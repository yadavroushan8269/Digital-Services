// Digital Services - Main App
(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {

    const $ = (selector) => document.querySelector(selector);

    // Main elements
    const modal = $("#authModal");
    const modalTitle = $("#modalTitle");
    const modalDescription = $("#modalDescription");
    const authMessage = $("#authMessage");

    const menuToggle = $("#menuToggle");
    const navigation = $("#navigation");

    // Available authentication forms
    const forms = {
      signup: $("#signupForm"),
      login: $("#loginForm"),
      otp: $("#otpForm"),
      forgot: $("#forgotForm"),
      reset: $("#resetForm")
    };

    // =========================
    // OPEN AUTH MODAL
    // =========================

    function openAuth(type = "signup") {

      if (!modal) {
        console.error("Auth modal #authModal nahi mila.");
        return;
      }

      // Show modal
      modal.hidden = false;
      document.body.style.overflow = "hidden";

      // Hide every form first
      Object.values(forms).forEach((form) => {
        if (form) form.hidden = true;
      });

      // Clear previous message
      if (authMessage) {
        authMessage.textContent = "";
      }

      // Show selected form
      const selectedForm = forms[type];

      if (!selectedForm) {
        console.error("Authentication form nahi mila:", type);
        return;
      }

      selectedForm.hidden = false;

      // Update title and description
      const titles = {
        signup: "Create Your Account",
        login: "Welcome Back",
        otp: "Verify Your Email",
        forgot: "Reset Your Password",
        reset: "Choose a New Password"
      };

      const descriptions = {
        signup: "Register with your email to get started.",
        login: "Login to your Digital Services account.",
        otp: "Enter the verification code from your email.",
        forgot: "We'll send password recovery instructions to your email.",
        reset: "Enter and confirm your new password."
      };

      if (modalTitle) {
        modalTitle.textContent = titles[type] || "Digital Services";
      }

      if (modalDescription) {
        modalDescription.textContent =
          descriptions[type] || "";
      }

      // Focus first input
      const firstInput = selectedForm.querySelector(
        'input:not([readonly])'
      );

      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }

      // Close mobile navigation
      if (navigation) navigation.classList.remove("open");

      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }

    // =========================
    // CLOSE AUTH MODAL
    // =========================

    function closeAuth() {
      if (!modal) return;

      modal.hidden = true;
      document.body.style.overflow = "";
    }

    // Make functions available to auth.js
    window.openDigitalServicesAuth = openAuth;
    window.closeDigitalServicesAuth = closeAuth;
    window.showAuthForm = openAuth;

    // =========================
    // REGISTER BUTTONS
    // =========================

    [
      "#navRegister",
      "#heroRegister",
      "#bottomRegister"
    ].forEach((selector) => {
      const button = $(selector);

      button?.addEventListener("click", (event) => {
        event.preventDefault();
        openAuth("signup");
      });
    });

    // =========================
    // LOGIN BUTTON
    // =========================

    $("#navLogin")?.addEventListener("click", () => {
      openAuth("login");
    });

    // =========================
    // SWITCH BETWEEN FORMS
    // =========================

    $("#showLogin")?.addEventListener("click", () => {
      openAuth("login");
    });

    $("#showSignup")?.addEventListener("click", () => {
      openAuth("signup");
    });

    $("#showForgot")?.addEventListener("click", () => {
      openAuth("forgot");
    });

    $("#backToLogin")?.addEventListener("click", () => {
      openAuth("login");
    });

    // =========================
    // CLOSE BUTTON
    // =========================

    $("#closeModal")?.addEventListener("click", closeAuth);

    // Close when clicking outside the modal box
    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeAuth();
      }
    });

    // Close modal using Escape
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        modal &&
        !modal.hidden
      ) {
        closeAuth();
      }
    });

    // =========================
    // MOBILE NAVIGATION
    // =========================

    menuToggle?.addEventListener("click", () => {
      const isOpen = navigation?.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(Boolean(isOpen))
      );
    });

    // Close menu after clicking a navigation link
    navigation?.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");

        menuToggle?.setAttribute(
          "aria-expanded",
          "false"
        );
      });
    });

    // =========================
    // SERVICES BUTTONS
    // =========================

    document.querySelectorAll(".service-action").forEach((button) => {
      button.addEventListener("click", () => {
        const service = button.dataset.service || "Services";

        // Store selected service for later use
        sessionStorage.setItem("ds_selected_service", service);

        // Scroll to services section; don't open black modal
        $("#services")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });

    // =========================
    // FOOTER YEAR
    // =========================

    const yearElement = $("#year");

    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // =========================
    // PASSWORD RESET LINK
    // =========================

    // If Supabase returns a password recovery link,
    // show the reset form.
    const hash = window.location.hash;

    if (
      hash.includes("type=recovery") ||
      hash.includes("error_description")
    ) {
      if (hash.includes("type=recovery")) {
        openAuth("reset");
      }
    }

    console.log("Digital Services app initialized.");
  });
})();
