/**
 * 실패한 매장 위경도 수동 재시도 스크립트
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cdvxiejyajgptdvrlyxe.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdnhpZWp5YWpncHRkdnJseXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE1NzkxOCwiZXhwIjoyMDg1NzMzOTE4fQ._Fy-jRWNfYvjTjtr3czQ8uuvZOTSbD_j9FdwSfDTdto';
const NAVER_CLIENT_ID = 'szg8tijbj7';
const NAVER_CLIENT_SECRET = 'r0HpA9bP4cBRO3YIW4Rv66xboWLVcFGArZnPdkaI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function geocode(address: string) {
    const url = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;
    const res = await fetch(url, {
        headers: {
            'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
            'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
            'Accept': 'application/json',
        },
    });
    const data = await res.json();
    if (data.addresses?.length > 0) {
        return { lat: parseFloat(data.addresses[0].y), lng: parseFloat(data.addresses[0].x) };
    }
    return null;
}

async function main() {
    // 아직 lat이 null인 매장 조회
    const { data: stores, error } = await supabase
        .from('store_master')
        .select('id, name, address_road, address_raw')
        .is('lat', null);

    if (!stores || stores.length === 0) {
        console.log('✅ 모든 매장 위경도 설정 완료!');
        return;
    }

    console.log(`📍 ${stores.length}개 매장 재시도...`);

    for (const store of stores) {
        const originalAddress = store.address_road || store.address_raw || '';

        // 주소 정제: 상세주소 제거, 오타 수정 등
        const cleanedVariants = [
            originalAddress,
            originalAddress.replace(/\s+상가동.*$/, '').replace(/\s+\d+층.*$/, '').replace(/\s+\d+호.*$/, ''),
            originalAddress.replace('공도음', '공도읍'),
            originalAddress.split(' ').slice(0, 4).join(' '), // 앞 4단어만
            originalAddress.split(' ').slice(0, 3).join(' '), // 앞 3단어만
        ];

        // 중복 제거
        const uniqueVariants = [...new Set(cleanedVariants)];

        let success = false;
        for (const addr of uniqueVariants) {
            if (!addr) continue;
            console.log(`  🔄 [${store.name}] "${addr}" 시도 중...`);
            const result = await geocode(addr);

            if (result) {
                const { error: updateError } = await supabase
                    .from('store_master')
                    .update({ lat: result.lat, lng: result.lng })
                    .eq('id', store.id);

                if (!updateError) {
                    console.log(`  ✅ [${store.name}] → ${result.lat}, ${result.lng}`);
                    success = true;
                    break;
                }
            }
            await new Promise(r => setTimeout(r, 100));
        }

        if (!success) {
            console.log(`  ❌ [${store.name}] 모든 시도 실패 - 수동 입력 필요`);
        }
    }
}

main().catch(console.error);
