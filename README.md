# Campus Navigation Application

A minimal, responsive web application for navigating your campus. Built with Next.js, TypeScript, and Tailwind CSS. Now featuring a **Hoodmaps-style visual design** for a fun, social map experience!

## Features

### Core Navigation
- 🗺️ Interactive SVG campus map
- 🔍 Search buildings and rooms by name or label
- 🧭 Route calculation with BFS algorithm
- 📱 Fully responsive (desktop and mobile)
- 🎨 Clean, modern UI with Tailwind CSS
- ⚡ Static export for easy deployment

### 🎨 NEW: Hoodmaps-Style Features
- **Bold Visual Design**: Color-coded zones with flat colors and geometric shapes
- **Room Labeling**: Associate clubs with specific rooms (e.g., "Dance Club" → Block A, Room 201)
- **Enhanced Search**: Find rooms by their custom labels (search "Dance" to find Dance Club)
- **Category Filtering**: Filter map by academic, canteens, recreational, etc.
- **Original Building Names**: Buildings keep their actual names (Block A, Annapurna Canteen, etc.)
- **View Toggle**: Switch between classic and Hoodmaps styles

See [ROOM-LABELING-GUIDE.md](./ROOM-LABELING-GUIDE.md) for a step-by-step guide on labeling rooms with club names.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd campus-navigation
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

Build the static site:
```bash
npm run build
```

The static files will be generated in the `out` directory.

## Deployment

You can deploy the static build to any web server or hosting platform:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Any static file server

## Campus Data

The campus layout is defined in `lib/campusData.ts` based on the provided Mermaid diagram.

## Hoodmaps Features

### Quick Start with Sample Labels

To try out the room labeling feature with sample data:

1. Open the application in your browser
2. Switch to Hoodmaps view (button in header)
3. Open browser console and run:
```javascript
const sampleLabels = await fetch('/sample-room-labels.json').then(r => r.json());
localStorage.setItem('campus-room-labels', JSON.stringify(sampleLabels));
location.reload();
```

Or manually add labels by clicking on buildings and rooms!

### Color Scheme

- 🟡 **Academic**: Yellow - Study zones and classrooms
- 🔵 **Hostels**: Blue - Residential areas
- 🔴 **Canteens**: Red - Food and dining spots
- 🟢 **Recreational**: Green - Parks, stages, and play areas
- 🟣 **Administrative**: Purple - Admin offices
- ⚪ **Facilities**: Gray - Service and utility buildings

### Usage Tips

1. **Label Rooms**: Click any building → Select a room → Add custom labels
2. **Search Labels**: Use the search bar to find rooms by their labels
3. **Filter Categories**: Use category pills to focus on specific zone types
4. **Export Labels**: Open console and run `localStorage.getItem('campus-room-labels')` to backup your labels

For complete documentation, see [HOODMAPS-FEATURES.md](./HOODMAPS-FEATURES.md).
