# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Server:**
```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run on web browser
```

**Code Quality:**
```bash
npm run lint       # Run ESLint
```

**Note:** No test suite is currently configured. When adding tests, consider using Jest with React Native Testing Library.

## Architecture Overview

This is a React Native application built with **Expo SDK 53** and **React 19** for plant operations management at Corplastik (plastic manufacturing). The app manages different production areas: containers, caps, straws, and mesh products.

### Navigation Structure
- **File-based routing** using Expo Router 5.1.0
- **Root layout**: Drawer navigation with custom profile header (`src/app/_layout.tsx`)
- **Nested tabs**: Tab navigation within drawer (`src/app/(tabs)/`)
- **Feature screens**: Each production area has dedicated screens (e.g., `area-envases.tsx`, `area-mallas.tsx`)

### Styling System
- **NativeWind 4.1.23**: Tailwind CSS for React Native
- **Custom components**: `AppText`, `Button`, `ButtonGrid` in `src/components/`
- **Utility function**: `cn()` in `src/utils/cn.ts` for class merging using clsx and tailwind-merge

### Key Configuration
- **TypeScript**: Strict mode enabled with path mapping (`@/*` → `src/*`)
- **Metro config**: Custom setup for NativeWind CSS processing
- **Babel**: Expo preset with NativeWind JSX integration
- **New Architecture**: Expo's new architecture enabled in app.json

### Project Structure
```
src/
├── app/           # File-based routes (Expo Router)
│   ├── (tabs)/    # Tab navigation screens
│   ├── _layout.tsx # Root drawer layout
│   └── [features] # Individual area management screens
├── components/    # Reusable UI components
└── utils/         # Utility functions
```

### Dependencies Note
- Uses both npm (package-lock.json) and bun (bun.lock) - stick to npm for consistency
- Spanish language interface targeting Spanish-speaking users
- No global state management - uses React built-in state (consider Zustand for complex state)
- No API layer detected - consider adding when implementing backend integration