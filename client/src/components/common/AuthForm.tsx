import { useState, FormEvent, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading, setError } from "../../features/auth/authSlice";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface AuthFormProps {
  title: string;
  fields: { name: string; type: string; placeholder: string }[];
  onSubmit: (formData: Record<string, string>) => Promise<void>;
}

const AuthForm = ({ title, fields, onSubmit }: AuthFormProps) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const getErrorMessage = (error: string | null, status?: number) => {
    if (!error) return null;
    switch (status) {
      case 400:
        return "Invalid input. Please check your details.";
      case 401:
        return "Invalid credentials. Please try again.";
      case 429:
        return "Too many attempts. Please try again later.";
      default:
        return error;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await onSubmit(formData);
    } catch (err: any) {
      dispatch(setError(err.error || err.message || "An error occurred"));
      dispatch(setError(getErrorMessage(err.error || err.message, err.status)));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <Input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Loading..." : title}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
