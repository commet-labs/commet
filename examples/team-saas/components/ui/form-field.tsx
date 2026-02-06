import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, id, ...props }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className={error ? "border-destructive" : ""} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
