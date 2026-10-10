import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Profile from "./Profile";

vi.mock("../store/authSlice", () => {
  const updateProfile = vi.fn();
  updateProfile.fulfilled = {
    match: (action) => action?.type === "auth/updateProfile/fulfilled",
  };
  const clearProfileError = vi.fn(() => ({ type: "auth/clearProfileError" }));
  return { updateProfile, clearProfileError };
});

import { updateProfile } from "../store/authSlice";

const currentUser = {
  _id: "u1",
  name: "Test User",
  email: "test@example.com",
  role: "customer",
};

const renderProfile = (authState = {}) => {
  const store = configureStore({
    reducer: {
      auth: () => ({
        user: currentUser,
        profileLoading: false,
        profileError: null,
        ...authState,
      }),
    },
  });

  return render(
    <Provider store={store}>
      <Profile />
    </Provider>,
  );
};

describe("Profile page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateProfile.mockReturnValue({ type: "auth/updateProfile/rejected" });
  });

  it("prefills the form with the current name and email", () => {
    renderProfile();

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Test User");
    expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
  });

  it("disables Save while nothing has changed", () => {
    renderProfile();

    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeDisabled();
  });

  it("enables Save once a field changes", async () => {
    renderProfile();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/full name/i), "x");

    expect(screen.getByRole("button", { name: /save changes/i })).toBeEnabled();
  });

  it("sends only the name when only the name changed", async () => {
    renderProfile();
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(updateProfile).toHaveBeenCalledWith({ name: "New Name" });
  });

  it("sends only the email when only the email changed", async () => {
    renderProfile();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    await user.clear(emailInput);
    await user.type(emailInput, "new@example.com");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(updateProfile).toHaveBeenCalledWith({ email: "new@example.com" });
  });

  it("trims whitespace before sending", async () => {
    renderProfile();
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "  Padded Name  ");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(updateProfile).toHaveBeenCalledWith({ name: "Padded Name" });
  });

  it("rejects a too-short name without calling the API", async () => {
    renderProfile();
    const user = userEvent.setup();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "A");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      screen.getByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("rejects an invalid email without calling the API", async () => {
    renderProfile();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    await user.clear(emailInput);
    await user.type(emailInput, "not-an-email");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("shows the server error from state", () => {
    renderProfile({ profileError: "Email is already in use" });

    expect(screen.getByText("Email is already in use")).toBeInTheDocument();
  });

  it("disables the button and shows a saving label while loading", () => {
    renderProfile({ profileLoading: true });

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });
});
