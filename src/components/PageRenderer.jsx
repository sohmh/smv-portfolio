// PageRenderer.jsx
// Reads content.jsx data and renders two-panel layouts for each page.
// To add a new page: create a component below and add it to PAGE_MAP.

import { useEffect, useState } from 'react';
import BlogEntry      from './BlogEntry.jsx';
import VideoEntry     from './VideoEntry.jsx';
import GitHubActivity from './GitHubActivity.jsx';
import LeetCodeHeatmap from './LeetCodeHeatmap.jsx';

import {
  ABOUT, BLOG_POSTS,
  PROJECTS, UPDATES,
  VIDEOS, FEATURED_VIDEO,
  CREDENTIALS, CERTIFICATES,
  EVENTS, NOTES,
  CONTACT,
} from '../data/content.jsx';

// ── shared primitives ──────────────────────────────────────────────────────
function Panel({ title, children }) {
  return (
    <div className="panel">
      <div className="panel-title">{title}</div>
      {children}
    </div>
  );
}

function TagList({ tags }) {
  // Deduplicate
  const unique = [...new Set(tags)];
  return (
    <div className="taglist">
      {unique.map(t => <span key={t}>{t}</span>)}
    </div>
  );
}

// ── social links (used on Contact page) ────────────────────────────────────
function SocialLinks() {
  const { email, github, linkedin, twitter, medium, bereal, letterboxd, researchgate } = CONTACT;

  // Strip leading @ so the user can write "@handle" or "handle" in content.jsx
  const gh = github?.replace(/^@/, '') || '';
  const tw = twitter?.replace(/^@/, '') || '';

  const links = [
    {
      key: 'email',
      label: 'EMAIL',
      href: email ? `mailto:${email}` : null,
      display: email || '',
      show: !!email,
    },
    {
      key: 'github',
      label: 'GITHUB',
      href: gh ? `https://github.com/${gh}` : null,
      display: gh ? `@${gh} ↗` : '',
      show: !!gh,
    },
    {
      key: 'linkedin',
      label: 'LINKEDIN',
      href: linkedin ? `https://linkedin.com${linkedin}` : null,
      display: linkedin ? `${linkedin} ↗` : '',
      show: !!linkedin,
    },
    {
      key: 'twitter',
      label: 'TWITTER / X',
      href: tw ? `https://twitter.com/${tw}` : null,
      display: tw ? `@${tw} ↗` : '',
      show: !!tw,
    },
    {
      key: 'medium',
      label: 'MEDIUM',
      href: medium || null,
      display: medium ? 'Read articles ↗' : '',
      show: !!medium,
    },
    {
      key: 'bereal',
      label: 'BEREAL',
      href: null,
      display: bereal ? `@${bereal?.replace(/^@/, '')}` : '',
      show: !!bereal,
    },
    {
      key: 'letterboxd',
      label: 'LETTERBOXD',
      href: letterboxd ? `https://letterboxd.com/${letterboxd}` : null,
      display: letterboxd ? `${letterboxd} ↗` : '',
      show: !!letterboxd,
    },
    {
      key: 'researchgate',
      label: 'RESEARCHGATE',
      href: researchgate ? `https://www.researchgate.net/profile/${researchgate}` : null,
      display: researchgate ? `${researchgate} ↗` : '',
      show: !!researchgate,
    },
  ].filter(l => l.show);

  return (
    <div className="social-links">
      {links.map(({ key, label, href, display }) => (
        <div key={key} className="social-link-row">
          <span className="social-link-label">{label}</span>
          {href
            ? (
              <a
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="social-link-val social-link-val--link"
              >
                {display}
              </a>
            )
            : <span className="social-link-val">{display}</span>
          }
        </div>
      ))}
    </div>
  );
}

// ── page components ────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <>
      <Panel title="ABOUT ME">
        {ABOUT.body.map(({ title, text }) => (
          <div className="entry" key={title}>
            <div className="title">{title}</div>
            <div style={{ lineHeight: 1.75, whiteSpace: 'pre-line', fontSize: 12.5 }}>{text}</div>
          </div>
        ))}
      </Panel>
      <Panel title="UPDATES">
        {UPDATES.length === 0
          ? <div className="entry-excerpt">No updates yet — add entries to UPDATES in content.jsx.</div>
          : UPDATES.map(u => (
            <div className="entry" key={u.date + u.title}>
              <div className="meta">{u.date}</div>
              <div className="title">{u.title}</div>
              {u.text && (
                <div style={{ fontSize: 12, lineHeight: 1.65, marginTop: 4 }}>{u.text}</div>
              )}
            </div>
          ))
        }
      </Panel>
    </>
  );
}

