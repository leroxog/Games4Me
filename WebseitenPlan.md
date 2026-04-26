# Plan: Mini Games Website

## Context
Wir bauen eine Gaming-Website mit Kacheln auf der Startseite. Klick auf eine Kachel öffnet das jeweilige Spiel. Die Seite wird auf GitHub Pages gehostet (statisch, kein Backend). Tests laufen mit Playwright (E2E) und Vitest (Unit).

**Hinweis zu Subway Surfers & Geometry Dash:** Diese sind urheberrechtlich geschützt. Wir bauen vereinfachte, inspirierte Versionen:
- "Endless Runner" (Subway Surfers-inspiriert): Figur läuft, Hindernissen ausweichen
- "Rhythm Jump" (Geometry Dash-inspiriert): Block hüpft über Hindernisse im Takt

---

## Projektstruktur

```
WebseiteLevent/
├── index.html                      # Startseite mit 2×2 Spielkacheln
├── css/
│   └── style.css                   # Dark Gaming Theme (CSS Grid, Mobile First)
├── assets/
│   ├── snake.png                   # Vorschaubild Snake-Kachel
│   └── tetris.png                  # Vorschaubild Tetris-Kachel
├── games/
│   ├── snake/
│   │   ├── index.html              # Snake (Canvas, Swipe/Tastatur)
│   │   └── logic.js               # Pure Funktionen: step, collides, placeFood
│   ├── tetris/
│   │   ├── index.html              # Tetris (Canvas, Tastatur)
│   │   └── logic.js               # Pure Funktionen: rotate, collides, clearLines
│   ├── runner/
│   │   ├── index.html              # Endless Runner (Canvas)
│   │   └── logic.js               # Pure Funktionen: updatePlayer, jump, collision
│   └── rhythmjump/
│       ├── index.html              # Rhythm Jump (Canvas)
│       └── logic.js               # Pure Funktionen: updatePlayer, jump, spawnSpike
├── tests/
│   ├── navigation.spec.js          # E2E: Startseite & Kachel-Navigation
│   ├── snake.spec.js               # E2E: Snake (12 Tests, inkl. Touch/Swipe)
│   ├── tetris.spec.js              # E2E: Tetris lädt & Steuerung
│   ├── runner.spec.js              # E2E: Runner lädt & Steuerung
│   ├── rhythmjump.spec.js          # E2E: Rhythm Jump lädt & Steuerung
│   ├── snake.logic.test.js         # Unit: Snake (17 Tests)
│   ├── tetris.logic.test.js        # Unit: Tetris
│   ├── runner.logic.test.js        # Unit: Runner
│   └── rhythmjump.logic.test.js    # Unit: Rhythm Jump
├── playwright.config.js
├── vitest.config.js
└── package.json
```

---

## Phase 1 – Grundstruktur & Startseite ✅

**index.html**
- 2×2 Kacheln (immer 2 Spalten), quadratisch (`aspect-ratio: 1/1`)
- Snake & Tetris: `<img>` aus `assets/` (statische Vorschaubilder)
- Runner & Rhythm: Canvas mit gezeichneter Vorschau (Vanilla JS)
- Logo "Games4Me" mit Lila→Blau-Farbverlauf (`#7b2fff` → `#00d4ff`)
- Kein Spielname auf Kacheln — rein visuell

**css/style.css — Mobile First**
- Dark Mode: `#0d0d0d` Hintergrund, `#1a1a2e` Karten
- Akzentfarbe: Neon-Lila/Cyan (`#7b2fff`, `#00d4ff`)
- Google Font: "Press Start 2P" für Gaming-Look
- Immer 2 Spalten, Kacheln mindestens 48px touch targets
- `viewport meta` tag: `width=device-width, initial-scale=1`
- Touch-Feedback via `:active`

---

## Phase 2 – Spiele ✅

Jedes Spiel:
- Eigenständige `index.html` mit Canvas
- Spiellogik in separater `logic.js` (pure Funktionen, unit-testbar)
- "← Zurück"-Button zur Startseite
- Startet erst bei Tastendruck / Touch

### Snake ✅
- Canvas max 400px, skaliert auf kleinen Screens
- **Mobile:** Wischen auf dem Canvas → Schlange folgt Wischrichtung (touchstart/touchmove)
- **Desktop:** WASD und Pfeiltasten — keine Buttons, keine visuelle Tastatur
- Score-Anzeige, Game Over Screen mit Neustart

