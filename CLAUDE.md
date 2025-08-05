# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start Development Server:**
```bash
cd expo-starter
bun start          # Start Expo development server
bun run android    # Run on Android device/emulator
bun run ios        # Run on iOS device/simulator
bun run web        # Run on web browser
```

**Code Quality:**
```bash
cd expo-starter
bun run lint       # Run ESLint with Prettier integration
```

**Build Commands:**
```bash
cd expo-starter
bun run build:android  # Build Android APK using EAS
```

**Note:** No test suite is currently configured. When adding tests, consider using Jest with React Native Testing Library.

## Architecture Overview

This is a React Native application built with **Expo SDK 53** and **React 19** for plant operations management at Corplastik (plastic manufacturing). The app manages different production areas: containers (envases), mesh products (mallas), straws (pitillos), and provides production reporting capabilities.

### Project Structure
```
expo-starter/
├── src/
│   ├── app/           # File-based routes (Expo Router)
│   │   ├── (tabs)/    # Tab navigation screens
│   │   ├── _layout.tsx # Root drawer layout with profile header
│   │   ├── area-*.tsx # Production area management screens
│   │   ├── crear-registro-envases.tsx # Container production form
│   │   └── reportes.tsx # Production reports dashboard
│   ├── components/    # Reusable UI components
│   ├── services/      # API service layer with validation
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions (cn for styling)
├── assets/           # Static assets
└── android/ios/      # Native platform code
```

### Navigation Architecture
- **Expo Router 5.1.3**: File-based routing with nested navigation
- **Root Drawer**: Custom drawer layout (`src/app/_layout.tsx`) with:
  - Profile header displaying user info (Lisa Martínez, Operario de Planta)
  - Drawer items for each production area and features
  - Hidden screens (index, crear-registro-envases) that don't appear in drawer
- **Nested Tab Navigation**: `(tabs)` directory contains tabbed interface within drawer
- **Production Areas**: Dedicated screens for envases, mallas, pitillos with consistent navigation patterns

### Styling System
- **NativeWind 4.1.23**: Tailwind CSS for React Native with custom preset
- **Utility function**: `cn()` in `src/utils/cn.ts` combines clsx and tailwind-merge for conditional styling
- **Mixed approach**: NativeWind for modern components, StyleSheet for complex layouts (drawer header)
- **Tailwind config**: Content scanning `src/**/*.{js,jsx,ts,tsx}` with NativeWind preset

### Key Technologies Stack
- **React 19** and **React Native 0.79.5**
- **Expo SDK 53** with new architecture disabled (legacy mode)
- **TypeScript**: Strict mode with path mapping (`@/*` → `src/*`)
- **Hermes**: JavaScript engine for both iOS and Android
- **Bun**: Package manager and task runner (preferred over npm)
- **ESLint + Prettier**: Code quality with expo config and prettier integration

### API Integration Architecture
- **Service Pattern**: Two main service classes:
  - `AuthService` in `src/services/authService.ts` for authentication
  - `ProductionRecordsService` in `src/services/productionRecords.ts` for production data
- **Base URL**: `https://production-records-backend.vercel.app` (production)
- **Request handling**: 30-second timeout with AbortController, comprehensive error handling
- **Authentication**: JWT token-based auth with AsyncStorage persistence
- **Validation**: Client-side validation with form validation functions
- **Error messages**: Spanish localized error messages for user-facing feedback
- **Type safety**: Full TypeScript coverage with `src/types/api.ts` interfaces

### Authentication System
- **AuthProvider**: React Context provider in `src/components/AuthProvider.tsx`
- **Persistent sessions**: JWT tokens stored in AsyncStorage with auto-refresh
- **Role-based permissions**: Four user roles with specific capabilities (see `src/utils/permissions.ts`):
  - Operario de Planta: Create records, view own records
  - Supervisor de Área: Create/view all records, access reports  
  - Gerente de Producción: Full access to records, reports, and admin
  - Administrativo: Full access to reports and data visualization
- **Session management**: Automatic logout with server notification and local cleanup

### Build Configuration Details
- **EAS Build**: Configured for Android APK builds with auto-increment versioning
- **Babel**: Expo preset with React Native Reanimated plugin and transform plugins
- **Metro**: Default configuration optimized for Hermes
- **Bundle ID**: `com.cueva1989.expostarter`
- **Project ID**: `bbedca64-0397-4fdb-8456-cbcc649826ea`

### Development Workflow Notes
- **Package manager**: Use bun for consistency (both npm and bun locks exist)
- **Language**: Spanish interface for manufacturing plant workers
- **State management**: React built-in state (no Redux/Zustand configured)
- **Component patterns**: Mix of functional components with hooks and StyleSheet/NativeWind styling
- **Production focus**: Real-world manufacturing operations tracking and reporting

### Important Instructions
Always prefer editing existing files over creating new ones. Never proactively create documentation files (*.md) or README files unless explicitly requested by the user.
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.