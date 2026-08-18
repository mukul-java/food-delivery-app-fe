import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Utensils } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { currency } from "@/utils/currency";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateItemQuantity, removeItem, clearCart, itemCount } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate({ to: ROUTES.CHECKOUT });
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md p-0">
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Your Cart
              {itemCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              )}
            </SheetTitle>
            {cart && cart.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive"
                onClick={clearCart}
              >
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        {!cart || cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Utensils className="h-8 w-8 text-muted-foreground" aria-hidden />
            </div>
            <h3 className="mt-4 text-base font-semibold">Your cart is empty</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Browse restaurants and add delicious meals to your cart!
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                closeCart();
                navigate({ to: ROUTES.RESTAURANTS });
              }}
            >
              Browse Restaurants
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.foodItemId}
                    className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold">{item.name}</h4>
                        {item.specialInstructions && (
                          <p className="text-xs italic text-muted-foreground">
                            "{item.specialInstructions}"
                          </p>
                        )}
                        <p className="mt-1 text-sm font-medium text-primary">
                          {currency(item.price)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.foodItemId)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 rounded-md border bg-background p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.foodItemId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.foodItemId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold">
                        {currency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t bg-muted/20 p-6 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{currency(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-primary">{currency(cart.totalAmount)}</span>
                </div>
              </div>

              <SheetFooter className="sm:flex-col gap-2">
                <Button className="w-full h-11 text-sm font-semibold gap-2" onClick={handleCheckout}>
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
