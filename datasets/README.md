# datasets/

Open datasets that power Atlas Sanctum's intelligence and verification layers.

All datasets are licensed under **CC BY 4.0** unless otherwise noted.
Indigenous datasets are governed by **FPIC (Free, Prior, and Informed Consent)** protocols.

## Structure

```
datasets/
├── environmental/    — NDVI, carbon stock, biodiversity, ocean health, air/water quality
├── social/           — Community wellbeing, health burden, cultural vitality indices
└── economic/         — Regenerative credit prices, impact investment flows, RVX market data
```

## Environmental Datasets

| Dataset | Source | Update Frequency | Format |
|---------|--------|-----------------|--------|
| Global NDVI | Sentinel-2 / Landsat-9 | 5-day | GeoTIFF |
| Carbon Stock Estimates | Global Forest Watch | Annual | GeoJSON |
| Biodiversity Intactness Index | Natural History Museum | Annual | CSV |
| Ocean Health Index | OHI / NCEAS | Annual | CSV |
| Air Quality Index | OpenAQ | Real-time | JSON |
| Freshwater Stress | WRI Aqueduct | Annual | GeoJSON |

## Social Datasets

| Dataset | Source | Update Frequency | Format |
|---------|--------|-----------------|--------|
| Human Development Index | UNDP | Annual | CSV |
| Climate Health Burden (DALYs) | WHO | Annual | CSV |
| Community Trust Index | Atlas Sanctum Network | Quarterly | JSON |

## Economic Datasets

| Dataset | Source | Update Frequency | Format |
|---------|--------|-----------------|--------|
| Carbon Credit Prices | Xpansiv / CBL | Daily | CSV |
| Impact Investment Flows | GIIN | Annual | CSV |
| Regenerative Credit Index | Atlas Sanctum RVX | Real-time | JSON |

## Contributing Datasets

See `CONTRIBUTING.md` for dataset submission guidelines.
All submissions must include provenance, methodology, and license documentation.
