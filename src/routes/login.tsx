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
import { ROUTES } from "@/constants/routes";
import { APP_LABELS } from "@/constants/labels";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(username, password);
      toast.success("Welcome back!");
      navigate({ to: ROUTES.DASHBOARD });
    } catch (err) {
      toast.error((err as Error).message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-6 w-6" aria-hidden />
          </div>
          <CardTitle className="text-2xl">
            Sign in to {APP_LABELS.APP_NAME}
          </CardTitle>
          <CardDescription>{APP_LABELS.APP_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper onSubmit={onSubmit} aria-label="Sign in form">
            <FormField
              id="username"
              label="Username"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <SubmitButton className="w-full" loading={submitting}>
              Sign in
            </SubmitButton>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </p>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
