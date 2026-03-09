import { Button, Input, Card } from "@cartify/ui";

export default function App() {
  return (
    <div className="p-10 space-y-4">
      <Card>
        <h2 className="text-xl mb-2">Admin Login</h2>
        <Input label="Email" />
        <Input label="Password" type="password" />
        <Button>Login</Button>
      </Card>
    </div>
  );
}
