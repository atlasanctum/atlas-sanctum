"""
Configuration Management Module for Atlas Sanctum Earth2Studio

This module provides controlled configuration for Earth2Studio operations,
ensuring consistent and reproducible scientific modeling with proper
separation between scientific parameters and economic constraints.
"""

import os
from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List
from enum import Enum
import json
from pathlib import Path


class ConfigSource(Enum):
    ENVIRONMENT = "environment"
    FILE = "file"
    DEFAULT = "default"


@dataclass
class Earth2StudioConfig:
    """
    Configuration for Earth2Studio operations.
    
    This configuration controls scientific modeling parameters while
    maintaining strict separation from economic decision-making.
    """
    # Cache configuration
    cache_enabled: bool = True
    cache_location: str = field(default_factory=lambda: os.environ.get(
        "EARTH2STUDIO_CACHE", 
        str(Path.home() / ".cache" / "earth2studio")
    ))
    
    # Download timeout
    package_timeout_seconds: int = field(default_factory=lambda: int(
        os.environ.get("EARTH2STUDIO_PACKAGE_TIMEOUT", "300")
    ))
    
    # Data source configuration
    default_data_source: str = "huggingface"
    NGC_api_key: Optional[str] = field(default_factory=lambda: os.environ.get(
        "NGC_API_KEY", None
    ))
    
    # Model configuration
    default_model: str = "graphcast"
    model_precision: str = "fp32"
    
    # GPU configuration
    gpu_device_id: int = 0
    gpu_memory_fraction: float = 1.0
    
    # Logging configuration
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Parallel processing
    num_workers: int = 4
    batch_size: int = 1
    
    # Atlas Sanctum specific
    enable_conscience_mode: bool = True
    regeneration_metrics_enabled: bool = True
    nature_constraint_enabled: bool = True


@dataclass
class NatureConstraintConfig:
    """
    Configuration for nature-based constraints on economic decisions.
    
    Ensures that AI remains humble before physics and regeneration
    is measurable and valued.
    """
    # Regeneration thresholds
    min_regeneration_rate: float = 0.01  # Minimum acceptable regeneration rate
    max_extraction_rate: float = 0.5     # Maximum sustainable extraction rate
    
    # Ecological boundaries
    biodiversity_threshold: float = 0.8   # Minimum biodiversity index
    carbon_budget_tonnes: float = 1.0e6  # Annual carbon budget
    
    # Economic constraints
    nature_value_weight: float = 0.5     # Weight for nature in value calculations
    regeneration_priority: bool = True   # Prioritize regeneration over extraction
    
    # Reporting
    report_regeneration_metrics: bool = True
    report_nature_constraints: bool = True


