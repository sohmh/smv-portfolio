// YoutubeEmbed.jsx
// Renders a responsive YouTube iframe embed.
// Accepts either a full YouTube URL or just the video ID.
//
// Usage:
//   <YoutubeEmbed videoId="dQw4w9WgXcQ" />
//   <YoutubeEmbed videoId="https://youtu.be/dQw4w9WgXcQ" />
//   <YoutubeEmbed videoId="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

function extractId(input) {
  if (!input) return '';
  // youtu.be/ID
  const short = input.match(/youtu\.be\/([a-zA-Z0-9_-]{4,20})/);
  if (short) return short[1];
  // youtube.com/watch?v=ID or &v=ID
  const watch = input.match(/[?&]v=([a-zA-Z0-9_-]{4,20})/);
  if (watch) return watch[1];
  // youtube.com/embed/ID
  const embed = input.match(/embed\/([a-zA-Z0-9_-]{4,20})/);
  if (embed) return embed[1];
  // Assume it's already a raw ID if no slashes or query chars
  if (!input.includes('/') && !input.includes('?') && !input.includes('&')) return input;
  return '';
}

export default function YoutubeEmbed({ videoId }) {
  const id = extractId(videoId);
  if (!id) return null;

  return (
    <div className="yt-wrapper">
      <iframe
        className="yt-iframe"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
