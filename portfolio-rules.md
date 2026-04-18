# Portfolio Guidelines & Principles

This document acts as the ultimate source of truth for the ongoing development, content creation, and architectural standards of this portfolio. Any future updates should strict adhere to these principles to maintain a consistent, professional, and architect-level brand.

---

## 🏗️ 1. Case Study Content Structure
All current and future case studies added to the `portfolio-data.json` MUST adhere to this exact top-to-bottom reading order. If a specific section does not fit a project (e.g., `Context & Role` or `Failure Handling`), omit it directly from the JSON so the UI can dynamically hide it.

**Standard Layout Order:**
1. **Context & Role Clarification** *(Optional but recommended for multi-platform architectures)*
2. **Business Problem**
3. **Outcome & Results** *(Immediately following the problem to show direct impact)*
4. **Hypothesis**
5. **Architecture**
6. **System Design Decisions**
7. **Failure & Edge Case Handling** *(Optional)*
8. **AI Safety & Constraints**
9. **Implementation Summary / Details**

---

## ✍️ 2. Writing Tone & Voice
When writing descriptions and project summaries, enforce the following style principles:
- **Architect-Level Authority:** Write like a systems engineer, not a junior developer. Focus on tradeoffs, scalability, isolation, workflows, and constraints.
- **Quantifiable First:** Always lead with hard metrics (e.g., *~30% cost reduction, 100% completion rate, 50+ calls/day*). Never bury the most important metric.
- **No Fluff:** Eliminate hyperbole like "revolutionary" or "cutting edge". Use definitive action verbs (*Designed*, *Orchestrated*, *Engineered*, *Migrated*).
- **Format for Scannability:** Use short paragraphs and structured bullet points. Dense blocks of text will not be read.

---

## 💾 3. Data-Driven Architecture (Spa Logic)
The entire portfolio utilizes a clean separation of concerns.
- **`index.html`**: Contains the UI Shell and CSS styling. Only hardcode content for permanent sections (e.g., Resume, Services cards).
- **`data/portfolio-data.json`**: This is the core database. Never hardcode a project's data into the HTML. If you need a new field (e.g., `failure_handling`), add it as an array or string here first.
- **`assets/js/data-loader.js`**: Reusable scripts that parse the JSON and inject it into the DOM. Handles line break parsing (`\n` to `<br>`) and dynamically collapses missing HTML sections.

---

## 🎨 4. UI Design & Theming Rules
To ensure the website remains highly premium, follow the existing design system tokens:
- **Color Palette:**
   - **Backgrounds:** `var(--smoky-black)` and `var(--eerie-black-1)`
   - **Borders:** `var(--jet)`
   - **Text:** `var(--light-gray)` for descriptions, `var(--white-2)` for Headers.
   - **Accents:** Use `var(--orange-yellow-crayola)` or `var(--text-gradient-yellow)` to highlight critical metrics or icons.
- **Typography:** Retain the sleek sans-serif stack. Do not use generic fonts.
- **Visuals:** Add subtle micro-interactions like image zooming curves or hover opacities, but avoid overly distracting heavy animations. Use the existing CSS utilities wherever possible.