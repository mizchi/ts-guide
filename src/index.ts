/**
 * このモジュールの説明
 */
export function index() {
  return true;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test("init", () => {
    expect(index()).toBe(true);
  });
}
