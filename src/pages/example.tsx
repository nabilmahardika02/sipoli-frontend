import Button from "@/components/elements/Button";

const ExamplePage = () => {
  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center p-10 w-full">
      <Button>Hello World</Button>
      <Button variant="secondary">Hello World</Button>
      <Button variant="danger">Hello World</Button>
      <Button variant="warning">Hello World</Button>
      <Button variant="success">Hello World</Button>
      <Button variant="outline">Hello World</Button>
    </div>
  );
};

export default ExamplePage;
