# SoundGuy — Marketing Website

Landing page and setup guide for SoundGuy, a voice-controlled Logic Pro X assistant for macOS. Built with React, Vite, and Tailwind CSS.

---

## What this site does

- Explains the app in under 5 seconds
- Walks users through the two required macOS permissions
- Lists built-in voice commands
- Provides a macOS download CTA (currently showing "Coming soon")
- Runs as a single static HTML file — no server, no backend

---

## Tech stack

| Tool | Version | Role |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool and dev server |
| Tailwind CSS | 3 | Utility-first styling |
| lucide-react | 0.441 | Icon set |

---

## Project structure

```
soundGuy_web/
├── index.html                  # Entry HTML (fonts, meta, SEO tags)
├── package.json
├── vite.config.js
├── tailwind.config.js          # Custom design tokens (colors, shadows, fonts)
├── postcss.config.js
├── vercel.json                 # SPA rewrite rule for Vercel
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Component composition — sections in page order
    ├── index.css               # Tailwind directives + global base styles
    │
    ├── data/
    │   ├── commands.js         # Voice command list (phrase → action)
    │   └── siteContent.js      # All copy, step data, feature cards, DOWNLOAD_URL
    │
    └── components/
        ├── Nav.jsx             # Sticky top nav with anchor links + download button
        ├── Hero.jsx            # Headline, CTAs, trust badges, command flow card
        ├── HowItWorks.jsx      # 4-step visual flow
        ├── Features.jsx        # 4 feature cards with icons
        ├── SetupSteps.jsx      # Numbered setup guide with permission paths
        ├── CommandsTable.jsx   # Desktop table + mobile card grid of commands
        ├── DownloadSection.jsx # Closing CTA with glow background
        ├── BackgroundCanvas.jsx # Animated waveform + particle background
        ├── ComingSoonButton.jsx # Disabled placeholder replacing download buttons
        └── Footer.jsx
```

---

## Local development

**Prerequisites:** Node.js 18+, npm 9+

```bash
cd soundGuy_web
npm install
npm run dev
# → http://localhost:5173
```

Changes to any `src/` file hot-reload instantly.

---

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview locally:

```bash
npm run preview
# → http://localhost:4173
```

---

## Deployment — Vercel

The site is deployed on Vercel. The included [`vercel.json`](vercel.json) handles the SPA rewrite so all paths resolve to `index.html`.

### Connect via GitHub (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import repo
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

Every push to `main` redeploys automatically.

### Or deploy via CLI

```bash
npm i -g vercel
vercel        # first deploy + follow prompts
vercel --prod # promote to production
```

---

## Hosting the .dmg — GitHub Releases

Do **not** host the `.dmg` on Vercel. Use **GitHub Releases** instead — it's free, has a 2 GB file limit, and is designed for distributing binary builds.

### Steps

1. Create a GitHub repo for SoundGuy (can be the same repo as the app)
2. Go to **Releases → Draft a new release**
3. Tag it `v1.0.0`, write release notes, attach `SoundGuy.dmg` as a binary asset
4. Publish the release — GitHub generates a permanent direct download URL:
   ```
   https://github.com/YOUR_USERNAME/soundguy/releases/download/v1.0.0/SoundGuy.dmg
   ```
5. Set that URL as `DOWNLOAD_URL` in [`src/data/siteContent.js`](src/data/siteContent.js) (see below)

---

## Enabling the download button

Download buttons currently show **"Coming soon"** via [`src/components/ComingSoonButton.jsx`](src/components/ComingSoonButton.jsx).

When the build is ready:

**Step 1** — Set the real URL in [`src/data/siteContent.js`](src/data/siteContent.js) line 2:

```js
export const DOWNLOAD_URL = 'https://github.com/YOUR_USERNAME/soundguy/releases/download/v1.0.0/SoundGuy.dmg'
```

**Step 2** — Restore the download buttons in three components:

In `Nav.jsx`, replace `<ComingSoonButton size="sm" />` with:
```jsx
<a href={DOWNLOAD_URL} className="btn-primary py-2 text-xs">
  <Download size={14} />
  Download
</a>
```

In `Hero.jsx`, replace `<ComingSoonButton />` with:
```jsx
<a href={DOWNLOAD_URL} className="btn-primary">
  <Download size={16} />
  Download for macOS
</a>
```

In `DownloadSection.jsx`, replace `<ComingSoonButton size="lg" />` with:
```jsx
<a href={DOWNLOAD_URL} className="btn-primary text-base px-8 py-3.5">
  <Download size={18} />
  Download for macOS
</a>
```

**Step 3** — Add the `Download` import back to `Nav.jsx` and `Hero.jsx`:
```js
import { Download } from 'lucide-react'
import { DOWNLOAD_URL } from '../data/siteContent'
```

**Step 4** — Delete `ComingSoonButton.jsx` and remove its imports from the three files above.

---

## Updating content

### Voice commands

Open [`src/data/commands.js`](src/data/commands.js) and add or edit rows:

```js
export const commands = [
  { phrase: 'record', action: 'Start recording' },
  // add more here
]
```

### Section copy

All headlines, descriptions, and step text live in [`src/data/siteContent.js`](src/data/siteContent.js):

| Export | Used by |
|---|---|
| `steps` | `HowItWorks.jsx` |
| `features` | `Features.jsx` |
| `setupSteps` | `SetupSteps.jsx` |
| `DOWNLOAD_URL` | `Nav.jsx`, `Hero.jsx`, `DownloadSection.jsx` |

### Page title / meta

Edit [`index.html`](index.html) directly — `<title>`, `<meta name="description">`, and Open Graph tags are all in `<head>`.

### Design tokens

Colors, shadows, and fonts are in [`tailwind.config.js`](tailwind.config.js) under `theme.extend`:

| Token | Value | Controls |
|---|---|---|
| `colors.accent` | `#7c6fff` | Purple highlight, buttons, icons |
| `colors.surface.*` | `surface-0` → `surface-4` | Layered dark backgrounds |
| `colors.text.*` | `primary / secondary / muted` | Text hierarchy |
| `boxShadow.card` | — | Card resting shadow |
| `boxShadow.glow-*` | — | Button and element glows |

---

## Design system — shared CSS classes

Defined in [`src/index.css`](src/index.css):

| Class | Description |
|---|---|
| `.container-site` | Centered container, max-width 1140px, responsive padding |
| `.btn-primary` | Filled accent button with glow hover |
| `.btn-secondary` | Outlined ghost button |
| `.card` | Dark rounded card with subtle border and hover lift |
| `.pill` | Small inline badge/tag |
| `.section-label` | Uppercase accent-colored eyebrow text |
| `.section-heading` | Section title (`text-2xl` / `text-3xl`) |
| `.mono` | JetBrains Mono / Fira Code monospace |

---

## Browser support

Targets modern evergreen browsers. Vite's default esbuild target is `es2015+`.

---

## License

Private. Not open source.
