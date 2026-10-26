/* =========================================
   DIGITAL SERVICES - MAIN STYLESHEET
========================================= */

:root {
    --bg: #080b14;
    --surface: #111626;
    --surface-light: #171e31;
    --border: rgba(255, 255, 255, 0.09);
    --text: #f4f6ff;
    --muted: #929bb3;
    --primary: #745cff;
    --secondary: #20d8c4;
    --success: #42d6a4;
    --danger: #ff647c;
    --radius: 18px;
    --container: 1160px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
    scroll-padding-top: 90px;
}

body {
    font-family: Inter, -apple-system, BlinkMacSystemFont,
                 "Segoe UI", sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    min-height: 100vh;
}

body.modal-open {
    overflow: hidden;
}

a {
    text-decoration: none;
    color: inherit;
}

button,
input {
    font: inherit;
}

button {
    cursor: pointer;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
    outline: 2px solid var(--secondary);
    outline-offset: 3px;
}

[hidden] {
    display: none !important;
}

.accent {
    color: var(--secondary);
}

.gradient-text {
    background: linear-gradient(
        110deg,
        #a49aff,
        #6e9bff,
        #35e0ce
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.muted {
    color: var(--muted);
    font-size: 0.88rem;
}

.small-text {
    font-size: 0.82rem;
    margin: 8px 0 16px;
}

/* NAVBAR */

.navbar {
    width: 100%;
    min-height: 78px;
    padding: 16px max(5%, calc((100% - var(--container)) / 2));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border-bottom: 1px solid var(--border);
    background: rgba(8, 11, 20, 0.92);
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(18px);
}

.logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 1.12rem;
    white-space: nowrap;
}

.logo-icon {
    width: 38px;
    height: 38px;
    display: inline-grid;
    place-items: center;
    border-radius: 12px;
    color: white;
    font-weight: 900;
    background: linear-gradient(135deg, var(--primary), #35dcca);
    box-shadow: 0 5px 25px rgba(116, 92, 255, 0.25);
}

.navbar nav {
    display: flex;
    align-items: center;
    gap: 25px;
}

.navbar nav > a {
    color: var(--muted);
    font-size: 0.9rem;
    transition: color 0.2s;
}

.navbar nav > a:hover {
    color: white;
}

.menu-toggle {
    display: none;
    background: none;
    border: 1px solid var(--border);
    color: white;
    border-radius: 9px;
    padding: 6px 11px;
    font-size: 1.3rem;
}

/* BUTTONS */

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 11px 17px;
    font-size: 0.91rem;
    font-weight: 700;
    transition: transform 0.2s, opacity 0.2s,
                background 0.2s;
}

.btn:hover {
    transform: translateY(-2px);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-primary {
    color: white;
    background: linear-gradient(115deg, #7257f7, #6255e9);
    box-shadow: 0 7px 22px rgba(98, 85, 233, 0.2);
}

.btn-primary:hover {
    background: linear-gradient(115deg, #8068ff, #7465ff);
}

.btn-outline {
    border-color: var(--border);
    color: white;
    background: rgba(255, 255, 255, 0.025);
}

.btn-outline:hover {
    background: rgba(255, 255, 255, 0.07);
}

.btn-large {
    padding: 15px 21px;
    min-height: 51px;
}

.full-width {
    width: 100%;
    margin-top: 12px;
}

/* HERO */

.hero {
    max-width: var(--container);
    margin: 0 auto;
    padding: 100px 25px 95px;
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    gap: 55px;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: #b8b4ff;
    background: rgba(116, 92, 255, 0.1);
    border: 1px solid rgba(116, 92, 255, 0.2);
    padding: 8px 12px;
    border-radius: 30px;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.7px;
    margin-bottom: 25px;
}

.status-dot {
    width: 7px;
    height: 7px;
    background: var(--secondary);
    border-radius: 50%;
}

.hero h1 {
    font-size: clamp(2.5rem, 5vw, 4.4rem);
    letter-spacing: -2px;
    line-height: 1.12;
    font-weight: 850;
    max-width: 650px;
}

.hero h1 .gradient-text {
    display: block;
    margin-top: 8px;
}

.hero-content > p {
    max-width: 520px;
    margin-top: 22px;
    color: var(--muted);
    font-size: 1.03rem;
}

.hero-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 30px;
}

.hero-note {
    margin-top: 22px;
    font-size: 0.82rem;
    color: #a7b5ca;
}

/* HERO VISUAL */

.hero-visual {
    position: relative;
}

.visual-card {
    padding: 26px;
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 25px;
    background:
        radial-gradient(
            circle at 100% 0%,
            rgba(116, 92, 255, 0.15),
            transparent 45%
        ),
        var(--surface);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
}

.visual-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 25px;
}

.visual-top h3 {
    margin-top: 5px;
    font-size: 1.3rem;
}

.live-badge {
    color: var(--success);
    font-size: 0.7rem;
    background: rgba(66, 214, 164, 0.08);
    padding: 6px 9px;
    border-radius: 7px;
    white-space: nowrap;
}

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

.stat-card {
    padding: 20px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.025);
    border-radius: 15px;
}

.stat-icon {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 14px;
}

.stat-card h2 {
    font-size: 1.3rem;
    margin-top: 7px;
}

.stat-caption {
    color: var(--success);
    font-size: 0.75rem;
}

.activity-card {
    border: 1px solid var(--border);
    border-radius: 15px;
    padding: 19px;
    margin-top: 15px;
}

.activity-heading {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 0.86rem;
    font-weight: 700;
}

.success-text {
    color: var(--success);
}

.activity-bar {
    width: 100%;
    height: 6px;
    border-radius: 10px;
    background: #252c40;
    margin: 15px 0;
    overflow: hidden;
}

.activity-bar div {
    height: 100%;
    width: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
}

.activity-card p {
    font-size: 0.8rem;
}

/* GENERAL SECTIONS */

.section {
    max-width: var(--container);
    margin: 0 auto;
    padding: 85px 25px;
}

.section-heading {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 45px;
}

.eyebrow {
    display: block;
    color: var(--secondary);
    font-size: 0.76rem;
    letter-spacing: 1.7px;
    font-weight: 800;
    margin-bottom: 13px;
}

.section-heading h2,
.cta-section h2 {
    font-size: clamp(1.9rem, 4vw, 2.8rem);
    letter-spacing: -1px;
    line-height: 1.2;
}

.section-heading > p {
    color: var(--muted);
    margin-top: 13px;
}

/* SERVICE CARDS */

.service-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 17px;
}

