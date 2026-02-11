/**
 * 주소 기반 위경도 추출 스크립트
 * 
 * 사용법:
 * 1. npx tsx scripts/geocode-stores.ts
 * 
 * 기능:
 * - store_master 테이블에서 주소는 있지만 lat/lng가 없는 매장을 조회
 * - Naver Geocoding API로 위경도 변환
 * - Supabase에 lat/lng 업데이트
 */

import { createClient } from '@supabase/supabase-js';

// 환경변수 (직접 입력하거나 .env에서 로드)
const SUPABASE_URL = 'https://cdvxiejyajgptdvrlyxe.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdnhpZWp5YWpncHRkdnJseXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1NzkxOCwiZXhwIjoyMDg1NzMzOTE4fQ._Fy-jRWNfYvjTjtr3czQ8uuvZOTSbD_j9FdwSfDTdto';
const NAVER_CLIENT_ID = 'szg8tijbj7';
const NAVER_CLIENT_SECRET = 'r0HpA9bP4cBRO3YIW4Rv66xboWLVcFGArZnPdkaI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface GeocodeResult {
    lat: number;
    lng: number;
    roadAddress?: string;
}

async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodedAddress}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
                'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Geocoding failed for "${address}": ${response.status}`);
            return null;
        }

        const data = await response.json();

        if (data.addresses && data.addresses.length > 0) {
            return {
                lat: parseFloat(data.addresses[0].y),
                lng: parseFloat(data.addresses[0].x),
                roadAddress: data.addresses[0].roadAddress,
            };
        } else {
            console.warn(`No results for "${address}"`);
            return null;
        }
    } catch (error) {
        console.error(`Error geocoding "${address}":`, error);
        return null;
    }
}

async function main() {
    console.log('🔍 lat/lng가 없는 매장 조회 중...');

    // lat이 null인 매장 조회
    const { data: stores, error } = await supabase
        .from('store_master')
        .select('id, name, address_road, address_raw')
        .is('lat', null);

    if (error) {
        console.error('매장 조회 실패:', error);
        return;
    }

    if (!stores || stores.length === 0) {
        console.log('✅ 모든 매장에 위경도가 설정되어 있습니다.');
        return;
    }

    console.log(`📍 ${stores.length}개 매장의 위경도 변환 시작...`);

    let successCount = 0;
    let failCount = 0;

    for (const store of stores) {
        const address = store.address_road || store.address_raw;
        if (!address) {
            console.log(`⏭️  [${store.name}] 주소 없음, 건너뜀`);
            continue;
        }

        console.log(`🔄 [${store.name}] "${address}" 변환 중...`);

        const result = await geocodeAddress(address);

        if (result) {
            const { error: updateError } = await supabase
                .from('store_master')
                .update({
                    lat: result.lat,
                    lng: result.lng,
                    address_road: result.roadAddress || store.address_road,
                })
                .eq('id', store.id);

            if (updateError) {
                console.error(`❌ [${store.name}] 업데이트 실패:`, updateError);
                failCount++;
            } else {
                console.log(`✅ [${store.name}] → ${result.lat}, ${result.lng}`);
                successCount++;
            }
        } else {
            failCount++;
        }

        // API 호출 제한 방지 (100ms 대기)
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 완료 결과:');
    console.log(`   성공: ${successCount}개`);
    console.log(`   실패: ${failCount}개`);
}

main().catch(console.error);
