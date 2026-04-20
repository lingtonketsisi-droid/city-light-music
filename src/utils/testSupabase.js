import { supabase } from '../lib/supabase';

/**
 * testSupabaseConnection
 *
 * Queries the "test" table in your Supabase project.
 * - If the table exists and has rows  → logs the data.
 * - If the table exists but is empty  → logs an empty array.
 * - If the table doesn't exist yet    → logs the Supabase error message,
 *   which still confirms that the network connection to your project works.
 */
export async function testSupabaseConnection() {
  console.group('🔌 Supabase Connection Test');
  console.log('URL :', import.meta.env.VITE_SUPABASE_URL);
  console.log('Table: "test"');

  const { data, error } = await supabase
    .from('test')
    .select('*')
    .limit(10);

  if (error) {
    // A "relation does not exist" error STILL means the connection is live.
    // Any other error may indicate a permissions or network issue.
    if (error.message.includes('does not exist')) {
      console.warn('⚠️  Table "test" does not exist yet in your Supabase project.');
      console.warn('   → Connection to Supabase is WORKING. Create the table to see data.');
    } else {
      console.error('❌ Supabase error:', error.message);
      console.error('   Code:', error.code);
    }
  } else {
    console.log('✅ Connection successful!');
    console.log(`   Rows returned: ${data.length}`);
    if (data.length > 0) {
      console.table(data);
    } else {
      console.info('   Table "test" exists but is empty. Add some rows to see data here.');
    }
  }

  console.groupEnd();
}
