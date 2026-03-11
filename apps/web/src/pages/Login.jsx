import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Input, Container, Section } from "@cartify/ui";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setEmail("");
      setPassword("");

      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };
  return (
    <Section className="py-10 min-h-[50vh] flex items-center justify-center bg-gray-50">
      <Container>
        <div className=" py-10 mx-auto bg-white shadow-md rounded-xl p-10">
          <h2 className="text-3xl font-semibold text-center mb-8 ">
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
            <Button type="submit" className="w-full py-3 text-lg">
              Login
            </Button>
          </form>
          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account ?{" "}
            <span className="text-blue-600 cursor-pointer">Sign up</span>
          </p>
        </div>
      </Container>
    </Section>
  );
}
