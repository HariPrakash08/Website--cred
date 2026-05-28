import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─── UTILITY HOOKS ───────────────────────────────────────────────────────────
function useCounter(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const colors = {
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  goldDark: "#8C6E2A",
  black: "#0A0A0A",
  surface: "#111111",
  surfaceElevated: "#181818",
  surfaceBorder: "#242424",
  textPrimary: "#F5F5F0",
  textSecondary: "#A0A09A",
  textMuted: "#606060",
  accent: "#2ECC8B",
  accentDim: "#1A7A52",
};

const font = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  mono: "'DM Mono', 'Courier New', monospace",
};

// ─── SHARED ANIMATIONS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

// ─── NOISE OVERLAY ───────────────────────────────────────────────────────────
const NoiseOverlay = () => (
  <div
    style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.025,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }}
  />
);

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = ["Features", "Rewards", "Security", "About"];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 2rem",
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${colors.surfaceBorder}` : "none",
        transition: "all 0.4s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "72px",
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: "8px",
          background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: font.display, fontWeight: 700, fontSize: 18, color: colors.black,
          boxShadow: `0 0 20px ${colors.gold}40`,
        }}>C</div>
        <span style={{ fontFamily: font.display, fontSize: 22, fontWeight: 700, color: colors.textPrimary, letterSpacing: 3 }}>CRED</span>
      </motion.div>

      {/* Desktop Links */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}
        className="desktop-nav"
      >
        {links.map((l) => (
          <motion.a
            key={l}
            whileHover={{ color: colors.gold }}
            style={{ color: colors.textSecondary, fontFamily: font.body, fontSize: 14, fontWeight: 500, letterSpacing: 1, cursor: "pointer", textDecoration: "none", transition: "color 0.2s" }}
          >{l}</motion.a>
        ))}
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${colors.gold}50` }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "10px 24px", borderRadius: "6px",
            background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
            border: "none", color: colors.black, fontFamily: font.body,
            fontSize: 13, fontWeight: 700, letterSpacing: 1.5, cursor: "pointer",
            textTransform: "uppercase",
          }}
        >Join Now</motion.button>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}
        className="mobile-menu-btn"
        aria-label="Menu"
      >
        <div style={{ width: 24, height: 2, background: colors.textPrimary, marginBottom: 6, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(6px, 6px)" : "none" }} />
        <div style={{ width: 24, height: 2, background: colors.textPrimary, marginBottom: 6, opacity: menuOpen ? 0 : 1, transition: "opacity 0.3s" }} />
        <div style={{ width: 24, height: 2, background: colors.textPrimary, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(6px, -6px)" : "none" }} />
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "absolute", top: "72px", left: 0, right: 0,
              background: "rgba(10,10,10,0.98)", backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${colors.surfaceBorder}`,
              padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem",
            }}
          >
            {links.map((l) => (
              <a key={l} onClick={() => setMenuOpen(false)}
                style={{ color: colors.textSecondary, fontFamily: font.body, fontSize: 16, cursor: "pointer", textDecoration: "none" }}
              >{l}</a>
            ))}
            <button style={{
              padding: "12px 24px", borderRadius: "6px",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
              border: "none", color: colors.black, fontFamily: font.body,
              fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>Join Now</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── HERO SECTION ────────────────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden", background: colors.black }}>
      {/* Background gradients */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, ${colors.gold}15 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 80%, ${colors.accent}08 0%, transparent 50%),
          radial-gradient(ellipse 60% 60% at 10% 60%, ${colors.goldDark}10 0%, transparent 50%)
        `,
      }} />

      {/* Floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div key={i}
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: [300, 200, 150][i], height: [300, 200, 150][i],
            borderRadius: "50%",
            border: `1px solid ${colors.gold}${["15", "10", "08"][i]}`,
            left: ["10%", "70%", "40%"][i], top: ["20%", "60%", "10%"][i],
            pointerEvents: "none",
            boxShadow: `inset 0 0 60px ${colors.gold}05`,
          }}
        />
      ))}

      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `linear-gradient(${colors.gold} 1px, transparent 1px), linear-gradient(90deg, ${colors.gold} 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <motion.div style={{ y, opacity }}
        className="hero-content"
        initial="hidden" animate="visible"
        variants={stagger}
        style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "0 2rem", textAlign: "center", y, opacity }}
      >
        {/* Badge */}
        <motion.div variants={fadeUp}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 18px", borderRadius: 100,
            border: `1px solid ${colors.gold}40`,
            background: `${colors.gold}10`,
            marginBottom: "2rem",
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors.accent }} />
          <span style={{ fontFamily: font.body, fontSize: 12, fontWeight: 600, letterSpacing: 2, color: colors.gold, textTransform: "uppercase" }}>
            India's Most Trusted Fintech
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp}
          style={{
            fontFamily: font.display, fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 700, lineHeight: 1.05, color: colors.textPrimary,
            marginBottom: "1.5rem", letterSpacing: -2,
          }}
        >
          Pay Bills.{" "}
          <span style={{
            background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight}, ${colors.gold})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Earn Rewards.
          </span>
          <br />Live Premium.
        </motion.h1>

        {/* Subheadline */}
        <motion.p variants={fadeUp}
          style={{
            fontFamily: font.body, fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: colors.textSecondary, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 3rem",
          }}
        >
          Join 12 million members who use CRED to pay credit card bills and unlock exclusive rewards, 
          cashback, and premium experiences curated just for them.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: `0 20px 60px ${colors.gold}40` }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "16px 36px", borderRadius: "8px",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
              border: "none", color: colors.black, fontFamily: font.body,
              fontSize: 14, fontWeight: 700, letterSpacing: 2, cursor: "pointer",
              textTransform: "uppercase", boxShadow: `0 8px 30px ${colors.gold}30`,
            }}
          >
            Get Started Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, borderColor: colors.gold, color: colors.gold }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "16px 36px", borderRadius: "8px",
              background: "transparent",
              border: `1px solid ${colors.surfaceBorder}`,
              color: colors.textSecondary, fontFamily: font.body,
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Watch Demo ↗
          </motion.button>
        </motion.div>

        {/* Stats strip */}
        <motion.div variants={fadeUp}
          style={{
            display: "flex", gap: "3rem", justifyContent: "center", marginTop: "5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { n: "12M+", label: "Members" },
            { n: "₹2L Cr+", label: "Bills Paid" },
            { n: "1000+", label: "Rewards" },
            { n: "4.8★", label: "App Rating" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: font.display, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: colors.gold }}>{s.n}</div>
              <div style={{ fontFamily: font.body, fontSize: 12, color: colors.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
      >
        <div style={{ width: 1, height: 50, background: `linear-gradient(to bottom, transparent, ${colors.gold}60)` }} />
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors.gold }} />
      </motion.div>
    </section>
  );
}

