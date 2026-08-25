# SMV Portfolio

Personal portfolio website built with React and Vite.

## Requirements

- Node.js 20 or newer
- npm (installed with Node.js)

Check your installed versions:

```bash
node --version
npm --version
```

## Install dependencies

From the project folder, install the packages required by the site:

```bash
npm install
```

## Run locally

Start the development server with hot reload:

```bash
npm run dev
```

Vite will print a local URL, normally `http://localhost:5173/`.

To make the server accessible through your local network, use:

```bash
npm run dev -- --host 0.0.0.0
```

On Windows systems where PowerShell blocks `npm.ps1`, use `npm.cmd` instead:

```powershell
npm.cmd install
npm.cmd run dev
```

## Check code quality

Run the linter before building or deploying:

```bash
npm run lint
```

## Create a production build

Generate the optimized production files:

```bash
npm run build
```

The deployable site is created in the `dist/` folder.

## Preview the production build

Serve the files from `dist/` locally to verify the production version:

```bash
npm run preview
```

## Recommended release checklist

```bash
npm install
npm run lint
npm run build
npm run preview
```

Open the preview URL printed by Vite and verify the main pages, mobile layout,
links, certificates, and event gallery before deployment.

## Content updates

Most portfolio content is managed in `src/data/content.jsx`.

- Certificates: add files to `public/certificates/`, then reference the filename in the relevant `file` field.
- Event photos: add files to `public/images/events/`, then list the filenames in `EVENTS.gallery`.
- Profile images: add normal and ASCII images to `public/images/profile/`, then configure `avatarImage` and `asciiImage`.
- Notes: add an external URL to a note's `link` field to show an **Open link** button.
