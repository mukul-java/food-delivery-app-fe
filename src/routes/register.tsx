import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { UtensilsCrossed } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { FormField, FormWrapper, SubmitButton } from "@/components/forms";
import { minLength, matches } from "@/utils/validation";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minLength(password, 6))
      return toast.error("Password must be at least 6 characters");
    if (!matches(password, confirm)) return toast.error("Passwords do not match");
    setSubmitting(true);
    try {
      await register(username, password);
      toast.success("Account created");
      navigate({ to: ROUTES.DASHBOARD });
    } catch (err) {
      toast.error((err as Error).message ?? "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-6 w-6" aria-hidden />
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Get started with the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper onSubmit={onSubmit} aria-label="Register form">
            <FormField
              id="username"
              label="Username"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="At least 6 characters"
            />
            <FormField
              id="confirm"
              label="Confirm password"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <SubmitButton className="w-full" loading={submitting}>
              Create account
            </SubmitButton>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
