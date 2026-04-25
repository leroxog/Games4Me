# Plan: Mini Games Website

## Context
Wir bauen eine Gaming-Website mit Kacheln auf der Startseite. Klick auf eine Kachel öffnet das jeweilige Spiel. Die Seite wird auf GitHub Pages gehostet (statisch, kein Backend). Tests laufen mit Playwright.

**Hinweis zu Subway Surfers & Geometry Dash:** Diese sind urheberrechtlich geschützt. Wir bauen vereinfachte, inspirierte Versionen:
- "Endless Runner" (Subway Surfers-inspiriert): Figur läuft, Hindernissen ausweichen
- "Rhythm Jump" (Geometry Dash-inspiriert): Block hüpft über Hindernisse im Takt

---

## Projektstruktur

```
WebseiteLevent/
├── index.html                  # Startseite mit Spielkacheln
├── css/
│   └── style.css               # Dark Gaming Theme (CSS Grid, Hover-Effekte)
├── games/
│   ├── snake/index.html        # Snake (Canvas)
│   ├── snake/logic.js          # Snake Spiellogik (pure Funktionen)
│   ├── tetris/index.html       # Tetris (Canvas)
│   ├── tetris/logic.js         # Tetris Spiellogik
│   ├── runner/index.html       # Endless Runner (Canvas)
│   ├── runner/logic.js         # Runner Spiellogik
│   ├── rhythmjump/index.html   # Rhythm Jump (Canvas)
│   └── rhythmjump/logic.js     # Rhythm Jump Spiellogik
├── tests/
│   ├── navigation.spec.js      # Startseite & Kachel-Navigation (E2E)
│   ├── snake.spec.js           # Snake lädt & Steuerung (E2E)
│   ├── tetris.spec.js          # Tetris lädt & Steuerung (E2E)
│   ├── runner.spec.js          # Runner lädt (E2E)
│   ├── rhythmjump.spec.js      # Rhythm Jump lädt (E2E)
│   ├── snake.logic.test.js     # Snake Unit Tests
│   ├── tetris.logic.test.js    # Tetris Unit Tests
│   ├── runner.logic.test.js    # Runner Unit Tests
│   └── rhythmjump.logic.test.js# Rhythm Jump Unit Tests
├── playwright.config.js
└── package.json
```

---

## Phase 1 – Grundstruktur & Startseite

**index.html**
- 4 Kacheln im CSS Grid mit animierten Canvas-Vorschauen
- Hover-Effekt: Kachel leuchtet auf, leichte Skalierung

**css/style.css — Mobile First**
- Dark Mode: `#0d0d0d` Hintergrund, `#1a1a2e` Karten
- Akzentfarbe: Neon-Lila/Cyan (`#7b2fff`, `#00d4ff`)
- Google Font: "Press Start 2P" für Gaming-Look
- **Mobile First:** 1 Spalte als Basis, ab 600px 2 Spalten
- Kacheln mindestens 48px touch targets
- `viewport meta` tag: `width=device-width, initial-scale=1`
- Kein Hover-only — Touch-Feedback via `:active` statt nur `:hover`

---

## Phase 2 – Spiele (je eigenständige HTML-Seite)

Jedes Spiel:
- Eigenständige `index.html` mit Canvas
- Spiellogik in `logic.js` (pure Funktionen, testbar)
- "← Zurück" Button zur Startseite
- Spiellogik komplett in Vanilla JS (kein Framework)
- Startet erst wenn Nutzer Taste drückt / klickt

### Snake
- Canvas passt sich per JS an Bildschirmbreite an (max 400px)
- **Mobile:** On-Screen D-Pad (4 Buttons: ↑↓←→)
- **Desktop:** WASD / Pfeiltasten
- Score-Anzeige, Game Over Screen mit Neustart

