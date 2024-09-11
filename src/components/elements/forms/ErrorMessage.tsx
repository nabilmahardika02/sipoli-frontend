import Typography from "../Typography";

export default function ErrorMessage({ children }: { children: string }) {
  return (
    <div className="flex space-x-1">
      <Typography variant="p3" className="text-danger !leading-tight">
        {children}
      </Typography>
    </div>
  );
}
