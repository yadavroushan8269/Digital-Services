// Digital-Services - Dashboard Manager

(() => {
  "use strict";

  const supabase = window.digitalServicesSupabase;

  const elements = {
    dashboard: document.getElementById("userDashboard"),
    username: document.getElementById("dashboardUsername"),
    email: document.getElementById("dashboardEmail"),
    orderCount: document.getElementById("orderCount"),
    authMessage: document.getElementById("authMessage"),
    logoutButton: document.getElementById("logoutButton")
  };

  function showMessage(message) {
    if (elements.authMessage) {
      elements.authMessage.textContent = message;
    }
  }

  function setText(element, value) {
    if (element) {
      element.textContent = value || "";
    }
  }

  function showDashboard(user) {
    if (!user) {
      if (elements.dashboard) {
        elements.dashboard.hidden = true;
      }
      return;
    }

    const username =
      user.user_metadata?.username ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    setText(elements.username, username);
    setText(elements.email, user.email);

    if (elements.dashboard) {
      elements.dashboard.hidden = false;
    }

    // Orders ka count baad mein orders table se connect hoga.
    setText(elements.orderCount, "0");
  }

  async function refreshDashboard() {
    if (!supabase) {
      console.warn(
        "Supabase initialize nahi hua. js/supabase.js check karo."
      );
      return;
    }

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      showDashboard(data.user);
    } catch (error) {
      console.error("Dashboard load error:", error.message);
      showDashboard(null);
    }
  }

  async function logout() {
    if (!supabase) {
      showMessage("Supabase abhi connect nahi hai.");
      return;
    }

    if (elements.logoutButton) {
      elements.logoutButton.disabled = true;
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      showDashboard(null);
      showMessage("Logout successful!");

      window.dispatchEvent(
        new CustomEvent("ds:auth-changed", {
          detail: { user: null }
        })
      );
    } catch (error) {
      showMessage("Logout nahi hua. Dobara try karo.");
      console.error("Logout error:", error.message);
    } finally {
      if (elements.logoutButton) {
        elements.logoutButton.disabled = false;
      }
    }
  }

  if (elements.logoutButton) {
    elements.logoutButton.addEventListener("click", logout);
  }

  window.addEventListener("ds:auth-changed", (event) => {
    showDashboard(event.detail?.user || null);
  });

  window.DigitalServicesDashboard = {
    refresh: refreshDashboard,
    show: showDashboard
  };

  document.addEventListener("DOMContentLoaded", refreshDashboard);
})();
