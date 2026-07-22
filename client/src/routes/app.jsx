import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { getAuth } from "firebase/auth";

export const Route = createFileRoute("/app")({
  // Server-side / pre-render guard: redirect to /login if not authenticated
  beforeLoad: async () => {
    // In SSR context Firebase isn't available — skip guard
    if (typeof window === "undefined") return;
    const auth = getAuth();
    // Wait briefly for auth to initialise (onAuthStateChanged fires asynchronously)
    const user = await new Promise((resolve) => {
      const unsub = auth.onAuthStateChanged((u) => {
        unsub();
        resolve(u);
      });
    });
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
