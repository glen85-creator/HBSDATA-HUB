import XLSX from 'xlsx';
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
const naverClientId = process.env.NAVER_CLIENT_ID;
const naverClientSecret = process.env.NAVER_CLIENT_SECRET;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

if (!naverClientId || !naverClientSecret) {
  console.error('❌ Naver Geocoding API 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 네이버 지오코딩 API 호출
async function geocodeAddress(address) {
  try {
    const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;

    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': naverClientId,
        'X-NCP-APIGW-API-KEY': naverClientSecret,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.addresses && data.addresses.length > 0) {
      const result = data.addresses[0];
      return {
        lat: parseFloat(result.y),
        lng: parseFloat(result.x),
        address_road: result.roadAddress || address,
        address_raw: result.jibunAddress || null,
        region_sido: result.addressElements?.find(e => e.types.includes('SIDO'))?.longName || null,
        region_sigungu: result.addressElements?.find(e => e.types.includes('SIGUGUN'))?.longName || null,
        region_dong: result.addressElements?.find(e => e.types.includes('DONGMYUN'))?.longName || null,
      };
    }

    return null;
  } catch (error) {
    console.error(`  ⚠️  지오코딩 실패 (${address}):`, error.message);
    return null;
  }
}

// 지연 함수 (API 호출 제한 대응)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadCompetitors() {
  const filePath = process.argv[2] || 'C:\\Users\\남지훈\\Downloads\\경쟁점포.xlsx';

  console.log('📊 경쟁점포 데이터 업로드 시작...\n');
  console.log(`파일: ${filePath}\n`);

  try {
    // 엑셀 파일 읽기
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`✅ ${rawData.length}개의 행을 읽었습니다.\n`);

    const uploadData = [];
    let successCount = 0;
    let failCount = 0;

    console.log('🔄 지오코딩 및 데이터 변환 시작...\n');

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const progress = `[${i + 1}/${rawData.length}]`;

      console.log(`${progress} ${row['매장명']} - 처리 중...`);

      // 주소로 지오코딩
      const geocodeResult = await geocodeAddress(row['주소']);

      if (geocodeResult) {
        const storeData = {
          brand_type: 'competitor',
          brand_name: '싸다김밥',
          name: row['매장명'],
          name_display: row['매장명'],
          address_road: geocodeResult.address_road,
          address_raw: geocodeResult.address_raw,
          phone: row['전화번호'] || null,
          status: row['상태'] || null,
          lat: geocodeResult.lat,
          lng: geocodeResult.lng,
          region_sido: geocodeResult.region_sido,
          region_sigungu: geocodeResult.region_sigungu,
          region_dong: geocodeResult.region_dong,
        };

        uploadData.push(storeData);
        console.log(`  ✅ 성공 - 좌표: (${geocodeResult.lat}, ${geocodeResult.lng})`);
        successCount++;
      } else {
        console.log(`  ❌ 실패 - 지오코딩 불가`);
        failCount++;
      }

      // API 호출 제한 대응 (0.1초 대기)
      await delay(100);
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n📈 지오코딩 완료: 성공 ${successCount}개, 실패 ${failCount}개\n`);

    if (uploadData.length === 0) {
      console.log('❌ 업로드할 데이터가 없습니다.');
      return;
    }

    // Supabase에 데이터 업로드
    console.log('📤 Supabase에 데이터 업로드 중...\n');

    // 배치로 나눠서 업로드 (한 번에 100개씩)
    const batchSize = 100;
    let uploadedCount = 0;

    for (let i = 0; i < uploadData.length; i += batchSize) {
      const batch = uploadData.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('store_master')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ 배치 ${Math.floor(i / batchSize) + 1} 업로드 실패:`, error.message);
      } else {
        uploadedCount += batch.length;
        console.log(`✅ 배치 ${Math.floor(i / batchSize) + 1} 업로드 완료 (${batch.length}개)`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n🎉 업로드 완료!`);
    console.log(`   - 총 처리: ${rawData.length}개`);
    console.log(`   - 지오코딩 성공: ${successCount}개`);
    console.log(`   - 지오코딩 실패: ${failCount}개`);
    console.log(`   - DB 업로드: ${uploadedCount}개\n`);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error(error);
    process.exit(1);
  }
}

uploadCompetitors();
