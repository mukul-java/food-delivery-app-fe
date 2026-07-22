import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { currency } from "@/utils/currency";

export const Route = createFileRoute("/_shop/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — FoodDash" },
      { name: "description", content: "Review your order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, totals, setQuantity, remove } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-10">
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title="Your cart is empty"
          description="Browse restaurants and add your favorite items."
          action={
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link to="/restaurants">Browse restaurants</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const restaurantName = items[0]?.restaurantName;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight">Your Cart</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Ordering from <span className="font-medium text-orange-600">{restaurantName}</span>
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((it) => (
            <Card key={it.foodItemId} className="border-orange-100">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{it.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currency(it.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 p-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-orange-100"
                    onClick={() => setQuantity(it.foodItemId, it.quantity - 1)}
                    aria-label={`Decrease ${it.name}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">
                    {it.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-orange-100"
                    onClick={() => setQuantity(it.foodItemId, it.quantity + 1)}
                    aria-label={`Increase ${it.name}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="w-20 text-right font-semibold">
                  {currency(it.price * it.quantity)}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                  onClick={() => remove(it.foodItemId)}
                  aria-label={`Remove ${it.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit border-orange-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <h2 className="mb-4 font-semibold">Order Summary</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Subtotal" value={currency(totals.subtotal)} />
              <Row label="Delivery Fee" value={currency(totals.deliveryFee)} />
              <Row label="Tax (8%)" value={currency(totals.tax)} />
              <div className="my-2 border-t border-dashed border-orange-200" />
              <Row label="Total" value={currency(totals.total)} bold />
            </dl>
            <Button
              className="mt-5 w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => navigate({ to: "/checkout" })}
            >
              Proceed to Checkout
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link to="/restaurants">Add more items</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-semibold" : ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
