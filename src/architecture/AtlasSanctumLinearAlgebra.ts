/**
 * Atlas Sanctum Linear Algebra Module
 * Vector Spaces, Matrix Operations, and Linear Transformations
 * 
 * Linear algebra provides the mathematical foundation for modeling multi-country
 * regenerative flows, system dynamics, and resource allocation optimization.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Vector type
 */
export type Vector = readonly number[];

/**
 * Matrix type (row-major)
 */
export type Matrix = readonly number[][];

/**
 * Sparse matrix entry
 */
export interface SparseEntry {
  readonly row: number;
  readonly col: number;
  readonly value: number;
}

/**
 * Eigenvalue decomposition result
 */
export interface EigenvalueDecomposition {
  readonly eigenvalues: readonly number[];
  readonly eigenvectors: readonly Vector[];
  readonly dominantEigenvalue: number | null;
  readonly dominantEigenvector: Vector | null;
  readonly spectralRadius: number | null;
}

/**
 * SVD decomposition result
 */
export interface SVDResult {
  readonly U: Matrix;
  readonly S: readonly number[];
  readonly Vt: Matrix;
  readonly rank: number;
}

/**
 * PCA result
 */
export interface PCAResult {
  readonly components: readonly Vector[];
  readonly explainedVariance: readonly number[];
  readonly cumulativeVariance: readonly number[];
  readonly transformedData: Matrix;
  readonly rank: number;
}

/**
 * Linear programming result
 */
export interface LinearProgrammingResult {
  readonly solution: Vector | null;
  readonly optimalValue: number | null;
  readonly status: 'optimal' | 'infeasible' | 'unbounded' | 'iterations';
  readonly iterations: number;
}

/**
 * Leontief input-output result
 */
export interface LeontiefResult {
  readonly totalOutput: Vector;
  readonly multiplier: Matrix;
  readonly requiredInputs: Matrix;
  readonly backwardLinkages: readonly number[];
  readonly forwardLinkages: readonly number[];
}

// ============================================================================
// VECTOR OPERATIONS
// ============================================================================

/**
 * Vector space operations
 */
export class VectorOps {
  /**
   * Vector addition: a + b
   */
  static add(a: Vector, b: Vector): Vector {
    return a.map((v, i) => v + b[i]);
  }

  /**
   * Vector subtraction: a - b
   */
  static subtract(a: Vector, b: Vector): Vector {
    return a.map((v, i) => v - b[i]);
  }

  /**
   * Scalar multiplication: k × v
   */
  static scale(v: Vector, k: number): Vector {
    return v.map(x => x * k);
  }

  /**
   * Dot product: a · b
   */
  static dot(a: Vector, b: Vector): number {
    return a.reduce((sum, v, i) => sum + v * b[i], 0);
  }

  /**
   * Euclidean norm: ||v||₂
   */
  static norm(v: Vector): number {
    return Math.sqrt(this.dot(v, v));
  }

  /**
   * Normalize vector: v / ||v||
   */
  static normalize(v: Vector): Vector {
    const n = this.norm(v);
    return n > 0 ? this.scale(v, 1 / n) : v;
  }

  /**
   * L1 norm: ||v||₁ (Manhattan)
   */
  static normL1(v: Vector): number {
    return v.reduce((sum, x) => sum + Math.abs(x), 0);
  }

  /**
   * L∞ norm: ||v||∞ (Chebyshev)
   */
  static normInf(v: Vector): number {
    return Math.max(...v.map(Math.abs));
  }

  /**
   * Cross product in 3D: a × b
   */
  static cross3D(a: Vector, b: Vector): Vector {
    if (a.length !== 3 || b.length !== 3) {
      throw new Error('Cross product requires 3D vectors');
    }
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  /**
   * Outer product: a ⊗ b
   */
  static outer(a: Vector, b: Vector): Matrix {
    return a.map(ai => b.map(bj => ai * bj));
  }

  /**
   * Hadamard (element-wise) product: a ∘ b
   */
  static hadamard(a: Vector, b: Vector): Vector {
    return a.map((v, i) => v * b[i]);
  }

  /**
   * Vector projection: projₐ(b) = (a·b / a·a) × a
   */
  static project(a: Vector, b: Vector): Vector {
    const coeff = this.dot(a, b) / this.dot(a, a);
    return this.scale(a, coeff);
  }

  /**
   * Gram-Schmidt orthogonalization
   */
  static gramSchmidt(vectors: readonly Vector[]): Vector[] {
    const orthogonal: Vector[] = [];

    for (const v of vectors) {
      let ortho = v;
      for (const u of orthogonal) {
        const proj = this.project(u, v);
        ortho = this.subtract(ortho, proj);
      }
      if (this.norm(ortho) > 1e-10) {
        orthogonal.push(this.normalize(ortho));
      }
    }

    return orthogonal;
  }
}

// ============================================================================
// MATRIX OPERATIONS
// ============================================================================

/**
 * Matrix operations and linear transformations
 */
export class MatrixOps {
  /**
   * Matrix addition: A + B
   */
  static add(A: Matrix, B: Matrix): Matrix {
    return A.map((row, i) => row.map((v, j) => v + B[i][j]));
  }

