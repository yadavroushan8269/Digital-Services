// Digital-Services - Main Application
(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const modal = $("#authModal");
  const modalTitle = $("#modalTitle");
  const modalDescription = $("#modalDescription");

  const forms = {
    signup: $("#signupForm"),
    otp: $("#otpForm"),
    login: $("#loginForm"),
    forgot: $("#forgotForm"),
    reset: $("#resetForm")
  };

  function showAuthForm(name) {
    Object.entries(forms).forEach(([key, form]) => {
      if (form) form.hidden = key !== name;
    });

    const titles = {
      signup: ["Create Your Account", "Register with your email to get started."],
      otp: ["Verify Your Email", "Enter the code sent to your email."],
      login: ["Welcome Back", "Login using your email and password."],
      forgot: ["Recover Password", "We'll send recovery instructions to your email."],
      reset: ["Reset Password", "Choose a new password for your account."]
    };

    const content = titles[name] || titles.login;

    if (modalTitle) modalTitle.textContent = content[0];
    if (modalDescription) modalDescription.textContent = content[1];

    const message = $("#authMessage");
    if (message) message.textContent = "";
  }

  function openAuth(name = "signup") {
    if (!modal) return;

    modal.hidden = false;
    showAuthForm(name);

    const firstInput = forms[name]?.querySelector("input");
    if (firstInput) firstInput.focus();
  }

  function closeAuth() {
    if (modal) modal.hidden = true;
  }

  // Expose this helper for auth.js.
  window.showAuthForm = showAuthForm;
  window.openDigitalServicesAuth = openAuth;
  window.closeDigitalServicesAuth = closeAuth;

  // Authentication modal buttons.
  $("#navLogin")?.addEventListener("click", () => openAuth("login"));
  $("#navRegister")?.addEventListener("click", () => openAuth("signup"));
  $("#heroRegister")?.addEventListener("click", () => openAuth("signup"));
  $("#bottomRegister")?.addEventListener("click", () => openAuth("signup"));

  $("#closeModal")?.addEventListener("click", closeAuth);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeAuth();
  });

  // Switch between forms.
  $("#showLogin")?.addEventListener("click", () => showAuthForm("login"));
  $("#showSignup")?.addEventListener("click", () => showAuthForm("signup"));
  $("#showForgot")?.addEventListener("click", () => showAuthForm("forgot"));
  $("#backToLogin")?.addEventListener("click", () => showAuthForm("login"));

  // Mobile navigation.
  const menuToggle = $("#menuToggle");
  const navigation = $("#navigation");

  menuToggle?.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navigation?.classList.toggle("active", !expanded);
  });

  $$("#navigation a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Close modal with Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAuth();
  });

  // Footer year.
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Service cards: informational demo only.
  $$(".service-action").forEach((button) => {
    button.addEventListener("click", () => {
      const service = button.dataset.service || "Digital Services";

      if (!window.DigitalServicesAuth) {
        openAuth("signup");
        return;
      }

      const supabase = window.digitalServicesSupabase;

      if (!supabase) {
        alert("Supabase connection setup check karo.");
        return;
      }

      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) {
          openAuth("login");
          return;
        }

        alert(
          `${service}\n\n` +
          "Ye service abhi demo mode mein hai. " +
          "Real integrations baad mein connect hongi."
        );
      }).catch(() => {
        alert("Abhi service load nahi hui. Dobara try karo.");
      });
    });
  });

  // Refresh dashboard when auth changes.
  window.addEventListener("ds:auth-changed", (event) => {
    const user = event.detail?.user;

    if (user) {
      closeAuth();
      window.DigitalServicesDashboard?.show(user);
    }
  });

})();
