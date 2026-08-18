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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { isEmail } from "@/utils/validator";
import { ROUTES } from "@/constants/routes";
import { APP_LABELS } from "@/constants/labels";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { UserRole } from "@/types/auth";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

interface FormErrors {
  fullName?: string;
  username?: string;
  password?: string;
  confirm?: string;
  phoneNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("CUSTOMER");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    else if (fullName.trim().length < 3)
      e.fullName = "Full name must be at least 3 characters";

    if (!username.trim()) e.username = "Email is required";
    else if (!isEmail(username)) e.username = "Enter a valid email address";

    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";

    if (!confirm) e.confirm = "Please confirm your password";
    else if (confirm !== password) e.confirm = "Passwords do not match";

    if (!phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(phoneNumber))
      e.phoneNumber = "Phone number must be exactly 10 digits";

    if (!street.trim()) e.street = "Street is required";
    if (!city.trim()) e.city = "City is required";
    if (!state.trim()) e.state = "State is required";

    if (!zipCode.trim()) e.zipCode = "Zip code is required";
    else if (!/^\d{6}$/.test(zipCode))
      e.zipCode = "Zip code must be exactly 6 digits";

    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        fullName: fullName.trim(),
        username: username.trim(),
        password,
        phoneNumber: Number(phoneNumber),
        userRole,
        address: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
        },
      });
      toast.success("Registration successful. Please sign in.");
      navigate({ to: ROUTES.LOGIN });
    } catch (err) {
      toast.error((err as Error).message ?? "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-lg shadow-xl border-border overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900" />
        <CardHeader className="space-y-3 text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <UtensilsCrossed className="h-7 w-7" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Create your account
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs sm:text-sm">
            Join {APP_LABELS.APP_NAME} to order delicious food
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <FormWrapper onSubmit={onSubmit} aria-label="Register form">
            <FormField
              id="fullName"
              label="Full Name"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
            />
            <FormField
              id="username"
              label="Email"
              type="email"
              required
              autoComplete="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="password"
                label="Password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint="At least 6 characters"
                error={errors.password}
              />
              <FormField
                id="confirm"
                label="Confirm password"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={errors.confirm}
              />
            </div>
            <FormField
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              inputMode="numeric"
              required
              autoComplete="tel"
              maxLength={10}
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/\D/g, ""))
              }
              error={errors.phoneNumber}
            />
            <div className="space-y-2">
              <Label htmlFor="userRole">Account Type</Label>
              <Select value={userRole} onValueChange={(val) => setUserRole(val as UserRole)}>
                <SelectTrigger id="userRole">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="RESTAURANT_OWNER">Restaurant Owner</SelectItem>
                  <SelectItem value="DELIVERY_PARTNER">Delivery Partner</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormField
              id="street"
              label="Street"
              required
              autoComplete="street-address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              error={errors.street}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                id="city"
                label="City"
                required
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={errors.city}
              />
              <FormField
                id="state"
                label="State"
                required
                autoComplete="address-level1"
                value={state}
                onChange={(e) => setState(e.target.value)}
                error={errors.state}
              />
              <FormField
                id="zipCode"
                label="Zip Code"
                inputMode="numeric"
                required
                autoComplete="postal-code"
                maxLength={6}
                value={zipCode}
                onChange={(e) =>
                  setZipCode(e.target.value.replace(/\D/g, ""))
                }
                error={errors.zipCode}
              />
            </div>
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
