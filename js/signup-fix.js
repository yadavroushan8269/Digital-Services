document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupForm");

    if (!form) {
        console.error("Signup form nahi mila!");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const supabase = window.digitalServicesSupabase;
        const message = document.getElementById("authMessage");
        const button = form.querySelector(
            'button[type="submit"]'
        );

        function showMessage(text, success = false) {
            if (message) {
                message.textContent = text;
                message.style.display = "block";
                message.style.color = success ? "#00ff9c" : "#ff7070";
            } else {
                alert(text);
            }
        }

        if (!supabase) {
            showMessage("Supabase connect nahi hua. Page refresh karo.");
            console.error("Supabase client missing!");
            return;
        }

        const username =
            document.getElementById("signupUsername")?.value.trim();

        const email =
            document.getElementById("signupEmail")?.value.trim();

        const password =
            document.getElementById("signupPassword")?.value;

        const confirmPassword =
            document.getElementById("signupConfirmPassword")?.value;

        if (!username || !email || !password || !confirmPassword) {
            showMessage("Saari details bharo.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Dono passwords match nahi karte.");
            return;
        }

        if (password.length < 8) {
            showMessage("Password kam se kam 8 characters ka rakho.");
            return;
        }

        if (button) {
            button.disabled = true;
            button.textContent = "Please wait...";
        }

        try {
            showMessage("Account create ho raha hai...", true);

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username
                    },
                    emailRedirectTo: window.location.origin + "/"
                }
            });

            if (error) throw error;

            if (data.session) {
                showMessage("Account create ho gaya! Ab login karo.", true);
            } else {
                showMessage(
                    "Registration request submit ho gayi! Email inbox aur Spam folder check karo. Confirmation link par click karke account verify karo.",
                    true
                );
            }
        } catch (error) {
            console.error("Signup error:", error);
            showMessage("Signup error: " + error.message);
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = "Create Account";
            }
        }
    }, true);
});
