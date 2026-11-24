# Electron Vite Starter

A minimal foundation for building Electron applications with React, TypeScript, and Vite.

The project uses Electron directly, with Vite configs and scripts in the repository for development and builds.

This starter provides the application infrastructure. It does not prescribe routing, state management, databases, authentication, telemetry, or product architecture.

## Architecture

Electron's process boundaries are kept explicit:

- `src/main` owns application lifecycle, windows, IPC handlers, and privileged operations.
- `src/preload` exposes a narrow API to the renderer through `contextBridge`.
- `src/renderer` contains the React/Vite app.
- `src/shared` contains IPC contracts and types shared across processes.

Each process has a separate Vite configuration:

- `vite.config.ts` builds the React renderer.
- `vite.main.config.ts` builds the Electron main process.
- `vite.preload.config.ts` builds the preload script.

Build output is written to `dist/`:

```text
dist/
├── main/
├── preload/
└── renderer/
```

Source is organized like this:

```text
src/
├── main/
│   └── index.ts
├── preload/
│   ├── index.d.ts
│   └── index.ts
├── renderer/
│   ├── index.html
│   ├── public/
│   └── src/
└── shared/
    └── ipc.ts
```

## Requirements

- Node.js `>=22.18.0`
- npm

## Getting started

Install dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm run dev
```

This starts the Vite renderer server, watches the main and preload processes, and launches Electron. Renderer changes use HMR. Main-process changes restart Electron, while preload changes reload the renderer. Stopping the command also stops its child processes.

## Commands

```bash
npm run dev               # Start the complete development environment
npm run dev:renderer      # Start only the renderer in a browser
npm run typecheck         # Check TypeScript
npm run lint              # Check code with Oxlint
npm run lint:fix          # Apply safe Oxlint fixes
npm run format            # Format files with Oxfmt
npm run format:check      # Check formatting without changing files
npm run fix               # Apply safe lint fixes and format files
npm run build             # Build main, preload, and renderer
npm start                 # Run Electron from an existing production build
npm run package           # Build and create an unpacked application
npm run make              # Build and create platform distributables
```

Oxlint uses its built-in defaults. Extend `oxlint.config.ts` as project requirements evolve. Oxfmt uses the starter author's preferred defaults in `oxfmt.config.ts`; adapt them to the project's conventions when needed.

## Packaging

Electron Builder packages the Vite build using `electron-builder.ts` and writes its output to `out/`.

The configured targets produce:

- Windows: NSIS installer
- macOS: ZIP and DMG
- Linux: deb and RPM packages

Create distributables for the current platform:

```bash
npm run make
```

Create macOS distributables explicitly:

```bash
npm run make -- --mac
```

Some distributables require platform-specific tools and should be built on their target operating system. macOS packages use ad hoc signing. Notarization and publishing are disabled.

## Security baseline

The current setup includes:

- renderer sandboxing
- context isolation
- disabled Node.js integration in the renderer
- a narrow, typed `contextBridge` API
- IPC sender and argument validation
- navigation and new-window restrictions
- a renderer Content Security Policy
- a custom production protocol instead of `file://`
- ASAR packaging
- restrictive Electron fuses for packaged applications

The renderer does not receive direct access to `ipcRenderer`, Node.js, the filesystem, or other privileged Electron APIs. Add new capabilities through a typed preload API and validate every request in the main process.

## Key decisions

### Use Electron directly

Electron-specific Vite wrappers reduce setup work, but they also own important parts of the development and build workflow. This starter keeps those parts as ordinary scripts and Vite configuration files that can be read, changed, and debugged directly.

### Use Vite for all compilation

Vite builds the renderer, main process, and preload script through separate configurations. The separation keeps their targets and module formats clear without adding another compiler such as esbuild.

### Own development orchestration

`scripts/dev.mjs` coordinates Vite, Electron, rebuilds, restarts, and shutdown. The renderer still uses the normal `vite.config.ts`, with its app root set to `src/renderer`.

### Keep Electron Builder focused on distribution

Electron Builder handles packaging, installers, and Electron fuses. The existing Vite scripts handle development and compilation.

### Keep IPC narrow and typed

IPC channel names, arguments, results, and the renderer-facing API are defined centrally. The included `ping` method is a small example of the pattern new application APIs should follow.

### Leave product choices to the application

The starter deliberately excludes application-level libraries and architecture. Separate variants can add tools such as Drizzle without making them requirements for every Electron application.

### Keep React Compiler optional

React Compiler is not enabled by default. Applications can add it when its optimization benefits justify the additional compilation work.