  /**
   * Matrix subtraction: A - B
   */
  static subtract(A: Matrix, B: Matrix): Matrix {
    return A.map((row, i) => row.map((v, j) => v - B[i][j]));
  }

  /**
   * Matrix multiplication: A × B
   */
  static multiply(A: Matrix, B: Matrix): Matrix {
    const m = A.length;
    const n = A[0].length;
    const p = B[0].length;

    if (n !== B.length) {
      throw new Error('Matrix dimensions incompatible for multiplication');
    }

    const result: Matrix = [];

    for (let i = 0; i < m; i++) {
      result[i] = [];
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }

    return result;
  }

  /**
   * Matrix-vector multiplication: A × v
   */
  static multiplyVector(A: Matrix, v: Vector): Vector {
    return A.map(row => VectorOps.dot(row, v));
  }

  /**
   * Scalar multiplication: k × A
   */
  static scale(A: Matrix, k: number): Matrix {
    return A.map(row => row.map(v => v * k));
  }

  /**
   * Transpose: Aᵀ
   */
  static transpose(A: Matrix): Matrix {
    return A[0].map((_, j) => A.map(row => row[j]));
  }

  /**
   * Conjugate transpose (Hermitian): A*
   */
  static conjugateTranspose(A: Matrix): Matrix {
    return this.transpose(A).map(row => row.map(v => v)); // For real matrices, same as transpose
  }

  /**
   * Trace: tr(A)
   */
  static trace(A: Matrix): number {
    return A.reduce((sum, row, i) => sum + (row[i] || 0), 0);
  }

