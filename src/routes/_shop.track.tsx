import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_shop/track")({
  head: () => ({
    meta: [
      { title: "Track Order — FoodDash" },
      { name: "description", content: "Live order tracking (coming soon)." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg">
        <Package className="h-12 w-12" aria-hidden />
        <Sparkles className="absolute -right-1 -top-1 h-6 w-6 text-yellow-300" aria-hidden />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Live Tracking</h1>
      <p className="mt-2 text-lg font-medium text-orange-600">Coming soon 🚀</p>
      <p className="mt-3 text-sm text-muted-foreground">
        We're building real-time order tracking with live delivery maps and status
        updates. In the meantime, you'll receive email updates on your order.
      </p>
      <Button asChild className="mt-6 bg-orange-500 hover:bg-orange-600">
        <Link to="/restaurants">Back to restaurants</Link>
      </Button>
    </div>
  );
}
