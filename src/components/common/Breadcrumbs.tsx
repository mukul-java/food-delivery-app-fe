import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { Fragment, useMemo } from "react";
import { titleize } from "@/utils";

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const parts = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname],
  );

  if (parts.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-3 hidden text-sm text-muted-foreground sm:block">
      <ol className="flex flex-wrap items-center gap-1">
        <li className="flex items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 hover:text-foreground"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </li>
        {parts.map((part, i) => {
          const isLast = i === parts.length - 1;
          const label = titleize(decodeURIComponent(part));
          return (
            <Fragment key={`${part}-${i}`}>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <li>
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <span>{label}</span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
