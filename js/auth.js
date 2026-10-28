"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const supabase = window.digitalServicesSupabase;

    // ==============================
    // ELEMENTS
    // ==============================

    const modal = document.getElementById("authModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const messageBox = document.getElementById("authMessage");

    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const forgotForm = document.getElementById("forgotForm");
    const resetForm = document.getElementById("resetForm");
    const otpForm = document.getElementById("otpForm");

    let authInitialized = false;
    let passwordRecoveryMode = false;

    // ==============================
    // MESSAGE
    // ==============================

    function showMessage(message, success = false) {
        if (!messageBox) {
            alert(message);
            return;
        }

        messageBox.textContent = message;
        messageBox.style.display = "block";
        messageBox.style.color = success ? "#00ff9c" : "#ff7070";
    }

    function clearMessage() {
        if (messageBox) {
            messageBox.textContent = "";
            messageBox.style.display = "none";
        }
    }

    // ==============================
    // FORM HELPERS
    // ==============================

    function hideAllForms() {
        [
            signupForm,
            loginForm,
            forgotForm,
            resetForm,
            otpForm
        ].forEach(form => {
            if (form) form.hidden = true;
        });
    }

    function openModal(formName) {
        if (!modal) return;

        clearMessage();
        hideAllForms();

        modal.hidden = false;
        modal.style.display = "flex";

        const config = {
            signup: {
                form: signupForm,
                title: "Create Account",
                description: "Create your Digital Services account."
            },
            login: {
                form: loginForm,
                title: "Welcome Back",
                description: "Login to your account."
            },
            forgot: {
                form: forgotForm,
                title: "Forgot Password",
                description: "We'll send you a password reset link."
            },
            reset: {
                form: resetForm,
                title: "Reset Password",
                description: "Choose a new password."
            },
            otp: {
                form: otpForm,
                title: "Verify Email",
                description: "Follow the verification instructions sent to your email."
            }
        };

        const selected = config[formName];

        if (!selected) return;

        if (selected.form) {
            selected.form.hidden = false;
        }

        if (modalTitle) {
            modalTitle.textContent = selected.title;
        }

        if (modalDescription) {
            modalDescription.textContent = selected.description;
        }
    }

    function closeModal() {
        if (!modal) return;

        modal.hidden = true;
        modal.style.display = "none";
        clearMessage();
    }

    // ==============================
    // DASHBOARD
    // ==============================

    function showDashboard(user) {
        if (!user) return;

        const dashboard = document.getElementById("userDashboard");
        const usernameElement = document.getElementById("dashboardUsername");
        const emailElement = document.getElementById("dashboardEmail");

        if (usernameElement) {
            usernameElement.textContent =
                user.user_metadata?.username ||
                user.email?.split("@")[0] ||
                "User";
        }

        if (emailElement) {
            emailElement.textContent = user.email || "";
        }

        if (dashboard) {
            dashboard.hidden = false;
            dashboard.style.display = "block";
        }

        closeModal();

        document.dispatchEvent(
            new CustomEvent("digitalServices:login", {
                detail: { user }
            })
        );
    }

    function hideDashboard() {
        const dashboard = document.getElementById("userDashboard");

        if (dashboard) {
            dashboard.hidden = true;
        }
    }

    // ==============================
    // BUTTON LOADING
    // ==============================

    async function withLoading(button, loadingText, action) {
        if (button?.disabled) return;

        const originalText = button?.textContent;

        if (button) {
            button.disabled = true;
            button.textContent = loadingText;
        }

        try {
            await action();
        } catch (error) {
            console.error("Authentication error:", error);
            showMessage(error.message || "Something went wrong.");
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = originalText;
            }
        }
    }

    // ==============================
    // CREATE ACCOUNT
    // ==============================

    if (signupForm) {
        signupForm.addEventListener("submit", async event => {
            event.preventDefault();

            const button = signupForm.querySelector(
                'button[type="submit"]'
            );

            await withLoading(button, "Creating account...", async () => {
                if (!supabase) {
                    throw new Error(
                        "Supabase connect nahi hua. js/supabase.js check karo."
                    );
                }

                const username =
                    document.getElementById("signupUsername")
                        ?.value.trim();

                const email =
                    document.getElementById("signupEmail")
                        ?.value.trim();

                const password =
                    document.getElementById("signupPassword")?.value;

                const confirmPassword =
                    document.getElementById("signupConfirmPassword")?.value;

                if (!username || !email || !password || !confirmPassword) {
                    throw new Error("Saari details fill karo.");
                }

                if (password.length < 8) {
                    throw new Error(
                        "Password kam se kam 8 characters ka hona chahiye."
                    );
                }

                if (password !== confirmPassword) {
                    throw new Error("Dono passwords match nahi karte.");
                }

                showMessage("Account create ho raha hai...", true);

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { username },
                        emailRedirectTo: window.location.origin + "/"
                    }
                });

                if (error) throw error;

                if (data.session && data.user) {
                    showMessage("Account create ho gaya!", true);
                    showDashboard(data.user);
                    return;
                }

                showMessage(
                    "Registration request submit ho gayi! Apna email inbox aur Spam folder check karo. Confirmation email mein link par click karo, phir website par wapas aao.",
                    true
                );

                signupForm.reset();
            });
        });
    }

    // ==============================
    // LOGIN
    // ==============================

    if (loginForm) {
        loginForm.addEventListener("submit", async event => {
            event.preventDefault();

            const button = loginForm.querySelector(
                'button[type="submit"]'
            );

            await withLoading(button, "Logging in...", async () => {
                if (!supabase) {
                    throw new Error("Supabase connection missing hai.");
                }

                const email =
                    document.getElementById("loginEmail")
                        ?.value.trim();

                const password =
                    document.getElementById("loginPassword")?.value;

                if (!email || !password) {
                    throw new Error("Email aur password fill karo.");
                }

                const { data, error } =
                    await supabase.auth.signInWithPassword({
                        email,
                        password
                    });

                if (error) throw error;

                showDashboard(data.user);
            });
        });
    }

    // ==============================
    // FORGOT PASSWORD
    // ==============================

    if (forgotForm) {
        forgotForm.addEventListener("submit", async event => {
            event.preventDefault();

            const button = forgotForm.querySelector(
                'button[type="submit"]'
            );

            await withLoading(button, "Sending link...", async () => {
                if (!supabase) {
                    throw new Error("Supabase connection missing hai.");
                }

                const email =
                    document.getElementById("forgotEmail")
                        ?.value.trim();

                if (!email) {
                    throw new Error("Email enter karo.");
                }

                const { error } =
                    await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: window.location.origin + "/"
                    });

                if (error) throw error;

                showMessage(
                    "Agar is email ke liye account available hai, password reset email bhej di gayi hai. Inbox aur Spam check karo.",
                    true
                );
            });
        });
    }

    // ==============================
    // RESET PASSWORD
    // ==============================

    if (resetForm) {
        resetForm.addEventListener("submit", async event => {
            event.preventDefault();

            const button = resetForm.querySelector(
                'button[type="submit"]'
            );

            await withLoading(button, "Updating password...", async () => {
                if (!supabase) {
                    throw new Error("Supabase connection missing hai.");
                }

                const password =
                    document.getElementById("resetPassword")?.value;

                const confirmPassword =
                    document.getElementById("resetConfirmPassword")?.value;

                if (!password || !confirmPassword) {
                    throw new Error("Dono password fields fill karo.");
                }

                if (password.length < 8) {
                    throw new Error("Password minimum 8 characters ka rakho.");
                }

                if (password !== confirmPassword) {
                    throw new Error("Passwords match nahi karte.");
                }

                const { error } = await supabase.auth.updateUser({
                    password
                });

                if (error) throw error;

                showMessage(
                    "Password update ho gaya! Ab naye password se login karo.",
                    true
                );

                await supabase.auth.signOut();

                setTimeout(() => openModal("login"), 1500);
            });
        });
    }

    // ==============================
    // EMAIL OTP FORM
    // Email-link mode is enabled
    // ==============================

    if (otpForm) {
        otpForm.addEventListener("submit", event => {
            event.preventDefault();

            showMessage(
                "Abhi email confirmation link use ho raha hai. Apne inbox mein confirmation email check karo."
            );
        });
    }

    const resendOtpButton = document.getElementById("resendOtp");

    if (resendOtpButton) {
        resendOtpButton.addEventListener("click", () => {
            showMessage(
                "Email confirmation link mode enabled hai. Registration ke baad inbox aur Spam folder check karo."
            );
        });
    }

    // ==============================
    // OPEN MODAL BUTTONS
    // ==============================

    document.querySelectorAll(
        "#showSignup, #registerButton, [data-auth='signup']"
    ).forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            openModal("signup");
        });
    });

    document.querySelectorAll(
        "#showLogin, #loginButton, [data-auth='login']"
    ).forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            openModal("login");
        });
    });

    const showForgot = document.getElementById("showForgot");

    if (showForgot) {
        showForgot.addEventListener("click", event => {
            event.preventDefault();
            openModal("forgot");
        });
    }

    const showSignup = document.getElementById("showSignup");

    if (showSignup) {
        showSignup.addEventListener("click", event => {
            event.preventDefault();
            openModal("signup");
        });
    }

    const backToLogin = document.getElementById("backToLogin");

    if (backToLogin) {
        backToLogin.addEventListener("click", event => {
            event.preventDefault();
            openModal("login");
        });
    }

    const closeButton = document.getElementById("closeModal");

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // ==============================
    // LOGOUT
    // ==============================

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            if (!supabase) {
                showMessage("Supabase connection missing hai.");
                return;
            }

            const { error } = await supabase.auth.signOut();

            if (error) {
                showMessage(error.message);
                return;
            }

            hideDashboard();
            openModal("login");
            showMessage("Logout successful.", true);
        });
    }

    // ==============================
    // SUPABASE AUTH STATE
    // ==============================

    async function initializeAuth() {
        if (!supabase) {
            console.error(
                "Supabase client nahi mila. js/supabase.js check karo."
            );
            return;
        }

        if (authInitialized) return;
        authInitialized = true;

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                passwordRecoveryMode = true;
                openModal("reset");
                showMessage("Ab apna naya password set karo.", true);
                return;
            }

            if (session?.user) {
                showDashboard(session.user);
            } else if (
                event === "SIGNED_OUT" ||
                event === "INITIAL_SESSION"
            ) {
                hideDashboard();
            }
        });

        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error("Session error:", error.message);
            return;
        }

        if (data.session?.user) {
            showDashboard(data.session.user);
        }

        // Handle a recovery link opened in the browser.
        const hash = window.location.hash;

        if (hash.includes("type=recovery")) {
            passwordRecoveryMode = true;
            openModal("reset");
            showMessage("Apna naya password enter karo.", true);
        }
    }

    initializeAuth();

    // Optional helpers for other site scripts.
    window.digitalServicesAuth = {
        openModal,
        closeModal,
        showDashboard,
        hideDashboard
    };
});
