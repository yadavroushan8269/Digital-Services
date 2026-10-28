// ============================================
// DIGITAL SERVICES — COMPLETE AUTHENTICATION
// Supabase + Modal + Signup + Login + Recovery
// ============================================

(() => {
  "use strict";

  const supabase = window.digitalServicesSupabase;

  if (!supabase) {
    console.error(
      "Supabase client nahi mila. js/supabase.js check karo."
    );
    return;
  }

  const $ = (selector) => document.querySelector(selector);

  const modalOverlay = $("#authModal");
  const modal = modalOverlay?.querySelector(".modal");

  const forms = {
    signup: $("#signupForm"),
    otp: $("#otpForm"),
    login: $("#loginForm"),
    forgot: $("#forgotForm"),
    reset: $("#resetForm")
  };

  let pendingSignup = null;

  // --------------------------------------------
  // MESSAGE
  // --------------------------------------------

  function showMessage(message, isError = false) {
    const element = $("#authMessage");

    if (!element) return;

    element.textContent = message;
    element.style.color = isError ? "#ff6b81" : "#00ff9c";
    element.style.display = "block";
  }

  function clearMessage() {
    const element = $("#authMessage");

    if (element) {
      element.textContent = "";
      element.style.display = "none";
    }
  }

  // --------------------------------------------
  // LOADING BUTTON
  // --------------------------------------------

  function setLoading(button, loading, originalText) {
    if (!button) return;

    button.disabled = loading;
    button.textContent = loading
      ? "Please wait..."
      : originalText;
  }

  // --------------------------------------------
  // ERROR MESSAGES
  // --------------------------------------------

  function friendlyError(error) {
    const message = error?.message || "";

    if (/invalid login credentials/i.test(message)) {
      return "Email ya password galat hai.";
    }

    if (/already registered|already exists/i.test(message)) {
      return "Is email se account pehle se hai. Login try karo.";
    }

    if (/email not confirmed/i.test(message)) {
      return "Pehle email confirmation complete karo.";
    }

    if (/rate limit|too many requests/i.test(message)) {
      return "Bahut attempts ho gaye. Thodi der baad try karo.";
    }

    if (/password/i.test(message) && /weak|short|least/i.test(message)) {
      return "Password aur strong rakho.";
    }

    if (/network|fetch/i.test(message)) {
      return "Internet connection check karke dobara try karo.";
    }

    return message || "Kuch problem hui. Dobara try karo.";
  }

  // --------------------------------------------
  // SHOW / HIDE MODAL
  // --------------------------------------------

  function hideAllForms() {
    Object.values(forms).forEach((form) => {
      if (form) form.hidden = true;
    });
  }

  function openAuth(type = "login") {
    if (!modalOverlay) {
      console.error("Auth modal #authModal nahi mila.");
      return;
    }

    const selectedForm = forms[type];

    if (!selectedForm) {
      console.error("Auth form nahi mila:", type);
      return;
    }

    hideAllForms();
    clearMessage();

    selectedForm.hidden = false;
    modalOverlay.hidden = false;
    modalOverlay.style.display = "flex";

    document.body.style.overflow = "hidden";

    const titles = {
      signup: [
        "Create Your Account",
        "Register with your email to get started."
      ],
      otp: [
        "Verify Your Email",
        "Enter the verification code sent to your email."
      ],
      login: [
        "Welcome Back",
        "Login to your Digital Services account."
      ],
      forgot: [
        "Recover Password",
        "We will send password recovery instructions."
      ],
      reset: [
        "Set New Password",
        "Choose a new password for your account."
      ]
    };

    const title = $("#modalTitle");
    const description = $("#modalDescription");

    if (title) title.textContent = titles[type][0];

    if (description) {
      description.textContent = titles[type][1];
    }

    const firstInput = selectedForm.querySelector(
      'input:not([type="hidden"]):not([readonly])'
    );

    setTimeout(() => firstInput?.focus(), 50);
  }

  function closeAuth() {
    if (!modalOverlay) return;

    modalOverlay.hidden = true;
    modalOverlay.style.display = "none";
    document.body.style.overflow = "";

    clearMessage();
  }

  // Make functions available to other app scripts.
  window.openDigitalServicesAuth = openAuth;
  window.closeDigitalServicesAuth = closeAuth;
  window.showAuthForm = openAuth;

  // --------------------------------------------
  // OPEN MODAL BUTTONS
  // --------------------------------------------

  $("#navLogin")?.addEventListener("click", () => {
    openAuth("login");
  });

  $("#navRegister")?.addEventListener("click", () => {
    openAuth("signup");
  });

  $("#heroRegister")?.addEventListener("click", () => {
    openAuth("signup");
  });

  $("#bottomRegister")?.addEventListener("click", () => {
    openAuth("signup");
  });

  // --------------------------------------------
  // SWITCH BETWEEN FORMS
  // --------------------------------------------

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

  $("#closeModal")?.addEventListener("click", closeAuth);

  modalOverlay?.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeAuth();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalOverlay && !modalOverlay.hidden) {
      closeAuth();
    }
  });

  // --------------------------------------------
  // MOBILE NAVIGATION
  // --------------------------------------------

  const menuToggle = $("#menuToggle");
  const navigation = $("#navigation");

  menuToggle?.addEventListener("click", () => {
    const expanded =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!expanded));

    navigation?.classList.toggle("open", !expanded);
  });

  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // --------------------------------------------
  // SIGNUP
  // --------------------------------------------

  forms.signup?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const username = $("#signupUsername")?.value.trim() || "";
    const email = $("#signupEmail")?.value.trim() || "";
    const password = $("#signupPassword")?.value || "";

    // Tumhare HTML mein ID signupConfirmPassword hai.
    const confirmPassword =
      $("#signupConfirmPassword")?.value ||
      $("#confirmPassword")?.value ||
      "";

    const button = forms.signup.querySelector(
      'button[type="submit"]'
    );

    if (username.length < 3) {
      showMessage("Username kam se kam 3 characters ka rakho.", true);
      return;
    }

    if (!email || !password || !confirmPassword) {
      showMessage("Saare fields fill karo.", true);
      return;
    }

    if (password.length < 8) {
      showMessage("Password kam se kam 8 characters ka hona chahiye.", true);
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Dono passwords match nahi kar rahe.", true);
      return;
    }

    const originalText = button?.textContent || "Create Account";

    setLoading(button, true, originalText);
    showMessage("Account create ho raha hai...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          },
          emailRedirectTo: window.location.origin + "/"
        }
      });

      if (error) throw error;

      pendingSignup = {
        email,
        password
      };

      const otpEmail = $("#otpEmail");

      if (otpEmail) {
        otpEmail.value = email;
      }

      /*
       * Agar Supabase ne session return kiya,
       * account create ho gaya aur user login hai.
       */
      if (data.session) {
        showMessage("Account create ho gaya! Welcome.");

        window.dispatchEvent(
          new CustomEvent("ds:auth-changed", {
            detail: { user: data.user }
          })
        );

        setTimeout(() => {
          closeAuth();
          showDashboard(data.user);
        }, 700);

        return;
      }

      /*
       * Session nahi mila to Supabase email confirmation
       * required ho sakta hai.
       *
       * Default confirmation-link template ke liye
       * OTP form dikhane ke bajaye email link use karo.
       */
      hideAllForms();

      showMessage(
        "Signup request submit ho gayi! Apna email inbox check karo aur Supabase ka confirmation link click karo. Confirmation ke baad Login karo."
      );

      forms.signup.reset();

    } catch (error) {
      console.error("Signup error:", error);
      showMessage(friendlyError(error), true);
    } finally {
      setLoading(button, false, originalText);
    }
  });

  // --------------------------------------------
  // OTP VERIFICATION
  // --------------------------------------------
  /*
   * Ye handler tabhi kaam karega jab Supabase email
   * template actual OTP bhej raha ho.
   *
   * Default confirmation-link template mein link click
   * karna hai, OTP enter karna nahi.
   */

  forms.otp?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const email = $("#otpEmail")?.value.trim() || "";
    const token = $("#otpCode")?.value.trim() || "";

    if (!email || !/^\d{6,8}$/.test(token)) {
      showMessage("Email aur valid verification code enter karo.", true);
      return;
    }

    const button = forms.otp.querySelector('button[type="submit"]');
    const originalText = button?.textContent || "Verify Email";

    setLoading(button, true, originalText);
    showMessage("Email verify ho raha hai...");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "signup"
      });

      if (error) throw error;

      showMessage("Email verify ho gaya!");

      if (data.user) {
        window.dispatchEvent(
          new CustomEvent("ds:auth-changed", {
            detail: { user: data.user }
          })
        );
      }

      setTimeout(() => {
        openAuth("login");
        showMessage("Email verify ho gaya. Ab login karo.");
      }, 800);

    } catch (error) {
      console.error("OTP verification error:", error);
      showMessage(friendlyError(error), true);
    } finally {
      setLoading(button, false, originalText);
    }
  });

  // --------------------------------------------
  // RESEND OTP
  // --------------------------------------------

  $("#resendOtp")?.addEventListener("click", async () => {
    clearMessage();

    const email = $("#otpEmail")?.value.trim() || "";

    if (!email) {
      showMessage("Pehle signup email enter karo.", true);
      return;
    }

    showMessage("Request process ho rahi hai...");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email
      });

      if (error) throw error;

      showMessage(
        "Agar email confirmation configured hai, toh inbox check karo."
      );

    } catch (error) {
      console.error("Resend error:", error);
      showMessage(friendlyError(error), true);
    }
  });

  // --------------------------------------------
  // LOGIN
  // --------------------------------------------

  forms.login?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const email = $("#loginEmail")?.value.trim() || "";
    const password = $("#loginPassword")?.value || "";

    const button = forms.login.querySelector('button[type="submit"]');
    const originalText = button?.textContent || "Login";

    if (!email || !password) {
      showMessage("Email aur password enter karo.", true);
      return;
    }

    setLoading(button, true, originalText);
    showMessage("Login ho raha hai...");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      showMessage("Login successful!");

      window.dispatchEvent(
        new CustomEvent("ds:auth-changed", {
          detail: { user: data.user }
        })
      );

      setTimeout(() => {
        closeAuth();
        showDashboard(data.user);
      }, 500);

    } catch (error) {
      console.error("Login error:", error);
      showMessage(friendlyError(error), true);
    } finally {
      setLoading(button, false, originalText);
    }
  });

  // --------------------------------------------
  // FORGOT PASSWORD
  // --------------------------------------------

  forms.forgot?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const email = $("#forgotEmail")?.value.trim() || "";
    const button = forms.forgot.querySelector('button[type="submit"]');
    const originalText = button?.textContent || "Send Recovery Link";

    if (!email) {
      showMessage("Apna email address enter karo.", true);
      return;
    }

    setLoading(button, true, originalText);
    showMessage("Recovery email send ho rahi hai...");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/"
      });

      if (error) throw error;

      showMessage(
        "Agar is email se account hai, toh recovery instructions email par bhej di gayi hain."
      );

    } catch (error) {
      console.error("Recovery error:", error);
      showMessage(friendlyError(error), true);
    } finally {
      setLoading(button, false, originalText);
    }
  });

  // --------------------------------------------
  // RESET PASSWORD
  // --------------------------------------------

  forms.reset?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const password = $("#resetPassword")?.value || "";
    const confirmPassword =
      $("#resetConfirmPassword")?.value || "";

    const button = forms.reset.querySelector('button[type="submit"]');
    const originalText = button?.textContent || "Update Password";

    if (password.length < 8) {
      showMessage("Password kam se kam 8 characters ka rakho.", true);
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Dono passwords match nahi kar rahe.", true);
      return;
    }

    setLoading(button, true, originalText);
    showMessage("Password update ho raha hai...");

    try {
      const { data, error } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;

      showMessage("Password update ho gaya. Ab naye password se login karo.");

      forms.reset.reset();

      setTimeout(() => {
        openAuth("login");
      }, 1000);

    } catch (error) {
      console.error("Reset password error:", error);
      showMessage(friendlyError(error), true);
    } finally {
      setLoading(button, false, originalText);
    }
  });

  // --------------------------------------------
  // SHOW DASHBOARD AFTER LOGIN
  // --------------------------------------------

  function showDashboard(user) {
    const dashboard = $("#userDashboard");

    if (!dashboard) {
      // Agar is page par dashboard section nahi hai,
      // toh login successful rehne do.
      return;
    }

    const username =
      user?.user_metadata?.username ||
      user?.email?.split("@")[0] ||
      "User";

    const usernameElement = $("#dashboardUsername");
    const emailElement = $("#dashboardEmail");

    if (usernameElement) {
      usernameElement.textContent = username;
    }

    if (emailElement) {
      emailElement.textContent = user?.email || "";
    }

    dashboard.hidden = false;

    dashboard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  // --------------------------------------------
  // LOGOUT
  // --------------------------------------------

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      window.dispatchEvent(
        new CustomEvent("ds:auth-changed", {
          detail: { user: null }
        })
      );

      closeAuth();

      const dashboard = $("#userDashboard");

      if (dashboard) {
        dashboard.hidden = true;
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      showMessage("Logout successful.");

    } catch (error) {
      console.error("Logout error:", error);
      alert(friendlyError(error));
    }
  }

  $("#logoutButton")?.addEventListener("click", logout);

  // --------------------------------------------
  // GLOBAL HELPERS
  // --------------------------------------------

  window.DigitalServicesAuth = {
    getUser: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;

      return data.user;
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      window.dispatchEvent(
        new CustomEvent("ds:auth-changed", {
          detail: { user: null }
        })
      );
    }
  };

  // --------------------------------------------
  // AUTH STATE
  // --------------------------------------------

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      window.dispatchEvent(
        new CustomEvent("ds:auth-changed", {
          detail: { user: session.user }
        })
      );
    }

    if (event === "PASSWORD_RECOVERY") {
      openAuth("reset");
    }
  });

  // --------------------------------------------
  // CURRENT YEAR
  // --------------------------------------------

  const yearElement = $("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  console.log("Digital Services authentication initialized.");
})();
