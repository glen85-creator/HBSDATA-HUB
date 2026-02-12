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

console.log('🔧 store_master 테이블 스키마 업데이트 시작...\n');

async function updateSchema() {
  try {
    // Supabase에서는 RPC를 통해 SQL 실행
    // 또는 Supabase Dashboard에서 직접 실행해야 합니다.

    console.log('📝 다음 SQL을 Supabase Dashboard의 SQL Editor에서 실행해주세요:\n');
    console.log('='.repeat(80));
    console.log(`
-- store_master 테이블에 새 컬럼 추가
ALTER TABLE store_master
ADD COLUMN IF NOT EXISTS brand_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS status TEXT;

-- 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_store_master_brand_name ON store_master(brand_name);
CREATE INDEX IF NOT EXISTS idx_store_master_status ON store_master(status);

-- 코멘트 추가
COMMENT ON COLUMN store_master.brand_name IS '브랜드명 (예: 싸다김밥, 국수나무)';
COMMENT ON COLUMN store_master.phone IS '전화번호';
COMMENT ON COLUMN store_master.status IS '운영 상태 (운영중, 폐업 등)';
    `);
    console.log('='.repeat(80));
    console.log('\n📍 Supabase Dashboard 접속: https://supabase.com/dashboard/project/cdvxiejyajgptdvrlyxe/editor\n');

    // 테이블 구조 확인
    console.log('✅ 현재 store_master 테이블의 컬럼 확인...\n');

    const { data, error } = await supabase
      .from('store_master')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ 오류:', error.message);
    } else if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('현재 컬럼 목록:');
      columns.forEach((col, idx) => {
        console.log(`  ${idx + 1}. ${col}`);
      });

      const newColumns = ['brand_name', 'phone', 'status'];
      const existingNewColumns = newColumns.filter(col => columns.includes(col));
      const missingColumns = newColumns.filter(col => !columns.includes(col));

      if (existingNewColumns.length > 0) {
        console.log(`\n✅ 이미 추가된 컬럼: ${existingNewColumns.join(', ')}`);
      }
      if (missingColumns.length > 0) {
        console.log(`\n⚠️  추가 필요한 컬럼: ${missingColumns.join(', ')}`);
        console.log('   → 위의 SQL을 Supabase Dashboard에서 실행해주세요.');
      }
      if (missingColumns.length === 0) {
        console.log('\n🎉 모든 컬럼이 이미 추가되어 있습니다!');
      }
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

updateSchema();
