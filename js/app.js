/* ==========================================
   DIGITAL-SERVICES
   MAIN APPLICATION
   Navigation | Modal | UI Initialization
========================================== */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* ------------------------------------------
     Safe Event Helpers
  ------------------------------------------ */

  function onClick(id, callback) {
    const element = $(id);

    if (element) {
      element.addEventListener("click", callback);
    }
  }

  /* ------------------------------------------
     Authentication Modal
  ------------------------------------------ */

  function openAuthModal(formId = "signupForm") {
    const modal = $("authModal");

    if (modal) {
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
    }

    if (
      window.DigitalServicesAuth &&
      typeof window.DigitalServicesAuth.showAuthForm === "function"
    ) {
      window.DigitalServicesAuth.showAuthForm(formId);
    } else {
      const form = $(formId);

      if (form) {
        form.style.display = "block";
      }
    }

    document.body.classList.add("modal-open");
  }

  function closeAuthModal() {
    const modal = $("authModal");

    if (modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }

    document.body.classList.remove("modal-open");
  }

  /* ------------------------------------------
     Mobile Navigation
  ------------------------------------------ */

  function initNavigation() {
    const menuButton = $("menuToggle");
    const navigation = $("navigation");

    if (!menuButton || !navigation) return;

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", function () {
      const isOpen = navigation.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------
     Authentication Buttons
  ------------------------------------------ */

  function initAuthButtons() {
    onClick("navLogin", () =>
      openAuthModal("loginForm")
    );

    onClick("navRegister", () =>
      openAuthModal("signupForm")
    );

    onClick("heroRegister", () =>
      openAuthModal("signupForm")
    );

    onClick("bottomRegister", () =>
      openAuthModal("signupForm")
    );

    onClick("closeModal", closeAuthModal);

    onClick("showLogin", () =>
      openAuthModal("loginForm")
    );

    onClick("showSignup", () =>
      openAuthModal("signupForm")
    );

    onClick("showForgot", () =>
      openAuthModal("forgotForm")
    );

    // Close modal when clicking its backdrop.

    const modal = $("authModal");

    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeAuthModal();
        }
      });
    }

    // Escape key closes the modal.

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAuthModal();
      }
    });
  }

  /* ------------------------------------------
     Session UI
  ------------------------------------------ */

  function updateAuthUI(user) {
    const dashboard = $("userDashboard");
    const usernameElement = $("dashboardUsername");
    const emailElement = $("dashboardEmail");

    if (dashboard) {
      dashboard.style.display = user ? "block" : "none";
    }

    if (usernameElement) {
      usernameElement.textContent =
        user?.user_metadata?.username ||
        user?.email?.split("@")[0] ||
        "User";
    }

    if (emailElement) {
      emailElement.textContent = user?.email || "";
    }

    // Hide the auth modal after successful login.

    if (user) {
      closeAuthModal();
    }
  }

  async function initializeSession() {
    if (
      !window.DigitalServicesAuth ||
      typeof window.DigitalServicesAuth.getCurrentUser !== "function"
    ) {
      return;
    }

    try {
      const user =
        await window.DigitalServicesAuth.getCurrentUser();

      updateAuthUI(user);
    } catch (error) {
      console.error("Session initialization failed.");
    }
  }

  /* ------------------------------------------
     Authentication State Listener
  ------------------------------------------ */

  function initAuthStateListener() {
    window.addEventListener("ds:auth-changed", (event) => {
      const user = event.detail?.user || null;

      updateAuthUI(user);
    });
  }

  /* ------------------------------------------
     Service Buttons
  ------------------------------------------ */

  function initServiceButtons() {
    document.querySelectorAll(".service-action").forEach((button) => {
      button.addEventListener("click", () => {
        const serviceName =
          button.dataset.service || "selected service";

        const userDashboard = $("userDashboard");

        if (userDashboard && userDashboard.style.display !== "block") {
          openAuthModal("loginForm");
          return;
        }

        alert(
          serviceName +
          ": service ordering abhi setup nahi hua hai."
        );
      });
    });
  }

  /* ------------------------------------------
     General UI
  ------------------------------------------ */

  function initCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = new Date().getFullYear();
    });
  }

  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {
          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  }

  /* ------------------------------------------
     App Initialization
  ------------------------------------------ */

  function initApp() {
    initNavigation();
    initAuthButtons();
    initAuthStateListener();
    initServiceButtons();
    initCurrentYear();
    initSmoothScrolling();

    initializeSession();

    console.log("Digital-Services app initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

  // Expose only the UI functions needed elsewhere.

  window.DigitalServicesApp = {
    openAuthModal,
    closeAuthModal,
    updateAuthUI
  };
})();
