var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _reactstart from "@tanstack/react-start";
import * as _errorpage from "./lib/error-page";

const errorMiddleware = _reactstart.createMiddleware.call(void 0).server(async ({ next }) => {
      try {
        return await next();
      } catch (error) {
        if (error != null && typeof error === "object" && "statusCode" in error) {
          throw error;
        }
        console.error(error);
        return new Response(_errorpage.renderErrorPage.call(void 0), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" }
        });
      }
    });
    const startInstance = _reactstart.createStart(() => ({
      requestMiddleware: [errorMiddleware]
    }));
export { startInstance };
