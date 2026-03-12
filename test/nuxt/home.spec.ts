import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, beforeEach, expect, it, vi } from "vitest";

import Home from "../../app/pages/index.vue";

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

describe("Home page", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockReset();
  });

  it("Render initial element correctly", async () => {
    const wrapper = await mountSuspended(Home);

    expect(wrapper.text()).toContain("AnyRanks");
    expect(wrapper.text()).toContain("No list yet");
  });

  it("adds item to list", async () => {
    const wrapper = await mountSuspended(Home);

    const input = wrapper.find('[data-test="input-main"]');
    await input.setValue("Naruto");

    await wrapper.find("form").trigger("submit");

    expect(wrapper.text()).toContain("Naruto");
  });

  it("Block duplicate item", async () => {
    const wrapper = await mountSuspended(Home);

    const input = wrapper.find('[data-test="input-main"]');
    await input.setValue("Luffy");
    await wrapper.find("form").trigger("submit");

    await input.setValue("Luffy");
    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(wrapper.text()).toContain("Same name");
    expect(wrapper.findAll("li").length).toBe(1);
  });

  it("Remove item", async () => {
    const wrapper = await mountSuspended(Home);

    const input = wrapper.find('[data-test="input-main"]')
    await input.setValue("Ichigo");
    await wrapper.find("form").trigger("submit");

    const removeButton = wrapper.find('[data-test="remove-item-button"]');
    await removeButton.trigger("click");

    expect(wrapper.text()).not.toContain("Ichigo");
    expect(wrapper.findAll("li").length).toBe(0);
  });

  it("startSort save localStorage and navigate to /sort", async () => {
    const wrapper = await mountSuspended(Home);

    const input = wrapper.find('[data-test="input-main"]');
    await input.setValue("Saitama");
    await wrapper.find("form").trigger("submit");
    await input.setValue("Genos");
    await wrapper.find("form").trigger("submit");

    const sortButton = wrapper.find(".sort-button");
    await sortButton.trigger("click");

    const stored = JSON.parse(localStorage.getItem("@anyranks") || "{}");

    expect(stored.temp_items.length).toBe(2);
    expect(push).toHaveBeenCalledWith("/sort");
  });

  it("onMounted clean temp_items", async () => {
    localStorage.setItem(
      "@anyranks",
      JSON.stringify({ temp_items: "Pikachu" })
    );

    await mountSuspended(Home);

    const stored = JSON.parse(localStorage.getItem("@anyranks") || "{}");

    expect(stored.temp_items).toEqual([]);
  });
});
