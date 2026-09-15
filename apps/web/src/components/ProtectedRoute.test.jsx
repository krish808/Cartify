import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// ✅ minimal fake auth reducer — just enough state for this component to
// read `state.auth.isAuthenticated`, without needing the real authSlice
// (and its real API calls, thunks, etc.)
const createTestStore = (isAuthenticated) =>
  configureStore({
    reducer: {
      auth: () => ({ isAuthenticated }),
    },
  });

const renderProtectedRoute = (isAuthenticated) => {
  const store = createTestStore(isAuthenticated);

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Secret Dashboard Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe("ProtectedRoute", () => {
  it("renders the protected children when authenticated", () => {
    renderProtectedRoute(true);

    expect(screen.getByText("Secret Dashboard Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    renderProtectedRoute(false);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(
      screen.queryByText("Secret Dashboard Content"),
    ).not.toBeInTheDocument();
  });
});