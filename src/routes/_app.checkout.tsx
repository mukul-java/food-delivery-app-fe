import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Building2,
  QrCode,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ordersService } from "@/services/ordersService";
import { paymentsService } from "@/services/paymentsService";
import type { OrderResponse } from "@/types/order";
import type { PaymentResponse, PaymentMethod, PaymentGateway } from "@/types/payment";
import { currency } from "@/utils/currency";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_app/checkout")({
  component: CheckoutPage,
});

type Step = "ADDRESS_REVIEW" | "PAYMENT" | "SUCCESS";

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();

  const [step, setStep] = useState<Step>("ADDRESS_REVIEW");

  // Address State
  const [address, setAddress] = useState({
    street: user?.address?.street || "123 Main St",
    city: user?.address?.city || "Metropolis",
    state: user?.address?.state || "NY",
    zipCode: user?.address?.zipCode || "10001",
    country: user?.address?.country || "USA",
  });

  // Created Order & Payment Results
  const [createdOrder, setCreatedOrder] = useState<OrderResponse | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);

  // Form Loading States
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [gateway, setGateway] = useState<PaymentGateway>("STRIPE");

  // Credit Card Form State
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "4111111111111111",
    cardHolderName: user?.username ? `${user.username}` : "John Doe",
    expiryMonth: "12",
    expiryYear: "2028",
    securityCode: "123",
  });

  const userId = user?.username || (user?.id ? String(user.id) : "guest");

  useEffect(() => {
    if (step === "ADDRESS_REVIEW" && (!cart || cart.items.length === 0)) {
      toast.info("Your cart is empty");
    }
  }, [cart, step]);

  // Step 1: Initiate Order Checkout
  const handleInitiateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setOrderLoading(true);
    try {
      const order = await ordersService.checkout({
        userId,
        address,
      });
      setCreatedOrder(order);
      setStep("PAYMENT");
      toast.success("Order created! Please complete payment.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setOrderLoading(false);
    }
  };

  // Step 2: Submit Payment
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdOrder) {
      toast.error("No active order to pay for");
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentData = {
        orderId: createdOrder.orderId || String((createdOrder as any).id || (createdOrder as any).orderNumber),
        userId,
        amount: createdOrder.totalAmount || cart?.totalAmount || 0,
        currency: "USD" as const,
        paymentMethod,
        gateway,
        creditCard: paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD" ? cardDetails : undefined,
      };

      const result = await paymentsService.processPayment(paymentData);
      setPaymentResult(result);
      setStep("SUCCESS");
      await refreshCart(); // Cart was cleared on order checkout
      toast.success("Payment completed successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Checkout & Payment"
        description="Review your order and complete secure payment"
      />

      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-between border-b pb-4 text-xs font-medium text-muted-foreground">
        <div
          className={`flex items-center gap-2 ${
            step === "ADDRESS_REVIEW" ? "text-primary font-bold" : "text-green-600"
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border text-xs">
            {step !== "ADDRESS_REVIEW" ? <CheckCircle2 className="h-4 w-4" /> : "1"}
          </span>
          <span>1. Delivery & Order</span>
        </div>
        <div className="h-0.5 w-12 bg-muted" />
        <div
          className={`flex items-center gap-2 ${
            step === "PAYMENT" ? "text-primary font-bold" : step === "SUCCESS" ? "text-green-600" : ""
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border text-xs">
            {step === "SUCCESS" ? <CheckCircle2 className="h-4 w-4" /> : "2"}
          </span>
          <span>2. Secure Payment</span>
        </div>
        <div className="h-0.5 w-12 bg-muted" />
        <div
          className={`flex items-center gap-2 ${
            step === "SUCCESS" ? "text-primary font-bold" : ""
          }`}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border text-xs">
            3
          </span>
          <span>3. Order Confirmed</span>
        </div>
      </div>

      {/* STEP 1: Address & Order Review */}
      {step === "ADDRESS_REVIEW" && (
        <form onSubmit={handleInitiateOrder} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Address
                </CardTitle>
                <CardDescription>
                  Enter the address where you want your food delivered.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">Zip / Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {cart && cart.items.length > 0 ? (
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.foodItemId} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold">{currency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between text-sm font-bold pt-2">
                      <span>Total Amount</span>
                      <span className="text-primary">{currency(cart.totalAmount)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No items in cart</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold gap-2"
                  disabled={orderLoading || !cart || cart.items.length === 0}
                >
                  {orderLoading ? "Creating Order..." : "Proceed to Payment"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      )}

      {/* STEP 2: Payment Processing Form */}
      {step === "PAYMENT" && createdOrder && (
        <form onSubmit={handleProcessPayment} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Select Payment Method
                </CardTitle>
                <CardDescription>
                  Choose your preferred payment method and gateway.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="CREDIT_CARD" id="cc" className="peer sr-only" />
                    <Label
                      htmlFor="cc"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <CreditCard className="mb-3 h-6 w-6 text-primary" />
                      <span className="text-xs font-semibold">Credit / Debit Card</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="UPI" id="upi" className="peer sr-only" />
                    <Label
                      htmlFor="upi"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <QrCode className="mb-3 h-6 w-6 text-primary" />
                      <span className="text-xs font-semibold">UPI / Instant Pay</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="NET_BANKING" id="nb" className="peer sr-only" />
                    <Label
                      htmlFor="nb"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Building2 className="mb-3 h-6 w-6 text-primary" />
                      <span className="text-xs font-semibold">Net Banking</span>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="CASH" id="cash" className="peer sr-only" />
                    <Label
                      htmlFor="cash"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <DollarSign className="mb-3 h-6 w-6 text-primary" />
                      <span className="text-xs font-semibold">Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Gateway Selection */}
                <div className="space-y-2 pt-2">
                  <Label className="text-xs font-semibold">Payment Gateway Provider</Label>
                  <div className="flex gap-4">
                    {(["STRIPE", "PAYPAL", "RAZORPAY"] as PaymentGateway[]).map((g) => (
                      <Button
                        key={g}
                        type="button"
                        variant={gateway === g ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGateway(g)}
                        className="text-xs font-medium"
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Credit Card Inputs */}
                {(paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4111 1111 1111 1111"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardHolderName">Cardholder Name</Label>
                      <Input
                        id="cardHolderName"
                        value={cardDetails.cardHolderName}
                        onChange={(e) =>
                          setCardDetails({ ...cardDetails, cardHolderName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expMonth">Exp Month</Label>
                        <Input
                          id="expMonth"
                          placeholder="12"
                          value={cardDetails.expiryMonth}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, expiryMonth: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expYear">Exp Year</Label>
                        <Input
                          id="expYear"
                          placeholder="2028"
                          value={cardDetails.expiryYear}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, expiryYear: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV / CVC</Label>
                        <Input
                          id="cvv"
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardDetails.securityCode}
                          onChange={(e) =>
                            setCardDetails({ ...cardDetails, securityCode: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary Box */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Order Reference</span>
                  <span className="font-mono font-medium text-foreground">
                    {createdOrder.orderId || (createdOrder as any).id || (createdOrder as any).orderNumber}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Status</span>
                  <Badge variant="outline" className="text-[10px]">
                    {createdOrder.orderStatus || "PENDING"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Total Due</span>
                  <span className="text-primary">{currency(createdOrder.totalAmount)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold gap-2 bg-green-600 hover:bg-green-700 text-white"
                  disabled={paymentLoading}
                >
                  <Lock className="h-4 w-4" />
                  {paymentLoading ? "Processing Payment..." : `Pay ${currency(createdOrder.totalAmount)} Now`}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-xs text-muted-foreground"
                  onClick={() => setStep("ADDRESS_REVIEW")}
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Back to Address
                </Button>

                <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground pt-2">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>256-bit SSL Encrypted Secure Checkout</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      )}

      {/* STEP 3: Order & Payment Success Confirmation */}
      {step === "SUCCESS" && (
        <Card className="text-center p-8 border-green-200 bg-green-50/30 dark:bg-green-950/10">
          <CardContent className="space-y-6 max-w-lg mx-auto">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Order & Payment Successful!</h2>
              <p className="text-sm text-muted-foreground">
                Thank you for your order. Your meal is being prepared and will be delivered shortly.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-bold text-foreground">
                  {createdOrder?.orderId || (createdOrder as any)?.id || (createdOrder as any)?.orderNumber}
                </span>
              </div>
              {paymentResult && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-mono text-foreground">{paymentResult.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-primary">
                  {currency(createdOrder?.totalAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <Badge className="bg-green-600 text-white">
                  {paymentResult?.status || paymentResult?.paymentStatus || "COMPLETED"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                onClick={() => navigate({ to: ROUTES.ORDERS })}
                className="gap-2 font-semibold"
              >
                Track My Orders
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: ROUTES.RESTAURANTS })}
              >
                Browse More Food
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
