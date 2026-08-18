import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { cartService } from "@/services/cartService";
import type { CartDto, AddToCartRequestDto, CartItem } from "@/types/cart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CartContextType {
  cart: CartDto | null;
  loading: boolean;
  isCartOpen: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    restaurantId: string,
    foodItem: { id: string; name: string; price: number },
    quantity?: number,
    specialInstructions?: string
  ) => Promise<void>;
  removeItem: (foodItemId: string) => Promise<void>;
  updateItemQuantity: (foodItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [conflictModal, setConflictModal] = useState<{
    isOpen: boolean;
    pendingDto: AddToCartRequestDto | null;
  }>({ isOpen: false, pendingDto: null });

  const userId = user?.username || (user?.id ? String(user.id) : "guest");

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await cartService.getCart(userId);
      setCart(res);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const executeAddToCart = async (dto: AddToCartRequestDto, showToast = true) => {
    try {
      const updated = await cartService.addToCart(dto);
      setCart(updated);
      if (showToast) {
        toast.success(`Added ${dto.name} to cart`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update cart");
    }
  };

  const addItem = async (
    restaurantId: string,
    foodItem: { id: string; name: string; price: number },
    quantity = 1,
    specialInstructions = ""
  ) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    const dto: AddToCartRequestDto = {
      userId,
      restaurantId,
      foodItemId: foodItem.id,
      name: foodItem.name,
      price: foodItem.price,
      quantity,
      specialInstructions,
    };

    // Check if cart already has items from another restaurant
    if (cart && cart.restaurantId && cart.restaurantId !== restaurantId && cart.items.length > 0) {
      setConflictModal({ isOpen: true, pendingDto: dto });
      return;
    }

    await executeAddToCart(dto, true);
  };

  const handleConfirmClearAndAdd = async () => {
    if (!conflictModal.pendingDto) return;
    try {
      await cartService.clearCart(userId);
      await executeAddToCart(conflictModal.pendingDto, true);
    } catch (err) {
      toast.error("Failed to replace cart");
    } finally {
      setConflictModal({ isOpen: false, pendingDto: null });
    }
  };

  const removeItem = async (foodItemId: string) => {
    if (!userId) return;
    try {
      const updated = await cartService.removeItem(userId, foodItemId);
      setCart(updated);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const updateItemQuantity = async (foodItemId: string, newQuantity: number) => {
    if (!userId || !cart) return;

    if (newQuantity <= 0) {
      await removeItem(foodItemId);
      return;
    }

    const existingItem = cart.items.find((i) => i.foodItemId === foodItemId);
    if (!existingItem) return;

    // Calculate Delta: Backend CartServiceImpl increments by request.quantity
    const deltaQuantity = newQuantity - existingItem.quantity;
    if (deltaQuantity === 0) return;

    const dto: AddToCartRequestDto = {
      userId,
      restaurantId: cart.restaurantId,
      foodItemId,
      name: existingItem.name,
      price: existingItem.price,
      quantity: deltaQuantity,
      specialInstructions: existingItem.specialInstructions,
    };

    await executeAddToCart(dto, false);
  };

  const clearCart = async () => {
    if (!userId) return;
    try {
      await cartService.clearCart(userId);
      setCart(null);
      toast.info("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const itemCount = cart?.items
    ? cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        itemCount,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}

      <AlertDialog
        open={conflictModal.isOpen}
        onOpenChange={(open) => !open && setConflictModal({ isOpen: false, pendingDto: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start a new cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Your cart currently contains items from another restaurant. Adding items from this restaurant will clear your existing cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClearAndAdd}>
              Clear & Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
