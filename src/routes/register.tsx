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
import { isEmail } from "@/utils/validator";
import { ROUTES } from "@/constants/routes";

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
        userRole: "CUSTOMER",
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
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-lg">
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