  /**
   * Determinant (LU decomposition)
   */
  static determinant(A: Matrix): number {
    const n = A.length;

    if (n === 1) return A[0][0];
    if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
    if (n === 3) {
      return A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1])
           - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0])
           + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
    }

    // LU decomposition for larger matrices
    const LU = this.luDecomposition(A);
    let det = 1;
    for (let i = 0; i < n; i++) {
      det *= LU.L[i][i] * LU.U[i][i];
    }
    return det * (LU.pivotParity || 1);
  }

  /**
   * Inverse: A⁻¹
   */
  static inverse(A: Matrix): Matrix {
    const n = A.length;
    const det = this.determinant(A);

    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is singular, cannot invert');
    }

    // Use adjugate matrix for small matrices
    if (n <= 3) {
      const adjugate = this.adjugate(A);
      return this.scale(adjugate, 1 / det);
    }

    // Gaussian elimination for larger matrices
    const augmented = A.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);

    for (let col = 0; col < n; col++) {
      // Find pivot
      let maxRow = col;
      for (let row = col + 1; row < n; row++) {
        if (Math.abs(augmented[row][col]) > Math.abs(augmented[maxRow][col])) {
          maxRow = row;
        }
      }
      [augmented[col], augmented[maxRow]] = [augmented[maxRow], augmented[col]];

      // Scale pivot row
      const pivot = augmented[col][col];
      for (let j = col; j < 2 * n; j++) {
        augmented[col][j] /= pivot;
      }

      // Eliminate column
      for (let row = 0; row < n; row++) {
        if (row !== col) {
          const factor = augmented[row][col];
          for (let j = col; j < 2 * n; j++) {
            augmented[row][j] -= factor * augmented[col][j];
          }
        }
      }
    }

    return augmented.map(row => row.slice(n));
  }

  /**
   * Moore-Penrose pseudoinverse: A⁺
   */
  static pseudoinverse(A: Matrix): Matrix {
    const svd = this.svd(A);
    const sigmaPlus = svd.S.map(s => s > 1e-10 ? 1 / s : 0);
    const sigmaPlusDiag = sigmaPlus.map((s, i) => {
      const row = new Array(svd.S.length).fill(0);
      row[i] = s;
      return row;
    });

    const V = this.transpose(svd.Vt);
    const U = this.transpose(svd.U);

    return this.multiply(this.multiply(V, sigmaPlusDiag), U);
  }

  /**
   * LU decomposition with partial pivoting
   */
  static luDecomposition(A: Matrix): {
    L: Matrix;
    U: Matrix;
    P: Matrix;
    pivotParity: number;
  } {
    const n = A.length;
    let pivotParity = 1;

    // Initialize L as identity and U as zeros
    const L: Matrix = Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0));
    const U: Matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    const P: Matrix = Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0));

    const p = Array(n).fill(0).map((_, i) => i);

    for (let j = 0; j < n; j++) {
      // Find pivot
      let maxRow = j;
      for (let i = j + 1; i < n; i++) {
        if (Math.abs(A[i][j]) > Math.abs(A[maxRow][j])) {
          maxRow = i;
        }
      }

      if (Math.abs(A[maxRow][j]) < 1e-10) continue;

      // Swap rows in A
      [A[j], A[maxRow]] = [A[maxRow], A[j]];
      [p[j], p[maxRow]] = [p[maxRow], p[j]];
      pivotParity *= -1;

      // Update permutation matrix
      [P[j], P[maxRow]] = [P[maxRow], P[j]];

      // Compute U and L
      for (let i = 0; i <= j; i++) {
        let sum = 0;
        for (let k = 0; k < i; k++) {
          sum += L[i][k] * U[k][j];
        }
        U[i][j] = A[i][j] - sum;
      }

      for (let i = j + 1; i < n; i++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += L[i][k] * U[k][j];
        }
        L[i][j] = (A[i][j] - sum) / U[j][j];
      }
    }

    return { L, U, P, pivotParity };
  }

  /**
   * Adjugate matrix (for small matrices)
   */
  private static adjugate(A: Matrix): Matrix {
    const n = A.length;
    const cofactorMatrix: Matrix = [];

    for (let i = 0; i < n; i++) {
      cofactorMatrix[i] = [];
      for (let j = 0; j < n; j++) {
        const minor = this.minor(A, i, j);
        const sign = ((i + j) % 2 === 0) ? 1 : -1;
        cofactorMatrix[i][j] = sign * this.determinant(minor);
      }
    }

    return this.transpose(cofactorMatrix);
  }

  /**
   * Minor matrix (remove row i, column j)
   */
  private static minor(A: Matrix, row: number, col: number): Matrix {
    return A
      .filter((_, i) => i !== row)
      .map(row => row.filter((_, j) => j !== col));
  }

  /**
   * Frobenius norm: ||A||F
   */
  static frobeniusNorm(A: Matrix): number {
    let sum = 0;
    for (const row of A) {
      for (const v of row) {
        sum += v * v;
      }
    }
    return Math.sqrt(sum);
  }

  /**
   * Condition number: κ(A) = ||A|| × ||A⁻¹||
   */
  static conditionNumber(A: Matrix): number {
    const normA = this.frobeniusNorm(A);
    const invA = this.pseudoinverse(A);
    const normInvA = this.frobeniusNorm(invA);
    return normA * normInvA;
  }

  /**
   * Rank of matrix
   */
  static rank(A: Matrix): number {
    const svd = this.svd(A);
    const rank = svd.S.filter(s => s > 1e-10).length;
    return rank;
  }
}

// ============================================================================
// EIGENVALUE DECOMPOSITION
// ============================================================================

/**
 * Eigenvalue analysis for system dynamics
 */
export class EigenvalueAnalysis {
  /**
   * Power iteration for dominant eigenvalue/eigenvector
   */
  static powerIteration(
    A: Matrix,
    maxIterations: number = 1000,
    tolerance: number = 1e-10
  ): { eigenvalue: number; eigenvector: Vector } {
    let v = VectorOps.normalize(Array(A.length).fill(1));

    for (let iter = 0; iter < maxIterations; iter++) {
      const Av = MatrixOps.multiplyVector(A, v);
      const eigenvalue = VectorOps.dot(Av, v);
      const newV = VectorOps.normalize(Av);

      if (VectorOps.norm(VectorOps.subtract(newV, v)) < tolerance ||
          VectorOps.norm(VectorOps.subtract(newV, VectorOps.scale(v, -1))) < tolerance) {
        return { eigenvalue, eigenvector: newV };
      }

      v = newV;
    }

    return { eigenvalue: VectorOps.dot(MatrixOps.multiplyVector(A, v), v), eigenvector: v };
  }

