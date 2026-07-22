import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Star, MapPin, Phone, Plus, Utensils } from "lucide-react";
import { restaurantsService } from "@/services/restaurantsService";
import type { Restaurant, FoodItem } from "@/types/restaurant";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cartService } from "@/services/cartService";
import { currency } from "@/utils/currency";

export const Route = createFileRoute("/_shop/restaurants/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Restaurant Menu — FoodDash` },
      { name: "description", content: `View the menu and order online. #${params.id}` },
    ],
  }),
  component: RestaurantDetailPage,
  notFoundComponent: () => (
    <div className="py-16 text-center">
      <h2 className="text-xl font-semibold">Restaurant not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The restaurant you're looking for doesn't exist.
      </p>
      <Button asChild variant="outline" className="mt-4">
        <Link to="/restaurants">Back to restaurants</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="py-16 text-center">
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset} variant="outline" className="mt-4">Retry</Button>
    </div>
  ),
});

function RestaurantDetailPage() {
  const { id } = Route.useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restaurantsService.get(id).then((r) => {
      if (!r) throw notFound();
      setRestaurant(r);
      setLoading(false);
    });
  }, [id]);

  if (loading || !restaurant) return <LoadingSpinner label="Loading menu..." />;

  const onAdd = (item: FoodItem) => {
    cartService.add(item, restaurant.name);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/restaurants">
          <ArrowLeft className="mr-1 h-4 w-4" aria-hidden /> All restaurants
        </Link>
      </Button>

      <section className="mb-6 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200">
          <Utensils className="h-16 w-16 text-orange-600" aria-hidden />
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{restaurant.name}</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {restaurant.description}
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              <Star className="mr-1 h-3 w-3 fill-current" aria-hidden />
              {restaurant.rating.toFixed(1)}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden />
              {restaurant.address.address}, {restaurant.address.city},{" "}
              {restaurant.address.state} {restaurant.address.zipcode}
            </span>
            {restaurant.contactInfo?.[0] && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-4 w-4" aria-hidden />
                {restaurant.contactInfo[0]}
              </span>
            )}
          </div>
        </div>
      </section>

      <h2 className="mb-3 text-lg font-semibold">Menu</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {restaurant.foodItems.map((item) => (
          <Card key={item.id} className="border-orange-100">
            <CardContent className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <h3 className="font-medium">{item.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-2 text-sm font-semibold text-orange-600">
                  {currency(item.price)}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => onAdd(item)}
                className="shrink-0 bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="mr-1 h-4 w-4" aria-hidden /> Add
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
