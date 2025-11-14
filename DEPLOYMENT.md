# Deployment Guide

## Quick Start

Your campus navigation app is ready to deploy! The static build is in the `out` directory.

## Local Testing

Test the production build locally:
```bash
npx serve out
```

## Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify
1. Drag and drop the `out` folder to Netlify
2. Or connect your Git repository

### GitHub Pages
1. Copy contents of `out` to your gh-pages branch
2. Enable GitHub Pages in repository settings

### Any Static Host
Upload the contents of the `out` directory to any web server.

## Features Implemented

✅ Interactive SVG campus map with all 12 locations
✅ Building search with real-time filtering
✅ BFS route calculation between any two buildings
✅ Zoom and pan controls for map navigation
✅ Fully responsive design (desktop and mobile)
✅ Touch-friendly controls (44px minimum)
✅ Error handling and user feedback
✅ Static export for easy deployment

## Campus Locations

The app includes all locations from your Mermaid diagram:
- Block A, B, C (Left Building)
- Block D, E, P
- JSK Greens
- Annapurna Canteen
- SAC Stage
- Scinti Stage
- Coca-Cola Canteen
- Ground
- PEB Block
