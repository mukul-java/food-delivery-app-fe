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
import { ThemeToggle } from "@/components/ThemeToggle";
import { ROUTES } from "@/constants/routes";
import { APP_LABELS } from "@/constants/labels";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({
        username,
        password,
      }); toast.success("Welcome back!");
      navigate({ to: ROUTES.DASHBOARD });
    } catch (err) {
      toast.error((err as Error).message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-xl border-border overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900" />
        <CardHeader className="space-y-3 text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <UtensilsCrossed className="h-7 w-7" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Sign in to {APP_LABELS.APP_NAME}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs sm:text-sm">
            {APP_LABELS.APP_DESCRIPTION}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <FormWrapper onSubmit={onSubmit} aria-label="Sign in form">
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <SubmitButton className="w-full h-11 font-semibold text-sm shadow-xs" loading={submitting}>
              Sign in
            </SubmitButton>
            <p className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="font-semibold text-primary hover:underline"
              >
                Register now
              </Link>
            </p>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
