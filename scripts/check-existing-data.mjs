import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 기존 매장 데이터 분석\n');
console.log('='.repeat(80));

async function checkData() {
  try {
    // 전체 매장 통계
    const { data: allStores, error } = await supabase
      .from('store_master')
      .select('id, brand_type, brand_name, name, lat, lng, created_at');

    if (error) {
      throw new Error(error.message);
    }

    console.log(`\n📊 전체 매장 수: ${allStores.length}개\n`);

    // 브랜드별 통계
    const guksunamu = allStores.filter(s => s.brand_type === 'guksunamu');
    const competitor = allStores.filter(s => s.brand_type === 'competitor');

    console.log('브랜드별 분류:');
    console.log(`  - 국수나무: ${guksunamu.length}개`);
    console.log(`  - 경쟁점포: ${competitor.length}개\n`);

    // 좌표 데이터 분석
    const guksunamuWithCoords = guksunamu.filter(s => s.lat && s.lng);
    const guksunamuWithoutCoords = guksunamu.filter(s => !s.lat || !s.lng);
    const competitorWithCoords = competitor.filter(s => s.lat && s.lng);
    const competitorWithoutCoords = competitor.filter(s => !s.lat || !s.lng);

    console.log('좌표 데이터 현황:');
    console.log(`  국수나무:`);
    console.log(`    - 좌표 있음: ${guksunamuWithCoords.length}개 (${(guksunamuWithCoords.length/guksunamu.length*100).toFixed(1)}%)`);
    console.log(`    - 좌표 없음: ${guksunamuWithoutCoords.length}개 (${(guksunamuWithoutCoords.length/guksunamu.length*100).toFixed(1)}%)`);
    console.log(`  경쟁점포:`);
    console.log(`    - 좌표 있음: ${competitorWithCoords.length}개 (${(competitorWithCoords.length/competitor.length*100).toFixed(1)}%)`);
    console.log(`    - 좌표 없음: ${competitorWithoutCoords.length}개 (${(competitorWithoutCoords.length/competitor.length*100).toFixed(1)}%)\n`);

    // 생성 날짜 분석
    console.log('생성 날짜 분석:');
    if (guksunamuWithCoords.length > 0) {
      const dates = guksunamuWithCoords.map(s => new Date(s.created_at));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      console.log(`  국수나무 (좌표 있음): ${minDate.toLocaleString('ko-KR')} ~ ${maxDate.toLocaleString('ko-KR')}`);
    }
    if (competitorWithoutCoords.length > 0) {
      const dates = competitorWithoutCoords.map(s => new Date(s.created_at));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      console.log(`  경쟁점포 (좌표 없음): ${minDate.toLocaleString('ko-KR')} ~ ${maxDate.toLocaleString('ko-KR')}\n`);
    }

    // 샘플 데이터 출력
    if (guksunamuWithCoords.length > 0) {
      console.log('='.repeat(80));
      console.log('\n📝 국수나무 샘플 데이터 (좌표 있음):');
      console.log(JSON.stringify(guksunamuWithCoords[0], null, 2));
    }

    if (guksunamuWithoutCoords.length > 0) {
      console.log('\n📝 국수나무 샘플 데이터 (좌표 없음):');
      console.log(JSON.stringify(guksunamuWithoutCoords[0], null, 2));
    }

    if (competitorWithoutCoords.length > 0) {
      console.log('\n📝 경쟁점포 샘플 데이터 (좌표 없음):');
      console.log(JSON.stringify(competitorWithoutCoords[0], null, 2));
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n💡 분석 결과:');
    if (guksunamuWithCoords.length === guksunamu.length && guksunamu.length > 0) {
      console.log('   ✅ 국수나무 매장은 모두 좌표 데이터를 가지고 있습니다.');
      console.log('   → 이전에 성공적으로 지오코딩이 완료된 것으로 보입니다.');
    }
    if (competitorWithoutCoords.length === competitor.length && competitor.length > 0) {
      console.log('   ⚠️  경쟁점포는 모두 좌표 데이터가 없습니다.');
      console.log('   → 방금 업로드된 데이터로, 지오코딩이 필요합니다.');
    }
    console.log('');

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

checkData();
