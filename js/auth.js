// Digital-Services - Authentication
(() => {
  "use strict";

  let pendingEmail = "";

  const getSupabase = () => window.digitalServicesSupabase;
  const getElement = (id) => document.getElementById(id);

  function showMessage(message, isError = false) {
    const element = getElement("authMessage");
    if (!element) return;

    element.textContent = message;
    element.style.color = isError ? "#dc2626" : "";
  }

  function setBusy(form, busy) {
    if (!form) return;

    const buttons = form.querySelectorAll(
      'button[type="submit"], input[type="submit"]'
    );

    buttons.forEach((button) => {
      button.disabled = busy;
    });
  }

  function friendlyError(error) {
    const message = String(error?.message || "").toLowerCase();

    if (message.includes("invalid login credentials")) {
      return "Email ya password galat hai.";
    }

    if (message.includes("email not confirmed")) {
      return "Pehle apna email OTP se verify karo.";
    }

    if (message.includes("already registered")) {
      return "Is email se account pehle se bana hua hai. Login try karo.";
    }

    if (message.includes("password")) {
      return error.message || "Password mein problem hai.";
    }

    if (message.includes("invalid")) {
      return "Code ya details galat hain. Dobara check karo.";
    }

    return error?.message || "Kuch problem hui. Dobara try karo.";
  }

  function requireSupabase() {
    const supabase = getSupabase();

    if (!supabase) {
      showMessage(
        "Supabase connection nahi ho rahi. Configuration check karo.",
        true
      );
      return null;
    }

    return supabase;
  }

  async function signup(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const supabase = requireSupabase();
    if (!supabase) return;

    const username = getElement("signupUsername")?.value.trim();
    const email = getElement("signupEmail")?.value.trim().toLowerCase();
    const password = getElement("signupPassword")?.value;
    const confirmPassword =
      getElement("signupConfirmPassword")?.value;

    if (!username || !email || !password || !confirmPassword) {
      showMessage("Saari details fill karo.", true);
      return;
    }

    if (password.length < 8) {
      showMessage("Password kam se kam 8 characters ka rakho.", true);
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Dono passwords match nahi kar rahe.", true);
      return;
    }

    setBusy(form, true);
    showMessage("Account create ho raha hai...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) throw error;

      pendingEmail = email;

      const otpEmail = getElement("otpEmail");
      if (otpEmail) otpEmail.value = email;

      if (data.user && !data.session) {
        if (typeof window.showAuthForm === "function") {
          window.showAuthForm("otp");
        }

        showMessage(
          "Email par verification code bheja gaya hai. Inbox ya spam folder check karo."
        );
      } else if (data.session) {
        showMessage(
          "Account create ho gaya! Ab login kar sakte ho."
        );

        await supabase.auth.signOut();
        if (typeof window.showAuthForm === "function") {
          window.showAuthForm("login");
        }
      } else {
        showMessage(
          "Account status confirm nahi ho saka. Dobara try karo.",
          true
        );
      }
    } catch (error) {
      showMessage(friendlyError(error), true);
    } finally {
      setBusy(form, false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const supabase = requireSupabase();
    if (!supabase) return;

    const email =
      getElement("otpEmail")?.value.trim().toLowerCase() ||
      pendingEmail;

    const token = getElement("otpCode")?.value.trim();

    if (!email || !token) {
      showMessage("Email aur OTP code enter karo.", true);
      return;
    }

    setBusy(form, true);
    showMessage("OTP verify ho raha hai...");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "signup"
      });

      if (error) throw error;

      // Verification ke baad session close karke normal login dikhate hain.
      await supabase.auth.signOut();

      const otpCode = getElement("otpCode");
      if (otpCode) otpCode.value = "";

      if (typeof window.showAuthForm === "function") {
        window.showAuthForm("login");
      }

      const loginEmail = getElement("loginEmail");
      if (loginEmail) loginEmail.value = email;

      showMessage(
        "Email verify ho gaya! Ab apne email aur password se login karo."
      );
    } catch (error) {
      showMessage(friendlyError(error), true);
    } finally {
      setBusy(form, false);
    }
  }

  async function login(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const supabase = requireSupabase();
    if (!supabase) return;

    const email = getElement("loginEmail")?.value.trim().toLowerCase();
    const password = getElement("loginPassword")?.value;

    if (!email || !password) {
      showMessage("Email aur password enter karo.", true);
      return;
    }

    setBusy(form, true);
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

      const modal = getElement("authModal");
      if (modal) modal.hidden = true;

      if (
        typeof window.DigitalServicesDashboard?.refresh === "function"
      ) {
        await window.DigitalServicesDashboard.refresh();
      }
    } catch (error) {
      showMessage(friendlyError(error), true);
    } finally {
      setBusy(form, false);
    }
  }

  async function resendOtp() {
    const supabase = requireSupabase();
    if (!supabase) return;

    const email =
      getElement("otpEmail")?.value.trim().toLowerCase() ||
      pendingEmail;

    if (!email) {
      showMessage("Pehle apna email enter karo.", true);
      return;
    }

    showMessage("Naya OTP bheja ja raha hai...");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email
      });

      if (error) throw error;

      showMessage("Naya OTP bhej diya gaya hai. Email check karo.");
    } catch (error) {
      showMessage(friendlyError(error), true);
    }
  }

  async function forgotPassword(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const supabase = requireSupabase();
    if (!supabase) return;

    const email = getElement("forgotEmail")?.value.trim().toLowerCase();

    if (!email) {
      showMessage("Apna registered email enter karo.", true);
      return;
    }

    setBusy(form, true);
    showMessage("Recovery email bheja ja raha hai...");

    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo }
      );

      if (error) throw error;

      showMessage(
        "Agar is email par account hai, toh password reset link bhej diya gaya hai. Email check karo."
      );
    } catch (error) {
      showMessage(friendlyError(error), true);
    } finally {
      setBusy(form, false);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const supabase = requireSupabase();
    if (!supabase) return;

    const password = getElement("resetPassword")?.value;
    const confirmPassword =
      getElement("resetConfirmPassword")?.value;

    if (!password || !confirmPassword) {
      showMessage("Dono password fields fill karo.", true);
      return;
    }

    if (password.length < 8) {
      showMessage("Password kam se kam 8 characters ka rakho.", true);
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Dono passwords match nahi kar rahe.", true);
      return;
    }

    setBusy(form, true);
    showMessage("Password update ho raha hai...");

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      await supabase.auth.signOut();

      if (typeof window.showAuthForm === "function") {
        window.showAuthForm("login");
      }

      const resetForm = getElement("resetForm");
      resetForm?.reset();

      showMessage(
        "Password update ho gaya! Ab naye password se login karo."
      );
    } catch (error) {
      showMessage(friendlyError(error), true);
    } finally {
      setBusy(form, false);
    }
  }

  function attach(formId, handler) {
    const form = getElement(formId);
    if (form) form.addEventListener("submit", handler);
  }

  attach("signupForm", signup);
  attach("otpForm", verifyOtp);
  attach("loginForm", login);
  attach("forgotForm", forgotPassword);
  attach("resetForm", resetPassword);

  getElement("resendOtp")?.addEventListener("click", resendOtp);

  window.DigitalServicesAuth = {
    signup,
    verifyOtp,
    login,
    resendOtp,
    forgotPassword,
    resetPassword
  };

  // Password recovery link se wapas aane par reset form kholne ki koshish.
  const supabase = getSupabase();

  if (supabase) {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        window.openDigitalServicesAuth?.("reset");
        showMessage("Apna naya password set karo.");
      }
    });
  }
})();
