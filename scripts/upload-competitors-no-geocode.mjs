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

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 지역명에서 시/도 추출
function extractSido(regionText) {
  const sidoList = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];

  for (const sido of sidoList) {
    if (regionText.includes(sido)) {
      if (sido === '서울') return '서울특별시';
      if (sido === '경기') return '경기도';
      if (sido === '인천') return '인천광역시';
      if (sido === '부산') return '부산광역시';
      if (sido === '대구') return '대구광역시';
      if (sido === '광주') return '광주광역시';
      if (sido === '대전') return '대전광역시';
      if (sido === '울산') return '울산광역시';
      if (sido === '세종') return '세종특별자치시';
      if (sido === '강원') return '강원특별자치도';
      if (sido === '충북') return '충청북도';
      if (sido === '충남') return '충청남도';
      if (sido === '전북') return '전북특별자치도';
      if (sido === '전남') return '전라남도';
      if (sido === '경북') return '경상북도';
      if (sido === '경남') return '경상남도';
      if (sido === '제주') return '제주특별자치도';
    }
  }
  return null;
}

async function uploadCompetitors() {
  const filePath = process.argv[2] || 'C:\\Users\\남지훈\\Downloads\\경쟁점포.xlsx';

  console.log('📊 경쟁점포 데이터 업로드 시작 (좌표 없이)...\n');
  console.log(`파일: ${filePath}\n`);

  try {
    // 엑셀 파일 읽기
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`✅ ${rawData.length}개의 행을 읽었습니다.\n`);

    const uploadData = rawData.map((row) => {
      return {
        brand_type: 'competitor',
        brand_name: '싸다김밥',
        name: row['매장명'],
        name_display: row['매장명'],
        address_road: row['주소'],
        address_raw: null,
        phone: row['전화번호'] || null,
        status: row['상태'] || null,
        lat: null,  // 나중에 지오코딩
        lng: null,  // 나중에 지오코딩
        region_sido: extractSido(row['지역']),
        region_sigungu: null,
        region_dong: null,
      };
    });

    console.log('📝 데이터 변환 완료\n');
    console.log('샘플 데이터:');
    console.log(JSON.stringify(uploadData[0], null, 2));
    console.log('\n');

    // Supabase에 데이터 업로드
    console.log('📤 Supabase에 데이터 업로드 중...\n');

    // 배치로 나눠서 업로드 (한 번에 100개씩)
    const batchSize = 100;
    let uploadedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < uploadData.length; i += batchSize) {
      const batch = uploadData.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('store_master')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ 배치 ${Math.floor(i / batchSize) + 1} 업로드 실패:`, error.message);
        errorCount += batch.length;
      } else {
        uploadedCount += batch.length;
        console.log(`✅ 배치 ${Math.floor(i / batchSize) + 1} 업로드 완료 (${batch.length}개)`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n🎉 업로드 완료!`);
    console.log(`   - 총 데이터: ${rawData.length}개`);
    console.log(`   - 업로드 성공: ${uploadedCount}개`);
    console.log(`   - 업로드 실패: ${errorCount}개`);
    console.log(`\n⚠️  좌표(lat, lng)가 null로 설정되어 지도에 표시되지 않습니다.`);
    console.log(`   → 지오코딩 스크립트를 별도로 실행하여 좌표를 업데이트하세요.\n`);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error(error);
    process.exit(1);
  }
}

uploadCompetitors();
