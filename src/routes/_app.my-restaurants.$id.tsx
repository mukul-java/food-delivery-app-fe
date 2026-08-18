import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { restaurantService } from "@/services/restaurantService";
import type { RestaurantDetail, FoodItemSummary } from "@/types/restaurant";
import { ROUTES } from "@/constants/routes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormWrapper, SubmitButton } from "@/components/forms";
import { currency } from "@/utils/currency";

export const Route = createFileRoute("/_app/my-restaurants/$id")({
  component: RestaurantDetailsPage,
});

function RestaurantDetailsPage() {
  const { id } = Route.useParams();
  const restaurantId = id;
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItemSummary | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.getRestaurant(restaurantId);
      setRestaurant(data);
    } catch (err) {
      toast.error("Failed to load restaurant details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [restaurantId]);

  const openDialog = (item?: FoodItemSummary) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setDescription(item.description || "");
      setPrice(item.price.toString());
      setCategory(item.category || "");
      setAvailableQuantity(item.availableQuantity.toString());
    } else {
      setEditingItem(null);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setAvailableQuantity("");
    }
    setErrors({});
    setDialogOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!price || isNaN(Number(price))) e.price = "Valid price is required";
    if (!availableQuantity || isNaN(Number(availableQuantity))) e.availableQuantity = "Valid quantity is required";
    return e;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      if (editingItem) {
        await restaurantService.updateFoodItem({
          id: editingItem.id,
          restaurantId,
          name,
          description,
          price: Number(price),
          category,
          availableQuantity: Number(availableQuantity),
        });
        toast.success("Food item updated");
      } else {
        await restaurantService.addFoodItem({
          restaurantId,
          name,
          description,
          price: Number(price),
          category,
          availableQuantity: Number(availableQuantity),
        });
        toast.success("Food item added");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error((err as Error).message || "Failed to save food item");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <div>
      <PageHeader
        title={restaurant.name}
        description={restaurant.description || "Manage your restaurant's menu"}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={ROUTES.MY_RESTAURANTS}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </Button>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Food Item
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="mt-1 font-semibold text-foreground">
                {restaurant.active !== false ? "Active" : "Inactive"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Cuisine Type</dt>
              <dd className="mt-1 font-semibold text-foreground">{restaurant.cuisineType || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Location</dt>
              <dd className="mt-1 font-semibold text-foreground">
                {restaurant.address ? `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state} ${restaurant.address.zipCode || restaurant.address.zipcode || ""}` : "—"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <h3 className="mb-4 text-xl font-semibold">Menu Items</h3>
      {!(restaurant.foodItems && restaurant.foodItems.length > 0) ? (
        <Card className="flex h-32 items-center justify-center text-muted-foreground">
          No menu items found. Add some to get started!
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(restaurant.foodItems || []).map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    {item.category && <p className="text-xs text-muted-foreground">{item.category}</p>}
                  </div>
                  <div className="font-semibold">{currency(item.price)}</div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description || "No description"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Qty: {item.availableQuantity}</span>
                  <Button variant="outline" size="sm" onClick={() => openDialog(item)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Food Item" : "Add Food Item"}</DialogTitle>
          </DialogHeader>
          <FormWrapper onSubmit={handleSave} aria-label="Food item form">
            <FormField
              id="name"
              label="Item Name"
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
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="price"
                label="Price"
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={errors.price}
              />
              <FormField
                id="availableQuantity"
                label="Available Quantity"
                type="number"
                min="0"
                required
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                error={errors.availableQuantity}
              />
            </div>
            <FormField
              id="category"
              label="Category"
              placeholder="e.g. Starters, Main Course, Desserts"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <SubmitButton loading={submitting}>{editingItem ? "Save Changes" : "Add Item"}</SubmitButton>
            </div>
          </FormWrapper>
        </DialogContent>
      </Dialog>
    </div>
  );
}
