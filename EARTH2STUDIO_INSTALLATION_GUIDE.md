# Earth2Studio Installation Guide

This document provides comprehensive instructions for installing Earth2Studio, a Python-based package for AI Earth system models. The installation is complete and verified in the `earth2studio-project/` directory.

## Quick Start

The Earth2Studio package has been successfully installed in the project:

```bash
cd earth2studio-project
source .venv/bin/activate
python -c "import earth2studio; print(earth2studio.__version__)"
# Output: 0.12.1rc0
```

## Installation Methods

### Method 1: pip (Basic Installation)

For users who prefer using pip directly:

```bash
# First ensure PyTorch is installed
pip install torch

# Install Earth2Studio
pip install earth2studio
```

### Method 2: pip from GitHub (Recommended for This Project)

This project uses GitHub installation with a specific release tag:

```bash
pip install "earth2studio @ git+https://github.com/NVIDIA/earth2studio.git@0.12.1"
```

### Method 3: Using uv (Recommended by Earth2Studio)

The Earth2Studio documentation recommends using uv for complex dependency management:

```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Initialize a new uv project with Python 3.12
uv init --python=3.12
uv add "earth2studio @ git+https://github.com/NVIDIA/earth2studio.git@0.12.1"
```

Note: This project uses Python 3.14 (available on the system) instead of 3.12, which works fine.

## Project Setup in This Workspace

### Directory Structure

```
earth2studio-project/
├── .venv/              # Virtual environment with Python 3.14
│   ├── bin/
│   ├── lib/
│   └── pyvenv.cfg
├── pyproject.toml      # Created by uv or manual setup
├── README.md           # Project README
└── .python-version    # Python version file
```

### Manual Setup Steps (Completed)

1. Created project directory:
   ```bash
   mkdir earth2studio-project
   cd earth2studio-project
   ```

2. Created virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install --upgrade pip
   ```

3. Installed Earth2Studio:
   ```bash
   pip install "earth2studio @ git+https://github.com/NVIDIA/earth2studio.git@0.12.1"
   ```

## Optional Dependencies

### Model Dependencies

Install specific model dependencies based on your needs:

```bash
# AIFS model
pip install earth2studio[aifs]

# Aurora model
pip install earth2studio[aurora]

# GraphCast model
pip install earth2studio[graphcast]

# Pangu-Weather model
pip install earth2studio[pangu]

# FourCastNet model
pip install earth2studio[fourcastnet]

# All models
pip install earth2studio[all]
```

### Data and Submodule Dependencies

```bash
# Data submodule (handles various data formats and sources)
pip install earth2studio[data]

# Perturbation submodule (ensemble generation)
pip install earth2studio[perturbation]

# Statistics submodule (statistical analysis)
pip install earth2studio[statistics]

# All submodules
pip install earth2studio[data,perturbation,statistics]
```

### Diagnostic Tools

```bash
# ClimateNet analysis
pip install earth2studio[climatenet]

# CorrDiff (correlation difference)
pip install earth2studio[corrdiff]

# Cyclone trackers
pip install earth2studio[cyclone]

# All diagnostics
pip install earth2studio[diagnostics]
```

## Using uv for Optional Dependencies

With uv, you can add extras to your project:

```bash
uv add "earth2studio @ git+https://github.com/NVIDIA/earth2studio.git@0.12.1"
uv add earth2studio[aifs,graphcast,data]
```

To install all optional dependencies (best-effort):

```bash
uv sync
uv add earth2studio --extra all
```

## Docker Installation

For containerized environments:

```bash
# Run Nvidia PyTorch container
docker run --gpus all -it nvcr.io/nvidia/pytorch:xx-xx-py3

# Install system dependencies
apt-get update
apt-get install -y git make curl cmake python3-dev libeccodes-tools libeccodes-dev

# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install Earth2Studio
uv pip install "earth2studio[aifs,data]@git+https://github.com/NVIDIA/earth2studio.git@0.12.1"
```

## Conda Installation (Alternative)

```bash
# Create conda environment
conda create -n earth2studio python=3.12 -y
conda activate earth2studio

# Install using uv
pip install uv
uv pip install "earth2studio @ git+https://github.com/NVIDIA/earth2studio.git@0.12.1"
```

## Environment Variables

Configure Earth2Studio using these environment variables:

```bash
# Cache location
export EARTH2STUDIO_CACHE=/path/to/cache

# Download timeout (seconds)
export EARTHTH2STUDIO_PACKAGE_TIMEOUT=300

# Disable multi-storage client
export EARTH2STUDIO_DISABLE_MSC=1
```

## System Requirements

### Recommended Specifications

| Component | Recommendation |
|-----------|----------------|
| OS | Ubuntu 24.04 LTS |
| Python | 3.12+ (tested with 3.14) |
| CUDA | 12.8 |
| GPU | NVIDIA GPU with compute capability 8.9+ |
| GPU Memory | 40GB+ |
| Disk Space | 128GB |

### Supported GPUs

- NVIDIA L40S
- NVIDIA RTX A6000
- NVIDIA H100
- NVIDIA B200

### Software Dependencies

- PyTorch (installed automatically with earth2studio)
- CUDA toolkit (for GPU acceleration)
- Git (for GitHub installation)

## Verification

Verify your installation:

```bash
cd earth2studio-project
source .venv/bin/activate

# Check version
python -c "import earth2studio; print(f'Earth2Studio version: {earth2studio.__version__}')"

# Check available modules
python -c "import earth2studio; print(dir(earth2studio))"
```

## Next Steps

1. **Explore Models**: Check the available AI Earth system models
2. **Load Data**: Set up data sources for your analysis
3. **Run Inference**: Use pre-trained models for weather/climate predictions
4. **Custom Models**: Extend Earth2Studio with custom model implementations

## Resources

- [Earth2Studio GitHub](https://github.com/NVIDIA/earth2studio)
- [Earth2Studio Documentation](https://nvidia.github.io/earth2studio/)
- [Model Zoo](https://github.com/NVIDIA/earth2studio/blob/main/docs/02-modelzoo.md)
- [Examples](https://github.com/NVIDIA/earth2studio/tree/main/examples)

## Troubleshooting

### Common Issues

1. **Permission Errors**: Use virtual environments to avoid system-wide installations
2. **CUDA Out of Memory**: Reduce batch size or use smaller models
3. **Dependency Conflicts**: Use uv for better dependency resolution
4. **Slow Installation**: Ensure stable internet connection for GitHub installation

### Getting Help

- GitHub Issues: https://github.com/NVIDIA/earth2studio/issues
- Discussions: https://github.com/NVIDIA/earth2studio/discussions

---

**Note**: This installation guide is based on the Earth2Studio documentation. For the latest information, always refer to the official GitHub repository.
