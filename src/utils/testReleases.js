import { supabase } from '../lib/supabase';

/**
 * testReleasesFlow
 *
 * 1. Checks if there is an active auth session.
 * 2. If authenticated → inserts a dummy release, then fetches all releases.
 * 3. If NOT authenticated → fetches publically visible releases (will be
 *    empty due to RLS) and explains what that means.
 *
 * All output goes to the DevTools console — the UI is never touched.
 */
export async function testReleasesFlow() {
  console.group('🎵 Supabase Releases — Insert & Fetch Test');

  // ── Step 1: Check auth session ──────────────────────────────────────────
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('❌ Could not retrieve auth session:', sessionError.message);
    console.groupEnd();
    return;
  }

  const user = session?.user ?? null;

  if (!user) {
    console.warn('⚠️  No authenticated user found.');
    console.warn('   RLS is active — insert & select will be blocked without a session.');
    console.warn('   To test with real data, sign in first (Supabase Auth).');
    console.info('   Attempting a fetch anyway to confirm RLS behaviour...');

    const { data, error } = await supabase.from('releases').select('*');

    if (error) {
      console.info(`   Supabase response: "${error.message}" (this is expected with RLS + no session)`);
    } else {
      console.info(`   Rows returned: ${data.length} (RLS filtered all rows — correct behaviour)`);
    }

    console.groupEnd();
    return;
  }

  console.log(`✅ Authenticated as: ${user.email} (${user.id})`);

  // ── Step 2: Insert a dummy release ────────────────────────────────────────
  console.log('\n📤 Inserting dummy release...');

  const dummyRelease = {
    user_id      : user.id,
    title        : `Test Release ${Date.now()}`,
    cover_url    : 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    release_date : new Date().toISOString().split('T')[0], // today's date
  };

  const { data: inserted, error: insertError } = await supabase
    .from('releases')
    .insert(dummyRelease)
    .select()
    .single();

  if (insertError) {
    console.error('❌ Insert failed:', insertError.message);
    console.error('   Code:', insertError.code);
    console.error('   Hint:', insertError.hint ?? 'none');

    if (insertError.code === '42501') {
      console.warn('   → RLS policy is blocking the insert. Check your "releases: insert own" policy.');
    }
    if (insertError.message.includes('profiles')) {
      console.warn('   → A profile row for this user does not exist yet in the profiles table.');
      console.warn('     Run the SQL trigger or manually insert a profile row first.');
    }
  } else {
    console.log('✅ Release inserted successfully:');
    console.table([inserted]);
  }

  // ── Step 3: Fetch all releases for this user ──────────────────────────────
  console.log('\n📥 Fetching all releases for the current user...');

  const { data: releases, error: fetchError } = await supabase
    .from('releases')
    .select('id, title, cover_url, release_date, created_at')
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('❌ Fetch failed:', fetchError.message);
    console.error('   Code:', fetchError.code);
  } else if (releases.length === 0) {
    console.info('ℹ️  Fetch succeeded but returned 0 rows.');
    console.info('   RLS may have filtered results, or no releases exist yet for this user.');
  } else {
    console.log(`✅ ${releases.length} release(s) found:`);
    console.table(releases);
  }

  console.groupEnd();
}
