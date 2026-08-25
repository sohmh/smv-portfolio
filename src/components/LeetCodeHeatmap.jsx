// LeetCodeHeatmap.jsx
// Fetches submission calendar and stats from the alfa-leetcode-api proxy
// and renders a GitHub-style heatmap + solved counts.
//
// API used: https://alfa-leetcode-api.onrender.com (free, CORS-enabled proxy)
// Note: This is a community-maintained proxy. If unavailable, the component
// shows a graceful error message.

import { useState, useEffect } from 'react';

const WEEKS = 15;

export default function LeetCodeHeatmap({ username }) {
  const [stats,    setStats]    = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [status,   setStatus]   = useState('loading');

  useEffect(() => {
    if (!username) return;
    const base = 'https://alfa-leetcode-api.onrender.com';

    Promise.all([
      fetch(`${base}/${username}`).then(r => r.json()),
      fetch(`${base}/${username}/calendar`).then(r => r.json()),
    ])
      .then(([st, cal]) => {
        if (st.errors || st.message) { setStatus('error'); return; }
        setStats(st);
        setCalendar(cal);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, [username]);

  if (status === 'loading') {
    return <div className="gh-status">FETCHING LEETCODE DATA…</div>;
  }
  if (status === 'error' || !calendar) {
    return (
      <div className="gh-status gh-status--err">
        Could not load LeetCode data for &quot;{username}&quot;.
        Check the username in content.jsx → CONTACT.leetcode.
      </div>
    );
  }

  // ── parse submission calendar ────────────────────────────────────────────
  let subs = {};
  try {
    const raw = calendar.submissionCalendar ?? calendar.submission_calendar ?? '{}';
    subs = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return <div className="gh-status gh-status--err">Could not parse LeetCode calendar.</div>;
  }

  // ── build heatmap cells ──────────────────────────────────────────────────
  const today    = new Date();
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - (WEEKS * 7 - 1));

  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    // LeetCode stores timestamps as Unix seconds at UTC midnight
    const utcTs = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000);
    const count  = Number(subs[String(utcTs)] || 0);
    return { date: d.toISOString().slice(0, 10), count };
  });

  const totalInPeriod = cells.reduce((a, c) => a + c.count, 0);
  const maxCount      = Math.max(...cells.map(c => c.count), 1);
  const intensity     = count =>
    count === 0 ? 0 : Math.ceil((count / maxCount) * 4);

  return (
    <div className="lc-section">
      {/* Solved stats */}
      {stats && (
        <div className="lc-stats">
          <div className="lc-stat">
            <span className="lc-stat-val">{stats.totalSolved ?? '—'}</span>
            <span className="lc-stat-label">Solved</span>
          </div>
          <div className="lc-stat lc-stat--easy">
            <span className="lc-stat-val">{stats.easySolved ?? '—'}</span>
            <span className="lc-stat-label">Easy</span>
          </div>
          <div className="lc-stat lc-stat--med">
            <span className="lc-stat-val">{stats.mediumSolved ?? '—'}</span>
            <span className="lc-stat-label">Medium</span>
          </div>
          <div className="lc-stat lc-stat--hard">
            <span className="lc-stat-val">{stats.hardSolved ?? '—'}</span>
            <span className="lc-stat-label">Hard</span>
          </div>
          <div className="lc-stat">
            <span className="lc-stat-val">{stats.ranking ? `#${stats.ranking.toLocaleString()}` : '—'}</span>
            <span className="lc-stat-label">Rank</span>
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div className="heatmap-section" style={{ marginTop: 10 }}>
        <div className="heatmap-label">
          Submissions &mdash; last {WEEKS} weeks &middot; {totalInPeriod} in period
        </div>
        <div className="heatmap-grid">
          {Array.from({ length: WEEKS }, (_, wi) => (
            <div key={wi} className="heatmap-week">
              {cells.slice(wi * 7, wi * 7 + 7).map(cell => (
                <div
                  key={cell.date}
                  className={`heatmap-cell lc-cell--${intensity(cell.count)}`}
                  title={`${cell.date}: ${cell.count} submission${cell.count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
