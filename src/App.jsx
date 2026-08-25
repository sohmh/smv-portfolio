// App.jsx — Shell layout: titlebar, menubar, sidebar, main area, statusbar
// You should not need to edit this file for content changes.
// To add new nav items, add entries to NAV_TOP or NAV_SIDE below.

import { useState, useEffect, useRef } from 'react';
import PageRenderer from './components/PageRenderer.jsx';
import { PROFILE, STATS, SYSTEM_MESSAGE, STATUS_BAR } from './data/content.jsx';

// ── navigation config ──────────────────────────────────────────────────────
const NAV_TOP = [
  { id: 'about',   label: 'About'   },
  { id: 'blog',    label: 'Blog'    },
  { id: 'contact', label: 'Contact' },
];

const NAV_SIDE = [
  { id: 'projects',     icon: '◈', label: 'Projects'    },
  { id: 'credentials', icon: '◉', label: 'Credentials' },
  { id: 'activity',    icon: '●', label: 'Activity'    },
  { id: 'videos',      icon: '▶', label: 'Videos'     },
  { id: 'events',      icon: '◆', label: 'Events'     },
  { id: 'notes',       icon: '□', label: 'Notes'      },
];

// ── helpers ────────────────────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }

function useClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const date = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
      setTime(`${date}  ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useUptime() {
  const [start] = useState(Date.now);
  const [uptime, setUptime] = useState('00:00:00');
  useEffect(() => {
    const tick = () => {
      const s = Math.floor((Date.now() - start) / 1000);
      setUptime(`${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`);
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [start]);
  return uptime;
}

const THEMES = ['light', 'dark', 'sepia'];

// ── sub-components ─────────────────────────────────────────────────────────
function Titlebar({ clock }) {
  return (
    <div className="titlebar">
      <div className="left">
        smv portfolio : ver.25.12.06
      </div>
      <div className="right" id="clock">{clock}</div>
    </div>
  );
}

function Menubar({ page, setPage, theme, setTheme }) {
  return (
    <div className="menubar">
      <nav className="menu-items" aria-label="Top navigation">
        {NAV_TOP.map(({ id, label }) => (
          <button
            key={id}
            id={`nav-top-${id}`}
            data-page={id}
            className={page === id ? 'active' : ''}
            onClick={() => setPage(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="theme-toggle" role="group" aria-label="Theme selector">
        {THEMES.map(t => (
          <button
            key={t}
            id={`theme-${t}`}
            className={`theme-dot theme-dot--${t}${theme === t ? ' active' : ''}`}
            onClick={() => setTheme(t)}
            title={t.charAt(0).toUpperCase() + t.slice(1)}
            aria-label={`${t} theme`}
          />
        ))}
      </div>
    </div>
  );
}

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar" aria-label="Side navigation">
      <div className="brand">
        <div className="glyph">&#9635;</div>
        <div className="name">TERMINAL</div>
      </div>
      <nav className="nav">
        {NAV_SIDE.map(({ id, icon, label }) => (
          <button
            key={id}
            id={`nav-side-${id}`}
            data-page={id}
            className={page === id ? 'active' : ''}
            onClick={() => setPage(id)}
          >
            <span className="tag">{icon}</span> {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function ProfilePanel() {
  return (
    <div className="profile-row">
      {/* Left: user profile */}
      <div className="panel">
        <div className="panel-title">USER PROFILE</div>
        <div className="profile-inner">
          {/* Avatar — image or ASCII art */}
          <div className="avatar" tabIndex={PROFILE.avatarImage && PROFILE.asciiImage ? 0 : undefined}>
            {PROFILE.avatarImage ? (
              <>
                <img src={PROFILE.avatarImage} alt={PROFILE.name} className="avatar-img avatar-img--normal" />
                {PROFILE.asciiImage && (
                  <img src={PROFILE.asciiImage} alt={`${PROFILE.name} ASCII portrait`} className="avatar-img avatar-img--ascii" />
                )}
              </>
            ) : <pre>{PROFILE.asciiArt}</pre>}
          </div>
          <div className="profile-details">
            <h1>
              {PROFILE.name}
              <span className="status-badge">ONLINE</span>
            </h1>
            <div className="quote">&ldquo;{PROFILE.quote}&rdquo;</div>
            <div className="kv">
              <div className="k">User ID:</div>   <div>{PROFILE.userId}</div>
              <div className="k">Role:</div>       <div>{PROFILE.role}</div>
              <div className="k">Location:</div>  <div>{PROFILE.location}</div>
              <div className="k">Domain:</div>    <div>{PROFILE.domain}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: stats */}
      <div className="panel">
        <div className="panel-title">STATS</div>
        <div className="stats-list">
          {STATS.map(({ label, value }) => (
            <div key={label}>
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SysMsg() {
  return (
    <div className="sysmsg">
      <div className="head">SYSTEM MESSAGE</div>
      <div className="msg">{SYSTEM_MESSAGE}</div>
    </div>
  );
}

function Statusbar({ uptime }) {
  return (
    <div className="statusbar">
      <div>{STATUS_BAR.left}</div>
      <div>UPTIME: {uptime}</div>
      <div>VISITORS TODAY: {STATUS_BAR.visitorsToday}</div>
    </div>
  );
}

// ── root App ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]   = useState('about');
  const [displayedPage, setDisplayedPage] = useState('about');
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderLeaving, setIsLoaderLeaving] = useState(false);
  const pageTransitionTimer = useRef(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('smv-theme') || 'light');
  const clock  = useClock();
  const uptime = useUptime();

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smv-theme', theme);
  }, [theme]);

  useEffect(() => () => window.clearTimeout(pageTransitionTimer.current), []);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setIsLoaderLeaving(true), 1600);
    const removeTimer = window.setTimeout(() => setIsLoading(false), 1950);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  const navigateTo = (nextPage) => {
    if (nextPage === page) return;

    window.clearTimeout(pageTransitionTimer.current);
    setPage(nextPage);
    setIsPageTransitioning(true);

    pageTransitionTimer.current = window.setTimeout(() => {
      setDisplayedPage(nextPage);
      window.requestAnimationFrame(() => setIsPageTransitioning(false));
    }, 160);
  };

  return (
    <div className="monitor">
      {isLoading && (
        <div className={`loading-screen${isLoaderLeaving ? ' loading-screen--leaving' : ''}`} role="status" aria-label="Loading portfolio">
          <div className="loading-screen__content">
            <div className="loading-screen__label">BOOTING PORTFOLIO</div>
            <div className="loading-screen__logo" aria-label="S M V">
              <pre className="loading-screen__glyph loading-screen__glyph--s">{` █████
█
 ████
     █
█████`}</pre>
              <pre className="loading-screen__glyph loading-screen__glyph--m">{`█   █
██ ██
█ █ █
█   █
█   █`}</pre>
              <pre className="loading-screen__glyph loading-screen__glyph--v">{`█   █
█   █
 █ █
 █ █
  █`}</pre>
            </div>
            <div className="loading-screen__prompt">&gt; INITIALIZING<span className="loading-screen__cursor">_</span></div>
          </div>
        </div>
      )}
      <div className="screen">
        <Titlebar clock={clock} />
        <Menubar page={page} setPage={navigateTo} theme={theme} setTheme={setTheme} />

        <div className="body-grid">
          <Sidebar page={page} setPage={navigateTo} />

          <main className="main">
            <ProfilePanel />
            <div className={`page-transition${isPageTransitioning ? ' page-transition--leaving' : ''}`}>
              <PageRenderer page={displayedPage} />
            </div>
            <SysMsg />
          </main>
        </div>

        <Statusbar uptime={uptime} />
      </div>
    </div>
  );
}
