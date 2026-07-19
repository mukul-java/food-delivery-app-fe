import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      throw redirect({ to: token ? "/dashboard" : "/login" });
    }
    throw redirect({ to: "/login" });
  },
  component: () => null,
});
