import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, CheckCircle2, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersService, type OrderResponse } from "@/services/ordersService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/common/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatNumber } from "@/utils/formatNumber";
import { ROUTES } from "@/constants/routes";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [stats, setStats] = useState<{
    total: number;
    delivered: number;
    pending: number;
    revenue: number;
  } | null>(null);
  const [recent, setRecent] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, r] = await Promise.all([
        ordersService.stats(),
        ordersService.list({ page: 1, pageSize: 5 }),
      ]);
      setStats(s);
      setRecent(r.data);
      setLoading(false);
    })();
  }, []);

  if (loading || !stats) return <LoadingSpinner label="Loading dashboard..." />;

  const cards = [
    { label: "Total Orders", value: formatNumber(stats.total), icon: ShoppingBag, color: "text-blue-600" },
    { label: "Delivered", value: formatNumber(stats.delivered), icon: CheckCircle2, color: "text-emerald-600" },
    { label: "In Progress", value: formatNumber(stats.pending), icon: Clock, color: "text-amber-600" },
    { label: "Revenue", value: formatCurrency(stats.revenue), icon: DollarSign, color: "text-purple-600" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your food delivery operations" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard
            key={c.label}
            label={c.label}
            value={c.value}
            icon={c.icon}
            iconClassName={c.color}
          />
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/orders">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((o) => (
                  <TableRow key={o.orderNumber}>
                    <TableCell className="font-medium">#{o.orderNumber}</TableCell>
                    <TableCell>{o.userName}</TableCell>
                    <TableCell>{o.restaurantName}</TableCell>
                    <TableCell>${o.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={o.orderStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
