# Personal Portfolio Website

A production-ready, highly accessible, responsive personal portfolio website built **strictly using ONLY HTML5 and CSS3** (no JavaScript, no Tailwind CSS, no Bootstrap, and no CSS frameworks).

Designed to demonstrate mastery of semantic HTML5, modern CSS3 layout architecture (Flexbox & CSS Grid), pure CSS interactive controls, and WCAG 2.1 AA accessibility guidelines.

---

## 🌟 Highlights & Accessibility Features

- **100% Zero-JavaScript Architecture**: All navigation toggles, progress visualizers, hover states, and smooth scrolling are achieved purely through HTML5 and CSS3.
- **WCAG 2.1 AA & Lighthouse Ready**:
  - High-visibility keyboard focus indicators (`:focus-visible` with 3px offset).
  - Landmark semantics (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`, `<address>`, `<time>`).
  - Single `<h1>` per page with strict heading hierarchy (`H1` ➔ `H2` ➔ `H3`).
  - Screen reader helper utility class (`.sr-only`).
  - Skip-to-main-content link (`.skip-link`) at the top of every page.
  - High color contrast ratio (WCAG AAA 15:1 for body text, 4.5:1+ for interactive elements).
  - Explicit `alt` text for all images and visual media.
  - Accessible form validation, fieldsets, legends, explicit labels, `autocomplete` attributes, and `aria-describedby` hints.
- **Full Responsive Design**: Mobile-first media queries targeting Mobile, Tablet, Laptop, and Desktop viewports.
- **Pure CSS Mobile Navigation**: Hamburger menu toggle implemented using the pure CSS checkbox hack (`#nav-toggle:checked ~ .nav-menu`).
- **Complete SEO Suite**:
  - Page-specific `<title>`, `<meta name="description">`, and `<meta name="keywords">`.
  - Open Graph social share metadata (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`).
  - Favicon and canonical URL link tags.

---

## 📁 Directory & File Structure

```text
portfolio/
│
├── index.html         # Home Page (Hero, Featured Skills, Project Highlights, CTA)
├── about.html         # About Page (Bio, Career Timeline, Education, Goals, Interests)
├── skills.html        # Skills Page (5 Categorized Skill Matrix & CSS Progress Bars)
├── projects.html      # Projects Page (6 Article Case Studies with Tags & Actions)
├── contact.html       # Contact Page (Accessible Form with Fieldset & Address Sidebar)
│
├── css/
│   └── style.css      # Core Design System, CSS Custom Properties & Responsive Styles
│
├── images/
│   ├── profile.jpg    # High-resolution profile avatar image
│   ├── project-1.jpg  # Screenshot for E-Commerce Analytics Platform
│   ├── project-2.jpg  # Screenshot for Accessible Task Kanban App
│   ├── project-3.jpg  # Screenshot for Core UI Design System
│   ├── project-4.jpg  # Screenshot for Automated WCAG Auditor
│   ├── project-5.jpg  # Screenshot for Weather & Climate Dashboard
│   └── project-6.jpg  # Screenshot for Developer Portfolio Engine
│
└── README.md          # Technical documentation & project specification
```

---

## 🎨 Color Palette & CSS Design Tokens

| Token Name | Hex Code | Description |
| :--- | :--- | :--- |
| `--primary-color` | `#2563EB` | Royal Blue (Primary Brand & Focus Rings) |
| `--secondary-color` | `#1E293B` | Slate Dark (Headings & Footer Background) |
| `--accent-color` | `#0284C7` | Sky Blue (Accessible Highlights & Icons) |
| `--bg-color` | `#F8FAFC` | Light Neutral Background |
| `--card-bg` | `#FFFFFF` | Card & Surface Container Background |
| `--text-color` | `#0F172A` | Deep Slate Body Text (High Contrast 15:1) |
| `--text-muted` | `#475569` | Secondary Muted Text |

- **Typography**: Google Font `Poppins` with system `sans-serif` fallbacks.
- **Border Radius**: `12px` default, `6px` for small controls, `20px` for large cards.

---

## 🚀 Pages Overview

1. **Home (`index.html`)**
   - Hero section with professional title, introduction, profile figure with experience badge, primary and secondary CTA buttons.
   - Core technical pillars grid showcasing 4 engineering capabilities.
   - Featured recent project preview cards with status tags and link actions.
   - Global sticky header and accessible multi-column footer.

2. **About (`about.html`)**
   - Professional bio lead article detailing 8+ years of engineering experience and web standards advocacy.
   - Interactive vertical timeline component for career experience (`Apex Cloud Technologies`, `Nexus Software Solutions`, `Horizon Digital Media`).
   - Education & certifications card (UC Berkeley B.S., Certified Web Accessibility Specialist).
   - Future career goals list and personal interests aside.

3. **Skills (`skills.html`)**
   - 5 Categorized skill sections:
     - *Frontend Architecture & Accessibility*
     - *Backend Development & APIs*
     - *Database & Data Management*
     - *Tools & Development Environment*
     - *Professional & Soft Skills*
   - Accessible CSS progress bars (`role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`).

4. **Projects (`projects.html`)**
   - Grid of 6 distinct project `<article>` cards:
     1. E-Commerce Analytics Platform
     2. Accessible Task Kanban App
     3. Core UI Design System
     4. Automated WCAG Auditor
     5. Weather & Climate Dashboard
     6. Developer Portfolio Engine
   - Each card features screenshot media, title, status badge (`Completed`/`In Progress`), paragraph description, tech tags list, GitHub button, and Live Demo button.

5. **Contact (`contact.html`)**
   - Accessible contact form wrapped in `<fieldset>` with `<legend>`:
     - `Full Name` (`autocomplete="name"`, `required`)
     - `Email Address` (`autocomplete="email"`, `type="email"`, `required`)
     - `Subject` (`required`)
     - `Message` (`<textarea>`, `required`, `aria-describedby`)
   - Direct address sidebar (`<address>`) with email, phone, location, and working hours.

---

## ⚡ How to View Locally

Simply open any `.html` file (e.g. `portfolio/index.html`) directly in any modern web browser or serve via a local HTTP server:

```bash
# Example using Python built-in HTTP server
cd portfolio
python -m http.server 8000
```

Then visit `http://localhost:8000` in your web browser.

---

## 🌐 Validation & Standards

- **HTML5 Validation**: Clean markup adhering strictly to W3C standards with zero deprecated tags.
- **CSS3 Validation**: Clean, modular stylesheet using custom properties and valid CSS Grid/Flexbox syntax.
- **Lighthouse Performance & Accessibility**: Designed to achieve 100/100 scores in Accessibility, SEO, and Best Practices.
