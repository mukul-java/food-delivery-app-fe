import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Star, MapPin, Utensils, ArrowRight } from "lucide-react";
import { restaurantService } from "@/services/restaurantService";
import type { RestaurantSummary } from "@/types/restaurant";
import { PageHeader } from "@/components/PageHeader";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/restaurants/")({
  component: RestaurantsPage,
});

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("ALL");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data || []);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cuisines = [
    "ALL",
    ...Array.from(
      new Set(
        restaurants
          .map((r) => r.cuisineType)
          .filter((c): c is string => Boolean(c))
      )
    ),
  ];

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCuisine =
      selectedCuisine === "ALL" || r.cuisineType === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explore Restaurants"
        description="Discover delicious food from top restaurants near you"
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants or cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {cuisines.map((c) => (
            <Button
              key={c}
              variant={selectedCuisine === c ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCuisine(c)}
              className="text-xs capitalize"
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Discovering restaurants..." />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <Utensils className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No restaurants found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or cuisine filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <Card
              key={r.id}
              className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 border-muted"
            >
              {/* Header Visual */}
              <div className="h-36 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-4 flex flex-col justify-between relative">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="bg-background/90 font-medium">
                    {r.cuisineType || "Multi-Cuisine"}
                  </Badge>
                  <div className="flex items-center gap-1 bg-background/90 px-2 py-1 rounded-full text-xs font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{r.rating ? r.rating.toFixed(1) : "4.5"}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white drop-shadow-md truncate">
                  {r.name}
                </h3>
              </div>

              <CardContent className="flex-1 p-5 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {r.description || "Fresh and hot food delivered fast to your doorstep."}
                </p>

                {r.address && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">
                      {r.address.street}, {r.address.city}
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-5 pt-0">
                <Button asChild className="w-full gap-2 font-medium">
                  <Link to="/restaurants/$id" params={{ id: r.id }}>
                    View Menu & Order
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
