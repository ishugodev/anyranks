import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, beforeEach, expect, it, vi } from "vitest";

import Sort from "../../app/pages/sort.vue";

const push = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
}));

const localStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => (store[key] = value),
    clear: () => (store = {}),
  };
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock(),
});

describe("Sort page", () => {
  const tempItems = [{ text: "Naruto" }, { text: "Goku" }, { text: "Luffy" }];

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      "@anyranks",
      JSON.stringify({ temp_items: tempItems })
    );
    push.mockReset();
  });

  it("redirects to home if no temp_items", async () => {
    localStorage.setItem("@anyranks", JSON.stringify({ temp_items: [] }));
    await mountSuspended(Sort);
    expect(push).toHaveBeenCalledWith("/");
  });

  it("loads temp_items from localStorage", async () => {
    const wrapper = await mountSuspended(Sort);

    expect(wrapper.vm.items.length).toBe(3);
    expect(wrapper.vm.currentIndex).toBe(0);
    expect(wrapper.vm.finished).toBe(false);
  });

  it("chooses an item and increments score", async () => {
    const wrapper = await mountSuspended(Sort);

    const pair = wrapper.vm.comparisons[0];
    const firstItem = pair[0];
    const initialScore = firstItem.score;

    wrapper.vm.choose(firstItem);

    expect(firstItem.score).toBe(initialScore + 1);
    expect(wrapper.vm.history.length).toBe(1);
  });

  it("likeBoth increments score of both items", async () => {
    const wrapper = await mountSuspended(Sort);

    const [a, b] = wrapper.vm.comparisons[0];
    const scoreA = a.score;
    const scoreB = b.score;

    wrapper.vm.likeBoth();

    expect(a.score).toBe(scoreA + 1);
    expect(b.score).toBe(scoreB + 1);
    expect(wrapper.vm.history.length).toBe(1);
  });

  it("goBack returns to previous comparison", async () => {
    const wrapper = await mountSuspended(Sort);

    wrapper.vm.choose(wrapper.vm.comparisons[0][0]);
    expect(wrapper.vm.currentIndex).toBe(1);

    wrapper.vm.goBack();
    expect(wrapper.vm.currentIndex).toBe(0);
    expect(wrapper.vm.history.length).toBe(0);
  });

  it("finishes ranking and saves result to localStorage", async () => {
    const wrapper = await mountSuspended(Sort);

    wrapper.vm.currentIndex = wrapper.vm.comparisons.length;
    wrapper.vm.finishRanking();

    const stored = JSON.parse(localStorage.getItem("@anyranks") || "{}");
    expect(wrapper.vm.finished).toBe(true);
    expect(stored.result).toBeDefined();
    expect(stored.result.length).toBe(3);
  });

  it("restart resets scores, comparisons, and state", async () => {
    const wrapper = await mountSuspended(Sort);

    wrapper.vm.choose(wrapper.vm.comparisons[0][0]);
    wrapper.vm.restart();

    expect(wrapper.vm.items.every((item) => item.score === 0)).toBe(true);
    expect(wrapper.vm.currentIndex).toBe(0);
    expect(wrapper.vm.history.length).toBe(0);
    expect(wrapper.vm.finished).toBe(false);
  });
});
