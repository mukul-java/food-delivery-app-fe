import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { UtensilsCrossed, Shield, User, Store, Truck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({
        identity: identity.trim(),
        username: identity.trim(),
        email: identity.trim().includes("@") ? identity.trim() : undefined,
        password,
      });
      toast.success("Welcome back!");
      navigate({ to: ROUTES.DASHBOARD });
    } catch (err) {
      toast.error((err as Error).message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoCredentials = (emailVal: string, passVal: string) => {
    setIdentity(emailVal);
    setPassword(passVal);
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-xl border-border overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 via-primary to-emerald-500" />
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
        <CardContent className="pt-4 space-y-4">
          <FormWrapper onSubmit={onSubmit} aria-label="Sign in form">
            <FormField
              id="identity"
              label="Email or Username"
              required
              autoComplete="username"
              value={identity}
              placeholder="e.g. john@example.com or johndoe"
              onChange={(e) => setIdentity(e.target.value)}
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
          </FormWrapper>

          {/* Quick Demo Pre-fill Options for Backend Role Testing */}
          <div className="rounded-lg border border-border/80 bg-muted/40 p-3 text-xs space-y-2">
            <p className="font-semibold text-foreground text-center">Quick Demo Account Quick-Fill</p>
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[11px] justify-start px-2 gap-1.5"
                onClick={() => setDemoCredentials("john@example.com", "SecretPassword123")}
              >
                <User className="h-3.5 w-3.5 text-blue-500" />
                Customer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[11px] justify-start px-2 gap-1.5"
                onClick={() => setDemoCredentials("owner@example.com", "OwnerPass123")}
              >
                <Store className="h-3.5 w-3.5 text-amber-500" />
                Owner
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[11px] justify-start px-2 gap-1.5"
                onClick={() => setDemoCredentials("driver@example.com", "DriverPass123")}
              >
                <Truck className="h-3.5 w-3.5 text-purple-500" />
                Delivery Agent
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[11px] justify-start px-2 gap-1.5"
                onClick={() => setDemoCredentials("admin@example.com", "AdminPass123")}
              >
                <Shield className="h-3.5 w-3.5 text-rose-500" />
                Admin
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground pt-1">
            Don't have an account?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="font-semibold text-primary hover:underline"
            >
              Register now
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
