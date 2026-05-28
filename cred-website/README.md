# CRED Website Clone

A pixel-perfect, fully responsive React.js clone of the CRED fintech website featuring premium dark theme design, smooth animations, and NeoPOP UI elements.

**🔗 Live Demo:** [https://website-cred.vercel.app/](https://website-cred.vercel.app/)

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Google Fonts** | Playfair Display + DM Sans + DM Mono |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
cred-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main app — all sections
│   ├── main.jsx         # React DOM entry
│   └── index.css        # Tailwind + global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Sections Included

1. **Navbar** — Fixed with scroll-aware blur + glassmorphism, mobile hamburger menu
2. **Hero** — Fullscreen dark, parallax scroll, floating orbs, animated stats counter
3. **Trust / About** — Members-only club concept, 3D credit card visual, scroll reveal
4. **Features** — 6 NeoPOP feature cards with hover glow effects and micro-animations
5. **NeoPOP Dashboard** — Live progress bars, glassmorphism cards, interactive stat panels
6. **Testimonials** — Animated counters, star ratings, member cards, App/Play Store ratings
7. **Security** — Shield animation with pulsing rings, security feature grid
8. **CTA** — Full-width dark CTA with gold gradient radials
9. **Footer** — 4-column link grid, social links, brand identity

## Design System

| Token | Value |
|---|---|
| Primary font | Playfair Display (display/headings) |
| Body font | DM Sans |
| Mono font | DM Mono |
| Gold | `#C9A84C` |
| Black | `#0A0A0A` |
| Surface | `#111111` |
| Accent green | `#2ECC8B` |

## Animations Used

- **`useScroll` + `useTransform`** — Hero parallax
- **`useInView`** — Section reveal triggers
- **`motion.div` stagger** — Card group entrances
- **`AnimatePresence`** — Mobile menu mount/unmount
- **`useCounter`** — Animated number counters in Testimonials
- **Floating orbs** — CSS keyframe + Framer loop
- **Progress bars** — Width-animated on scroll into view
- **Shield pulse rings** — Scale + opacity loop
