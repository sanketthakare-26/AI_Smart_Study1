var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _reactquery from "@tanstack/react-query";
import * as _reactrouter from "@tanstack/react-router";
import * as _routeTreegen from "./routeTree.gen";

const getRouter = /* @__PURE__ */ __name(() => {
      const queryClient = new _reactquery.QueryClient();
      const router = _reactrouter.createRouter({
        routeTree: _routeTreegen.routeTree,
        context: { queryClient },
        scrollRestoration: true,
        defaultPreloadStaleTime: 0
      });
      return router;
    }, "getRouter");
export { getRouter };
