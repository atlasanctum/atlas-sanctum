# Atlas Sanctum Earth2Studio Integration

This package provides integration between Earth2Studio scientific modeling and Atlas Sanctum's planetary conscience system.

## Overview

Atlas Sanctum uses Earth2Studio as its **planetary conscience**, ensuring that:

1. **Regeneration is measurable** - All actions are evaluated against quantitative regeneration metrics
2. **Value is constrained by nature** - Economic value cannot exceed nature's regenerative capacity
3. **AI remains humble before physics** - Predictions include uncertainty margins acknowledging physical limits

## Installation

### Prerequisites

- Python 3.12+
- uv package manager
- NVIDIA GPU (for Earth2Studio modeling)
- 40GB+ GPU memory
- Compute capability 8.9+

### Setup

```bash
# Navigate to project directory
cd atlas-sanctum-earth2studio

# Install dependencies using uv
export UV_CACHE_DIR=~/atlas-earth2studio-cache
uv sync

# Activate virtual environment
source .venv/bin/activate

# Verify installation
python main.py --report
```

## Usage

### Command Line Interface

```bash
# Basic status check
python main.py

# Full status report
python main.py --report

# JSON output
python main.py --json

# Run demonstration
python main.py --demo
```

### Python API

```python
from atlas_sanctum import (
    verify_gpu_for_atlas_sanctum,
    create_planetary_conscience,
    create_atlas_sanctum_integration,
    ModelingDomain
)

# Verify GPU availability
gpu_info = verify_gpu_for_atlas_sanctum()
print(f"GPU Status: {gpu_info.status.value}")

# Create planetary conscience
conscience = create_planetary_conscience()

# Create Earth2Studio integration
integration = create_atlas_sanctum_integration()

# Run scientific modeling
prediction = integration.run_scientific_modeling(
    domain=ModelingDomain.CLIMATE,
    time_range={"start": "2024-01-01", "end": "2024-01-07"},
    spatial_domain={"lat": [0, 90], "lon": [0, 360]}
)

# Generate economic recommendation
recommendation = integration.generate_economic_recommendation(
    scientific_prediction=prediction,
    proposed_action="renewable_energy_investment",
    base_economic_value=1000000
)
print(f"Constrained Value: ${recommendation.constrained_value:,.0f}")
```

## Project Structure

```
atlas-sanctum-earth2studio/
├── atlas_sanctum/
│   ├── __init__.py
│   ├── config/
│   │   ├── __init__.py
│   │   └── manager.py          # Configuration management
│   ├── gpu/
│   │   ├── __init__.py
│   │   └── verifier.py          # GPU verification
│   ├── conscience/
│   │   ├── __init__.py
│   │   └── core.py              # Planetary conscience
│   └── integration/
│       ├── __init__.py
│       └── engine.py            # Earth2Studio integration
├── main.py                       # CLI entry point
├── pyproject.toml               # Project configuration
└── README.md                     # This file
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EARTH2STUDIO_CACHE` | Cache location for model files | `~/.cache/earth2studio` |
| `EARTH2STUDIO_PACKAGE_TIMEOUT` | Download timeout (seconds) | `300` |
| `NGC_API_KEY` | NGC API key for model access | None |

### Configuration File

Create a `config.json` file:

```json
{
  "earth2studio": {
    "default_model": "graphcast",
    "model_precision": "fp32",
    "gpu_device_id": 0
  },
  "nature_constraints": {
    "min_regeneration_rate": 0.01,
    "max_extraction_rate": 0.5,
    "nature_value_weight": 0.5,
    "regeneration_priority": true
  }
}
```

## Planetary Conscience

The planetary conscience ensures that Earth2Studio operations:

1. **Measure Regeneration**
   - Carbon sequestration rates
   - Biodiversity indices
   - Water cycle health
   - Soil carbon content

2. **Constrain Value**
   - Economic value is reduced when regeneration is low
   - Hard constraints prevent nature violation
   - Regeneration priority over extraction

3. **Maintain Humility**
   - Uncertainty margins in all predictions
   - Confidence scores for all recommendations
   - Physics-compliant modeling

## Supported Models

Earth2Studio supports multiple AI Earth system models:

- **GraphCast** - Global weather prediction
- **Pangu-Weather** - Earth-specific weather modeling
- **FourCastNet** - Fourier-based forecasting
- **AIFS** - AI Forecasting System
- **Aurora** - High-resolution modeling
- And more...

See [Earth2Studio Model Zoo](https://github.com/NVIDIA/earth2studio) for full list.

## Hardware Requirements

### Minimum

| Component | Requirement |
|-----------|-------------|
| GPU | NVIDIA with compute capability 8.0+ |
| Memory | 16GB GPU, 128GB system |
| Storage | 50GB for models and cache |

### Recommended

| Component | Recommendation |
|-----------|----------------|
| GPU | L40S, RTX A6000, H100, B200 |
| Memory | 40GB GPU, 256GB system |
| Storage | 128GB SSD |
| CUDA | 12.8+ |

## Development

### Adding New Models

```python
from atlas_sanctum.integration import Earth2StudioIntegration, ModelingDomain

# Create integration with custom model
integration = create_atlas_sanctum_integration(model_name="pangu")
```

### Adding Constraints

```python
from atlas_sanctum.conscience import NatureConstraint

# Add custom nature constraint
constraint = NatureConstraint(
    constraint_type="custom_limit",
    max_value=1000,
    min_value=0,
    current_value=500,
    severity="warning"
)
conscience.add_constraint(constraint)
```

## Integration with Atlas Sanctum

This package is designed to integrate with the broader Atlas Sanctum system:

- **Economic Decisions**: Constrained by scientific predictions
- **Regeneration Metrics**: Measured and reported
- **Nature Constraints**: Applied to all economic activities
- **Transparency**: All decisions logged with reasoning

## License

This project is part of Atlas Sanctum and follows its licensing terms.

## References

- [Earth2Studio GitHub](https://github.com/NVIDIA/earth2studio)
- [Earth2Studio Documentation](https://nvidia.github.io/earth2studio/)
- [Atlas Sanctum Architecture](../src/architecture/AtlasSanctumArchitecture.ts)

## Contact

For questions about this integration, refer to the Atlas Sanctum project documentation.
