import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock("../store/authSlice", () => {
  const register = vi.fn();
  register.fulfilled = { match: () => false };
  return { register };
});

const renderRegister = () => {
  const store = configureStore({
    reducer: { auth: () => ({ loading: false, error: null }) },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Register page - password visibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("password field starts masked and toggles independently", async () => {
    renderRegister();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText(/create a password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const passwordToggle = passwordInput.parentElement.querySelector(
      'button[type="button"]',
    );
    await user.click(passwordToggle);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("confirm password field starts masked and toggles independently, without affecting the password field", async () => {
    renderRegister();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText(/create a password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);

    // ✅ this is the exact regression check for the bug we just fixed —
    // confirm password must render with a valid, lowercase "password" type
    expect(confirmInput).toHaveAttribute("type", "password");

    const confirmToggle = confirmInput.parentElement.querySelector(
      'button[type="button"]',
    );
    await user.click(confirmToggle);

    expect(confirmInput).toHaveAttribute("type", "text");
    // ✅ toggling confirm's visibility must NOT affect the password field
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("toggling password visibility does not affect confirm password", async () => {
    renderRegister();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText(/create a password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm your password/i);

    const passwordToggle = passwordInput.parentElement.querySelector(
      'button[type="button"]',
    );
    await user.click(passwordToggle);

    expect(passwordInput).toHaveAttribute("type", "text");
    // ✅ confirm field should remain untouched
    expect(confirmInput).toHaveAttribute("type", "password");
  });
});