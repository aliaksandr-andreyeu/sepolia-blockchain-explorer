import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/components/search/SearchBar";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("SearchBar", () => {
  afterEach(() => {
    cleanup();
  });

  it("navigates to block page on block number search", async () => {
    const user = userEvent.setup();
    push.mockClear();

    render(<SearchBar />);

    await user.type(
      screen.getByPlaceholderText(/Search by Address/i),
      "10976937",
    );
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(push).toHaveBeenCalledWith("/block/10976937");
  });

  it("shows error for invalid query", async () => {
    const user = userEvent.setup();
    push.mockClear();

    render(<SearchBar />);

    await user.type(
      screen.getByPlaceholderText(/Search by Address/i),
      "invalid-query",
    );
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(
      screen.getByText(/Invalid format/i),
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
