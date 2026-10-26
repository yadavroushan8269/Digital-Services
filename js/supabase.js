/* ==========================================
   DIGITAL-SERVICES
   SUPABASE CLIENT CONFIGURATION
========================================== */

(function () {
  "use strict";

  // Replace these placeholders with your own
  // Supabase Project URL and Publishable Key.

  const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";

  const SUPABASE_PUBLISHABLE_KEY =
    "YOUR_SUPABASE_PUBLISHABLE_KEY";

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
    SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL" ||
    SUPABASE_PUBLISHABLE_KEY ===
      "YOUR_SUPABASE_PUBLISHABLE_KEY"
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