### Tetris
- Canvas max 300px breit, skaliert auf kleinen Screens
- **Mobile:** On-Screen Buttons (Links, Rechts, Drehen, Fallen)
- **Desktop:** Tastatursteuerung

### Endless Runner (Subway-inspiriert)
- Figur läuft automatisch
- **Mobile:** Tap = Springen
- **Desktop:** Leertaste = Springen
- Zufällige Hindernisse, steigernde Geschwindigkeit

### Rhythm Jump (GD-inspiriert)
- Block springt auf Tap / Klick / Leertaste (gleiche Steuerung für alle)
- Hindernisse im festen Rhythmus, einfache Levels

---

## Phase 3 – Teststrategie

### Testpyramide

```
        [E2E – Playwright]         ← wenige, hoher Wert
      Navigation, Game-Load, Touch
    ────────────────────────────────
      [Integration – Playwright]   ← mittel
    Spiellogik-Flows, Steuerung
  ──────────────────────────────────
    [Unit – Vitest]                ← viele, schnell
  Spielfunktionen, Kollision, Score
```

### Ebene 1 — Unit Tests (Vitest)

Spiellogik als pure Funktionen isoliert testen:

| Datei | Funktion | Testfall |
|-------|----------|----------|
| `games/snake/logic.js` | `step()`, `collides()`, `placeFood()` | Wandkollision, Selbstkollision, Wachstum |
| `games/tetris/logic.js` | `rotate()`, `collides()`, `clearLines()` | Rotation, Blockierung, Linien löschen |
| `games/runner/logic.js` | `update()`, Kollisionsprüfung | Sprung-Physik, Hindernis-Kollision |
| `games/rhythmjump/logic.js` | Spike-Spawn, Kollision | Beat-Intervall, Kollisionsbox |

### Ebene 2 — E2E Tests (Playwright)

| Test | Was wird geprüft |
|------|-----------------|
| `navigation.spec.js` | Startseite lädt, alle 4 Kacheln sichtbar, Klick öffnet Spiel |
| `snake.spec.js` | Seite lädt ohne JS-Fehler, Canvas vorhanden, Steuerung reagiert |
| `tetris.spec.js` | Seite lädt, Canvas vorhanden |
| `runner.spec.js` | Seite lädt, Canvas vorhanden |
| `rhythmjump.spec.js` | Seite lädt, Canvas vorhanden |
| Mobile Viewport (375px) | Alle Kacheln sichtbar, Touch-Buttons vorhanden |

### Ebene 3 — Visuelle Regressionstests (Playwright Screenshots)

- Beim ersten Lauf Baseline-Screenshots speichern
- Bei jedem Push: Screenshots vergleichen (Differenz < 5%)
- Verhindert unbemerkte UI-Änderungen

```js
await expect(page).toHaveScreenshot('startseite.png', { maxDiffPercent: 5 });
```

---

## Phase 4 – CI/CD Pipeline (GitHub Actions)

```
Push → master
  ├── Job 1: Unit Tests (Vitest)       ~10s
  ├── Job 2: E2E Tests (Playwright)    ~60s  (läuft nach Job 1)
  │     ├── Desktop Chromium
  │     └── Mobile (Pixel 5 emulation)
  └── Job 3: Deploy → GitHub Pages     (nur wenn Jobs 1+2 grün)
```

**Deploy nur bei grünen Tests** — kaputte Versionen kommen nie live.

---

## Phase 5 – GitHub Pages Deployment

- URL: `https://leroxog.github.io/Games4Me/`
- Automatisch nach jedem Push auf `master` (via GitHub Actions)

---

## Verifikation

1. `npm run test:unit` → alle Vitest Unit Tests grün
2. `npm run test:e2e` → alle Playwright Tests grün
3. Startseite im Browser: 4 animierte Kacheln sichtbar
4. Klick auf Snake → Snake-Spiel öffnet sich
5. "Zurück"-Button → zurück zur Startseite
6. GitHub Actions: grüner Haken nach Push
