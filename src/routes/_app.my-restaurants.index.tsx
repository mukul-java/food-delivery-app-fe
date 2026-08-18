import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Store, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { restaurantService } from "@/services/restaurantService";
import type { RestaurantSummary } from "@/types/restaurant";
import { ROUTES } from "@/constants/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormWrapper, SubmitButton } from "@/components/forms";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/_app/my-restaurants/")({
  component: MyRestaurantsPage,
});

function MyRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
    } catch (err) {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDialog = (restaurant?: RestaurantSummary) => {
    if (restaurant) {
      setEditingId(restaurant.id);
      setName(restaurant.name);
      setDescription(restaurant.description || "");
      setCuisineType(restaurant.cuisineType || "");
      setStreet(restaurant.address?.street || "");
      setCity(restaurant.address?.city || "");
      setState(restaurant.address?.state || "");
      setZipCode(restaurant.address?.zipCode || restaurant.address?.zipcode || "");
    } else {
      setEditingId(null);
      setName("");
      setDescription("");
      setCuisineType("");
      setStreet("");
      setCity("");
      setState("");
      setZipCode("");
    }
    setErrors({});
    setDialogOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!street.trim()) e.street = "Street is required";
    if (!city.trim()) e.city = "City is required";
    if (!state.trim()) e.state = "State is required";
    if (!zipCode.trim()) e.zipCode = "Zip code is required";
    else if (!/^\d{6}$/.test(zipCode)) e.zipCode = "Zip code must be 6 digits";
    return e;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      const payload = {
        name,
        description,
        cuisineType,
        address: { street, city, state, zipCode, zipcode: zipCode },
        ownerInfo: user ? {
          ownerName: user.username,
          email: user.username,
          phone: 0,
        } : undefined,
      };

      if (editingId) {
        await restaurantService.updateRestaurant(editingId, payload);
        toast.success("Restaurant updated successfully");
      } else {
        await restaurantService.addRestaurant(payload);
        toast.success("Restaurant created successfully");
      }
      
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error((err as Error).message || "Failed to save restaurant");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Restaurants"
        description="Manage your restaurants and their menus"
        actions={
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Restaurant
          </Button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : restaurants.length === 0 ? (
        <Card className="flex h-[400px] flex-col items-center justify-center text-center">
          <Store className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No restaurants found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            You haven't added any restaurants yet.
          </p>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add your first restaurant
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="line-clamp-1">{restaurant.name}</CardTitle>
                  <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-8 w-8 text-muted-foreground" onClick={() => openDialog(restaurant)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Restaurant</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="line-clamp-2">{restaurant.description || "No description provided."}</p>
                  {restaurant.cuisineType && (
                    <p><span className="font-medium text-foreground">Cuisine:</span> {restaurant.cuisineType}</p>
                  )}
                  {restaurant.address && (
                    <p className="line-clamp-1">
                      <span className="font-medium text-foreground">Location:</span> {restaurant.address.city}, {restaurant.address.state}
                    </p>
                  )}
                </div>
                <Button asChild className="w-full">
                  <Link to={ROUTES.MY_RESTAURANTS_DETAILS} params={{ id: restaurant.id }}>
                    Manage Menu
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Restaurant" : "Add New Restaurant"}</DialogTitle>
          </DialogHeader>
          <FormWrapper onSubmit={handleSave} aria-label="Restaurant form">
            <FormField
              id="name"
              label="Restaurant Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <FormField
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormField
              id="cuisineType"
              label="Cuisine Type"
              placeholder="e.g. Italian, Indian, Fast Food"
              value={cuisineType}
              onChange={(e) => setCuisineType(e.target.value)}
            />
            <h4 className="mt-4 text-sm font-medium">Address</h4>
            <FormField
              id="street"
              label="Street"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              error={errors.street}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                id="city"
                label="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={errors.city}
              />
              <FormField
                id="state"
                label="State"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                error={errors.state}
              />
              <FormField
                id="zipCode"
                label="Zip Code"
                inputMode="numeric"
                required
                maxLength={6}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                error={errors.zipCode}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <SubmitButton loading={submitting}>{editingId ? "Save Changes" : "Create Restaurant"}</SubmitButton>
            </div>
          </FormWrapper>
        </DialogContent>
      </Dialog>
    </div>
  );
}