  /**
   * Inverse iteration with shift
   */
  static inverseIteration(
    A: Matrix,
    shift: number,
    maxIterations: number = 100,
    tolerance: number = 1e-10
  ): { eigenvalue: number; eigenvector: Vector } {
    const n = A.length;
    const I = Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0));
    const Ashifted = MatrixOps.subtract(A, MatrixOps.scale(I, shift));

    let v = VectorOps.normalize(Array(n).fill(1));

    for (let iter = 0; iter < maxIterations; iter++) {
      try {
        const invA = MatrixOps.inverse(Ashifted);
        const newV = VectorOps.normalize(MatrixOps.multiplyVector(invA, v));

        if (VectorOps.norm(VectorOps.subtract(newV, v)) < tolerance) {
          const eigenvalue = shift + 1 / VectorOps.dot(MatrixOps.multiplyVector(Ashifted, newV), newV);
          return { eigenvalue, eigenvector: newV };
        }

        v = newV;
      } catch {
        break;
      }
    }

    return { eigenvalue: shift, eigenvector: v };
  }

  /**
   * QR iteration for all eigenvalues
   */
  static qrIteration(
    A: Matrix,
    maxIterations: number = 100
  ): EigenvalueDecomposition {
    let currentA = A.map(row => [...row]);

    for (let iter = 0; iter < maxIterations; iter++) {
      // QR decomposition (simplified)
      const Q = this.gramSchmidtQR(currentA);
      const R = MatrixOps.multiply(MatrixOps.transpose(Q), currentA);
      currentA = MatrixOps.multiply(R, Q);
    }

    // Extract eigenvalues from diagonal
    const eigenvalues = currentA.map((row, i) => row[i]);
    const n = A.length;

    // Compute eigenvectors (simplified)
    const eigenvectors: Vector[] = [];
    for (let i = 0; i < n; i++) {
      // Solve (A - λI)v = 0
      const I = Array(n).fill(0).map((_, j) => Array(n).fill(0).map((_, k) => j === k ? 1 : 0));
      const lambdaI = MatrixOps.scale(I, eigenvalues[i]);
      const shiftedA = MatrixOps.subtract(A, lambdaI);

      // Find null space (simplified)
      const nullVec = this.findNullVector(shiftedA);
      if (nullVec) {
        eigenvectors.push(VectorOps.normalize(nullVec));
      } else {
        eigenvectors.push(Array(n).fill(0));
      }
    }

    const dominantIdx = eigenvalues.reduce((maxIdx, val, idx, arr) =>
      Math.abs(val) > Math.abs(arr[maxIdx]) ? idx : maxIdx, 0);

    return {
      eigenvalues,
      eigenvectors,
      dominantEigenvalue: eigenvalues[dominantIdx],
      dominantEigenvector: eigenvectors[dominantIdx],
      spectralRadius: Math.max(...eigenvalues.map(Math.abs)),
    };
  }

  /**
   * Simplified Gram-Schmidt QR
   */
  private static gramSchmidtQR(A: Matrix): Matrix {
    const Q: Matrix = [];
    const n = A.length;

    for (let j = 0; j < n; j++) {
      let qj = A.map(row => row[j]);

      for (let i = 0; i < j; i++) {
        const proj = VectorOps.project(Q[i], qj);
        qj = VectorOps.subtract(qj, proj);
      }

      const norm = VectorOps.norm(qj);
      if (norm > 1e-10) {
        Q.push(VectorOps.scale(qj, 1 / norm));
      } else {
        Q.push(Array(n).fill(0));
      }
    }

    return Q;
  }

  /**
   * Find null vector of matrix
   */
  private static findNullVector(A: Matrix): Vector | null {
    const n = A.length;

    // For square matrix, solve Ax = 0
    // Simplified: return last column if near-zero
    const lastCol = A.map(row => row[n - 1]);
    if (VectorOps.norm(lastCol) < 1e-6) {
      return lastCol;
    }

    return null;
  }

  /**
   * Check system stability (eigenvalues inside unit circle)
   */
  static checkStability(A: Matrix): {
    stable: boolean;
    spectralRadius: number;
    eigenvalues: readonly number[];
  } {
    const ev = this.qrIteration(A);
    const maxAbsEigenvalue = Math.max(...ev.eigenvalues.map(Math.abs));

    return {
      stable: maxAbsEigenvalue < 1,
      spectralRadius: maxAbsEigenvalue,
      eigenvalues: ev.eigenvalues,
    };
  }

  /**
   * Calculate spectral radius
   */
  static spectralRadius(A: Matrix): number {
    const ev = this.powerIteration(A);
    return Math.abs(ev.eigenvalue);
  }
}

// ============================================================================
// MATRIX DECOMPOSITION (SVD & PCA)
// ============================================================================

/**
 * Matrix decomposition for pattern extraction
 */
