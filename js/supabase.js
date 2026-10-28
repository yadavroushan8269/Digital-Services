/* ==========================================
   DIGITAL-SERVICES
   SUPABASE CLIENT CONFIGURATION
========================================== */

(function () {
  "use strict";

  // Replace these placeholders with your own
  // Supabase Project URL and Publishable Key.

  const SUPABASE_URL = "https://qzkqkfmueejeyjjdqfts.supabase.co/rest/v1/";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Ua7940LgyOi8a7g7zTFzdg_xLojVla_";

  // Prevent duplicate initialization.

  if (window.digitalServicesSupabase) {
    return;
  }

  // Check whether Supabase library is loaded.

  if (!window.supabase || !window.supabase.createClient) {
    console.error(
      "Supabase library missing. Check the Supabase CDN script."
    );
    return;
  }

  // Check configuration.

  if (
    SUPABASE_URL === "https://qzkqkfmueejeyjjdqfts.supabase.co/rest/v1/" ||
    SUPABASE_PUBLISHABLE_KEY ===
      "sb_publishable_Ua7940LgyOi8a7g7zTFzdg_xLojVla_"
  ) {
    console.warn(
      "Digital-Services: Add your Supabase project URL and publishable key."
    );
    return;
  }

  // Initialize Supabase.

  try {
    window.digitalServicesSupabase =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
          }
        }
      );

    console.log(
      "Digital-Services: Supabase client initialized."
    );
  } catch (error) {
    console.error(
      "Supabase initialization failed:",
      error.message
    );
  }
})();
