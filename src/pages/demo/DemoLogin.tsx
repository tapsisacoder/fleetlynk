import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DemoLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("john@masvingohaul.co.zw");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/demo/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-[hsl(221,47%,12%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
            <span className="text-white font-bold text-2xl">LF</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">LynkFleet</h1>
          <p className="text-gray-600">Login to your fleet control center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <button className="text-accent font-medium hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
