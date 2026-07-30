"""
GPU Verification Module for Atlas Sanctum Earth2Studio

This module provides explicit GPU verification to ensure Earth2Studio
runs on appropriate hardware for scientific modeling.
"""

import torch
import subprocess
import sys
from dataclasses import dataclass
from typing import Optional, Dict, List
from enum import Enum


class GPUStatus(Enum):
    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    INSUFFICIENT = "insufficient"
    NOT_RECOMMENDED = "not_recommended"


@dataclass
class GPUInfo:
    name: str
    memory_gb: float
    compute_capability: float
    status: GPUStatus
    recommendations: List[str]


class GPUVerifier:
    """
    Verifies GPU availability and suitability for Earth2Studio operations.
    
    Ensures that scientific modeling workloads run on appropriate hardware
    with sufficient resources for accurate Earth system predictions.
    """
    
    # Minimum requirements for Earth2Studio
    MIN_COMPUTE_CAPABILITY = 8.9
    MIN_MEMORY_GB = 40.0
    RECOMMENDED_GPUS = {
        "NVIDIA L40S": {"compute_capability": 8.9, "memory_gb": 48.0},
        "NVIDIA RTX A6000": {"compute_capability": 8.6, "memory_gb": 48.0},
        "NVIDIA H100": {"compute_capability": 9.0, "memory_gb": 80.0},
        "NVIDIA B200": {"compute_capability": 12.0, "memory_gb": 192.0},
    }
    
    def __init__(self):
        self._gpu_info: Optional[GPUInfo] = None
    
    def verify(self) -> GPUInfo:
        """
        Perform comprehensive GPU verification.
        
        Returns:
            GPUInfo object containing verification results and recommendations
        """
        if not torch.cuda.is_available():
            self._gpu_info = GPUInfo(
                name="No GPU detected",
                memory_gb=0.0,
                compute_capability=0.0,
                status=GPUStatus.UNAVAILABLE,
                recommendations=[
                    "Earth2Studio requires an NVIDIA GPU for scientific modeling",
                    "Consider using cloud GPU services (AWS, GCP, Azure) with NVIDIA hardware",
                    "Recommended: L40S, RTX A6000, H100, or B200",
                ]
            )
            return self._gpu_info
        
        # Get GPU properties
        gpu_name = torch.cuda.get_device_name(0)
        gpu_memory = torch.cuda.get_device_properties(0).total_memory / (1024**3)
        major, minor = torch.cuda.get_device_capability(0)
        compute_capability = float(f"{major}.{minor}")
        
        # Determine status and recommendations
        status, recommendations = self._evaluate_gpu(
            gpu_name, compute_capability, gpu_memory
        )
        
        self._gpu_info = GPUInfo(
            name=gpu_name,
            memory_gb=gpu_memory,
            compute_capability=compute_capability,
            status=status,
            recommendations=recommendations
        )
        
        return self._gpu_info
    
    def _evaluate_gpu(
        self, name: str, compute_capability: float, memory_gb: float
    ) -> tuple[GPUStatus, List[str]]:
        """Evaluate GPU against requirements."""
        recommendations = []
        
        # Check compute capability
        if compute_capability < self.MIN_COMPUTE_CAPABILITY:
            recommendations.append(
                f"GPU compute capability ({compute_capability}) is below "
                f"recommended minimum ({self.MIN_COMPUTE_CAPABILITY})"
            )
        
        # Check memory
        if memory_gb < self.MIN_MEMORY_GB:
            recommendations.append(
                f"GPU memory ({memory_gb:.1f} GB) is below "
                f"recommended minimum ({self.MIN_MEMORY_GB} GB)"
            )
        
        # Check if recommended GPU
        is_recommended = any(gpu in name for gpu in self.RECOMMENDED_GPUS)
        if not is_recommended:
            recommendations.append(
                f"Consider upgrading to recommended GPUs: "
                f"{', '.join(self.RECOMMENDED_GPUS.keys())}"
            )
        
        # Determine status
        if compute_capability >= self.MIN_COMPUTE_CAPABILITY and \
           memory_gb >= self.MIN_MEMORY_GB:
            if is_recommended:
                status = GPUStatus.AVAILABLE
                recommendations = ["GPU meets all requirements for Earth2Studio"]
            else:
                status = GPUStatus.NOT_RECOMMENDED
        elif compute_capability >= 7.0 and memory_gb >= 16.0:
            status = GPUStatus.INSUFFICIENT
            recommendations.append(
                "May work with reduced batch size or smaller models"
            )
        else:
            status = GPUStatus.INSUFFICIENT
            recommendations.append(
                "Consider using cloud GPU resources for scientific modeling"
            )
        
        return status, recommendations
    
    def check_cuda_compatibility(self) -> Dict[str, bool]:
        """
        Check CUDA compatibility for Earth2Studio operations.
        
        Returns:
            Dictionary of CUDA compatibility checks
        """
        checks = {
            "cuda_available": torch.cuda.is_available(),
            "cuda_version": torch.version.cuda if torch.cuda.is_available() else None,
            "cudnn_available": torch.backends.cudnn.is_available() if torch.cuda.is_available() else False,
            "torch_version": torch.__version__,
        }
        return checks
    
    def get_status_report(self) -> Dict:
        """
        Get complete status report for GPU verification.
        
        Returns:
            Dictionary containing full verification report
        """
        gpu_info = self.verify()
        cuda_checks = self.check_cuda_compatibility()
        
        return {
            "gpu_status": gpu_info.status.value,
            "gpu_name": gpu_info.name,
            "gpu_memory_gb": gpu_info.memory_gb,
            "gpu_compute_capability": gpu_info.compute_capability,
            "recommendations": gpu_info.recommendations,
            "cuda_compatibility": cuda_checks,
            "earth2studio_ready": gpu_info.status == GPUStatus.AVAILABLE,
        }
    
    def ensure_gpu_available(self) -> bool:
        """
        Ensure GPU is available and suitable for Earth2Studio.
        
        Raises:
            RuntimeError: If GPU is not available or insufficient
            
        Returns:
            True if GPU is available and suitable
        """
        report = self.get_status_report()
        
        if not report["cuda_compatibility"]["cuda_available"]:
            raise RuntimeError(
                "CUDA is not available. Earth2Studio requires GPU support "
                "for scientific modeling operations."
            )
        
        if not report["earth2studio_ready"]:
            warnings = "\n".join(report["recommendations"])
            raise RuntimeError(
                f"GPU may be insufficient for optimal Earth2Studio performance.\n"
                f"{warnings}"
            )
        
        return True


def verify_gpu_for_atlas_sanctum() -> GPUInfo:
    """
    Verify GPU availability for Atlas Sanctum Earth2Studio operations.
    
    This is the primary entry point for GPU verification in Atlas Sanctum.
    
    Returns:
        GPUInfo object with verification results
    """
    verifier = GPUVerifier()
    return verifier.verify()


if __name__ == "__main__":
    verifier = GPUVerifier()
    report = verifier.get_status_report()
    
    print("=" * 60)
    print("Atlas Sanctum - Earth2Studio GPU Verification")
    print("=" * 60)
    print(f"Status: {report['gpu_status']}")
    print(f"GPU: {report['gpu_name']}")
    print(f"Memory: {report['gpu_memory_gb']:.1f} GB")
    print(f"Compute Capability: {report['gpu_compute_capability']}")
    print(f"Earth2Studio Ready: {report['earth2studio_ready']}")
    print("\nRecommendations:")
    for rec in report['recommendations']:
        print(f"  - {rec}")
    print("\nCUDA Compatibility:")
    for key, value in report['cuda_compatibility'].items():
        print(f"  {key}: {value}")
    print("=" * 60)
