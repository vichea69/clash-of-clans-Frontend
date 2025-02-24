import { Button } from "@/components/ui/button";

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center">Hello World</h1>
      <Button variant="default">Click me</Button>
      <Button variant="outline">Click me</Button>
      <Button variant="secondary">Click me</Button>
      <Button variant="ghost">Click me</Button>
      <Button variant="link">Click me</Button>
    </div>
  );
}

export default App;
