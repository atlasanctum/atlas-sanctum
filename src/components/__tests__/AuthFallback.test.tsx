import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AuthFallback from "../AuthFallback";

// Component that throws the exact auth context error
function Broken(): JSX.Element {
  throw new Error("useAuth must be used within an AuthProvider");
}

// Minimal local ErrorBoundary mirroring SentryErrorBoundary behaviour
class TestBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

describe("AuthFallback", () => {
  it("renders fallback UI when auth context is missing instead of blank screen", () => {
    // Silence expected error log
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <TestBoundary fallback={<AuthFallback />}>
        <Broken />
      </TestBoundary>
    );
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reload/i })).toBeInTheDocument();
    spy.mockRestore();
  });
});