### Tetris ✅
- Canvas max 300px, skaliert auf kleinen Screens
- **Desktop:** Pfeiltasten (links/rechts/drehen/fallen) — keine Buttons
- **Mobile:** Wischen auf dem Canvas:
  - Wischen links/rechts → Stück bewegen
  - Wischen nach unten → Hard Drop
  - Wischen nach oben oder kurz antippen → Drehen

### Endless Runner ✅
- Figur läuft automatisch
- **Desktop:** Leertaste = Springen — kein Button
- **Mobile:** Tippen auf Canvas = Springen
- Zufällige Hindernisse, steigernde Geschwindigkeit

### Rhythm Jump ✅
- **Desktop:** Leertaste = Springen — kein Button
- **Mobile:** Tippen auf Canvas = Springen
- Hindernisse im festen Rhythmus

---

## Phase 3 – Teststrategie ✅

### Testpyramide

```
        [E2E – Playwright]              ← Navigation, Game-Load, Touch/Swipe
      ──────────────────────────────────
        [Unit – Vitest]                 ← Spiellogik, Kollision, Score
```

### Ebene 1 — Unit Tests (Vitest) ✅

Spiellogik als pure Funktionen in `logic.js` isoliert testen:

| Datei | Funktionen | Tests |
|-------|-----------|-------|
| `games/snake/logic.js` | `step()`, `isOutOfBounds()`, `isSelfCollision()`, `isOpposite()`, `placeFood()` | 17 Tests |
| `games/tetris/logic.js` | `rotate()`, `collides()`, `clearLines()`, `scoreForLines()`, `randomPiece()` | Unit Tests |
| `games/runner/logic.js` | `updatePlayer()`, `jump()`, `collidesWithObstacle()`, `calcSpeed()` | Unit Tests |
| `games/rhythmjump/logic.js` | `updatePlayer()`, `jump()`, `collidesWithSpike()`, `shouldSpawn()` | Unit Tests |

**Ausführung:** `npm run test:unit` → Vitest

### Ebene 2 — E2E Tests (Playwright) ✅

| Datei | Tests | Was wird geprüft |
|-------|-------|-----------------|
| `navigation.spec.js` | 5 | Startseite lädt, alle 4 Kacheln sichtbar, Klick öffnet jedes Spiel |
| `snake.spec.js` | 10 | Laden ohne JS-Fehler, Zurück-Button, Pfeiltasten, WASD, alle Tasten, kein D-Pad, Touch-Start, Wischen rechts, Wischen unten |
| `tetris.spec.js` | 7 | Laden, Zurück-Button, Tastendruck, keine Buttons, Touch-Start, Wischen links, Wischen unten |
| `runner.spec.js` | 5 | Laden, Zurück-Button, Leertaste, kein Jump-Button, Touch-Start |
| `rhythmjump.spec.js` | 5 | Laden, Zurück-Button, Leertaste, kein Jump-Button, Touch-Start |

**Browser:** Desktop Chromium + Mobile Pixel 5 Emulation  
**Ausführung:** `npm run test:e2e` → Playwright

### Ebene 3 — Visuelle Regressionstests (geplant)

- Baseline-Screenshots beim ersten Lauf speichern
- Bei jedem Push: Screenshots vergleichen (Differenz < 5%)
- Verhindert unbemerkte UI-Änderungen

```js
await expect(page).toHaveScreenshot('startseite.png', { maxDiffPercent: 5 });
```

---

## Phase 4 – CI/CD Pipeline (GitHub Actions) ✅

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

## Phase 5 – GitHub Pages Deployment ✅

- URL: `https://leroxog.github.io/Games4Me/`
- Automatisch nach jedem Push auf `master` (via GitHub Actions)

---

## Verifikation

1. `npm run test:unit` → alle 58 Vitest Unit Tests grün
2. `npm run test:e2e` → alle 64 Playwright Tests grün (Desktop + Mobile)
3. Startseite im Browser: 4 Kacheln (Snake & Tetris als Bild, Runner & Rhythm als Canvas)
4. Klick auf Snake → Spiel öffnet sich; Wischen steuert die Schlange
5. "Zurück"-Button → zurück zur Startseite
6. GitHub Actions: grüner Haken nach Push auf `master`