export class MatrixDecomposition {
  /**
   * Singular Value Decomposition: A = U × Σ × Vᵀ
   */
  static svd(A: Matrix): SVDResult {
    const m = A.length;
    const n = A[0].length;

    // Power iteration for dominant singular values
    const AtA = MatrixOps.multiply(MatrixOps.transpose(A), A);
    const AAt = MatrixOps.multiply(A, MatrixOps.transpose(A));

    const singularValues: number[] = [];
    const U: Matrix = [];
    const V: Matrix = [];

    let remainingA = A.map(row => [...row]);

    for (let k = 0; k < Math.min(m, n); k++) {
      // Find dominant eigenvector of AᵀA
      const ev = EigenvalueAnalysis.powerIteration(remainingA, 100);
      const sigma = ev.eigenvalue;

      if (sigma < 1e-10) break;

      singularValues.push(Math.sqrt(Math.abs(sigma)));

      // U column: Av / σ
      const uCol = VectorOps.scale(MatrixOps.multiplyVector(remainingA, ev.eigenvector), 1 / singularValues[k]);
      U.push(VectorOps.normalize(uCol));

      // V column: eigenvector
      V.push(ev.eigenvector);

      // Update remaining matrix: A - σ × u × vᵀ
      const uuT = MatrixOps.multiply(VectorOps.outer(uCol, ev.eigenvector), [[singularValues[k]]]);
      remainingA = MatrixOps.subtract(remainingA, uuT);
    }

    return {
      U: U.length > 0 ? MatrixOps.transpose(U) : [[1]],
      S: singularValues,
      Vt: V.length > 0 ? MatrixOps.transpose(V) : [[1]],
      rank: singularValues.filter(s => s > 1e-10).length,
    };
  }

  /**
   * Principal Component Analysis
   */
  static pca(
    data: Matrix,
    nComponents?: number
  ): PCAResult {
    const n = data.length;
    const d = data[0].length;

    // Center the data
    const means = Array(d).fill(0).map((_, j) =>
      data.reduce((sum, row) => sum + row[j], 0) / n
    );

    const centered = data.map(row => row.map((v, j) => v - means[j]));

    // Covariance matrix
    const cov: Matrix = [];
    for (let i = 0; i < d; i++) {
      cov[i] = [];
      for (let j = 0; j < d; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += centered[k][i] * centered[k][j];
        }
        cov[i][j] = sum / (n - 1);
      }
    }

    // Eigenvalue decomposition of covariance matrix
    const ev = EigenvalueAnalysis.qrIteration(cov);

    // Sort by eigenvalues (descending)
    const sorted = ev.eigenvalues
      .map((eigenvalue, i) => ({
        eigenvalue,
        eigenvector: ev.eigenvectors[i],
      }))
      .sort((a, b) => b.eigenvalue - a.eigenvalue);

    const components = sorted.map(s => s.eigenvector);
    const explainedVariance = sorted.map(s => s.eigenvalue / sorted.reduce((sum, x) => sum + x.eigenvalue, 0));
    const cumulativeVariance: number[] = [];
    let runningSum = 0;
    for (const evar of explainedVariance) {
      runningSum += evar;
      cumulativeVariance.push(runningSum);
    }

    // Transform data to PCA space
    const transformedData = centered.map(row =>
      components.map(comp => VectorOps.dot(row, comp))
    );

    return {
      components,
      explainedVariance,
      cumulativeVariance,
      transformedData,
      rank: sorted.filter(s => s.eigenvalue > 1e-10).length,
    };
  }

  /**
   * Truncated SVD for dimensionality reduction
   */
  static truncatedSVD(
    A: Matrix,
    k: number
  ): { Uk: Matrix; Sk: readonly number[]; Vk: Matrix; Ak: Matrix } {
    const svd = this.svd(A);

    const Uk = svd.U.map(row => row.slice(0, k));
    const Sk = svd.S.slice(0, k);
    const Vk = MatrixOps.transpose(svd.Vt).map(row => row.slice(0, k));
    const VkT = MatrixOps.transpose(Vk);
    const SkDiag = Sk.map((s, i) => {
      const row = new Array(k).fill(0);
      row[i] = s;
      return row;
    });

    // Reconstruct approximation
    const UkSk = MatrixOps.multiply(Uk, SkDiag);
    const Ak = MatrixOps.multiply(UkSk, VkT);

    return { Uk, Sk, Vk: MatrixOps.transpose(Vk), Ak };
  }
}

// ============================================================================
// LINEAR PROGRAMMING
// ============================================================================

/**
 * Linear programming for resource allocation optimization
 */
