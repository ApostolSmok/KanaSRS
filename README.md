# Kana & Kanji SRS

A minimalist Single Page Application (SPA) and Progressive Web App (PWA) designed for learning Japanese Kana (Hiragana and Katakana) and Kanji characters using a Spaced Repetition System (SRS) inspired by the SM-2 algorithm.

## Features

* **Three Study Tracks:**
  * **Hiragana & Katakana:** Built-in databases containing all 92 basic Gojūon characters (46 each) with support for alternative romanizations (e.g., `o` / `wo`)[cite: 18].
  * **Custom Kanji Deck:** Integrated deck builder allowing users to add custom Kanji characters, readings, and meanings, complete with a deck viewer to inspect and delete existing entries[cite: 17, 19].
* **Three Study Modes:**
  * **Text Input (Manual):** Direct keyboard input validation for romaji readings[cite: 17, 19].
  * **Multiple Choice (Quiz):** Dynamic 4-option quiz generator with instant color-coded feedback and input locking to prevent accidental double submissions[cite: 16, 17, 19].
  * **Flashcards (Learning):** Interactive 3D flip cards for self-assessment ("Remember" / "Forgot")[cite: 16, 17, 19].
* **Adaptive Spaced Repetition (SRS):**
  * Calculates optimal review intervals dynamically based on each card's ease factor (`ease`) and consecutive correct repetitions (`reps`)[cite: 17, 18].
  * **Context-Aware Intervals:** Uses short intervals (in minutes) for rapid Kana drilling and long-term intervals (in days: 1, 6, 15+ days) for Kanji retention[cite: 17].
* **Bilingual Interface (EN / RU):** Instant UI language switching with state persistence, keeping study materials strictly in romaji/Japanese[cite: 17, 19].
* **Local Persistence:** All learning progress, custom Kanji cards, and user preferences are stored locally in the browser via `localStorage`[cite: 17].
* **Mobile-Ready PWA:** Responsive layout and a configured Web App Manifest (`manifest.json`) allow the app to be installed directly onto iOS and Android home screens for full-screen, standalone use[cite: 16, 19, 20].

## Tech Stack

Built entirely with vanilla web technologies without external frameworks or dependencies:
* **HTML5:** Semantic structure and mobile viewport configuration[cite: 19].
* **CSS3:** Flexbox, CSS Grid, 3D transforms (`perspective`, `backface-visibility`) for card animations, and responsive mobile styling[cite: 16].
* **JavaScript (ES6 Modules):** Modular architecture, DOM manipulation, state management, `localStorage` persistence, and SM-2 interval calculations[cite: 17, 18].
* **Web App Manifest:** Standalone PWA configuration[cite: 20].

## Project Structure

```text
├── index.html       # Main application layout (menu and study views)
├── style.css        # UI styling, responsive rules, and 3D flip animations
├── app.js           # Core logic: SRS algorithm, mode switching, localization, DOM events
├── data.js          # Hiragana and Katakana character datasets
├── manifest.json    # PWA configuration for mobile installation
└── icon.png         # Application icon (192x192)
```

## Local Development

Because this project uses ES6 modules (`import` / `export`), opening `index.html` directly via the `file://` protocol will trigger CORS errors in modern browsers[cite: 17, 18, 19]. Run the project using a local development server:

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   ```
2. Open the project folder in VS Code.
3. Install and run the **Live Server** extension (right-click `index.html` and select **Open with Live Server**).
4. Access the application at `http://127.0.0.1:5500`.

## Mobile Installation (PWA)

1. Deploy the repository to a static hosting service such as **GitHub Pages** (*Settings -> Pages -> Source: main branch*).
2. Open the deployed URL in Safari (iOS) or Chrome (Android).
3. Open the browser menu and select **Add to Home Screen**.
4. Launch the application from your home screen in standalone mode[cite: 20].
