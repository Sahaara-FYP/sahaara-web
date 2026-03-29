# Sahaara Web

This is the web frontend for Sahaara, a smart, real-time, hyperlocal community support platform, built with React, TypeScript, and Vite.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (or yarn/pnpm)

### Installation
1. Navigate to the web directory:
   ```bash
   cd sahaara-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory (or `.env.local`) and configure necessary variables (e.g., API URL for the backend).

### Running the Application

**Development Mode**
Starts the Vite development server with Hot Module Replacement (HMR).
```bash
npm run dev
```

**Production Build**
Builds the app for production to the `dist` folder. It also runs TypeScript checks.
```bash
npm run build
```

**Preview Production Build**
Locally preview the production build generated in the `dist` folder.
```bash
npm run preview
```

### Additional Commands

**Linting**
Run ESLint to check for code quality and formatting issues.
```bash
npm run lint
```
