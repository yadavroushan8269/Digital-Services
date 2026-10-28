// Digital Services - Authentication
(() => {
  "use strict";

  const supabase = window.digitalServicesSupabase;

  // Supabase client check
  if (!supabase) {
    console.error(
      "Supabase client nahi mila. js/supabase.js check karo."
    );
    return;
  }

  const $ = (selector) => document.querySelector(selector);

  // Show message on page
  function showMessage(element, message, isError = false) {
    if (!element) return;

    element.textContent = message;
    element.style.color = isError ? "#dc2626" : "#15803d";
  }

  // Disable button while request is processing
  function setLoading(button, loading, originalText) {
    if (!button) return;

    button.disabled = loading;
    button.textContent = loading
      ? "Please wait..."
      : originalText;
  }

  // Friendly error messages
  function friendlyError(error) {
    const message = error?.message || "";

    if (/invalid login credentials/i.test(message)) {
      return "Email ya password galat hai.";
    }

    if (/already registered|already exists/i.test(message)) {
      return "Is email se account pehle se bana hua hai. Login try karo.";
    }

    if (/password/i.test(message) && /least|short|weak/i.test(message)) {
      return "Password thoda strong rakho.";
    }

    if (/rate limit|too many requests/i.test(message)) {
      return "Bahut attempts ho gaye. Thodi der baad try karo.";
    }

    if (/email not confirmed/i.test(message)) {
      return "Pehle apne email par aaya confirmation link click karo.";
    }

    return message || "Kuch problem hui. Dobara try karo.";
  }

  // Send authentication event to the website
  function notifyAuthChanged(user) {
    window.dispatchEvent(
      new CustomEvent("ds:auth-changed", {
        detail: { user: user || null }
      })
    );
  }

  // =========================
  // REGISTER / SIGNUP
  // =========================

  const signupForm = $("#signupForm");

  signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput =
      $("#signupUsername") ||
      signupForm.querySelector('[name="username"]');

    const emailInput =
      $("#signupEmail") ||
      signupForm.querySelector('[name="email"]');

    const passwordInput =
      $("#signupPassword") ||
      signupForm.querySelector('[name="password"]');

    const confirmInput =
      $("#confirmPassword") ||
      signupForm.querySelector('[name="confirmPassword"]');

    const messageElement =
      $("#signupMessage") ||
      $("#authMessage");

    const button = signupForm.querySelector(
      'button[type="submit"]'
    );

    const name = nameInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const password = passwordInput?.value || "";
    const confirmPassword = confirmInput?.value || "";

    if (!email || !password) {
      showMessage(
        messageElement,
        "Email aur password dono bharo.",
        true
      );
      return;
    }

    if (confirmInput && password !== confirmPassword) {
      showMessage(
        messageElement,
        "Password aur confirm password match nahi kar rahe.",
        true
      );
      return;
    }

    if (password.length < 6) {
      showMessage(
        messageElement,
        "Password kam se kam 6 characters ka hona chahiye.",
        true
      );
      return;
    }

    const originalText = button?.textContent || "Create Account";

    setLoading(button, true, originalText);
    showMessage(messageElement, "Account create ho raha hai...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: name
          },
          emailRedirectTo: window.location.origin + "/"
        }
      });

      if (error) throw error;

      if (data.session) {
        showMessage(
          messageElement,
          "Account ban gaya! Tum login ho chuke ho."
        );

        notifyAuthChanged(data.user);

        setTimeout(() => {
          window.location.href =
            window.location.origin + "/pages/dashboard.html";
        }, 1000);

        return;
      }

      showMessage(
        messageElement,
        "Account request submit ho gayi! Apna email inbox check karo aur confirmation link par click karo. Uske baad Login page se login karna."
      );

      signupForm.reset();

    } catch (error) {
      console.error("Signup error:", error);

      showMessage(
        messageElement,
        friendlyError(error),
        true
      );
    } finally {
      setLoading(button, false, originalText);
    }
  });

  // =========================
  // LOGIN
  // =========================

  const loginForm = $("#loginForm");

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput =
      $("#loginEmail") ||
      loginForm.querySelector('[name="email"]');

    const passwordInput =
      $("#loginPassword") ||
      loginForm.querySelector('[name="password"]');

    const messageElement =
      $("#loginMessage") ||
      $("#authMessage");

    const button = loginForm.querySelector(
      'button[type="submit"]'
    );

    const email = emailInput?.value.trim() || "";
    const password = passwordInput?.value || "";

    if (!email || !password) {
      showMessage(
        messageElement,
        "Email aur password bharo.",
        true
      );
      return;
    }

    const originalText = button?.textContent || "Login";

    setLoading(button, true, originalText);
    showMessage(messageElement, "Login ho raha hai...");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      showMessage(messageElement, "Login successful!");

      notifyAuthChanged(data.user);

      setTimeout(() => {
        window.location.href =
          window.location.origin + "/pages/dashboard.html";
      }, 700);

    } catch (error) {
      console.error("Login error:", error);

      showMessage(
        messageElement,
        friendlyError(error),
        true
      );
    } finally {
      setLoading(button, false, originalText);
    }
  });

  // =========================
  // LOGOUT
  // =========================

  $("#logoutButton")?.addEventListener("click", async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      notifyAuthChanged(null);

      window.location.href = window.location.origin + "/";

    } catch (error) {
      console.error("Logout error:", error);
      alert(friendlyError(error));
    }
  });

  // =========================
  // PASSWORD RECOVERY
  // =========================

  const forgotForm = $("#forgotForm");

  forgotForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const emailInput =
      $("#forgotEmail") ||
      forgotForm.querySelector('[name="email"]');

    const messageElement =
      $("#forgotMessage") ||
      $("#authMessage");

    const email = emailInput?.value.trim() || "";

    if (!email) {
      showMessage(
        messageElement,
        "Apna email address bharo.",
        true
      );
      return;
    }

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/"
        });

      if (error) throw error;

      showMessage(
        messageElement,
        "Agar is email se account hai, toh password recovery instructions email par bhej di gayi hain."
      );

    } catch (error) {
      console.error("Password recovery error:", error);

      showMessage(
        messageElement,
        friendlyError(error),
        true
      );
    }
  });

  // =========================
  // UPDATE PASSWORD
  // =========================

  const resetForm = $("#resetForm");

  resetForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const passwordInput =
      $("#resetPassword") ||
      resetForm.querySelector('[name="password"]');

    const confirmInput =
      $("#resetConfirmPassword") ||
      resetForm.querySelector('[name="confirmPassword"]');

    const messageElement =
      $("#resetMessage") ||
      $("#authMessage");

    const password = passwordInput?.value || "";
    const confirmPassword = confirmInput?.value || "";

    if (password.length < 6) {
      showMessage(
        messageElement,
        "Password kam se kam 6 characters ka hona chahiye.",
        true
      );
      return;
    }

    if (confirmInput && password !== confirmPassword) {
      showMessage(
        messageElement,
        "Dono passwords match nahi kar rahe.",
        true
      );
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;

      showMessage(
        messageElement,
        "Password update ho gaya. Ab login kar sakte ho."
      );

    } catch (error) {
      console.error("Password update error:", error);

      showMessage(
        messageElement,
        friendlyError(error),
        true
      );
    }
  });

  // =========================
  // GLOBAL AUTH HELPERS
  // =========================

  window.DigitalServicesAuth = {
    getUser: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;

      return data.user;
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      notifyAuthChanged(null);
    }
  };

  // Handle password recovery links and restored sessions
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      if (typeof window.showAuthForm === "function") {
        window.openDigitalServicesAuth?.("reset");
      }
    }

    if (event === "SIGNED_IN" && session?.user) {
      notifyAuthChanged(session.user);
    }
  });

  console.log("Digital Services authentication initialized.");
})();
