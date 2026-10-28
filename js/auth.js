"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const supabase = window.digitalServicesSupabase;

    const modal = document.getElementById("authModal");
    const messageBox = document.getElementById("authMessage");

    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const forgotForm = document.getElementById("forgotForm");
    const resetForm = document.getElementById("resetForm");

    // ===================================
    // MESSAGE
    // ===================================

    function showMessage(message, success = false) {
        if (!messageBox) {
            alert(message);
            return;
        }

        messageBox.textContent = message;
        messageBox.style.display = "block";
        messageBox.style.color = success
            ? "#00ff9c"
            : "#ff7070";
    }

    function clearMessage() {
        if (messageBox) {
            messageBox.textContent = "";
            messageBox.style.display = "none";
        }
    }

    // ===================================
    // MODAL
    // ===================================

    function hideForms() {
        [
            signupForm,
            loginForm,
            forgotForm,
            resetForm
        ].forEach(function (form) {
            if (form) form.hidden = true;
        });
    }

    function openModal(type) {
        if (!modal) return;

        clearMessage();
        hideForms();

        modal.hidden = false;

        const settings = {
            signup: {
                form: signupForm,
                title: "Create Account",
                description: "Create your account."
            },

            login: {
                form: loginForm,
                title: "Login",
                description: "Welcome back!"
            },

            forgot: {
                form: forgotForm,
                title: "Forgot Password",
                description: "Request a password reset link."
            },

            reset: {
                form: resetForm,
                title: "Reset Password",
                description: "Enter your new password."
            }
        };

        const selected = settings[type];

        if (!selected) return;

        if (selected.form) {
            selected.form.hidden = false;
        }

        const title = document.getElementById("modalTitle");
        const description = document.getElementById("modalDescription");

        if (title) title.textContent = selected.title;

        if (description) {
            description.textContent = selected.description;
        }
    }

    function closeModal() {
        if (!modal) return;

        modal.hidden = true;
        clearMessage();
    }

    // ===================================
    // CONNECTION CHECK
    // ===================================

    function checkConnection() {
        if (!supabase) {
            showMessage(
                "Supabase connect nahi hua. js/supabase.js mein Project URL aur Publishable Key check karo."
            );

            console.error(
                "window.digitalServicesSupabase is undefined."
            );

            return false;
        }

        return true;
    }

    // ===================================
    // DASHBOARD
    // ===================================

    function showDashboard(user) {
        if (!user) return;

        const dashboard = document.getElementById("userDashboard");
        const username = document.getElementById("dashboardUsername");
        const email = document.getElementById("dashboardEmail");

        if (username) {
            username.textContent =
                user.user_metadata?.username ||
                user.email?.split("@")[0] ||
                "User";
        }

        if (email) {
            email.textContent = user.email || "";
        }

        if (dashboard) {
            dashboard.hidden = false;
            dashboard.style.display = "block";
        }

        closeModal();
    }

    function hideDashboard() {
        const dashboard = document.getElementById("userDashboard");

        if (dashboard) {
            dashboard.hidden = true;
        }
    }

    // ===================================
    // LOADING HELPER
    // ===================================

    async function submitWithLoading(button, action) {
        if (button && button.disabled) return;

        const originalText = button
            ? button.textContent
            : "";

        if (button) {
            button.disabled = true;
            button.textContent = "Please wait...";
        }

        try {
            await action();

        } catch (error) {
            console.error("Auth error:", error);

            showMessage(
                error.message || "Something went wrong."
            );

        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = originalText;
            }
        }
    }

    // ===================================
    // CREATE ACCOUNT
    // ===================================

    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const button = signupForm.querySelector(
                'button[type="submit"]'
            );

            await submitWithLoading(button, async function () {

                if (!checkConnection()) return;

                const username = document
                    .getElementById("signupUsername")
                    ?.value.trim();

                const email = document
                    .getElementById("signupEmail")
                    ?.value.trim();

                const password = document
                    .getElementById("signupPassword")
                    ?.value;

                const confirmPassword = document
                    .getElementById("signupConfirmPassword")
                    ?.value;

                if (!username || !email || !password || !confirmPassword) {
                    showMessage("Saari details fill karo.");
                    return;
                }

                if (password.length < 8) {
                    showMessage(
                        "Password kam se kam 8 characters ka rakho."
                    );
                    return;
                }

                if (password !== confirmPassword) {
                    showMessage("Passwords match nahi karte.");
                    return;
                }

                showMessage("Account create ho raha hai...", true);

                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,

                    options: {
                        data: {
                            username: username
                        },

                        emailRedirectTo:
                            window.location.origin + "/"
                    }
                });

                if (error) throw error;

                if (data.session && data.user) {
                    showMessage("Account create ho gaya!", true);
                    showDashboard(data.user);

                } else {
                    showMessage(
                        "Registration request submit ho gayi! Email inbox aur Spam folder check karo. Confirmation link par click karke account verify karo.",
                        true
                    );

                    signupForm.reset();
                }
            });
        });
    }

    // ===================================
    // LOGIN
    // ===================================

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const button = loginForm.querySelector(
                'button[type="submit"]'
            );

            await submitWithLoading(button, async function () {

                if (!checkConnection()) return;

                const email = document
                    .getElementById("loginEmail")
                    ?.value.trim();

                const password = document
                    .getElementById("loginPassword")
                    ?.value;

                if (!email || !password) {
                    showMessage("Email aur password fill karo.");
                    return;
                }

                const { data, error } =
                    await supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                if (error) throw error;

                showDashboard(data.user);
            });
        });
    }

    // ===================================
    // FORGOT PASSWORD
    // ===================================

    if (forgotForm) {
        forgotForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const button = forgotForm.querySelector(
                'button[type="submit"]'
            );

            await submitWithLoading(button, async function () {

                if (!checkConnection()) return;

                const email = document
                    .getElementById("forgotEmail")
                    ?.value.trim();

                if (!email) {
                    showMessage("Apna email enter karo.");
                    return;
                }

                const { error } =
                    await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: window.location.origin + "/"
                    });

                if (error) throw error;

                showMessage(
                    "Agar account available hai, reset email bheji gayi hai. Inbox aur Spam check karo.",
                    true
                );
            });
        });
    }

    // ===================================
    // RESET PASSWORD
    // ===================================

    if (resetForm) {
        resetForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const button = resetForm.querySelector(
                'button[type="submit"]'
            );

            await submitWithLoading(button, async function () {

                if (!checkConnection()) return;

                const password = document
                    .getElementById("resetPassword")
                    ?.value;

                const confirmPassword = document
                    .getElementById("resetConfirmPassword")
                    ?.value;

                if (!password || !confirmPassword) {
                    showMessage("Dono password fields fill karo.");
                    return;
                }

                if (password.length < 8) {
                    showMessage(
                        "Password kam se kam 8 characters ka rakho."
                    );
                    return;
                }

                if (password !== confirmPassword) {
                    showMessage("Passwords match nahi karte.");
                    return;
                }

                const { error } = await supabase.auth.updateUser({
                    password: password
                });

                if (error) throw error;

                showMessage(
                    "Password update ho gaya! Ab login karo.",
                    true
                );

                setTimeout(function () {
                    openModal("login");
                }, 1500);
            });
        });
    }

    // ===================================
    // OPEN FORMS
    // ===================================

    document.querySelectorAll(
        "#registerButton, #showSignup, [data-auth='signup']"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            openModal("signup");
        });
    });

    document.querySelectorAll(
        "#loginButton, #showLogin, [data-auth='login']"
    ).forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            openModal("login");
        });
    });

    const forgotButton = document.getElementById("showForgot");

    if (forgotButton) {
        forgotButton.addEventListener("click", function (event) {
            event.preventDefault();
            openModal("forgot");
        });
    }

    const backButton = document.getElementById("backToLogin");

    if (backButton) {
        backButton.addEventListener("click", function (event) {
            event.preventDefault();
            openModal("login");
        });
    }

    const closeButton = document.getElementById("closeModal");

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // ===================================
    // LOGOUT
    // ===================================

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", async function () {

            if (!checkConnection()) return;

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

    // ===================================
    // SESSION AND EMAIL CONFIRMATION
    // ===================================

    async function initializeAuth() {
        if (!checkConnection()) return;

        supabase.auth.onAuthStateChange(function (event, session) {

            if (event === "PASSWORD_RECOVERY") {
                openModal("reset");
                showMessage("Apna naya password enter karo.", true);
                return;
            }

            if (session && session.user) {
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

        if (window.location.hash.includes("type=recovery")) {
            openModal("reset");
            showMessage("Apna naya password enter karo.", true);
        }
    }

    initializeAuth();

    // ===================================
    // GLOBAL HELPERS
    // ===================================

    window.digitalServicesAuth = {
        openModal: openModal,
        closeModal: closeModal,
        showDashboard: showDashboard,
        hideDashboard: hideDashboard
    };

});
