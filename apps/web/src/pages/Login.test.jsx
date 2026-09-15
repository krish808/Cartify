import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

// ✅ Mock the navigate function so we can assert redirects without a real router history
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ✅ Mock the login thunk itself — we're testing the FORM's behavior
// (validation, dispatch call, navigation), not re-testing the real API
// call, which is already covered by our backend integration tests.
vi.mock("../store/authSlice", () => {
  const login = vi.fn();
  login.fulfilled = { match: (action) => action?.type === "login/fulfilled" };
  return { login };
});

import { login } from "../store/authSlice";

const renderLogin = (authState = { loading: false, error: null }) => {
  const store = configureStore({
    reducer: { auth: () => authState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>,
  );
};

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation errors when submitting empty fields", async () => {
    renderLogin();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("dispatches login with entered credentials on valid submit", async () => {
    login.mockReturnValue({ type: "login/rejected" }); // doesn't matter for this test
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/enter your password/i), "mypassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "mypassword",
    });
  });

  it("navigates to / on successful login", async () => {
    login.mockReturnValue({ type: "login/fulfilled" });
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/enter your password/i), "mypassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("does NOT navigate when login fails", async () => {
    login.mockReturnValue({ type: "login/rejected" });
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/enter your password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows a server error message from Redux state", () => {
    renderLogin({ loading: false, error: "Invalid credentials" });

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("disables the submit button and shows a spinner while loading", () => {
    renderLogin({ loading: true, error: null });

    const button = screen.getByRole("button", { name: /signing in/i });
    expect(button).toBeDisabled();
  });

  it("toggles password visibility when the eye icon is clicked", async () => {
    renderLogin();
    const user = userEvent.setup();

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    // the toggle button has no accessible name, so find it by its position
    // near the password field instead
    const toggleButton = passwordInput.parentElement.querySelector(
      'button[type="button"]',
    );
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
  });
});