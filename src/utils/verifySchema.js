import { supabase } from '../lib/supabase';

/**
 * verifySchema
 *
 * Queries each of the three core tables and reports the result.
 * Run this after you've executed the SQL migration in the Supabase dashboard.
 *
 * Usage (e.g. inside Dashboard.jsx useEffect):
 *   import { verifySchema } from '../utils/verifySchema';
 *   useEffect(() => { verifySchema(); }, []);
 */
export async function verifySchema() {
  const tables = ['profiles', 'releases', 'tracks'];
  const results = {};

  console.group('🗄️  City Light Media — Supabase Schema Verification');

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(5);

    if (error) {
      if (error.message.includes('does not exist')) {
        console.error(`❌ "${table}" — table not found. Run the SQL migration first.`);
      } else if (error.code === 'PGRST301') {
        // RLS blocked the read — but this means the table EXISTS.
        console.warn(`🔒 "${table}" — exists but RLS blocked (no auth session). This is expected.`);
        results[table] = 'rls_blocked';
        continue;
      } else {
        console.error(`❌ "${table}" — unexpected error:`, error.message);
      }
      results[table] = 'error';
    } else {
      console.log(`✅ "${table}" — OK (${data.length} test row(s) visible)`);
      results[table] = 'ok';
    }
  }

  const allOk = Object.values(results).every(v => v === 'ok' || v === 'rls_blocked');
  if (allOk) {
    console.log('\n🎉 Schema is set up correctly and Supabase is connected!');
  } else {
    console.warn('\n⚠️  Some tables are missing. Copy supabase/migrations/001_initial_schema.sql');
    console.warn('   and run it in: Supabase Dashboard → SQL Editor → Run');
  }

  console.groupEnd();
  return results;
}
