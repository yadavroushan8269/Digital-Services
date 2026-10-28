// ============================================
// DIGITAL SERVICES — COMPLETE AUTHENTICATION
// Supabase + Signup + Email Confirmation + Login
// Forgot Password + Reset Password + Logout
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

  const forms = {
    signup: $("#signupForm"),
    otp: $("#otpForm"),
    login: $("#loginForm"),
    forgot: $("#forgotForm"),
    reset: $("#resetForm")
  };

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

    if (!element) return;

    element.textContent = "";
    element.style.display = "none";
  }

  // --------------------------------------------
  // BUTTON LOADING
  // --------------------------------------------

  function setLoading(button, loading, originalText) {
    if (!button) return;

    button.disabled = loading;
    button.textContent = loading
      ? "Please wait..."
      : originalText;
  }

  // --------------------------------------------
  // FRIENDLY ERRORS
  // --------------------------------------------

  function friendlyError(error) {
    const message = error?.message || "";

    if (/invalid login credentials/i.test(message)) {
      return "Email ya password galat hai.";
    }

    if (/email not confirmed/i.test(message)) {
      return "Pehle email inbox mein confirmation link par click karo.";
    }

    if (/already registered|already exists/i.test(message)) {
      return "Is email se account pehle se hai. Login try karo.";
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

    if (/invalid.*token|token.*expired|otp_expired/i.test(message)) {
      return "Confirmation link expire ya invalid ho gaya. Naya link mangwao.";
    }

    return message || "Kuch problem hui. Dobara try karo.";
  }

  // --------------------------------------------
  // MODAL
  // --------------------------------------------

  function hideAllForms() {
    Object.values(forms).forEach((form) => {
      if (form) form.hidden = true;
    });
  }

  function openAuth(type = "login") {
    if (!modalOverlay) return;

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
        "Email Verification",
        "This website currently uses an email confirmation link."
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

  window.openDigitalServicesAuth = openAuth;
  window.closeDigitalServicesAuth = closeAuth;
  window.showAuthForm = openAuth;

  // --------------------------------------------
  // OPEN AUTH BUTTONS
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
  // SWITCH FORMS
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
    if (
      event.key === "Escape" &&
      modalOverlay &&
      !modalOverlay.hidden
    ) {
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
  // SIGNUP — EMAIL CONFIRMATION LINK
  // --------------------------------------------

  forms.signup?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const username = $("#signupUsername")?.value.trim() || "";
    const email = $("#signupEmail")?.value.trim() || "";
    const password = $("#signupPassword")?.value || "";

    const confirmPassword =
      $("#signupConfirmPassword")?.value || "";

    const button = forms.signup.querySelector(
      'button[type="submit"]'
    );

    const originalText =
      button?.textContent || "Create Account";

    if (username.length < 3) {
      showMessage(
        "Username kam se kam 3 characters ka rakho.",
        true
      );
      return;
    }

    if (!email || !password || !confirmPassword) {
      showMessage("Saare fields fill karo.", true);
      return;
    }

    if (password.length < 8) {
      showMessage(
        "Password kam se kam 8 characters ka rakho.",
        true
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage(
        "Dono passwords match nahi kar rahe.",
        true
      );
      return;
    }

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

      // Agar signup ke baad session mila,
      // user already authenticated hai.
      if (data.session && data.user) {
        forms.signup.reset();

        showMessage("Account create ho gaya!");

        window.dispatchEvent(
          new CustomEvent("ds:auth-changed", {
            detail: { user: data.user }
          })
        );

        setTimeout(() => {
          closeAuth();
          showDashboard(data.user);
        }, 1000);

        return;
      }

      // Email confirmation required hai.
      forms.signup.reset();

      showMessage(
        "Registration request submit ho gayi! " +
        "Apna email inbox aur Spam folder check karo. " +
        "Confirmation email mein link par click karo. " +
        "Email verify hone ke baad yahan aakar Login karo."
      );

    } catch (error) {
      console.error("Signup error:", error);

      showMessage(friendlyError(error), true);

    } finally {
      setLoading(button, false, originalText);
    }
  });

  // --------------------------------------------
  // OTP FORM — NOT USED IN EMAIL-LINK MODE
  // --------------------------------------------

  // Is version mein email OTP verification use nahi ho rahi.
  // User ko email mein confirmation link milega.
  // Isliye OTP form ko signup ke baad nahi kholte.

  forms.otp?.addEventListener("submit", (event) => {
    event.preventDefault();

    showMessage(
      "Abhi email-link verification enabled hai. " +
      "Apne inbox mein confirmation link kholo.",
      true
    );
  });

  $("#resendOtp")?.addEventListener("click", () => {
    showMessage(
      "Email-link mode mein OTP resend nahi hota. " +
      "Agar naya confirmation email chahiye, signup dobara try karne se pehle " +
      "Supabase mein user ka status check karo.",
      true
    );
  });

  // --------------------------------------------
  // LOGIN
  // --------------------------------------------

  forms.login?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const email = $("#loginEmail")?.value.trim() || "";
    const password = $("#loginPassword")?.value || "";

    const button = forms.login.querySelector(
      'button[type="submit"]'
    );

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

      if (!data.user) {
        showMessage(
          "Login complete nahi hua. Dobara try karo.",
          true
        );
        return;
      }

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

    const button = forms.forgot.querySelector(
      'button[type="submit"]'
    );

    const originalText =
      button?.textContent || "Send Recovery Link";

    if (!email) {
      showMessage("Apna email address enter karo.", true);
      return;
    }

    setLoading(button, true, originalText);

    showMessage("Recovery email send ho rahi hai...");

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/"
        });

      if (error) throw error;

      showMessage(
        "Agar is email se account hai, toh recovery instructions " +
        "email par bhej di gayi hain. Inbox aur Spam folder check karo."
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

    const button = forms.reset.querySelector(
      'button[type="submit"]'
    );

    const originalText =
      button?.textContent || "Update Password";

    if (password.length < 8) {
      showMessage(
        "Password kam se kam 8 characters ka rakho.",
        true
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage(
        "Dono passwords match nahi kar rahe.",
        true
      );
      return;
    }

    setLoading(button, true, originalText);

    showMessage("Password update ho raha hai...");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      forms.reset.reset();

      showMessage(
        "Password update ho gaya. Ab naye password se login karo."
      );

      // Password update ke baad current session band karo.
      await supabase.auth.signOut();

      setTimeout(() => {
        openAuth("login");
        showMessage(
          "Password update ho gaya. Ab naye password se login karo."
        );
      }, 1000);

    } catch (error) {
      console.error("Reset password error:", error);

      showMessage(friendlyError(error), true);

    } finally {
      setLoading(button, false, originalText);
    }
  });

  // --------------------------------------------
  // SHOW DASHBOARD
  // --------------------------------------------

  function showDashboard(user) {
    const dashboard = $("#userDashboard");

    if (!dashboard) return;

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

      const dashboard = $("#userDashboard");

      if (dashboard) {
        dashboard.hidden = true;
      }

      closeAuth();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    } catch (error) {
      console.error("Logout error:", error);

      alert(friendlyError(error));
    }
  }

  $("#logoutButton")?.addEventListener("click", logout);

  // --------------------------------------------
  // GLOBAL AUTH HELPERS
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
    if (
      (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
      session?.user
    ) {
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

  console.log(
    "Digital Services authentication initialized."
  );
})();
