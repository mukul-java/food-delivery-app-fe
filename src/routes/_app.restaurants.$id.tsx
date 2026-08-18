import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  Utensils,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Search,
} from "lucide-react";
import { restaurantService } from "@/services/restaurantService";
import type { RestaurantDetail, FoodItemSummary } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";
import { currency } from "@/utils/currency";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_app/restaurants/$id")({
  component: RestaurantDetailPage,
});

function RestaurantDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { cart, addItem, updateItemQuantity, openCart } = useCart();

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await restaurantService.getRestaurant(id);
        setRestaurant(res);

        // Fetch food items for this restaurant
        const items = await restaurantService.getFoodItems(id);
        setFoodItems(items || res.foodItems || []);
      } catch (err) {
        console.error("Failed to fetch restaurant details", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading menu items..." />;
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Utensils className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Restaurant Not Found</h2>
        <Button className="mt-4" onClick={() => navigate({ to: ROUTES.RESTAURANTS })}>
          Back to Restaurants
        </Button>
      </div>
    );
  }

  const categories = [
    "ALL",
    ...Array.from(
      new Set(
        foodItems
          .map((item) => item.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    ),
  ];

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate({ to: ROUTES.RESTAURANTS })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Restaurants
      </Button>

      {/* Restaurant Header Banner */}
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-none font-medium">
                  {restaurant.cuisineType || "Multi-Cuisine"}
                </Badge>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  <span>{restaurant.rating ? restaurant.rating.toFixed(1) : "4.5"}</span>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold">{restaurant.name}</h1>
              <p className="text-white/90 text-sm mt-1 max-w-xl">
                {restaurant.description || "Delivering fresh & high quality meals right to you."}
              </p>
            </div>

            {cart && cart.restaurantId === restaurant.id && cart.items.length > 0 && (
              <Button
                onClick={openCart}
                className="bg-white text-zinc-900 hover:bg-zinc-100 font-bold gap-2 shadow-md"
              >
                <ShoppingCart className="h-4 w-4" />
                View Cart ({cart.items.reduce((acc, i) => acc + i.quantity, 0)})
              </Button>
            )}
          </div>

          {restaurant.address && (
            <div className="flex items-center gap-2 text-xs text-white/80 pt-2 border-t border-white/20">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>
                {restaurant.address.street}, {restaurant.address.city},{" "}
                {restaurant.address.state} {restaurant.address.zipCode}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Food Items List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <Utensils className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-3 text-sm font-medium">No menu items found in this section</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const inCartItem = cart?.items.find((i) => i.foodItemId === item.id);
            const currentQty = inCartItem?.quantity || 0;

            return (
              <Card key={item.id} className="flex flex-col justify-between p-4 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">{item.name}</h3>
                      {item.category && (
                        <Badge variant="outline" className="text-[10px] uppercase font-normal">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <p className="text-base font-bold text-primary pt-1">
                      {currency(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    {item.availableQuantity > 0 ? (
                      <span className="text-green-600 font-medium">In Stock</span>
                    ) : (
                      <span className="text-destructive font-medium">Out of Stock</span>
                    )}
                  </span>

                  {currentQty > 0 ? (
                    <div className="flex items-center gap-2 rounded-md border bg-muted/40 p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateItemQuantity(item.id, currentQty - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {currentQty}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateItemQuantity(item.id, currentQty + 1)}
                        disabled={item.availableQuantity <= currentQty}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-1 font-semibold"
                      disabled={item.availableQuantity <= 0}
                      onClick={() =>
                        addItem(restaurant.id, {
                          id: item.id,
                          name: item.name,
                          price: item.price,
                        })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
