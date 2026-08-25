// GitHubActivity.jsx
// Uses GitHub Search API for commits, PRs, and issues — accurate counts
// including private commits authored by the user (in public repo visibility).
// Three sub-tabs: COMMITS · PULL REQUESTS · ISSUES

import { useState, useEffect } from 'react';

// ── helpers ────────────────────────────────────────────────────────────────
const stripAt = s => s?.replace(/^@/, '') || '';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: '2-digit', day: '2-digit', year: '2-digit',
  });
}

function repoLabel(htmlUrl, username) {
  try {
    const [owner, repo] = htmlUrl.replace('https://github.com/', '').split('/');
    return owner.toLowerCase() === username.toLowerCase() ? repo : `${owner}/${repo}`;
  } catch { return '?'; }
}

// ── shared row (commit / PR / Issue) ──────────────────────────────────────
function ItemRow({ href, date, repo, title }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="gh-pr-row">
      <span className="gh-pr-date">{date}</span>
      <span className="gh-pr-repo">{repo}</span>
      <span className="gh-pr-title">{title}</span>
      <span className="gh-pr-arrow">↗</span>
    </a>
  );
}

function SubHeader({ label }) {
  return <div className="gh-sub-section">{label}</div>;
}

function Empty({ msg = 'Nothing to show.' }) {
  return <div className="gh-empty">{msg}</div>;
}

// ── COMMITS TAB ────────────────────────────────────────────────────────────
// Uses search/commits API — returns all public-repo commits by the author.
function CommitsTab({ commits, totalCommits, username }) {
  if (!commits.length) {
    return (
      <Empty msg="No public commits found. Private repo commits aren't accessible without auth." />
    );
  }
  return (
    <div className="gh-list">
      {commits.map(c => {
        const repo  = repoLabel(c.html_url, username);
        const msg   = c.commit.message.split('\n')[0];
        const date  = fmtDate(c.commit.author?.date || c.commit.committer?.date);
        const short = msg.length > 90 ? msg.slice(0, 90) + '…' : msg;
        return (
          <ItemRow
            key={c.sha}
            href={c.html_url}
            date={date}
            repo={repo}
            title={short}
          />
        );
      })}
      <div className="gh-list-note">
        Showing {commits.length} of {totalCommits} commits in public repos (newest first).
      </div>
    </div>
  );
}

// ── PULL REQUESTS TAB ──────────────────────────────────────────────────────
function PRsTab({ mergedPRs, openPRs, mergedTotal, openTotal, username }) {
  return (
    <div>
      <SubHeader label={`MERGED  (${mergedTotal})`} />
      {!mergedPRs.length
        ? <Empty msg="No merged PRs found." />
        : (
          <div className="gh-pr-list">
            {mergedPRs.map(pr => (
              <ItemRow
                key={pr.id}
                href={pr.html_url}
                date={fmtDate(pr.pull_request?.merged_at || pr.closed_at)}
                repo={repoLabel(pr.html_url, username)}
                title={pr.title}
              />
            ))}
          </div>
        )
      }
      <SubHeader label={`OPEN  (${openTotal})`} />
      {!openPRs.length
        ? <Empty msg="No open PRs." />
        : (
          <div className="gh-pr-list">
            {openPRs.map(pr => (
              <ItemRow
                key={pr.id}
                href={pr.html_url}
                date={fmtDate(pr.created_at)}
                repo={repoLabel(pr.html_url, username)}
                title={pr.title}
              />
            ))}
          </div>
        )
      }
    </div>
  );
}

