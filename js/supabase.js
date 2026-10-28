"use strict";

(function () {
    // ===================================
    // SUPABASE CONFIGURATION
    // ===================================

    const SUPABASE_URL = "https://qzkqkfmueejeyjjdqfts.supabase.co/rest/v1/";
    const SUPABASE_KEY = "sb_publishable_Ua7940LgyOi8a7g7zTFzdg_xLojVla_";

    // ===================================
    // CHECK SUPABASE LIBRARY
    // ===================================

    if (!window.supabase || !window.supabase.createClient) {
        console.error("Supabase library load nahi hui.");
        return;
    }

    // ===================================
    // CHECK CONFIGURATION
    // ===================================

    if (
        !SUPABASE_URL.startsWith("https://") ||
        !SUPABASE_URL.endsWith(".supabase.co") ||
        SUPABASE_KEY.startsWith("PASTE_")
    ) {
        console.error(
            "Supabase URL ya Publishable Key sahi se configure nahi hai."
        );
        return;
    }

    // ===================================
    // CREATE SUPABASE CLIENT
    // ===================================

    try {
        window.digitalServicesSupabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY,
                {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: true,
                        flowType: "pkce"
                    }
                }
            );

        console.log("Supabase client initialized successfully.");

    } catch (error) {
        console.error("Supabase initialization error:", error);
    }
})();
