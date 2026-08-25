// VideoEntry.jsx
// A video list item with a click-to-expand YouTube embed.

import { useState } from 'react';
import YoutubeEmbed from './YoutubeEmbed.jsx';

export default function VideoEntry({ video, featured = false }) {
  const [open, setOpen] = useState(false);
  const hasEmbed = Boolean(video.youtubeId);

  return (
    <div className={`video-entry${featured ? ' video-entry--featured' : ''}`} id={video.id}>
      <div
        className={`list-item${hasEmbed ? ' list-item--clickable' : ''}`}
        onClick={() => hasEmbed && setOpen(o => !o)}
        title={hasEmbed ? (open ? 'Collapse' : 'Click to watch') : ''}
      >
        <span className="video-title">
          {hasEmbed && (
            <span className="play-icon">{open ? '▼' : '▶'}</span>
          )}
          {video.title}
        </span>
        <span className="r">
          {video.duration} · {video.views} views
        </span>
      </div>

      {open && hasEmbed && (
        <div className="yt-container">
          <YoutubeEmbed videoId={video.youtubeId} />
        </div>
      )}
    </div>
  );
}