.service-card {
    padding: 25px 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    transition: transform 0.25s, border-color 0.25s;
}

.service-card:hover {
    transform: translateY(-5px);
    border-color: rgba(116, 92, 255, 0.55);
}

.service-icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    font-size: 1.55rem;
    font-weight: 800;
    background: var(--surface-light);
    margin-bottom: 20px;
}

.instagram {
    color: #f3a2cc;
}

.facebook {
    color: #76a6ff;
}

.youtube {
    color: #ff7585;
}

.analytics {
    color: #62e0ca;
}

.service-card h3 {
    font-size: 1.1rem;
    margin-bottom: 9px;
}

.service-card p {
    color: var(--muted);
    font-size: 0.87rem;
    min-height: 85px;
}

.text-link {
    border: none;
    background: none;
    color: #a99aff;
    font-size: 0.86rem;
    font-weight: 700;
}

.text-link:hover {
    color: var(--secondary);
}

.service-action {
    margin-top: 17px;
}

/* FEATURES */

.features-section {
    border-top: 1px solid var(--border);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.feature {
    padding: 28px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.018);
}

.feature > span {
    font-size: 1.8rem;
}

.feature h3 {
    margin: 15px 0 8px;
    font-size: 1.05rem;
}

.feature p {
    color: var(--muted);
    font-size: 0.9rem;
}

/* CTA */

.cta-section {
    max-width: calc(var(--container) - 50px);
    margin: 20px auto 85px;
    padding: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 25px;
    border-radius: 23px;
    border: 1px solid rgba(116, 92, 255, 0.25);
    background:
        radial-gradient(
            circle at 0% 100%,
            rgba(32, 216, 196, 0.09),
            transparent 45%
        ),
        rgba(116, 92, 255, 0.07);
}

.cta-section p {
    color: var(--muted);
    margin-top: 10px;
}

/* FOOTER */

.footer {
    border-top: 1px solid var(--border);
    padding: 32px 5%;
    text-align: center;
}

.footer .logo {
    justify-content: center;
    margin-bottom: 12px;
}

.footer > p {
    color: var(--muted);
    font-size: 0.85rem;
}

.footer .copyright {
    margin-top: 15px;
    font-size: 0.78rem;
}

/* AUTHENTICATION MODAL */

.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    padding: 20px;
    display: grid;
    place-items: center;
    background: rgba(2, 4, 10, 0.83);
    backdrop-filter: blur(8px);
    overflow-y: auto;
}

