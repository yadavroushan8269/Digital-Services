/* ==========================================
   DIGITAL-SERVICES
   AUTHENTICATION MODULE
   Register | Email OTP | Login | Logout
========================================== */

(function () {
  "use strict";

  const getSupabase = () =>
    window.digitalServicesSupabase || null;

  const getElement = (id) =>
    document.getElementById(id);

  function showMessage(message, type = "info") {
    const box = getElement("authMessage");

    if (!box) {
      console.log(message);
      return;
    }

    box.textContent = message;
    box.className = "auth-message " + type;
    box.style.display = "block";
    box.setAttribute("role", "status");
  }

  function clearMessage() {
    const box = getElement("authMessage");

    if (box) {
      box.textContent = "";
      box.className = "auth-message";
      box.style.display = "none";
    }
  }

  function getInputValue(id) {
    const input = getElement(id);
    return input ? input.value.trim() : "";
  }

  function setButtonLoading(button, loading, originalText) {
    if (!button) return;

    button.disabled = loading;
    button.textContent = loading
      ? "Please wait..."
      : originalText;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function friendlyError(error) {
    const message = String(error?.message || "").toLowerCase();

    if (message.includes("invalid login credentials")) {
      return "Email ya password sahi nahi hai.";
    }

    if (message.includes("email not confirmed")) {
      return "Pehle apna email verify karo.";
    }

    if (message.includes("already registered")) {
      return "Ye email pehle se registered hai. Login try karo.";
    }

    if (message.includes("password")) {
      return "Password requirements check karo.";
    }

    if (
      message.includes("rate limit") ||
      message.includes("too many requests")
    ) {
      return "Bahut saari requests ho gayi hain. Thodi der baad try karo.";
    }

    if (message.includes("network")) {
      return "Internet connection check karo.";
    }

    return error?.message || "Kuch problem hui. Dobara try karo.";
  }

  /* ------------------------------------------
     Form Visibility Helpers
  ------------------------------------------ */

  function hideAllAuthForms() {
    [
      "signupForm",
      "otpForm",
      "loginForm",
      "forgotForm",
      "resetForm"
    ].forEach((id) => {
      const form = getElement(id);

      if (form) {
        form.style.display = "none";
      }
    });
  }

  function showAuthForm(id) {
    hideAllAuthForms();

    const form = getElement(id);

    if (form) {
      form.style.display = "block";
    }

    clearMessage();
  }

  /* ------------------------------------------
     Registration
  ------------------------------------------ */

  async function registerUser(event) {
    event.preventDefault();
    clearMessage();

    const supabase = getSupabase();

    if (!supabase) {
      showMessage(
        "Supabase connect nahi hua. Configuration check karo.",
        "error"
      );
      return;
    }

    const username = getInputValue("signupUsername");
    const email = getInputValue("signupEmail");
    const password = getInputValue("signupPassword");
    const confirmPassword = getInputValue("signupConfirmPassword");

    if (!username || !email || !password) {
      showMessage("Saari required details bharo.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Valid email address enter karo.", "error");
      return;
    }

    if (password.length < 8) {
      showMessage(
        "Password kam se kam 8 characters ka rakho.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Dono passwords match nahi kar rahe.", "error");
      return;
    }

    const button = event.submitter;
    const originalText = button?.textContent || "Create Account";

    setButtonLoading(button, true, originalText);

    try {
      /*
       * OTP-based registration:
       * Supabase sends an email OTP.
       * Email template must contain {{ .Token }}.
       */

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            username: username
          }
        }
      });

      if (error) throw error;

      // Store only temporary, non-secret registration details.
      sessionStorage.setItem(
        "ds_pending_email",
        email
      );

      sessionStorage.setItem(
        "ds_pending_username",
        username
      );

      // Do not store the password in browser storage.

      const emailField = getElement("otpEmail");

      if (emailField) {
        emailField.value = email;
      }

      showAuthForm("otpForm");

      showMessage(
        "Email par OTP bhej diya gaya hai. Inbox aur spam folder check karo.",
        "success"
      );
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setButtonLoading(button, false, originalText);
    }
  }

  /* ------------------------------------------
     Verify Registration OTP
  ------------------------------------------ */

  async function verifyRegistrationOtp(event) {
    event.preventDefault();
    clearMessage();

    const supabase = getSupabase();

    if (!supabase) {
      showMessage("Supabase connection missing hai.", "error");
      return;
    }

    const email =
      getInputValue("otpEmail") ||
      sessionStorage.getItem("ds_pending_email") ||
      "";

    const token = getInputValue("otpCode");

    if (!isValidEmail(email)) {
      showMessage("Registration email nahi mila.", "error");
      return;
    }

    if (!/^\d{6}$/.test(token)) {
      showMessage("6-digit OTP enter karo.", "error");
      return;
    }

    const button = event.submitter;
    const originalText = button?.textContent || "Verify OTP";

    setButtonLoading(button, true, originalText);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email"
      });

      if (error) throw error;

      sessionStorage.removeItem("ds_pending_email");
      sessionStorage.removeItem("ds_pending_username");

      showMessage(
        "Email verify ho gaya! Account ready hai.",
        "success"
      );

      /*
       * Successful email OTP verification may also sign
       * the user in. Update dashboard if available.
       */

      if (data?.session) {
        window.dispatchEvent(
          new CustomEvent("ds:auth-changed", {
            detail: { user: data.user }
          })
        );

        if (typeof window.refreshDashboard === "function") {
          await window.refreshDashboard();
        }
      } else {
        showAuthForm("loginForm");
        showMessage(
          "Email verify ho gaya. Ab login karo.",
          "success"
        );
      }
    } catch (error) {
      showMessage(
        friendlyError(error),
        "error"
      );
    } finally {
      setButtonLoading(button, false, originalText);
    }
  }

  /* ------------------------------------------
     Resend Registration OTP
  ------------------------------------------ */

  async function resendOtp() {
    clearMessage();

    const supabase = getSupabase();

    if (!supabase) {
      showMessage("Supabase connection missing hai.", "error");
      return;
    }

    const email =
      getInputValue("otpEmail") ||
      sessionStorage.getItem("ds_pending_email") ||
      "";

    if (!isValidEmail(email)) {
      showMessage("Valid email address nahi mila.", "error");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });

      if (error) throw error;

      showMessage(
        "Agar account registered hai, naya OTP bhej diya gaya hai.",
        "success"
      );
    } catch (error) {
      showMessage(friendlyError(error), "error");
    }
  }

  /* ------------------------------------------
     Login with Email and Password
  ------------------------------------------ */

  async function loginUser(event) {
    event.preventDefault();
    clearMessage();

    const supabase = getSupabase();

    if (!supabase) {
      showMessage("Supabase connection missing hai.", "error");
      return;
    }

    const email = getInputValue("loginEmail");
    const password = getInputValue("loginPassword");

    if (!isValidEmail(email) || !password) {
      showMessage("Email aur password check karo.", "error");
      return;
    }

    const button = event.submitter;
    const originalText = button?.textContent || "Login";

    setButtonLoading(button, true, originalText);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      showMessage("Login successful!", "success");

      window.dispatchEvent(
        new CustomEvent("ds:auth-changed", {
          detail: { user: data.user }
        })
      );

      if (typeof window.refreshDashboard === "function") {
        await window.refreshDashboard();
      }
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setButtonLoading(button, false, originalText);
    }
  }

  /* ------------------------------------------
     Forgot Password
  ------------------------------------------ */

  async function sendPasswordReset(event) {
    event.preventDefault();
    clearMessage();

    const supabase = getSupabase();

    if (!supabase) {
      showMessage("Supabase connection missing hai.", "error");
      return;
    }

    const email = getInputValue("forgotEmail");

    if (!isValidEmail(email)) {
      showMessage("Valid email address enter karo.", "error");
      return;
    }

    const button = event.submitter;
    const originalText =
      button?.textContent || "Send Reset Link";

    setButtonLoading(button, true, originalText);

    try {
      const redirectTo = new URL(
        window.location.pathname,
        window.location.origin
      ).href;

      const { error } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo
        });

      if (error) throw error;

      showMessage(
        "Agar is email ka account hai, password reset instructions bhej di gayi hain.",
        "success"
      );
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setButtonLoading(button, false, originalText);
    }
  }

  /* ------------------------------------------
     Update Password
  ------------------------------------------ */

  async function updatePassword(event) {
    event.preventDefault();
    clearMessage();

    const supabase = getSupabase();

    if (!supabase) {
      showMessage("Supabase connection missing hai.", "error");
      return;
    }

    const password = getInputValue("resetPassword");
    const confirmPassword =
      getInputValue("resetConfirmPassword");

    if (password.length < 8) {
      showMessage(
        "Password kam se kam 8 characters ka rakho.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Dono passwords match nahi kar rahe.", "error");
      return;
    }

    const button = event.submitter;
    const originalText =
      button?.textContent || "Update Password";

    setButtonLoading(button, true, originalText);

    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;

      showMessage(
        "Password successfully update ho gaya.",
        "success"
      );

      const resetForm = getElement("resetForm");

      if (resetForm) resetForm.reset();

      showAuthForm("loginForm");
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setButtonLoading(button, false, originalText);
    }
  }

  /* ------------------------------------------
     Logout
  ------------------------------------------ */

  async function logoutUser() {
    const supabase = getSupabase();

    if (!supabase) return;

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      sessionStorage.removeItem("ds_pending_email");
      sessionStorage.removeItem("ds_pending_username");

      window.dispatchEvent(
        new CustomEvent("ds:auth-changed", {
          detail: { user: null }
        })
      );

      showAuthForm("loginForm");
      showMessage("Logout successful.", "success");
    } catch (error) {
      showMessage(friendlyError(error), "error");
    }
  }

  /* ------------------------------------------
     Session Check
  ------------------------------------------ */

  async function getCurrentUser() {
    const supabase = getSupabase();

    if (!supabase) return null;

    const { data, error } =
      await supabase.auth.getUser();

    if (error) {
      console.warn("Could not retrieve current user.");
      return null;
    }

    return data.user || null;
  }

  /* ------------------------------------------
     Form Event Setup
  ------------------------------------------ */

  function attachSubmit(id, handler) {
    const form = getElement(id);

    if (form) {
      form.addEventListener("submit", handler);
    }
  }

  function attachClick(id, handler) {
    const element = getElement(id);

    if (element) {
      element.addEventListener("click", handler);
    }
  }

  function initAuth() {
    attachSubmit("signupForm", registerUser);
    attachSubmit("otpForm", verifyRegistrationOtp);
    attachSubmit("loginForm", loginUser);
    attachSubmit("forgotForm", sendPasswordReset);
    attachSubmit("resetForm", updatePassword);

    attachClick("resendOtp", resendOtp);
    attachClick("logoutButton", logoutUser);

    attachClick("showLogin", () =>
      showAuthForm("loginForm")
    );

    attachClick("showForgot", () =>
      showAuthForm("forgotForm")
    );

    attachClick("showSignup", () =>
      showAuthForm("signupForm")
    );

    attachClick("backToLogin", () =>
      showAuthForm("loginForm")
    );

    // Listen for Supabase session changes.

    const supabase = getSupabase();

    if (supabase) {
      supabase.auth.onAuthStateChange((event, session) => {
        window.dispatchEvent(
          new CustomEvent("ds:auth-changed", {
            detail: {
              event,
              user: session?.user || null
            }
          })
        );
      });
    }
  }

  // Public functions for other project files.

  window.DigitalServicesAuth = {
    init: initAuth,
    getCurrentUser,
    logout: logoutUser,
    showAuthForm,
    showMessage
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initAuth
    );
  } else {
    initAuth();
  }
})();
