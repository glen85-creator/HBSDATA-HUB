import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const naverClientId = process.env.NAVER_CLIENT_ID;
const naverClientSecret = process.env.NAVER_CLIENT_SECRET;

console.log('🧪 Naver Geocoding API 테스트\n');
console.log('='.repeat(80));
console.log(`Client ID: ${naverClientId}`);
console.log(`Client Secret: ${naverClientSecret ? '***' + naverClientSecret.slice(-4) : 'Not set'}`);
console.log('='.repeat(80) + '\n');

const testAddress = '서울특별시 강남구 테헤란로 152';

console.log(`테스트 주소: ${testAddress}\n`);

async function testGeocode() {
  try {
    const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(testAddress)}`;

    console.log('API 호출 중...\n');

    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': naverClientId,
        'X-NCP-APIGW-API-KEY': naverClientSecret,
      }
    });

    console.log(`응답 상태: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 오류 응답:');
      console.error(errorText);
      console.error('\n💡 해결 방법:');
      console.error('   1. Naver Cloud Platform (https://console.ncloud.com) 접속');
      console.error('   2. AI·NAVER API > Application 메뉴에서 API 키 확인');
      console.error('   3. Maps > Geocoding 서비스가 활성화되어 있는지 확인');
      console.error('   4. .env 파일의 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET 재확인');
      return;
    }

    const data = await response.json();

    console.log('✅ API 호출 성공!\n');
    console.log('응답 데이터:');
    console.log(JSON.stringify(data, null, 2));

    if (data.addresses && data.addresses.length > 0) {
      const result = data.addresses[0];
      console.log('\n📍 지오코딩 결과:');
      console.log(`   위도: ${result.y}`);
      console.log(`   경도: ${result.x}`);
      console.log(`   도로명 주소: ${result.roadAddress}`);
      console.log(`   지번 주소: ${result.jibunAddress}`);
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

testGeocode();
