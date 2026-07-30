/**
 * Atlas Sanctum Dashboard App
 * Entry point for the primary platform dashboard.
 *
 * Renders: planetary metrics, impact portfolio, governance activity,
 * agent network status, sensor fabric health, digital twin divergence.
 *
 * Production: migrated from src/ monorepo root into this apps/dashboard/ package.
 * Current implementation lives at src/pages/Dashboard.tsx and src/components/dashboard/.
 */

export { default as DashboardApp } from './src/DashboardApp';
