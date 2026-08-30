# Design

Prototype UI components for future front-end development.

## App.jsx

A standalone React prototype (`SalesLeadTracker`) that demonstrates the intended
dashboard layout, navigation, lead management, calendar, and reporting views.

### Status

**Not wired into the build.** This is a reference prototype only. The current
application renders its UI via `src/renderer/app.js` (vanilla JS/HTML/CSS served
by the Electron main process at `src/main/main.js`).

### Dependencies

This prototype requires npm packages that are **not** listed in `package.json`
and are **not** installed in the project:

| Package       | Used for                        |
|---------------|---------------------------------|
| `react`       | Component framework             |
| `lucide-react`| Icon set                        |
| `recharts`    | Chart components (Pie/Line)       |

The project already uses `chart.js` (v4.5.1) for desktop charts — see
`src/renderer/app.js` and `scripts/build-web-renderer.js`. If this prototype is
ever adopted, consider migrating from `recharts` to `chart.js` to avoid adding
a new dependency.

### Running locally

```bash
cd design
npm install react lucide-react recharts
# Then integrate with a bundler (e.g., Vite) or run via a sandbox.
```
