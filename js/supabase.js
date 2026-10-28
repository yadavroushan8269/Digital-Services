"use strict";

(function () {
    // Apne Supabase project ki details yahan daalo.
    const SUPABASE_URL =
        "https://YOUR_PROJECT_ID.supabase.co";

    const SUPABASE_KEY =
        "YOUR_SUPABASE_PUBLISHABLE_KEY";

    // Check whether Supabase library loaded.
    if (!window.supabase || !window.supabase.createClient) {
        console.error(
            "Supabase library load nahi hui. CDN check karo."
        );
        return;
    }

    // Check configuration.
    if (
        SUPABASE_URL.includes("https://qzkqkfmueejeyjjdqfts.supabase.co/rest/v1/") ||
        SUPABASE_KEY.includes("sb_publishable_Ua7940LgyOi8a7g7zTFzdg_xLojVla_")
    ) {
        console.error(
            "Supabase URL aur publishable key abhi set nahi ki gayi."
        );
        return;
    }

    try {
        window.digitalServicesSupabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

        console.log("Supabase client successfully initialized!");
    } catch (error) {
        console.error("Supabase initialization failed:", error);
    }
})();
