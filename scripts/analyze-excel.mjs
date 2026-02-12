import XLSX from 'xlsx';
import { readFileSync } from 'fs';

const filePath = process.argv[2] || 'C:\\Users\\남지훈\\Downloads\\경쟁점포.xlsx';

try {
  // 엑셀 파일 읽기
  const workbook = XLSX.readFile(filePath);

  console.log('📊 엑셀 파일 분석 결과\n');
  console.log('='.repeat(80));

  // 시트 목록
  console.log('\n📋 시트 목록:');
  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`  ${index + 1}. ${sheetName}`);
  });

  // 각 시트 분석
  workbook.SheetNames.forEach((sheetName) => {
    console.log('\n' + '='.repeat(80));
    console.log(`\n📄 시트: "${sheetName}"`);
    console.log('-'.repeat(80));

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    console.log(`\n총 ${jsonData.length}개의 행 발견`);

    if (jsonData.length > 0) {
      // 컬럼 정보
      const columns = Object.keys(jsonData[0]);
      console.log(`\n📌 컬럼 목록 (${columns.length}개):`);
      columns.forEach((col, index) => {
        console.log(`  ${index + 1}. ${col}`);
      });

      // 샘플 데이터 (처음 3개)
      console.log(`\n📝 샘플 데이터 (처음 3개):`);
      jsonData.slice(0, 3).forEach((row, index) => {
        console.log(`\n  [${index + 1}번째 행]`);
        Object.entries(row).forEach(([key, value]) => {
          const displayValue = value === null ? '(비어있음)' :
                              typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value;
          console.log(`    ${key}: ${displayValue}`);
        });
      });

      // 데이터 타입 분석
      console.log(`\n🔍 데이터 타입 분석:`);
      columns.forEach((col) => {
        const values = jsonData.map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '');
        const nonEmptyCount = values.length;
        const emptyCount = jsonData.length - nonEmptyCount;
        const types = [...new Set(values.map(v => typeof v))];
        const sampleValue = values[0];

        console.log(`\n  "${col}":`);
        console.log(`    - 채워진 값: ${nonEmptyCount}개 (${(nonEmptyCount/jsonData.length*100).toFixed(1)}%)`);
        console.log(`    - 비어있음: ${emptyCount}개 (${(emptyCount/jsonData.length*100).toFixed(1)}%)`);
        console.log(`    - 데이터 타입: ${types.join(', ')}`);
        console.log(`    - 샘플 값: ${sampleValue}`);
      });

      // store_master 테이블과 매핑 제안
      console.log('\n' + '='.repeat(80));
      console.log('\n💡 store_master 테이블 매핑 제안:');
      console.log('-'.repeat(80));

      const mappingSuggestions = {
        'brand_type': '→ "competitor" (고정값)',
        'name': columns.find(c => c.includes('상호') || c.includes('매장') || c.includes('이름') || c.includes('점포명')) || '(수동 매핑 필요)',
        'address_raw': columns.find(c => c.includes('지번') || c.includes('주소')) || '(수동 매핑 필요)',
        'address_road': columns.find(c => c.includes('도로명')) || '(수동 매핑 필요)',
        'lat': columns.find(c => c.includes('위도') || c.includes('lat')) || '(지오코딩 필요)',
        'lng': columns.find(c => c.includes('경도') || c.includes('lng') || c.includes('lon')) || '(지오코딩 필요)',
      };

      Object.entries(mappingSuggestions).forEach(([field, suggestion]) => {
        console.log(`  ${field}: ${suggestion}`);
      });
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ 분석 완료!\n');

} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  process.exit(1);
}
