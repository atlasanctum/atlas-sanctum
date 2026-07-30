import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuth } from "../useAuth";

describe("useAuth smoke", () => {
  it("does not throw when called outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).not.toThrow();
  });

  it("returns a safe default context shape", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current).toMatchObject({
      user: null,
      tokens: null,
      loading: false,
    });
    expect(typeof result.current.signIn).toBe("function");
    expect(typeof result.current.signOut).toBe("function");
  });
});