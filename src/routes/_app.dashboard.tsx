import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, CheckCircle2, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersService } from "@/services/ordersService";
import type { OrderResponse } from "@/types/order";
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
import { currency } from "@/utils/currency";
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
    { label: "In Progress", value: formatNumber(stats.pending), icon: Clock, color: "text-zinc-400" },
    { label: "Revenue", value: currency(stats.revenue), icon: DollarSign, color: "text-purple-600" },
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
            <Link to={ROUTES.ORDERS}>
              View all <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Order #</TableHead>
                  <TableHead scope="col">User</TableHead>
                  <TableHead scope="col">Restaurant</TableHead>
                  <TableHead scope="col">Total</TableHead>
                  <TableHead scope="col">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((o) => (
                  <TableRow key={o.orderId}>
                    <TableCell className="font-medium">{o.orderId}</TableCell>
                    <TableCell>{o.userId}</TableCell>
                    <TableCell>{o.restaurantId}</TableCell>
                    <TableCell>{currency(o.totalAmount)}</TableCell>
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
