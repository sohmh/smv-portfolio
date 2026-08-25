# Certificates Folder

Drop certificate files here (PDF, PNG, JPG, or WebP).

## Add a certificate to an event

In `src/data/content.jsx`, add the filename to an entry under `EVENTS.list`.
Use only the filename; do not include `/certificates/`.

```js
{
  date: "2026-08-25",
  location: "Pune, India",
  title: "My Event",
  detail: "Short optional description.",
  file: "my-event-certificate.pdf",
  link: "https://verify.example.com/abc123", // optional external URL
}
```

- `file` opens as `/certificates/filename.pdf` from the Events page.
- `link` is an optional external event or verification URL.
- If both are set, the event shows both buttons.

## Supported formats

- `.pdf` opens in the browser PDF viewer.
- `.png`, `.jpg`, and `.webp` open as images.
