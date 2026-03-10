# BackgroundZero

A desktop app for removing image backgrounds. Drop in an image, preview the result side-by-side, and save the processed PNG — all from a clean, minimal interface.

Built with Electron, React, TypeScript, and Tailwind CSS. Uses the [remove.bg](https://www.remove.bg/) API for background removal.

## Features

- **Drag-and-drop or file picker** — supports PNG, JPG, and WebP (up to 12MB)
- **Side-by-side preview** — compare original and processed images before saving
- **Transparent background** — processed images use a checkerboard preview to show transparency
- **Native save dialog** — export the result as a PNG anywhere on your filesystem
- **Secure by design** — API key is encrypted at rest and never exposed to the renderer process
- **Credits tracker** — shows remaining remove.bg API credits after each processing

## Prerequisites

- **Node.js 22+** (a `.nvmrc` is included)
- **remove.bg API key** — sign up for free at [remove.bg/api](https://www.remove.bg/api). The free tier includes 50 image processing calls per month.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/ijshd7/backgroundzero.git
cd backgroundzero

# Use the correct Node version
nvm use

# Install dependencies
npm install

# Start the app in development mode
npm run dev
```

On first launch, the app will prompt you to enter your remove.bg API key. You can also update it later via the settings gear icon in the top-right corner.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the app in development mode with hot reload |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build |
| `npm run package` | Build and package the app for distribution |
| `npm run lint` | Type-check the project with TypeScript |

## Project Structure

```
src/
├── main/
│   ├── index.ts            # Electron main process, window creation, IPC handlers
│   └── removeBg.ts         # remove.bg API integration
├── preload/
│   └── index.ts            # Context bridge exposing IPC methods to the renderer
└── renderer/
    ├── index.html
    └── src/
        ├── main.tsx         # React entry point
        ├── App.tsx          # Root component, state orchestration
        ├── index.css        # Tailwind imports and custom styles
        ├── components/
        │   ├── DropZone.tsx       # Drag-and-drop image upload area
        │   ├── ImagePreview.tsx   # Side-by-side original vs processed view
        │   ├── SettingsModal.tsx  # API key configuration modal
        │   └── StatusBar.tsx      # Processing status and error display
        ├── hooks/
        │   └── useImageProcessor.ts  # Image processing state machine
        └── lib/
            └── ipc.ts       # Typed wrapper for the Electron IPC API
```

## How It Works

1. You drop an image onto the app (or click to browse)
2. The renderer reads the file as base64 and sends it to the main process via IPC
3. The main process calls the remove.bg API with your encrypted API key
4. The processed image (transparent PNG) is returned to the renderer as base64
5. Both images are displayed side-by-side for preview
6. Click "Save PNG" to write the result to disk via a native save dialog

All API communication happens in the main process. The renderer is sandboxed with `contextIsolation` enabled and `nodeIntegration` disabled.

## License

[MIT](LICENSE)