// ─── ABOUT / TRUST SECTION ───────────────────────────────────────────────────
function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ padding: "8rem 2rem", background: colors.surface, overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}
          className="trust-grid"
        >
          {/* Text */}
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}>
            <motion.div variants={fadeUp}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 100,
                border: `1px solid ${colors.gold}30`, background: `${colors.gold}08`,
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 2, color: colors.gold, textTransform: "uppercase" }}>Members-Only Club</span>
            </motion.div>

            <motion.h2 variants={fadeUp}
              style={{ fontFamily: font.display, fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.15, marginBottom: "1.5rem" }}
            >
              Not everyone gets in.<br />
              <span style={{ color: colors.gold }}>Only the best do.</span>
            </motion.h2>

            <motion.p variants={fadeUp}
              style={{ fontFamily: font.body, fontSize: 16, color: colors.textSecondary, lineHeight: 1.8, marginBottom: "2rem" }}
            >
              CRED is an exclusive community of India's most creditworthy individuals. 
              We reward you for your financial discipline — the more responsible you are, 
              the more you earn. It's that simple.
            </motion.p>

            {[
              { icon: "◆", text: "Invite-only membership for high credit scores" },
              { icon: "◆", text: "Curated rewards from premium brands" },
              { icon: "◆", text: "Transparent, no-hidden-fees ecosystem" },
            ].map((item) => (
              <motion.div key={item.text} variants={fadeUp}
                style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: "1rem" }}
              >
                <span style={{ color: colors.gold, fontSize: 8, marginTop: 6 }}>{item.icon}</span>
                <span style={{ fontFamily: font.body, fontSize: 15, color: colors.textSecondary, lineHeight: 1.6 }}>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Visual card stack */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ position: "relative", height: 380 }}
          >
            {/* Background card */}
            <div style={{
              position: "absolute", top: 40, left: 40, right: -20,
              height: 300, borderRadius: 16,
              background: `linear-gradient(135deg, ${colors.surfaceElevated}, ${colors.surfaceBorder})`,
              border: `1px solid ${colors.surfaceBorder}`,
              transform: "rotate(3deg)",
            }} />
            {/* Middle card */}
            <div style={{
              position: "absolute", top: 20, left: 20, right: -10,
              height: 310, borderRadius: 16,
              background: `linear-gradient(135deg, #1a1a1a, #222)`,
              border: `1px solid ${colors.gold}20`,
              transform: "rotate(1deg)",
            }} />
            {/* Front card — CRED Black Card */}
            <motion.div
              whileHover={{ y: -8, boxShadow: `0 40px 80px ${colors.gold}20` }}
              style={{
                position: "absolute", top: 0, left: 0, right: -30,
                height: 320, borderRadius: 20,
                background: `linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 40%, ${colors.gold}15 100%)`,
                border: `1px solid ${colors.gold}40`,
                boxShadow: `0 20px 60px ${colors.black}80, 0 0 0 1px ${colors.gold}20`,
                padding: "2rem",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                cursor: "pointer", transition: "all 0.4s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: font.display, fontSize: 20, fontWeight: 700, color: colors.gold, letterSpacing: 3 }}>CRED</div>
                  <div style={{ fontFamily: font.body, fontSize: 11, color: colors.textMuted, letterSpacing: 2, marginTop: 2 }}>BLACK MEMBER</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`, opacity: 0.9 }} />
              </div>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: 16, color: colors.textPrimary, letterSpacing: 4, marginBottom: "1rem" }}>
                  •••• •••• •••• 4892
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontFamily: font.body, fontSize: 10, color: colors.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>Credit Score</div>
                    <div style={{ fontFamily: font.display, fontSize: 22, fontWeight: 700, color: colors.accent }}>812</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: font.body, fontSize: 10, color: colors.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>CRED Coins</div>
                    <div style={{ fontFamily: font.display, fontSize: 22, fontWeight: 700, color: colors.gold }}>24,590</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES SECTION ────────────────────────────────────────────────────────
const featureData = [
  {
    icon: "💳",
    title: "Credit Card Bills",
    subtitle: "Pay instantly, earn rewards",
    description: "Pay all your credit card bills in one place. Get CRED Coins on every payment and unlock exclusive offers.",
    tag: "CORE",
    accent: colors.gold,
  },
  {
    icon: "🎁",
    title: "CRED Rewards",
    subtitle: "Premium brand offers",
    description: "Redeem CRED Coins for exclusive cashback, vouchers, and experiences from 1000+ premium brands.",
    tag: "POPULAR",
    accent: colors.accent,
  },
  {
    icon: "📊",
    title: "Credit Score",
    subtitle: "Real-time monitoring",
    description: "Track your credit score and get personalised tips to improve it. Know what lenders see about you.",
    tag: "FREE",
    accent: "#7C6EF7",
  },
  {
    icon: "⚡",
    title: "CRED UPI",
    subtitle: "Pay everyone, earn on all",
    description: "Send money, split bills, and pay merchants using CRED UPI — earn CRED Coins on every transaction.",
    tag: "NEW",
    accent: "#E87B45",
  },
  {
    icon: "🪙",
    title: "CRED Coins",
    subtitle: "Every rupee rewarded",
    description: "The CRED currency that keeps giving. Earn on bills, payments, and referrals. Never let them expire.",
    tag: "EXCLUSIVE",
    accent: colors.gold,
  },
  {
    icon: "💰",
    title: "Instant Cashback",
    subtitle: "Real money, real fast",
    description: "Get direct cashback to your bank account or wallet. No hoops, no minimum spends, just rewards.",
    tag: "HOT",
    accent: colors.accent,
  },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: 16, padding: "2rem",
        background: hovered ? colors.surfaceElevated : colors.surface,
        border: `1px solid ${hovered ? feature.accent + "40" : colors.surfaceBorder}`,
        cursor: "pointer", overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: hovered ? `0 20px 60px ${feature.accent}15` : "none",
      }}
    >
      {/* Glow on hover */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${feature.accent}60, transparent)`,
        opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
      }} />

      {/* Tag */}
      <div style={{
        display: "inline-flex", padding: "3px 10px", borderRadius: 4, marginBottom: "1.5rem",
        background: `${feature.accent}15`, border: `1px solid ${feature.accent}30`,
      }}>
        <span style={{ fontFamily: font.body, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: feature.accent }}>{feature.tag}</span>
      </div>

      {/* Icon */}
      <div style={{ fontSize: 36, marginBottom: "1rem", display: "block" }}>{feature.icon}</div>

      <h3 style={{ fontFamily: font.display, fontSize: 20, fontWeight: 700, color: colors.textPrimary, marginBottom: 6, lineHeight: 1.2 }}>
        {feature.title}
      </h3>
      <div style={{ fontFamily: font.body, fontSize: 12, color: feature.accent, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: "1rem" }}>
        {feature.subtitle}
      </div>
      <p style={{ fontFamily: font.body, fontSize: 14, color: colors.textSecondary, lineHeight: 1.7 }}>
        {feature.description}
      </p>

      <motion.div
        animate={{ x: hovered ? 4 : 0 }}
        style={{ marginTop: "1.5rem", color: feature.accent, fontFamily: font.body, fontSize: 13, fontWeight: 600 }}
      >
        Learn more →
      </motion.div>
    </motion.div>
  );
}

