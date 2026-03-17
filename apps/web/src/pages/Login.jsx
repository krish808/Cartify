import { useState } from "react";
import { Button, Input, Container, Section } from "@cartify/ui";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      setEmail("");
      setPassword("");

      navigate("/");
    }
  };

  return (
    <Section className="py-10 min-h-[50vh] flex items-center justify-center bg-gray-50">
      <Container>
        <div className="py-10 mx-auto bg-white shadow-md rounded-xl p-10 max-w-md">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Login to Cartify
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full py-3 text-lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account?{" "}
            <span className="text-blue-600 cursor-pointer">Sign up</span>
          </p>
        </div>
      </Container>
    </Section>
  );
}