// ── ProjectCard — expandable project entry ──────────────────────────────────
function ProjectCard({ p }) {
  const [open, setOpen] = useState(false);
  const hasDetails = p.details && p.details.trim().length > 0;

  return (
    <div className="entry">
      {/* Header: title + status badge */}
      <div className="project-header">
        <div className="title">{p.title}</div>
        {p.status && (
          <span className={`project-badge project-badge--${p.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {p.status}
          </span>
        )}
      </div>

      {/* Short description */}
      {p.description && (
        <div className="project-short-desc">{p.description}</div>
      )}

      {/* Tech tags */}
      {p.tech?.length > 0 && (
        <div className="taglist project-taglist">
          {p.tech.map(t => <span key={t}>{t}</span>)}
        </div>
      )}

      {/* Expand toggle — only renders when details text is present */}
      {hasDetails && (
        <button
          className="project-expand-btn"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          {open ? '▲ less' : '▼ details'}
        </button>
      )}

      {/* Extended description — shown only when open */}
      {hasDetails && open && (
        <div className="project-details">
          {p.details.trim().split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {/* GitHub / Live links */}
      {(p.github || p.link) && (
        <div className="project-links">
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="entry-btn">
              GitHub ↗
            </a>
          )}
          {p.link && (
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="entry-btn">
              Live ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectsPage() {
  return (
    <>
      <Panel title="PROJECTS">
        {PROJECTS.length === 0
          ? <div className="entry-excerpt">No projects yet — add entries to PROJECTS in content.jsx.</div>
          : PROJECTS.map(p => <ProjectCard key={p.id} p={p} />)
        }
      </Panel>
      <Panel title="SKILLS">
        <TagList tags={ABOUT.skills} />
      </Panel>
    </>
  );
}


function BlogPage() {
  return (
    <Panel title="BLOG POSTS">
      {BLOG_POSTS.map(post => (
        <BlogEntry key={post.id} post={post} />
      ))}
    </Panel>
  );
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xeajyggw';

function ContactPage() {
  const [formStatus, setFormStatus] = useState('idle');

  const submitMessage = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormStatus('sending');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Message delivery failed');
      form.reset();
      setFormStatus('success');
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <>
      <Panel title="SEND A MESSAGE">
        <form onSubmit={submitMessage}>
          <input className="form-honeypot" type="text" name="_gotcha" tabIndex="-1" autoComplete="off" aria-hidden="true" />
        <div className="field">
          <label>NAME</label>
          <input name="name" type="text" placeholder="Your name" required />
        </div>
        <div className="field">
          <label>EMAIL</label>
          <input name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="field">
          <label>MESSAGE</label>
          <textarea name="message" placeholder="What's on your mind?" required />
        </div>
        <button
          className="send-btn"
          type="submit"
          disabled={formStatus === 'sending'}
        >
          SEND ▶
        </button>
        {formStatus === 'success' && <div className="form-status form-status--success" role="status">Message sent. Thank you!</div>}
        {formStatus === 'error' && <div className="form-status form-status--error" role="alert">Could not send the message. Please try again.</div>}
        </form>
      </Panel>

      <Panel title="CONTACT INFO">
        <div className="kv" style={{ gridTemplateColumns: '80px 1fr', marginBottom: 14 }}>
          <div className="k">Location:</div>
          <div>{CONTACT.location}</div>
        </div>
        <SocialLinks />
      </Panel>
    </>
  );
}

function CredentialsPage() {
  return (
    <>
      {/* LEFT: Education + legacy cert entries */}
      <Panel title="EDUCATION & CREDENTIALS">
        {CREDENTIALS.education.map(e => (
          <div className="entry" key={e.title}>
            <div className="meta">{e.period}</div>
            <div className="title">{e.title}</div>
            {e.institution && <div className="entry-excerpt">{e.institution}</div>}
            {e.detail && <div style={{ fontSize: 12, lineHeight: 1.65, marginTop: 4 }}>{e.detail}</div>}
          </div>
        ))}
        {CREDENTIALS.certifications.map(c => (
          <div className="entry" key={c.title}>
            <div className="meta">{c.period}</div>
            <div className="title">{c.title}</div>
          </div>
        ))}
      </Panel>

      {/* RIGHT: Certificates with view/verify buttons */}
      <Panel title="CERTIFICATES">
        {CERTIFICATES.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.75 }}>
            No certificates added yet.<br />
            Drop files in <code style={{ fontSize: 11 }}>public/certificates/</code> and add entries
            to <code style={{ fontSize: 11 }}>CERTIFICATES</code> in content.jsx.
          </div>
        ) : (
          CERTIFICATES.map((cert, i) => (
            <div className="cert-card" key={i}>
              <div className="cert-title">{cert.title}</div>
              {(cert.issuer || cert.date) && (
                <div className="cert-meta">
                  {cert.issuer && <span>{cert.issuer}</span>}
                  {cert.issuer && cert.date && <span className="cert-sep">·</span>}
                  {cert.date && <span>{cert.date}</span>}
                </div>
              )}
              <div className="cert-actions">
                {cert.file && (
                  <a
                    href={`/certificates/${cert.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entry-btn"
                  >
                    View Certificate ↗
                  </a>
                )}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entry-btn cert-verify-btn"
                  >
                    Verify ↗
                  </a>
                )}
              </div>
            </div>
          ))
        )}
        <div className="cert-stack-sep" />
        <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '.4px', marginBottom: 6 }}>STACK</div>
        <TagList tags={CREDENTIALS.stack} />
      </Panel>
    </>
  );
}

