import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, MapPin, Utensils } from "lucide-react";
import { restaurantsService } from "@/services/restaurantsService";
import type { Restaurant } from "@/types/restaurant";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/_shop/restaurants/")({
  head: () => ({
    meta: [
      { title: "Browse Restaurants — FoodDash" },
      { name: "description", content: "Find your favorite restaurants and order online." },
      { property: "og:title", content: "Browse Restaurants — FoodDash" },
      { property: "og:description", content: "Find your favorite restaurants and order online." },
    ],
  }),
  component: RestaurantsPage,
});

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    restaurantsService.list({ search }).then((r) => {
      setRestaurants(r);
      setLoading(false);
    });
  }, [search]);

  return (
    <div>
      <section className="mb-6 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 p-6 text-white shadow-md sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Hungry? Order from your favorite spots
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
          Fresh food from local restaurants, delivered to your door.
        </p>
        <div className="mt-4 rounded-lg bg-white p-2 shadow-inner">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search restaurants, cuisines, or cities..."
          />
        </div>
      </section>

      {loading ? (
        <LoadingSpinner label="Loading restaurants..." />
      ) : restaurants.length === 0 ? (
        <EmptyState
          title="No restaurants match your search"
          description="Try a different keyword or clear the search box."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <Link
              key={r.id}
              to="/restaurants/$id"
              params={{ id: r.id }}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-xl"
            >
              <Card className="h-full overflow-hidden border-orange-100 transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100">
                  <Utensils className="h-12 w-12 text-orange-500" aria-hidden />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{r.name}</h3>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      <Star className="mr-1 h-3 w-3 fill-current" aria-hidden />
                      {r.rating.toFixed(1)}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {r.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" aria-hidden />
                    {r.address.city}, {r.address.state}
                    <span className="ml-auto text-orange-600">
                      {r.foodItems.length} items
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