function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section style={{ padding: "8rem 2rem", background: colors.black }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <motion.div variants={fadeUp}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 100,
              border: `1px solid ${colors.gold}30`, background: `${colors.gold}08`,
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 2, color: colors.gold, textTransform: "uppercase" }}>Everything You Need</span>
          </motion.div>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: font.display, fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.1, marginBottom: "1rem" }}
          >
            Premium features for<br />
            <span style={{ color: colors.gold }}>premium members</span>
          </motion.h2>
          <motion.p variants={fadeUp}
            style={{ fontFamily: font.body, fontSize: 16, color: colors.textSecondary, maxWidth: 500, margin: "0 auto" }}
          >
            Every feature built with care, designed to give you more back than you put in.
          </motion.p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}>
          {featureData.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── NEOPOP UI SECTION ────────────────────────────────────────────────────────
function NeoPOPSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCard, setActiveCard] = useState(0);

  const cards = [
    {
      title: "₹24,590",
      subtitle: "CRED Coins Earned",
      change: "+2,340 this month",
      positive: true,
      icon: "🪙",
    },
    {
      title: "812",
      subtitle: "Credit Score",
      change: "↑ Excellent Range",
      positive: true,
      icon: "📈",
    },
    {
      title: "₹1,24,000",
      subtitle: "Bills Paid YTD",
      change: "12 cards managed",
      positive: null,
      icon: "💳",
    },
  ];

  return (
    <section ref={ref} style={{ padding: "8rem 2rem", background: colors.surface, overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}
          className="neopop-grid"
        >
          {/* Left: UI Cards */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main dashboard card */}
            <div style={{
              borderRadius: 24, padding: "2rem", marginBottom: "1rem",
              background: `linear-gradient(135deg, #0f0f0f, #1a1509)`,
              border: `1px solid ${colors.gold}30`,
              boxShadow: `0 40px 80px ${colors.black}80, 0 0 60px ${colors.gold}08`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                  <div style={{ fontFamily: font.body, fontSize: 11, color: colors.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Total Rewards</div>
                  <div style={{ fontFamily: font.display, fontSize: 36, fontWeight: 700, color: colors.gold }}>₹12,490</div>
                </div>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `${colors.gold}15`, border: `1px solid ${colors.gold}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                }}>✦</div>
              </div>

              {/* Mini progress bars */}
              {[
                { label: "Cashback", value: 72, color: colors.accent },
                { label: "Vouchers", value: 54, color: colors.gold },
                { label: "Experiences", value: 38, color: "#7C6EF7" },
              ].map((bar) => (
                <div key={bar.label} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: font.body, fontSize: 12, color: colors.textSecondary }}>{bar.label}</span>
                    <span style={{ fontFamily: font.mono, fontSize: 12, color: bar.color }}>{bar.value}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 100, background: colors.surfaceBorder, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${bar.value}%` } : {}}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                      style={{ height: "100%", borderRadius: 100, background: `linear-gradient(90deg, ${bar.color}80, ${bar.color})` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mini stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              {cards.map((c, i) => (
                <motion.div key={c.title}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setActiveCard(i)}
                  style={{
                    borderRadius: 12, padding: "1rem",
                    background: activeCard === i ? `${colors.gold}10` : colors.surfaceElevated,
                    border: `1px solid ${activeCard === i ? colors.gold + "40" : colors.surfaceBorder}`,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</div>
                  <div style={{ fontFamily: font.display, fontSize: 15, fontWeight: 700, color: colors.textPrimary, marginBottom: 2 }}>{c.title}</div>
                  <div style={{ fontFamily: font.body, fontSize: 10, color: colors.textMuted, marginBottom: 4 }}>{c.subtitle}</div>
                  <div style={{ fontFamily: font.body, fontSize: 10, color: c.positive === true ? colors.accent : c.positive === false ? "#E87B45" : colors.textMuted }}>{c.change}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 100,
                border: `1px solid ${colors.gold}30`, background: `${colors.gold}08`,
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 2, color: colors.gold, textTransform: "uppercase" }}>NeoPOP Design</span>
            </motion.div>
            <motion.h2 variants={fadeUp}
              style={{ fontFamily: font.display, fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.15, marginBottom: "1.5rem" }}
            >
              Your financial life,<br />
              <span style={{ color: colors.gold }}>beautifully displayed</span>
            </motion.h2>
            <motion.p variants={fadeUp}
              style={{ fontFamily: font.body, fontSize: 16, color: colors.textSecondary, lineHeight: 1.8, marginBottom: "2rem" }}
            >
              CRED's NeoPOP design system brings depth, dimension, and delight to every interaction. 
              Glassmorphism, bold shadows, and premium card layouts make managing money feel luxurious.
            </motion.p>
            {[
              ["Glass UI", "Frosted, layered card interfaces"],
              ["3D Buttons", "Tactile press interactions"],
              ["Live Data", "Animated real-time updates"],
            ].map(([t, d]) => (
              <motion.div key={t} variants={fadeUp}
                style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${colors.gold}15`, border: `1px solid ${colors.gold}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.gold }} />
                </div>
                <div>
                  <div style={{ fontFamily: font.body, fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{t}</div>
                  <div style={{ fontFamily: font.body, fontSize: 13, color: colors.textMuted }}>{d}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS SECTION ────────────────────────────────────────────────────
function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const membersCount = useCounter(12000000, 2500, inView);
  const billsCount = useCounter(200000, 2000, inView);
  const rewardsCount = useCounter(1000, 1500, inView);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Product Manager, Bangalore",
      avatar: "PS",
      text: "CRED changed how I think about credit card bills. It's not a chore anymore — it's actually rewarding. I've earned over ₹8,000 in cashback this year alone.",
      rating: 5,
      coins: "32,400 Coins",
    },
    {
      name: "Arjun Menon",
      role: "Startup Founder, Mumbai",
      avatar: "AM",
      text: "The exclusivity is real. The app feels like a private club. Interface is stunning, rewards are genuine, and the credit score tracking has helped me plan my finances better.",
      rating: 5,
      coins: "56,200 Coins",
    },
    {
      name: "Kavya Reddy",
      role: "Investment Banker, Hyderabad",
      avatar: "KR",
      text: "Finally an app that respects my intelligence. No gimmicks, just premium experiences. The travel rewards I've unlocked have been absolutely incredible.",
      rating: 5,
      coins: "18,900 Coins",
    },
  ];

  return (
    <section ref={ref} style={{ padding: "8rem 2rem", background: colors.black }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Stats */}
        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}
          style={{ textAlign: "center", marginBottom: "6rem" }}
        >
          <motion.div variants={fadeUp}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 100,
              border: `1px solid ${colors.gold}30`, background: `${colors.gold}08`,
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 2, color: colors.gold, textTransform: "uppercase" }}>Numbers Don't Lie</span>
          </motion.div>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: font.display, fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.1, marginBottom: "3rem" }}
          >
            Trusted by millions,<br /><span style={{ color: colors.gold }}>loved by all</span>
          </motion.h2>

          <motion.div variants={fadeUp}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", maxWidth: 800, margin: "0 auto 5rem" }}
          >
            {[
              { value: membersCount >= 10000000 ? `${(membersCount / 1000000).toFixed(0)}M+` : "12M+", label: "Active Members", icon: "👥" },
              { value: billsCount >= 190000 ? `₹${(billsCount / 100000).toFixed(0)}L Cr+` : "₹2L Cr+", label: "Bills Paid", icon: "💳" },
              { value: rewardsCount >= 950 ? `${rewardsCount}+` : "1000+", label: "Reward Partners", icon: "🎁" },
              { value: "4.8 ★", label: "App Rating", icon: "⭐" },
            ].map((s) => (
              <div key={s.label}
                style={{
                  padding: "2rem 1rem", borderRadius: 16,
                  background: colors.surface, border: `1px solid ${colors.surfaceBorder}`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: "0.75rem" }}>{s.icon}</div>
                <div style={{ fontFamily: font.display, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: colors.gold, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontFamily: font.body, fontSize: 13, color: colors.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Testimonials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, boxShadow: `0 30px 60px ${colors.gold}10` }}
              style={{
                borderRadius: 20, padding: "2rem",
                background: colors.surface, border: `1px solid ${colors.surfaceBorder}`,
                cursor: "default", transition: "box-shadow 0.3s",
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 4, marginBottom: "1.5rem" }}>
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} style={{ color: colors.gold, fontSize: 14 }}>★</span>
                ))}
              </div>
              {/* Quote */}
              <p style={{ fontFamily: font.body, fontSize: 15, color: colors.textSecondary, lineHeight: 1.75, marginBottom: "2rem", fontStyle: "italic" }}>
                "{t.text}"
              </p>
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.gold}30, ${colors.gold}10)`,
                    border: `1px solid ${colors.gold}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: font.body, fontWeight: 700, fontSize: 13, color: colors.gold,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontFamily: font.body, fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{t.name}</div>
                    <div style={{ fontFamily: font.body, fontSize: 12, color: colors.textMuted }}>{t.role}</div>
                  </div>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 6,
                  background: `${colors.gold}15`, border: `1px solid ${colors.gold}20`,
                }}>
                  <span style={{ fontFamily: font.mono, fontSize: 11, color: colors.gold }}>{t.coins}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* App store ratings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap", marginTop: "3rem" }}
        >
          {[
            { store: "App Store", rating: "4.8", reviews: "1.2M", icon: "" },
            { store: "Play Store", rating: "4.7", reviews: "2.8M", icon: "▶" },
          ].map((s) => (
            <div key={s.store}
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1rem 1.5rem", borderRadius: 12,
                background: colors.surface, border: `1px solid ${colors.surfaceBorder}`,
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: colors.surfaceElevated, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {s.icon || ""}
              </div>
              <div>
                <div style={{ fontFamily: font.body, fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>{s.store}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: font.display, fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>{s.rating}</span>
                  <span style={{ color: colors.gold, fontSize: 12 }}>★★★★★</span>
                  <span style={{ fontFamily: font.body, fontSize: 11, color: colors.textMuted }}>{s.reviews} reviews</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── SECURITY SECTION ────────────────────────────────────────────────────────
function SecuritySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: "🔐",
      title: "256-bit Encryption",
      description: "Bank-grade AES-256 encryption protects every transaction and piece of data.",
    },
    {
      icon: "🛡️",
      title: "Secure Payments",
      description: "PCI-DSS certified payment infrastructure with multi-layer fraud detection.",
    },
    {
      icon: "🔒",
      title: "Data Protection",
      description: "Zero data sharing with third parties. Your financial data belongs to you, always.",
    },
    {
      icon: "👁️",
      title: "Biometric Auth",
      description: "Face ID and fingerprint authentication for every sensitive action.",
    },
    {
      icon: "📡",
      title: "Real-time Alerts",
      description: "Instant notifications for every transaction, login attempt, and account change.",
    },
    {
      icon: "⚙️",
      title: "RBI Compliant",
      description: "Fully regulated by the Reserve Bank of India. Safe, legal, trusted.",
    },
  ];

  return (
    <section ref={ref} style={{ padding: "8rem 2rem", background: colors.surface, position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${colors.accent}06, transparent 60%)`,
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <motion.div
          initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <motion.div variants={fadeUp}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 100,
              border: `1px solid ${colors.accent}30`, background: `${colors.accent}08`,
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors.accent }} />
            <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 2, color: colors.accent, textTransform: "uppercase" }}>Enterprise-Grade Security</span>
          </motion.div>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: font.display, fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.1, marginBottom: "1rem" }}
          >
            Your money. Your data.<br />
            <span style={{ color: colors.accent }}>Protected. Always.</span>
          </motion.h2>
          <motion.p variants={fadeUp}
            style={{ fontFamily: font.body, fontSize: 16, color: colors.textSecondary, maxWidth: 500, margin: "0 auto" }}
          >
            CRED employs military-grade security protocols so you can trust us with what matters most.
          </motion.p>
        </motion.div>

        {/* Security shield visual + cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
          className="security-grid"
        >
          {/* Left: Shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div style={{ position: "relative", width: 300, height: 340 }}>
              {/* Glow rings */}
              {[0, 1, 2].map((i) => (
                <motion.div key={i}
                  animate={{ scale: [1, 1.05 + i * 0.05, 1], opacity: [0.4 - i * 0.1, 0.6 - i * 0.1, 0.4 - i * 0.1] }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    inset: -(i * 30),
                    borderRadius: "50%",
                    border: `1px solid ${colors.accent}${["30", "20", "10"][i]}`,
                  }}
                />
              ))}
              {/* Main shield */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "40% 40% 50% 50% / 40% 40% 50% 50%",
                background: `linear-gradient(180deg, ${colors.surfaceElevated}, ${colors.surface})`,
                border: `2px solid ${colors.accent}40`,
                boxShadow: `0 0 60px ${colors.accent}20, inset 0 0 40px ${colors.accent}08`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column",
              }}>
                <div style={{ fontSize: 64, marginBottom: "0.5rem" }}>🛡️</div>
                <div style={{ fontFamily: font.display, fontSize: 16, fontWeight: 700, color: colors.accent, letterSpacing: 2 }}>SECURED</div>
                <div style={{ fontFamily: font.body, fontSize: 11, color: colors.textMuted, letterSpacing: 1 }}>CRED VAULT</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Feature list */}
          <div>
            {features.slice(0, 4).map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ x: 4 }}
                style={{
                  display: "flex", gap: "1rem", alignItems: "flex-start",
                  padding: "1rem 0",
                  borderBottom: i < 3 ? `1px solid ${colors.surfaceBorder}` : "none",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `${colors.accent}10`, border: `1px solid ${colors.accent}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily: font.body, fontSize: 15, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontFamily: font.body, fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>{f.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "3rem" }}>
          {features.slice(4).map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              style={{
                display: "flex", gap: "1rem", alignItems: "flex-start",
                padding: "1.25rem", borderRadius: 12,
                background: colors.black, border: `1px solid ${colors.surfaceBorder}`,
              }}
            >
              <span style={{ fontSize: 24 }}>{f.icon}</span>
              <div>
                <div style={{ fontFamily: font.body, fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontFamily: font.body, fontSize: 12, color: colors.textSecondary }}>{f.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA SECTION ─────────────────────────────────────────────────────────────
function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ padding: "8rem 2rem", background: colors.black, position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${colors.gold}10, transparent 60%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04,
        backgroundImage: `linear-gradient(${colors.gold} 1px, transparent 1px), linear-gradient(90deg, ${colors.gold} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <motion.div
        ref={ref}
        initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}
        style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}
      >
        <motion.div variants={fadeUp}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            border: `1px solid ${colors.gold}30`, background: `${colors.gold}08`,
            marginBottom: "2rem",
          }}
        >
          <span style={{ fontFamily: font.body, fontSize: 11, fontWeight: 600, letterSpacing: 2, color: colors.gold, textTransform: "uppercase" }}>Join The Elite</span>
        </motion.div>

        <motion.h2 variants={fadeUp}
          style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.05, marginBottom: "1.5rem" }}
        >
          Ready to start<br />
          <span style={{
            background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight}, ${colors.gold})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            earning more?
          </span>
        </motion.h2>

        <motion.p variants={fadeUp}
          style={{ fontFamily: font.body, fontSize: 18, color: colors.textSecondary, lineHeight: 1.7, marginBottom: "3rem" }}
        >
          Download CRED and join 12 million members who've turned bill payments into rewards.
          It's free. It's exclusive. It's yours.
        </motion.p>

        <motion.div variants={fadeUp}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          {[
            { label: "Download for iOS", icon: "" },
            { label: "Get it on Android", icon: "▶" },
          ].map((btn) => (
            <motion.button key={btn.label}
              whileHover={{ scale: 1.04, boxShadow: `0 20px 60px ${colors.gold}40` }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "14px 28px", borderRadius: "10px",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
                border: "none", color: colors.black, fontFamily: font.body,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                boxShadow: `0 8px 30px ${colors.gold}30`,
              }}
            >
              <span style={{ fontSize: 20 }}>{btn.icon}</span>
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.p variants={fadeUp}
          style={{ fontFamily: font.body, fontSize: 13, color: colors.textMuted, marginTop: "1.5rem" }}
        >
          Requires credit score 700+. Free to join. No subscription fees ever.
        </motion.p>
      </motion.div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    Company: ["About", "Careers", "Press", "Blog", "Investors"],
    Product: ["Features", "Rewards", "CRED Pay", "Credit Score", "CRED Coins"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Data Deletion", "Grievance"],
    Support: ["Help Center", "Contact Us", "Status", "Security", "Community"],
  };

  const socials = [
    { name: "Twitter", icon: "𝕏" },
    { name: "Instagram", icon: "◎" },
    { name: "LinkedIn", icon: "in" },
    { name: "YouTube", icon: "▶" },
  ];

  return (
    <footer style={{ background: colors.surface, borderTop: `1px solid ${colors.surfaceBorder}`, padding: "5rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "4rem" }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "8px",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldDark})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: font.display, fontWeight: 700, fontSize: 18, color: colors.black,
              }}>C</div>
              <span style={{ fontFamily: font.display, fontSize: 22, fontWeight: 700, color: colors.textPrimary, letterSpacing: 3 }}>CRED</span>
            </div>
            <p style={{ fontFamily: font.body, fontSize: 14, color: colors.textMuted, lineHeight: 1.8, maxWidth: 260, marginBottom: "2rem" }}>
              India's most trusted credit card payment and rewards platform. 
              Built for those who deserve more.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {socials.map((s) => (
                <motion.div key={s.name}
                  whileHover={{ scale: 1.1, borderColor: colors.gold, color: colors.gold }}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: `1px solid ${colors.surfaceBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: font.mono, fontSize: 12, color: colors.textMuted, cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >{s.icon}</motion.div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <div style={{ fontFamily: font.body, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: colors.textMuted, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                {section}
              </div>
              {items.map((item) => (
                <motion.div key={item}
                  whileHover={{ color: colors.textPrimary, x: 2 }}
                  style={{ fontFamily: font.body, fontSize: 14, color: colors.textSecondary, marginBottom: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}
                >{item}</motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${colors.surfaceBorder}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontFamily: font.body, fontSize: 13, color: colors.textMuted }}>
            © 2024 CRED (Dreamplug Technologies Pvt. Ltd.) All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <span key={l} style={{ fontFamily: font.body, fontSize: 13, color: colors.textMuted, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.accent }} />
            <span style={{ fontFamily: font.body, fontSize: 12, color: colors.textMuted }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0A0A0A; color: #F5F5F0; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #C9A84C40; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #C9A84C80; }
  
  @media (max-width: 768px) {
    .desktop-nav { display: none !important; }
    .mobile-menu-btn { display: block !important; }
    .trust-grid, .neopop-grid, .security-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
  }
  @media (max-width: 480px) {
    .footer-grid { grid-template-columns: 1fr !important; }
  }
`;

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <NoiseOverlay />
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <NeoPOPSection />
        <TestimonialsSection />
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
