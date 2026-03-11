const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://toiafoxboonmacowjggb.supabase.co',
  'sb_publishable_ShzcjqrkXv_XCrSwcUTwMg_lOUjEcKd'
);

module.exports = { supabase };