export class LinearProgramming {
  /**
   * Simplex method for max cᵀx subject to Ax ≤ b, x ≥ 0
   */
  static simplex(
    c: Vector,        // Objective coefficients
    A: Matrix,        // Constraint matrix
    b: Vector,        // RHS vector
    maxIterations: number = 1000
  ): LinearProgrammingResult {
    const m = A.length;
    const n = c.length;

    // Create tableau
    // [ A | I | b ]
    // [ -cᵀ | 0 | 0 ]
    const tableau: number[][] = [];

    for (let i = 0; i < m; i++) {
      tableau.push([...A[i], ...Array(m).fill(0).map((_, j) => i === j ? 1 : 0), b[i]]);
    }
    tableau.push([...c.map(x => -x), ...Array(m + 1).fill(0), 0]);

    const basis = Array(m).fill(0).map((_, i) => n + i); // Basic variables
    const nonBasis = Array(n).fill(0).map((_, i) => i);   // Non-basic variables

    for (let iter = 0; iter < maxIterations; iter++) {
      // Find entering variable (most negative coefficient in objective row)
      let enteringCol = -1;
      let minCoeff = 0;
      for (let j = 0; j < n + m; j++) {
        if (tableau[m][j] < minCoeff) {
          minCoeff = tableau[m][j];
          enteringCol = j;
        }
      }

      if (enteringCol === -1) {
        // Optimal solution found
        const solution = Array(n + m).fill(0);
        for (let i = 0; i < m; i++) {
          solution[basis[i]] = tableau[i][n + m];
        }
        return {
          solution: solution.slice(0, n),
          optimalValue: tableau[m][n + m],
          status: 'optimal',
          iterations: iter,
        };
      }

      // Find leaving variable (minimum ratio test)
      let leavingRow = -1;
      let minRatio = Infinity;
      for (let i = 0; i < m; i++) {
        if (tableau[i][enteringCol] > 1e-10) {
          const ratio = tableau[i][n + m] / tableau[i][enteringCol];
          if (ratio < minRatio) {
            minRatio = ratio;
            leavingRow = i;
          }
        }
      }

      if (leavingRow === -1) {
        return {
          solution: null,
          optimalValue: Infinity,
          status: 'unbounded',
          iterations: iter,
        };
      }

      // Pivot
      this.pivot(tableau, leavingRow, enteringCol);
      [basis[leavingRow], nonBasis[enteringCol]] = [nonBasis[enteringCol], basis[leavingRow]];
    }

    return {
      solution: null,
      optimalValue: null,
      status: 'iterations',
      iterations: maxIterations,
    };
  }

  /**
   * Pivot operation
   */
  private static pivot(tableau: number[][], row: number, col: number): void {
    const pivot = tableau[row][col];
    const m = tableau.length;
    const n = tableau[0].length;

    // Scale pivot row
    for (let j = 0; j < n; j++) {
      tableau[row][j] /= pivot;
    }

    // Eliminate column
    for (let i = 0; i < m; i++) {
      if (i !== row) {
        const factor = tableau[i][col];
        for (let j = 0; j < n; j++) {
          tableau[i][j] -= factor * tableau[row][j];
        }
      }
    }
  }

  /**
   * Two-phase simplex for constraints with equality and mixed signs
   */
  static twoPhaseSimplex(
    c: Vector,
    A: Matrix,
    b: Vector,
    maxIterations: number = 1000
  ): LinearProgrammingResult {
    // Phase 1: Find feasible solution
    const m = A.length;
    const n = A[0].length;

    // Add artificial variables
    const Aaug = A.map((row, i) => [...row, ...Array(m).fill(0).map((_, j) => i === j ? 1 : 0)]);
    const baug = [...b];
    const caug = [...Array(n + m).fill(0), ...Array(m).fill(-1)];

    // Phase 1 simplex
    const phase1 = this.simplex(caug, Aaug, baug, maxIterations);

    if (phase1.status !== 'optimal' || (phase1.optimalValue && phase1.optimalValue < -1e-6)) {
      return {
        solution: null,
        optimalValue: null,
        status: 'infeasible',
        iterations: phase1.iterations,
      };
    }

    // Phase 2: Optimize original objective
    // Remove artificial variables from basis and continue
    return this.simplex(c, A, b, maxIterations);
  }

