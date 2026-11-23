# Harshan Babu — Portfolio v3

Immersive 3D portfolio. React 19 + Vite, React Three Fiber, GSAP ScrollTrigger, Lenis, Tailwind CSS 4.
Live: https://harshanoff.vercel.app

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # serve dist/ locally
npm run lint
```

Node 20+ recommended.

## Deploy

**Vercel (current host).** Import the repo, framework preset "Vite", build `npm run build`, output `dist`. Every push to `main` deploys.

**GitHub Pages.** `vite.config.js` switches the base path to `/react-portfolio/` when `GITHUB_PAGES=true`.
1. Repo → Settings → Pages → Source: **GitHub Actions**.
2. Actions → **Deploy to GitHub Pages** → Run workflow (manual, so it never fights Vercel).

Local Pages build: `npm run build:pages`.

## Where to edit things

All content lives in `src/data/` — components only read from it.

| File | What's in it |
| --- | --- |
| `src/data/profile.js` | name, headline, bio, stats, contact, socials, marquee words, avatar settings, certifications |
| `src/data/projects.js` | featured projects (Problem → Built → Result), smaller builds |
| `src/data/skills.js` | skill groups for the 3D sphere |
| `src/data/experience.js` | timeline entries |
| `src/config/theme.js` | colour themes — set `ACTIVE_THEME` to `acid_graphite`, `bone_cobalt` or `forest_clay` |

## The 3D avatar

`public/models/avatar.glb` is a friendly low-poly robot (CC0 "RobotExpressive" by Tomás Laulhé),
recoloured at runtime into the palette's clay tones. Clips used: Wave, Idle, Sitting (at the desk), ThumbsUp.
The uncompressed source is `assets-src/avatar-source.glb`; `npm run optimize:model` rebuilds the compressed file.

**Swapping in a scanned / Mixamo avatar later:** export a rigged `.glb` with Idle, Waving, Typing and Pointing clips,
compress it with `npm run optimize:model`, and in `src/data/profile.js → avatar` set
`headBone: "mixamorigHead"` and `clips: { wave: "Waving", idle: "Idle", typing: "Typing", point: "Pointing" }`.

## Regenerating images

Two dev-only routes render images you can screenshot:

- `http://localhost:5173/?capture=avatar` → transparent avatar render → save as `public/images/avatar-fallback.png` (shown when WebGL is off or the device is low-end).
- `http://localhost:5173/?capture=og` at a 1200×630 window → save as `public/og-image.png` (Open Graph / Twitter card).

In Chrome DevTools: toggle the device toolbar, set the size, then ⋮ → *Capture screenshot*.

## Testing switches

- `?no3d` — forces the no-WebGL fallback.
- OS "reduce motion" setting — disables smooth scroll, parallax, the pinned gallery and heavy 3D motion.

## Structure

```
src/
  components/
    canvas/    Avatar, HeroScene, DeskScene, SkillSphere, Experience3D, ContactScene,
               ProjectDistortion (WebGL hover), SceneCanvas (lazy canvas), props, materials
    sections/  Hero, About, Skills, Projects, Experience, Achievements, Contact, Footer
    ui/        Cursor, MagneticButton, Loader, Marquee, Grain, Nav, RevealText, SectionHeader
  data/        profile, projects, skills, experience
  hooks/       useLenis, useMousePosition, useIsMobile, useInView
  config/      theme.js
  styles/      tokens.css, globals.css
public/        models/avatar.glb, resume.pdf, og-image.png, favicons, sitemap, robots
assets-src/    uncompressed source model (not deployed)
```

## Credits

Fonts: Clash Display & Satoshi (Fontshare, ITF Free Font License), JetBrains Mono (OFL). Avatar: RobotExpressive by Tomás Laulhé, CC0.