function ActivityPage() {
  return (
    <>
      <Panel title="GITHUB ACTIVITY">
        <GitHubActivity username={CONTACT.github} />
      </Panel>
      <Panel title="LEETCODE">
        <LeetCodeHeatmap username={CONTACT.leetcode} />
      </Panel>
    </>
  );
}

function VideosPage() {
  return (
    <>
      <Panel title="VIDEOS">
        {VIDEOS.length > 0
          ? VIDEOS.map(v => <VideoEntry key={v.id} video={v} />)
          : <div className="entry-excerpt">No videos yet — add entries to VIDEOS in content.jsx.</div>
        }
      </Panel>
      <Panel title="FEATURED">
        {FEATURED_VIDEO?.youtubeId
          ? <VideoEntry video={{ ...FEATURED_VIDEO, id: 'featured', duration: '', views: '' }} featured />
          : <div className="entry-excerpt">{FEATURED_VIDEO?.description || 'Set FEATURED_VIDEO in content.jsx.'}</div>
        }
      </Panel>
    </>
  );
}

function EventGallery() {
  const photos = (EVENTS.gallery || []).filter(Boolean);
  const [activePhoto, setActivePhoto] = useState(0);
  const displayedPhoto = photos.length ? activePhoto % photos.length : 0;

  useEffect(() => {
    if (photos.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActivePhoto(current => (current + 1) % photos.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [photos.length]);

  if (photos.length === 0) {
    return <div className="gallery-empty">Add image filenames to <code>EVENTS.gallery</code>.</div>;
  }

  return (
    <div className="event-gallery">
      <img
        src={`/images/events/${photos[displayedPhoto]}`}
        alt={`Event gallery photo ${displayedPhoto + 1}`}
        className="event-gallery__image"
      />
      {photos.length > 1 && (
        <div className="event-gallery__status" aria-label={`Photo ${displayedPhoto + 1} of ${photos.length}`}>
          {photos.map((photo, index) => <span key={photo} className={index === displayedPhoto ? 'active' : ''} />)}
        </div>
      )}
    </div>
  );
}

function EventsPage() {
  return (
    <>
      <Panel title="UPCOMING & PAST EVENTS">
        {EVENTS.list.map(e => (
          <div className="entry" key={e.title}>
            <div className="meta">{e.date} · {e.location}</div>
            <div className="title">{e.title}</div>
            {e.detail && (
              <div style={{ fontSize: 12, lineHeight: 1.65, marginTop: 4 }}>{e.detail}</div>
            )}
            {/* Certificate / event link buttons — set `file` or `link` in EVENTS */}
            {(e.file || e.link) && (
              <div className="cert-actions">
                {e.file && (
                  <a
                    href={`/certificates/${e.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entry-btn"
                  >
                    View Certificate ↗
                  </a>
                )}
                {e.link && (
                  <a
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entry-btn cert-verify-btn"
                  >
                    View ↗
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </Panel>
      <Panel title="EVENT GALLERY">
        <EventGallery />
      </Panel>
    </>
  );
}

function NotesPage() {
  const allTags = [...new Set(NOTES.flatMap(n => n.tags || []))];
  return (
    <>
      <Panel title="NOTES">
        {NOTES.map(n => (
          <div className="entry" key={n.id || n.date + (n.text || n.link || '').slice(0, 12)}>
            <div className="meta">{n.date}</div>
            {n.text && <div>{n.text}</div>}
            {n.link && (
              <a href={n.link} target="_blank" rel="noopener noreferrer" className="entry-btn note-file-link">
                Open link
              </a>
            )}
            {n.tags?.length > 0 && (
              <div className="note-tags">
                {n.tags.map(t => <span key={t} className="blog-tag">{t}</span>)}
              </div>
            )}
          </div>
        ))}
      </Panel>
      <Panel title="TAGS">
        <TagList tags={allTags} />
      </Panel>
    </>
  );
}

// ── routing map ────────────────────────────────────────────────────────────
const PAGE_MAP = {
  about:       <AboutPage />,
  blog:        <BlogPage />,
  contact:     <ContactPage />,
  projects:    <ProjectsPage />,
  credentials: <CredentialsPage />,
  activity:    <ActivityPage />,
  videos:      <VideosPage />,
  events:      <EventsPage />,
  notes:       <NotesPage />,
};

export default function PageRenderer({ page }) {
  return (
    <div className="content-row">
      {PAGE_MAP[page] ?? (
        <Panel title="404">
          <div className="entry">Page not found.</div>
        </Panel>
      )}
    </div>
  );
}