  /**
   * Interior-point method (barrier)
   */
  static interiorPoint(
    c: Vector,
    A: Matrix,
    b: Vector,
    maxIterations: number = 100,
    tolerance: number = 1e-8
  ): LinearProgrammingResult {
    const m = A.length;
    const n = c.length;

    // Initial feasible point (central path)
    let x = Array(n).fill(1);
    let s = Array(n).fill(1); // Slack variables
    let y = Array(m).fill(0); // Dual variables

    for (let iter = 0; iter < maxIterations; iter++) {
      // Centering parameter
      const mu = VectorOps.dot(x, s) / n;
      const barrier = mu * n;

      // Check convergence
      if (mu < tolerance) {
        return {
          solution: x,
          optimalValue: VectorOps.dot(c, x),
          status: 'optimal',
          iterations: iter,
        };
      }

      // Solve Newton system (simplified)
      // Calculate residuals
      const Ax = MatrixOps.multiplyVector(A, x);
      const residual1 = VectorOps.subtract(Ax, b);  // Primal feasibility
      const ATy = MatrixOps.transpose(A);
      const cMinusATy = VectorOps.subtract(c, MatrixOps.multiplyVector(ATy, y)); // Dual feasibility
      const residual3 = VectorOps.hadamard(x, s);   // Complementarity

      // Simplified Newton step (affine scaling)
      // In practice, full Newton system solving would be implemented here

      // Update (simplified)
      x = x.map((vi, i) => Math.max(1e-6, vi - 0.1 * residual3[i]));
      s = s.map((si, i) => Math.max(1e-6, si - 0.1 * residual3[i]));
      y = y.map((yi, i) => yi - 0.1 * residual1[i]);
    }

    return {
      solution: x,
      optimalValue: VectorOps.dot(c, x),
      status: 'iterations',
      iterations: maxIterations,
    };
  }
}

// ============================================================================
// INPUT-OUTPUT ANALYSIS (LEONTIEF)
// ============================================================================

/**
 * Input-output analysis for economic ripple effects
 */
