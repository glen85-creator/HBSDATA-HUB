import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 로드
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 지연 함수 (API 호출 제한 대응)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Supabase Edge Function을 통한 지오코딩
async function geocodeAddress(address) {
  try {
    const { data, error } = await supabase.functions.invoke('geocode', {
      body: { address }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.lat && data.lng) {
      return {
        lat: data.lat,
        lng: data.lng,
        address_road: data.roadAddress || address,
        address_raw: data.jibunAddress || null,
      };
    }

    return null;
  } catch (error) {
    console.error(`  ⚠️  지오코딩 실패: ${error.message}`);
    return null;
  }
}

// 주소에서 지역 정보 추출
function parseAddress(address) {
  // 시/도 추출
  const sidoMatch = address.match(/(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원[특별자치]?도|충청북도|충청남도|전북특별자치도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)/);
  const sido = sidoMatch ? sidoMatch[1] : null;

  // 시/군/구 추출
  const sigunguMatch = address.match(/([가-힣]+시|[가-힣]+군|[가-힣]+구)/);
  const sigungu = sigunguMatch ? sigunguMatch[1] : null;

  // 동/읍/면 추출
  const dongMatch = address.match(/([가-힣]+동|[가-힣]+읍|[가-힣]+면)/);
  const dong = dongMatch ? dongMatch[1] : null;

  return { sido, sigungu, dong };
}

async function geocodeStores() {
  console.log('🌍 매장 지오코딩 시작...\n');

  try {
    // lat/lng가 null인 매장만 가져오기
    const { data: stores, error } = await supabase
      .from('store_master')
      .select('id, name, address_road')
      .is('lat', null)
      .is('lng', null)
      .not('address_road', 'is', null);

    if (error) {
      throw new Error(error.message);
    }

    if (!stores || stores.length === 0) {
      console.log('✅ 지오코딩이 필요한 매장이 없습니다.\n');
      return;
    }

    console.log(`📍 총 ${stores.length}개의 매장을 지오코딩합니다.\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < stores.length; i++) {
      const store = stores[i];
      const progress = `[${i + 1}/${stores.length}]`;

      console.log(`${progress} ${store.name} - 처리 중...`);

      // 지오코딩 수행
      const geocodeResult = await geocodeAddress(store.address_road);

      if (geocodeResult) {
        // 지역 정보 파싱
        const { sido, sigungu, dong } = parseAddress(geocodeResult.address_road);

        // DB 업데이트
        const { error: updateError } = await supabase
          .from('store_master')
          .update({
            lat: geocodeResult.lat,
            lng: geocodeResult.lng,
            address_road: geocodeResult.address_road,
            address_raw: geocodeResult.address_raw,
            region_sido: sido,
            region_sigungu: sigungu,
            region_dong: dong,
          })
          .eq('id', store.id);

        if (updateError) {
          console.log(`  ❌ DB 업데이트 실패: ${updateError.message}`);
          failCount++;
        } else {
          console.log(`  ✅ 성공 - 좌표: (${geocodeResult.lat}, ${geocodeResult.lng})`);
          successCount++;
        }
      } else {
        console.log(`  ❌ 실패 - 지오코딩 불가`);
        failCount++;
      }

      // API 호출 제한 대응 (0.2초 대기)
      await delay(200);
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n🎉 지오코딩 완료!`);
    console.log(`   - 총 처리: ${stores.length}개`);
    console.log(`   - 성공: ${successCount}개`);
    console.log(`   - 실패: ${failCount}개\n`);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error(error);
    process.exit(1);
  }
}

geocodeStores();
