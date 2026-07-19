import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { paymentsService, type Payment } from "@/services/paymentsService";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/_app/payments/$id")({
  component: PaymentDetailsPage,
});

function PaymentDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await paymentsService.get(id);
      setPayment(p ?? null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading payment..." />;

  if (!payment) {
    return (
      <div>
        <PageHeader title="Payment not found" />
        <Button variant="outline" onClick={() => navigate({ to: "/payments" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to payments
        </Button>
      </div>
    );
  }

  const rows: [string, React.ReactNode][] = [
    ["Payment ID", payment.id],
    ["Order ID", <Link to="/orders" className="text-primary hover:underline">{payment.orderId}</Link>],
    ["Customer", payment.customer],
    ["Amount", `$${payment.amount.toFixed(2)}`],
    ["Method", payment.method],
    ["Status", <StatusBadge status={payment.status} />],
    ["Transaction Ref", payment.transactionRef],
    ["Card", payment.cardLast4 ? `•••• ${payment.cardLast4}` : "—"],
    ["Created", new Date(payment.createdAt).toLocaleString()],
  ];

  return (
    <div>
      <PageHeader
        title={`Payment ${payment.id}`}
        description="Transaction details"
        actions={
          <Button variant="outline" asChild>
            <Link to="/payments">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3">
                <dt className="text-sm font-medium text-muted-foreground">{k}</dt>
                <dd className="text-sm sm:col-span-2">{v}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