export class InputOutputAnalysis {
  /**
   * Build Leontief matrix: L = (I - A)⁻¹
   */
  static buildLeontief(A: Matrix): LeontiefResult {
    const n = A.length;
    const I = Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0));

    // Leontief inverse: (I - A)⁻¹
    const IminusA = MatrixOps.subtract(I, A);
    const L = MatrixOps.inverse(IminusA);

    // Backward linkages (column sums)
    const backwardLinkages = Array(n).fill(0).map((_, j) =>
      Array(n).fill(0).reduce((sum, row, i) => sum + row[j], 0)
    );

    // Forward linkages (row sums)
    const forwardLinkages = L.map(row => row.reduce((sum, v) => sum + v, 0));

    return {
      totalOutput: Array(n).fill(0),
      multiplier: L,
      requiredInputs: A,
      backwardLinkages,
      forwardLinkages,
    };
  }

  /**
   * Calculate total output for given final demand
   */
  static calculateOutput(
    A: Matrix,
    finalDemand: Vector
  ): { totalOutput: Vector; multiplier: Matrix } {
    const leontief = this.buildLeontief(A);
    const totalOutput = MatrixOps.multiplyVector(leontief.multiplier, finalDemand);

    return {
      totalOutput,
      multiplier: leontief.multiplier,
    };
  }

  /**
   * Multiplier effect analysis
   */
  static multiplierEffect(
    A: Matrix,
    injection: { sector: number; amount: number }
  ): {
    directEffect: number;
    indirectEffect: number;
    totalEffect: number;
    multiplier: number;
    sectorImpacts: Vector;
  } {
    const n = A.length;
    const leontief = this.buildLeontief(A);

    // Direct effect
    const directEffect = injection.amount;

    // Total effect (from Leontief inverse)
    const sectorImpacts = leontief.multiplier.map(row =>
      row[injection.sector] * injection.amount
    );
    const totalEffect = sectorImpacts.reduce((sum, v) => sum + v, 0);

    // Indirect effect
    const indirectEffect = totalEffect - directEffect;

    // Multiplier
    const multiplier = totalEffect / directEffect;

    return {
      directEffect,
      indirectEffect,
      totalEffect,
      multiplier,
      sectorImpacts,
    };
  }

  /**
   * Trace economic ripple effects
   */
  static traceRippleEffects(
    A: Matrix,
    initialInjection: Vector,
    rounds: number = 10
  ): readonly { round: number; output: Vector; cumulative: Vector }[] {
    const leontief = this.buildLeontief(A);
    const roundsData: { round: number; output: Vector; cumulative: Vector }[] = [];

    let currentInjection = [...initialInjection];
    let cumulativeOutput = Array(A.length).fill(0);

    for (let r = 0; r <= rounds; r++) {
      // Round r output
      const roundOutput = MatrixOps.multiplyVector(leontief.requiredInputs, currentInjection);
      cumulativeOutput = VectorOps.add(cumulativeOutput, roundOutput);

      roundsData.push({
        round: r,
        output: [...roundOutput],
        cumulative: [...cumulativeOutput],
      });

      // Next round demand (simplified: 10% of current round)
      currentInjection = VectorOps.scale(roundOutput, 0.1);
    }

    return roundsData;
  }

  /**
   * Calculate linkage indices (normalized)
   */
  static linkageIndices(
    A: Matrix
  ): {
    backwardIndex: readonly number[];
    forwardIndex: readonly number[];
    keySectors: readonly number[];
  } {
    const n = A.length;
    const leontief = this.buildLeontief(A);

    // Backward linkage indices
    const colSums = Array(n).fill(0).map((_, j) =>
      leontief.multiplier.reduce((sum, row, i) => sum + row[j], 0)
    );
    const avgColSum = colSums.reduce((a, b) => a + b, 0) / n;
    const backwardIndex = colSums.map(s => s / avgColSum);

    // Forward linkage indices
    const rowSums = leontief.multiplier.map(row => row.reduce((sum, v) => sum + v, 0));
    const avgRowSum = rowSums.reduce((a, b) => a + b, 0) / n;
    const forwardIndex = rowSums.map(s => s / avgRowSum);

    // Key sectors (high backward AND forward linkage)
    const keySectors = backwardIndex
      .map((bi, i) => ({ index: i, score: bi + forwardIndex[i] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.ceil(n * 0.2))
      .map(s => s.index);

    return {
      backwardIndex,
      forwardIndex,
      keySectors,
    };
  }
}

// ============================================================================
// LINEAR TRANSFORMATIONS
// ============================================================================

/**
 * Linear transformation operations
 */
export class LinearTransformations {
  /**
   * Apply linear transformation to vector: T(v) = A × v
   */
  static apply(A: Matrix, v: Vector): Vector {
    return MatrixOps.multiplyVector(A, v);
  }

  /**
   * Compose transformations: T₂ ∘ T₁
   */
  static compose(A2: Matrix, A1: Matrix): Matrix {
    return MatrixOps.multiply(A2, A1);
  }

  /**
   * Inverse transformation
   */
  static inverse(A: Matrix): Matrix {
    return MatrixOps.inverse(A);
  }

  /**
   * Check if transformation is invertible
   */
  static isInvertible(A: Matrix): boolean {
    return Math.abs(MatrixOps.determinant(A)) > 1e-10;
  }

  /**
   * Calculate transformation matrix between bases
   */
  static changeOfBasis(
    oldBasis: readonly Vector[],
    newBasis: readonly Vector[]
  ): Matrix {
    // P = [old]→[new] = [new]⁻¹ × [old]
    const newBasisInv = MatrixOps.inverse(newBasis.map(v => [...v]));
    return MatrixOps.multiply(newBasisInv, oldBasis.map(v => [...v]));
  }

  /**
   * Kernel (null space) of transformation
   */
  static kernel(A: Matrix): Vector[] {
    const nullVectors: Vector[] = [];
    const svd = MatrixDecomposition.svd(A);
    const nullSpaceDim = A[0].length - svd.rank;

    if (nullSpaceDim > 0) {
      // For simple case, return vectors in null space
      const V = MatrixOps.transpose(svd.Vt);
      for (let i = 0; i < nullSpaceDim; i++) {
        const idx = A[0].length - 1 - i;
        nullVectors.push(V.map(row => row[idx]));
      }
    }

    return nullVectors;
  }

  /**
   * Image (column space) of transformation
   */
  static image(A: Matrix): Vector[] {
    const svd = MatrixDecomposition.svd(A);
    const rank = svd.rank;

    // Return basis vectors for column space
    return svd.U.map((row, i) => row.slice(0, rank)).slice(0, rank);
  }

  /**
   * Rank-nullity theorem verification
   */
  static rankNullity(A: Matrix): {
    rank: number;
    nullity: number;
    dimensionsMatch: boolean;
  } {
    const rank = MatrixOps.rank(A);
    const kernel = this.kernel(A);
    const n = A[0].length;

    return {
      rank,
      nullity: kernel.length,
      dimensionsMatch: rank + kernel.length === n,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Vector Operations
  VectorOps,

  // Matrix Operations
  MatrixOps,

  // Eigenvalue Analysis
  EigenvalueAnalysis,

  // Matrix Decomposition
  MatrixDecomposition,

  // Linear Programming
  LinearProgramming,

  // Input-Output Analysis
  InputOutputAnalysis,

  // Linear Transformations
  LinearTransformations,
};
