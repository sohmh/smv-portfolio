// BlogEntry.jsx
// Single blog post card. Supports full inline body text, a cover image,
// tags, likes/comments counts, and an optional "Read on Medium" button.

import { useState } from 'react';
import ImageBlock from './ImageBlock.jsx';

export default function BlogEntry({ post }) {
  const [expanded, setExpanded] = useState(false);

  const hasMedium = Boolean(post.mediumUrl);
  const hasBody   = Boolean(post.body && post.body.trim().length > 0);

  return (
    <article className="entry blog-entry" id={post.id}>
      {/* Cover image */}
      <ImageBlock src={post.image} alt={post.title} />

      {/* Meta row */}
      <div className="entry-meta-row">
        <span className="meta">{post.date}</span>
        {post.tags && post.tags.map(t => (
          <span key={t} className="blog-tag">{t}</span>
        ))}
      </div>

      {/* Title */}
      <div className="title">{post.title}</div>

      {/* Excerpt */}
      <div className="entry-excerpt">{post.excerpt}</div>

      {/* Expanded body — click to read inline */}
      {hasBody && expanded && (
        <div className="entry-body">
          {post.body.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {/* Footer: actions */}
      <div className="foot entry-foot">
        <span>♡ {post.likes} &nbsp;&nbsp; 💬 {post.comments}</span>
        <div className="entry-actions">
          {hasBody && (
            <button
              className="entry-btn"
              onClick={() => setExpanded(e => !e)}
            >
              {expanded ? '▲ Collapse' : '▼ Read here'}
            </button>
          )}
          {hasMedium && (
            <a
              className="entry-btn entry-btn--medium"
              href={post.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read on Medium ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