.modal {
    position: relative;
    width: 100%;
    max-width: 430px;
    padding: 32px;
    border-radius: 23px;
    border: 1px solid var(--border);
    background: #101525;
    box-shadow: 0 25px 100px rgba(0, 0, 0, 0.5);
    margin: auto;
}

.modal-close {
    position: absolute;
    right: 17px;
    top: 13px;
    width: 35px;
    height: 35px;
    color: var(--muted);
    font-size: 1.8rem;
    border: none;
    background: none;
}

.modal-brand {
    margin-bottom: 18px;
}

.modal h2 {
    font-size: 1.65rem;
    letter-spacing: -0.5px;
    padding-right: 15px;
}

.modal-description {
    color: var(--muted);
    font-size: 0.9rem;
    margin: 8px 0 24px;
}

.modal form label {
    display: block;
    font-size: 0.85rem;
    font-weight: 650;
    margin: 15px 0 7px;
}

.modal form input {
    width: 100%;
    min-height: 47px;
    padding: 12px 13px;
    border-radius: 10px;
    border: 1px solid #2a334a;
    color: white;
    background: #0a0f1d;
    outline: none;
}

.modal form input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(116, 92, 255, 0.12);
}

.form-switch {
    color: var(--muted);
    text-align: center;
    font-size: 0.84rem;
    margin-top: 18px;
}

.resend-button {
    display: block;
    margin: 18px auto 0;
}

.auth-message {
    font-size: 0.87rem;
    padding: 0;
    margin-top: 15px;
    overflow-wrap: anywhere;
}

.auth-message:empty {
    display: none;
}

.auth-message.error {
    color: var(--danger);
}

.auth-message.success {
    color: var(--success);
}

.security-note {
    text-align: center;
    color: var(--muted);
    font-size: 0.75rem;
    margin-top: 25px;
}

/* USER DASHBOARD */

.dashboard {
    max-width: var(--container);
    min-height: 75vh;
    padding: 60px 25px 90px;
    margin: auto;
}

.dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 35px;
}

.dashboard-header h1 {
    font-size: clamp(1.7rem, 4vw, 2.5rem);
    overflow-wrap: anywhere;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 25px;
}

.dashboard-card {
    padding: 25px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
}

.dashboard-card h2 {
    margin: 10px 0;
    font-size: 1.65rem;
}

.dashboard-card p {
    color: var(--muted);
    font-size: 0.87rem;
}

.dashboard-info .btn {
    margin-top: 20px;
}

/* RESPONSIVE DESIGN */

@media (max-width: 950px) {
    .hero {
        gap: 30px;
        padding-top: 75px;
    }

    .service-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .service-card p {
        min-height: 60px;
    }
}

@media (max-width: 700px) {
    .navbar {
        min-height: 68px;
        padding: 12px 5%;
        flex-wrap: wrap;
    }

    .menu-toggle {
        display: block;
    }

    .navbar nav {
        display: none;
        flex-basis: 100%;
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
        padding: 15px 0 8px;
    }

    .navbar nav.open {
        display: flex;
    }

    .navbar nav > a {
        padding: 6px 0;
    }

    .hero {
        grid-template-columns: 1fr;
        padding: 65px 20px;
        gap: 40px;
    }

    .hero h1 {
        font-size: clamp(2.4rem, 10vw, 3.5rem);
        letter-spacing: -1.5px;
    }

    .hero-content > p {
        font-size: 0.96rem;
    }

    .hero-visual {
        max-width: 500px;
        width: 100%;
        margin: auto;
    }

    .section {
        padding: 65px 20px;
    }

    .features-grid {
        grid-template-columns: 1fr;
    }

    .cta-section {
        margin: 10px 20px 60px;
        padding: 28px 23px;
        flex-direction: column;
        align-items: flex-start;
    }

    .dashboard {
        padding: 40px 20px 70px;
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .dashboard-header {
        align-items: flex-start;
    }
}

@media (max-width: 420px) {
    .logo {
        font-size: 0.98rem;
    }

    .hero-buttons {
        flex-direction: column;
    }

    .hero-buttons .btn {
        width: 100%;
    }

    .visual-card {
        padding: 17px;
    }

    .stats-grid {
        gap: 9px;
    }

    .stat-card {
        padding: 14px 11px;
    }

    .modal {
        padding: 25px 20px;
    }

    .service-grid {
        grid-template-columns: 1fr;
    }

    .service-card p {
        min-height: 0;
    }

    .dashboard-header {
        flex-direction: column;
    }
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
    }
}