// ── ISSUES TAB ─────────────────────────────────────────────────────────────
function IssuesTab({ issues, issuesTotal, username }) {
  const open   = issues.filter(i => i.state === 'open');
  const closed = issues.filter(i => i.state === 'closed');
  return (
    <div>
      <SubHeader label={`OPEN  (${open.length})`} />
      {!open.length
        ? <Empty msg="No open issues found." />
        : (
          <div className="gh-pr-list">
            {open.map(issue => (
              <ItemRow
                key={issue.id}
                href={issue.html_url}
                date={fmtDate(issue.created_at)}
                repo={repoLabel(issue.html_url, username)}
                title={issue.title}
              />
            ))}
          </div>
        )
      }
      <SubHeader label={`CLOSED  (${closed.length})`} />
      {!closed.length
        ? <Empty msg="No recently closed issues." />
        : (
          <div className="gh-pr-list">
            {closed.map(issue => (
              <ItemRow
                key={issue.id}
                href={issue.html_url}
                date={fmtDate(issue.closed_at || issue.updated_at)}
                repo={repoLabel(issue.html_url, username)}
                title={issue.title}
              />
            ))}
          </div>
        )
      }
      <div className="gh-list-note">Showing recent {issues.length} of {issuesTotal} total issues.</div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
const BASE = 'https://api.github.com';

export default function GitHubActivity({ username: raw }) {
  const username = stripAt(raw);

  const [data,   setData]   = useState(null);
  const [status, setStatus] = useState('loading');
  const [tab,    setTab]    = useState('commits');

  useEffect(() => {
    if (!username) return;

    Promise.all([
      // Profile
      fetch(`${BASE}/users/${username}`).then(r => r.json()),
      // Repos → total stars
      fetch(`${BASE}/users/${username}/repos?per_page=100&sort=updated`).then(r => r.json()),
      // Commits via search API — far more reliable than events API
      // The Accept header ensures the commits search endpoint responds properly
      fetch(
        `${BASE}/search/commits?q=author:${username}&sort=author-date&order=desc&per_page=100`,
        { headers: { 'Accept': 'application/vnd.github.cloak-preview+json' } }
      ).then(r => r.json()).catch(() => ({ items: [], total_count: 0 })),
      // Merged PRs
      fetch(`${BASE}/search/issues?q=author:${username}+type:pr+is:merged&sort=created&order=desc&per_page=50`)
        .then(r => r.json()).catch(() => ({ items: [], total_count: 0 })),
      // Open PRs
      fetch(`${BASE}/search/issues?q=author:${username}+type:pr+is:open&sort=created&order=desc&per_page=20`)
        .then(r => r.json()).catch(() => ({ items: [], total_count: 0 })),
      // Issues
      fetch(`${BASE}/search/issues?q=author:${username}+type:issue&sort=updated&order=desc&per_page=40`)
        .then(r => r.json()).catch(() => ({ items: [], total_count: 0 })),
    ])
      .then(([prof, rps, commitData, merged, openPRs, issues]) => {
        if (prof.message) { setStatus('error'); return; }
        setData({
          profile:       prof,
          totalStars:    (Array.isArray(rps) ? rps : []).reduce((a, r) => a + r.stargazers_count, 0),
          commits:       commitData.items       || [],
          commitTotal:   commitData.total_count || 0,
          mergedPRs:     merged.items           || [],
          mergedTotal:   merged.total_count     || 0,
          openPRs:       openPRs.items          || [],
          openTotal:     openPRs.total_count    || 0,
          issues:        issues.items           || [],
          issuesTotal:   issues.total_count     || 0,
        });
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, [username]);

  if (status === 'loading') return <div className="gh-status">FETCHING GITHUB DATA…</div>;
  if (status === 'error' || !data) {
    return (
      <div className="gh-status gh-status--err">
        Could not load GitHub data for &quot;{username}&quot;. Check CONTACT.github in content.jsx.
      </div>
    );
  }

  const {
    profile, totalStars, commits, commitTotal,
    mergedPRs, mergedTotal, openPRs, openTotal, issues, issuesTotal,
  } = data;

  const TABS = [
    { id: 'commits', label: `COMMITS (${commitTotal})` },
    { id: 'prs',     label: `PULL REQUESTS (${mergedTotal + openTotal})` },
    { id: 'issues',  label: `ISSUES (${issuesTotal})` },
  ];

  return (
    <div className="gh-activity">
      {/* Stats row */}
      <div className="gh-stats">
        {[
          { label: 'Repos',      val: profile.public_repos },
          { label: 'Stars',      val: totalStars           },
          { label: 'Commits',    val: commitTotal          },
          { label: 'PRs Merged', val: mergedTotal          },
          { label: 'PRs Open',   val: openTotal            },
          { label: 'Issues',     val: issuesTotal          },
          { label: 'Followers',  val: profile.followers    },
        ].map(({ label, val }) => (
          <div key={label} className="gh-stat">
            <span className="gh-stat-val">{val}</span>
            <span className="gh-stat-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Sub-tab navigation */}
      <div className="gh-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`gh-tab-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="gh-tab-content">
        {tab === 'commits' && (
          <CommitsTab commits={commits} totalCommits={commitTotal} username={username} />
        )}
        {tab === 'prs' && (
          <PRsTab
            mergedPRs={mergedPRs} openPRs={openPRs}
            mergedTotal={mergedTotal} openTotal={openTotal}
            username={username}
          />
        )}
        {tab === 'issues' && (
          <IssuesTab issues={issues} issuesTotal={issuesTotal} username={username} />
        )}
      </div>
    </div>
  );
}
