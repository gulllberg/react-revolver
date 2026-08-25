# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-08-25

A full rebuild of the package's tooling. The `ReactRevolver` component's behaviour, props, and ref methods (`goToIndex`, `next`, `previous`) are unchanged.

### Added
- Broader React compatibility: `peerDependencies` now accepts `^17.0.0 || ^18.0.0 || ^19.0.0`.
- TypeScript source (`src/index.tsx`) with a published `dist/index.d.ts`.
- Dual-module output: an ES Module build (`dist/react-revolver.js`) alongside the CommonJS build, wired up via a proper `"exports"` map so both `import` and `require()` consumers resolve correctly.
- `bullets` and `numberOfColumns` prop changes are now picked up after the initial mount — bullet content updates live automatically, and structural changes (bullet count or column count) recompute the Revolver's internal geometry without requiring a `key`-based remount.
- New `hideArrows` and `hideBalls` optional boolean props (default `false`) to independently hide the previous/next arrow buttons and/or the footer ball pagination indicators.
- New `startingIndex` optional prop (default `0`) to initialise the Revolver at a specific bullet index; out-of-range values are clamped to the nearest valid index.

### Breaking
- **CSS import path changed**: `react-revolver/dist/index.css` → `react-revolver/style.css`.
- **`package.json` now declares an `"exports"` map**.

### Upgrading from 1.x

For the typical usage shown in the [README](README.md):

```diff
 import React from 'react';
 import ReactRevolver, { arrowOverhangModes } from 'react-revolver';
-import 'react-revolver/dist/index.css';
+import 'react-revolver/style.css';
```

## [1.0.0] - 2021-03-14

Initial release
