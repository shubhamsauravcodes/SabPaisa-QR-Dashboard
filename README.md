
# SabPaisa QR Dashboard

SabPaisa QR Dashboard is a modern web application for managing and monitoring UPI QR codes and payment transactions. Built with React and Vite, it provides a seamless interface for generating QR codes, tracking transaction activity, and simulating payment flows for testing and demonstration purposes.

## Features

- Generate and manage multiple UPI QR codes with custom identifiers and categories
- View, filter, and search all generated QR codes
- Monitor real-time and historical payment transactions
- Simulate payment activity for demo or testing
- Dashboard with key stats, recent activity, and quick actions
- Responsive, user-friendly UI

## Tech Stack

- React 18 + TypeScript
- Vite for fast development and build
- Redux Toolkit for state management
- Modern CSS for styling

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) to use the dashboard.

## Project Structure

- `src/components/` – UI components (Dashboard, QR modals, etc.)
- `src/pages/` – Main application pages
- `src/store/` – Redux slices and hooks
- `src/types/` – TypeScript types
- `src/utils/` – Utility functions

## License

This project is for demonstration and internal use. All rights reserved.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
