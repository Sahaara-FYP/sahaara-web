import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- Icons (inline SVG to avoid extra deps) ---
const Icon = {
  Menu: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  Close: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  Shield: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  ),
  Map: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
      />
    </svg>
  ),
  Chat: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    </svg>
  ),
  Bell: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  ),
  Star: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  ),
  Users: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  ),
  Heart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  ),
};

const features = [
  {
    icon: <Icon.Heart />,
    title: "Help Requests & Offers",
    desc: "Post what you need or what you can give. From blood donation and medical aid to food, shelter, and everyday tasks — all in one feed.",
    color: "from-indigo-500/20 to-indigo-500/5",
    border: "border-indigo-500/20",
    accent: "text-indigo-400",
  },
  {
    icon: <Icon.Bell />,
    title: "Emergency Alerts",
    desc: "Instantly notify everyone nearby about dangerous situations — accidents, flooding, missing persons. Real-time alerts when every second counts.",
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/20",
    accent: "text-cyan-400",
  },
  {
    icon: <Icon.Map />,
    title: "Live Map View",
    desc: "See requests, alerts, and offers on an interactive map. Find who needs help closest to you and respond before anyone else.",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    accent: "text-emerald-400",
  },
  {
    icon: <Icon.Chat />,
    title: "Real-Time Communication",
    desc: "The moment a helper is accepted, a private chat opens. For larger tasks, a temporary group chat coordinates multiple helpers seamlessly.",
    color: "from-indigo-500/20 to-indigo-500/5",
    border: "border-indigo-500/20",
    accent: "text-indigo-400",
  },
  {
    icon: <Icon.Shield />,
    title: "Identity Verification",
    desc: "CNIC and live selfie verification ensure every helper is a real, accountable person. Women-Safe mode keeps vulnerable users protected.",
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "border-cyan-500/20",
    accent: "text-cyan-400",
  },
  {
    icon: <Icon.Star />,
    title: "Trust Score & Ratings",
    desc: "After every completed task, both parties rate each other. A transparent Trust Score builds community accountability over time.",
    color: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
    accent: "text-amber-400",
  },
];

const stats = [
  { value: "20km", label: "Smart Proximity Radius" },
  { value: "3", label: "Content Types Supported" },
  { value: "Real-Time", label: "Chat & Notifications" },
  { value: "CNIC", label: "Verified Identity System" },
];

const useCases = [
  {
    emoji: "🩸",
    title: "Blood Emergency",
    desc: "A father urgently needs O-negative blood. With one request, verified nearby donors are notified — reducing response time from hours to minutes.",
  },
  {
    emoji: "🏠",
    title: "Disaster Relief",
    desc: "During urban flooding, families post SOS requests for food, shelter, or transport. Volunteers and NGOs respond via the live map.",
  },
  {
    emoji: "👩",
    title: "Women-Safe Requests",
    desc: "Verified women can post requests visible only to other verified female helpers, ensuring safety and dignity in sensitive situations.",
  },
  {
    emoji: "🧓",
    title: "Everyday Assistance",
    desc: "An elderly person needs help carrying groceries or fixing a household issue. A nearby verified helper responds within minutes.",
  },
];