class ConfigurationManager:
    """
    Manages configuration for Atlas Sanctum Earth2Studio.
    
    Provides controlled access to configuration parameters with
    validation and defaults. Maintains strict separation between
    scientific modeling configuration and economic constraints.
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize configuration manager.
        
        Args:
            config_path: Optional path to JSON configuration file
        """
        self._config = Earth2StudioConfig()
        self._nature_constraints = NatureConstraintConfig()
        self._config_source = ConfigSource.DEFAULT
        
        if config_path and os.path.exists(config_path):
            self._load_from_file(config_path)
        elif config_path:
            print(f"Warning: Config file not found: {config_path}")
    
    def _load_from_file(self, config_path: str) -> None:
        """Load configuration from JSON file."""
        try:
            with open(config_path, 'r') as f:
                data = json.load(f)
            
            # Update Earth2Studio config
            for key, value in data.get('earth2studio', {}).items():
                if hasattr(self._config, key):
                    setattr(self._config, key, value)
            
            # Update nature constraints
            for key, value in data.get('nature_constraints', {}).items():
                if hasattr(self._nature_constraints, key):
                    setattr(self._nature_constraints, key, value)
            
            self._config_source = ConfigSource.FILE
        except Exception as e:
            print(f"Error loading config: {e}")
    
    def get_earth2studio_config(self) -> Earth2StudioConfig:
        """Get Earth2Studio configuration."""
        return self._config
    
    def get_nature_constraints(self) -> NatureConstraintConfig:
        """Get nature constraint configuration."""
        return self._nature_constraints
    
    def update_config(self, updates: Dict[str, Any], section: str = "earth2studio") -> None:
        """
        Update configuration with validated values.
        
        Args:
            updates: Dictionary of configuration updates
            section: Configuration section to update
        """
        if section == "earth2studio":
            config = self._config
        elif section == "nature_constraints":
            config = self._nature_constraints
        else:
            raise ValueError(f"Unknown configuration section: {section}")
        
        for key, value in updates.items():
            if hasattr(config, key):
                setattr(config, key, value)
        
        self._config_source = ConfigSource.ENVIRONMENT
    
    def validate_config(self) -> List[str]:
        """
        Validate current configuration.
        
        Returns:
            List of validation warnings or errors
        """
        warnings = []
        
        # Check GPU configuration
        if self._config.gpu_memory_fraction > 1.0:
            warnings.append("GPU memory fraction > 1.0 may cause out-of-memory errors")
        
        # Check batch size
        if self._config.batch_size < 1:
            warnings.append("Batch size must be >= 1")
        
        # Check nature constraints
        if self._nature_constraints.min_regeneration_rate > \
           self._nature_constraints.max_extraction_rate:
            warnings.append(
                "Min regeneration rate > max extraction rate - "
                "this may prevent any economic activity"
            )
        
        return warnings
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Export configuration as dictionary.
        
        Returns:
            Dictionary representation of configuration
        """
        return {
            "earth2studio": {
                k: v for k, v in self._config.__dict__.items() 
                if not k.startswith('_')
            },
            "nature_constraints": {
                k: v for k, v in self._nature_constraints.__dict__.items()
                if not k.startswith('_')
            },
            "config_source": self._config_source.value
        }
    
    def save_to_file(self, config_path: str) -> None:
        """
        Save configuration to JSON file.
        
        Args:
            config_path: Path to save configuration
        """
        with open(config_path, 'w') as f:
            json.dump(self.to_dict(), f, indent=2)
    
    def apply_environment_variables(self) -> None:
        """
        Apply Earth2Studio environment variables to configuration.
        
        Reads standard Earth2Studio environment variables and applies
        them to the configuration.
        """
        env_mappings = {
            "EARTH2STUDIO_CACHE": ("cache_location", str),
            "EARTH2STUDIO_PACKAGE_TIMEOUT": ("package_timeout_seconds", int),
            "NGC_API_KEY": ("NGC_api_key", str),
            "EARTH2STUDIO_DISABLE_MSC": ("disable_msc", bool),
        }
        
        for env_var, (attr_name, cast_func) in env_mappings.items():
            value = os.environ.get(env_var)
            if value is not None:
                try:
                    if cast_func == bool:
                        value = value.lower() in ("true", "1", "yes")
                    else:
                        value = cast_func(value)
                    setattr(self._config, attr_name, value)
                except (ValueError, TypeError) as e:
                    print(f"Error parsing {env_var}: {e}")
        
        self._config_source = ConfigSource.ENVIRONMENT


def get_atlas_sanctum_config(config_path: Optional[str] = None) -> ConfigurationManager:
    """
    Get Atlas Sanctum configuration manager.
    
    This is the primary entry point for configuration management.
    
    Args:
        config_path: Optional path to configuration file
        
    Returns:
        Configured ConfigurationManager instance
    """
    manager = ConfigurationManager(config_path)
    manager.apply_environment_variables()
    return manager


if __name__ == "__main__":
    config = get_atlas_sanctum_config()
    
    print("=" * 60)
    print("Atlas Sanctum - Earth2Studio Configuration")
    print("=" * 60)
    print(f"Config Source: {config.to_dict()['config_source']}")
    print(f"Default Model: {config.get_earth2studio_config().default_model}")
    print(f"Cache Location: {config.get_earth2studio_config().cache_location}")
    print(f"Enable Conscience Mode: {config.get_earth2studio_config().enable_conscience_mode}")
    print(f"Nature Value Weight: {config.get_nature_constraints().nature_value_weight}")
    
    warnings = config.validate_config()
    if warnings:
        print("\nValidation Warnings:")
        for warning in warnings:
            print(f"  - {warning}")
    print("=" * 60)
