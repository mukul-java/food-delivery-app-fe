import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Wallet, Landmark, Banknote, CheckCircle2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, FormWrapper, SubmitButton } from "@/components/forms";
import { EmptyState } from "@/components/common/EmptyState";
import { currency } from "@/utils/currency";
import { cn } from "@/lib/utils";

type Method = "CARD" | "UPI" | "NET_BANKING" | "CASH";

const METHODS: { id: Method; label: string; icon: typeof CreditCard }[] = [
  { id: "CARD", label: "Card", icon: CreditCard },
  { id: "UPI", label: "UPI", icon: Wallet },
  { id: "NET_BANKING", label: "Net Banking", icon: Landmark },
  { id: "CASH", label: "Cash on Delivery", icon: Banknote },
];

export const Route = createFileRoute("/_shop/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — FoodDash" },
      { name: "description", content: "Complete your order and payment." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, totals, clear } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("CARD");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  if (placed) {
    return (
      <div className="mx-auto max-w-md py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Order placed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Order <span className="font-mono font-semibold">{placed}</span> is being prepared.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild variant="outline">
            <Link to="/restaurants">Order again</Link>
          </Button>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link to="/track">Track order</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to checkout"
        description="Your cart is empty."
        action={
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link to="/restaurants">Browse restaurants</Link>
          </Button>
        }
      />
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const orderNo = `ORD-${Math.floor(100000 + Math.random() * 899999)}`;
    clear();
    setPlaced(orderNo);
    setSubmitting(false);
    toast.success("Payment successful");
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card className="border-orange-100">
            <CardContent className="p-5">
              <h2 className="mb-4 font-semibold">Delivery Address</h2>
              <FormWrapper onSubmit={onSubmit} id="checkout-form">
                <FormField
                  id="street"
                  label="Street"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Main St"
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    id="city"
                    label="City"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Springfield"
                  />
                  <FormField
                    id="zip"
                    label="Zip Code"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="90001"
                  />
                </div>
              </FormWrapper>
            </CardContent>
          </Card>

          <Card className="border-orange-100">
            <CardContent className="p-5">
              <h2 className="mb-4 font-semibold">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {METHODS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-sm transition-all",
                      method === id
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-border hover:border-orange-200",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit border-orange-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <h2 className="mb-4 font-semibold">Order Summary</h2>
            <ul className="mb-3 space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.foodItemId} className="flex justify-between">
                  <span className="min-w-0 truncate">
                    {i.quantity}× {i.name}
                  </span>
                  <span className="ml-2 shrink-0">
                    {currency(i.price * i.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="my-3 border-t border-dashed border-orange-200" />
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{currency(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd>{currency(totals.deliveryFee)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd>{currency(totals.tax)}</dd>
              </div>
              <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{currency(totals.total)}</dd>
              </div>
            </dl>
            <SubmitButton
              form="checkout-form"
              loading={submitting}
              loadingText="Processing..."
              className="mt-5 w-full bg-orange-500 hover:bg-orange-600"
            >
              Pay {currency(totals.total)}
            </SubmitButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