const team = [
  { name: "Ayyan Ali", id: "22K-5194" },
  { name: "Amal Abdul Rehman", id: "22K-4822" },
  { name: "Ali Nazir", id: "22K-5164" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-['Outfit',sans-serif] overflow-x-hidden">
      {/* ── Ambient background glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-[100px]" />
      </div>

      {/* ────────────── NAVBAR ────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <img
                src="/icon.png"
                alt="Sahaara"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              Sahaara
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {["about", "features", "use-cases", "team"].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm text-[#94a3b8] hover:text-white capitalize transition-colors"
              >
                {id.replace("-", " ")}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/login")}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              Admin Login
              <Icon.ArrowRight />
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg border border-white/10 text-[#94a3b8] hover:text-white transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <Icon.Close /> : <Icon.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#020617]/95 backdrop-blur-xl px-5 py-4 flex flex-col gap-4">
            {["about", "features", "use-cases", "team"].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-sm text-[#94a3b8] hover:text-white capitalize transition-colors py-1"
              >
                {id.replace("-", " ")}
              </button>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/admin/login");
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
            >
              Admin Login <Icon.ArrowRight />
            </button>
          </div>
        )}
      </header>

      {/* ────────────── HERO ────────────── */}
      <section
        id="hero"
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-16"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 shadow-lg shadow-indigo-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Final Year Project — NUCES FAST Karachi · Spring 2026
        </div>

        {/* App icon */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-indigo-500/30 mb-8 flex-shrink-0">
          <img
            src="/icon.png"
            alt="Sahaara App"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight max-w-4xl mb-6">
          <span className="text-white">Sahaara</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
            Community Support,
          </span>
          <br />
          <span className="text-white">Reimagined.</span>
        </h1>

        <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl leading-relaxed mb-10">
          Pakistan's first unified platform for real-time, hyperlocal community
          assistance. Connecting people in need with nearby verified helpers —
          from blood emergencies and disaster relief to everyday tasks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={() => scrollTo("features")}
            className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 flex items-center gap-2"
          >
            Explore Features <Icon.ArrowRight />
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-[#94a3b8] hover:text-white font-semibold text-sm transition-all duration-200 bg-white/5 hover:bg-white/10"
          >
            Read Abstract
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-20 w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-sm"
            >
              <div className="text-xl md:text-2xl font-bold text-indigo-300">
                {s.value}
              </div>
              <div className="text-xs text-[#64748b] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────── ABOUT / ABSTRACT ────────────── */}
      <section id="about" className="relative z-10 py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-3">
              About the Project
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              The Problem. The Platform.
            </h2>
          </div>

          {/* Abstract card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 md:p-12 mb-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-t-3xl" />
            <p className="text-[#94a3b8] text-sm md:text-base leading-loose">
              In Pakistan, accessing timely and trusted community support
              remains a persistent challenge. People rely on scattered channels
              — WhatsApp groups, Facebook posts, personal contacts — to seek
              help during both everyday needs and emergencies. This results in
              delayed responses, missed connections, and critical gaps in
              assistance, particularly for vulnerable groups including women,
              the elderly, and people with disabilities.
            </p>
            <p className="text-[#94a3b8] text-sm md:text-base leading-loose mt-5">
              <span className="text-white font-semibold">Sahaara</span>{" "}
              addresses this gap as Pakistan's first unified platform connecting
              people in need with nearby verified helpers. A live map and
              proximity-based feed make it easy to discover and respond to
              nearby needs. Admin-based user verification via CNIC and selfie
              matching ensures accountability and trust. Smart notifications
              prioritize the most relevant helpers based on history and
              proximity — transforming fragmented community goodwill into a
              structured, scalable, and dignified system.
            </p>
          </div>

          {/* Problem / Solution two-col */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-red-400 text-lg">⚠️</span> The Problem
              </h3>
              <ul className="space-y-2 text-[#94a3b8] text-sm">
                <li>
                  • No unified, verified platform for neighborhood-level help
                </li>
                <li>
                  • NGOs only cover large-scale disasters, not small local needs
                </li>
                <li>• No safe, private channel for vulnerable groups</li>
                <li>
                  • Help requests get lost in unstructured social media noise
                </li>
                <li>
                  • Blood/medical emergencies delayed by hours due to poor
                  coordination
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-emerald-400 text-lg">✅</span> The
                Solution
              </h3>
              <ul className="space-y-2 text-[#94a3b8] text-sm">
                <li>
                  • One platform: requests, offers, and alerts unified in a feed
                  + map
                </li>
                <li>
                  • Identity verification via CNIC + live selfie for real
                  accountability
                </li>
                <li>
                  • Women-Safe mode for private, gender-restricted requests
                </li>
                <li>
                  • Smart proximity notifications delivered to the most relevant
                  helpers
                </li>
                <li>
                  • Real-time chat opens automatically between accepted parties
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── FEATURES ────────────── */}
      <section id="features" className="relative z-10 py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Core Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Everything a community needs.
            </h2>
            <p className="text-[#64748b] mt-3 max-w-xl mx-auto text-sm">
              Designed for speed and trust — from emergencies to everyday tasks.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl border ${f.border} bg-gradient-to-b ${f.color} p-6 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200 group`}
              >
                <div
                  className={`${f.accent} mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">
                  {f.title}
                </h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Admin panel callout */}
          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">
                🖥️ Admin Control Panel
              </h3>
              <p className="text-[#94a3b8] text-sm leading-relaxed">
                A dedicated web panel for administrators to manage the entire
                platform — review CNIC verifications, moderate harmful content,
                monitor reports, track analytics, and manage all users,
                requests, offers, and alerts.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/login")}
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Open Admin Panel <Icon.ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ────────────── USE CASES ────────────── */}
      <section id="use-cases" className="relative z-10 py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Real Scenarios
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Built for real life.
            </h2>
            <p className="text-[#64748b] mt-3 max-w-xl mx-auto text-sm">
              From critical emergencies to quiet everyday moments — Sahaara is
              there.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {useCases.map((u, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200"
              >
                <div className="text-3xl mb-4">{u.emoji}</div>
                <h3 className="text-white font-semibold mb-2">{u.title}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  {u.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────── TECH STACK ────────────── */}
      <section className="relative z-10 py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Tech Stack
            </p>
            <h3 className="text-white font-bold text-xl mb-8">
              Built with modern, scalable technology.
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                {
                  label: "React Native",
                  color: "bg-sky-500/10 text-sky-300 border-sky-500/20",
                },
                {
                  label: "Expo",
                  color:
                    "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
                },
                {
                  label: "Node.js + Express",
                  color:
                    "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
                },
                {
                  label: "Supabase (PostgreSQL)",
                  color: "bg-green-500/10 text-green-300 border-green-500/20",
                },
                {
                  label: "Prisma ORM",
                  color: "bg-teal-500/10 text-teal-300 border-teal-500/20",
                },
                {
                  label: "WebSockets",
                  color: "bg-amber-500/10 text-amber-300 border-amber-500/20",
                },
                {
                  label: "Firebase FCM",
                  color:
                    "bg-orange-500/10 text-orange-300 border-orange-500/20",
                },
                {
                  label: "React.js Admin",
                  color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
                },
                {
                  label: "Resend Email API",
                  color: "bg-rose-500/10 text-rose-300 border-rose-500/20",
                },
              ].map((t, i) => (
                <span
                  key={i}
                  className={`px-4 py-1.5 rounded-full border text-xs font-medium ${t.color}`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── TEAM ────────────── */}
      <section id="team" className="relative z-10 py-24 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-3">
            The Team
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Built by students,
            <br />
            for communities.
          </h2>
          <p className="text-[#64748b] text-sm mb-12 max-w-xl mx-auto">
            Final Year Project — Bachelor of Software Engineering
            <br />
            FAST School of Computing, NUCES Karachi · Spring 2026
          </p>

          <div className="flex flex-wrap justify-center gap-5 mb-12">
            {team.map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-6 flex flex-col items-center gap-2 min-w-[180px] hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                  {m.name[0]}
                </div>
                <div className="text-white font-semibold text-sm">{m.name}</div>
                <div className="text-[#64748b] text-xs">{m.id}</div>
              </div>
            ))}
          </div>

          {/* Supervisor */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 max-w-sm mx-auto">
            <div className="text-[#64748b] text-xs mb-2 uppercase tracking-widest">
              Project Supervisor
            </div>
            <div className="text-white font-semibold">Mr. Ali Fatmi</div>
            <div className="text-[#64748b] text-xs mt-1">
              FAST School of Computing, NUCES
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── FOOTER CTA ────────────── */}
      <section className="relative z-10 py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-transparent p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-xl shadow-indigo-500/20 mx-auto mb-6">
              <img
                src="/icon.png"
                alt="Sahaara"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to manage the platform?
            </h2>
            <p className="text-[#94a3b8] text-sm mb-8 max-w-md mx-auto">
              Access the admin panel to review verifications, moderate content,
              and track community activity across the entire platform.
            </p>
            <button
              onClick={() => navigate("/admin/login")}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
            >
              Go to Admin Panel <Icon.ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ────────────── FOOTER ────────────── */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20">
              <img
                src="/icon.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-[#64748b]">
              Sahaara — FYP Spring 2026
            </span>
          </div>
          <p className="text-xs text-[#475569] text-center">
            FAST School of Computing · National University of Computer and
            Emerging Sciences, Karachi
          </p>
          <button
            onClick={() => navigate("/admin/login")}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Admin Panel →
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
