# Phishing Detection Frontend - Vite + React Project

## Project Structure

```
phishing-frontend/
│
├── public/
│   └── images/
│       └── phishing-illustration.png
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── UrlInput.jsx
│   │   ├── ResultBox.jsx
│   │   ├── Features.jsx
│   │   ├── HowItWorks.jsx
│   │   └── Footer.jsx
│   │
│   ├── pages/
│   │   └── HomePage.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── hooks/
│   │   └── usePhishingCheck.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
└── vite.config.js
```

## Components Overview

### 1. Navbar.jsx
- Navigation bar with links to different sections
- Contains logo and navigation menu

### 2. HeroSection.jsx
- Main headline section with call-to-action
- Contains illustration image

### 3. UrlInput.jsx
- Form for entering website URLs to check
- Submit button to trigger phishing detection

### 4. ResultBox.jsx
- Displays results of phishing analysis
- Shows whether URL is safe or phishing
- Includes risk score and reasons

### 5. Features.jsx
- Highlights key features of the phishing detector
- Grid layout with icons and descriptions

### 6. HowItWorks.jsx
- Step-by-step explanation of the process
- Visual representation of workflow

### 7. Footer.jsx
- Copyright and attribution information

### 8. HomePage.jsx
- Main page component that combines all sections

## Services and Hooks

### api.js
- Service for communicating with backend API
- Functions for checking URLs and getting analysis details

### usePhishingCheck.js
- Custom React hook for handling phishing check functionality
- Manages state for results, loading, and errors

## Styles

### global.css
- Global styling for the entire application
- Component-specific styles

### variables.css
- CSS variables for consistent theming
- Color palette, spacing, typography definitions

## Setup Instructions

Due to Node.js version compatibility issues, here are the recommended steps to run this project:

1. Upgrade Node.js to version 20.19+ or 22.12+
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Notes

- The project uses Vite as the build tool for faster development
- React components are organized by feature and functionality
- Styling uses CSS variables for consistent theming
- The application is responsive and mobile-friendly
- API integration is prepared but currently uses mock data for demonstration