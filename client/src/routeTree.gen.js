var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as ___root from "./routes/__root";
import * as _sitemapxml from "./routes/sitemap[.]xml";
import * as _register from "./routes/register";
import * as _qrdismiss from "./routes/qr-dismiss";
import * as _otp from "./routes/otp";
import * as _login from "./routes/login";
import * as _forgotpassword from "./routes/forgot-password";
import * as _app from "./routes/app";
import * as _index from "./routes/index";
import * as _appindex from "./routes/app.index";
import * as _approfile from "./routes/app.profile";
import * as _appsettings from "./routes/app.settings";
import * as _approoms from "./routes/app.rooms";
import * as _appplanner from "./routes/app.planner";
import * as _appanalytics from "./routes/app.analytics";
import * as _appalarms from "./routes/app.alarms";
import * as _appai from "./routes/app.ai";

const SitemapDotxmlRoute = _sitemapxml.Route.update({
      id: "/sitemap.xml",
      path: "/sitemap.xml",
      getParentRoute: () => ___root.Route
    });
    const RegisterRoute = _register.Route.update({
      id: "/register",
      path: "/register",
      getParentRoute: () => ___root.Route
    });
    const QrDismissRoute = _qrdismiss.Route.update({
      id: "/qr-dismiss",
      path: "/qr-dismiss",
      getParentRoute: () => ___root.Route
    });
    const OtpRoute = _otp.Route.update({
      id: "/otp",
      path: "/otp",
      getParentRoute: () => ___root.Route
    });
    const LoginRoute = _login.Route.update({
      id: "/login",
      path: "/login",
      getParentRoute: () => ___root.Route
    });
    const ForgotPasswordRoute = _forgotpassword.Route.update({
      id: "/forgot-password",
      path: "/forgot-password",
      getParentRoute: () => ___root.Route
    });
    const AppRoute = _app.Route.update({
      id: "/app",
      path: "/app",
      getParentRoute: () => ___root.Route
    });
    const IndexRoute = _index.Route.update({
      id: "/",
      path: "/",
      getParentRoute: () => ___root.Route
    });
    const AppIndexRoute = _appindex.Route.update({
      id: "/",
      path: "/",
      getParentRoute: () => AppRoute
    });
    const AppRoomsRoute = _approoms.Route.update({
      id: "/rooms",
      path: "/rooms",
      getParentRoute: () => AppRoute
    });
    const AppPlannerRoute = _appplanner.Route.update({
      id: "/planner",
      path: "/planner",
      getParentRoute: () => AppRoute
    });
    const AppAnalyticsRoute = _appanalytics.Route.update({
      id: "/analytics",
      path: "/analytics",
      getParentRoute: () => AppRoute
    });
    const AppAlarmsRoute = _appalarms.Route.update({
      id: "/alarms",
      path: "/alarms",
      getParentRoute: () => AppRoute
    });
    const AppAiRoute = _appai.Route.update({
      id: "/ai",
      path: "/ai",
      getParentRoute: () => AppRoute
    });
    const AppProfileRoute = _approfile.Route.update({
      id: "/profile",
      path: "/profile",
      getParentRoute: () => AppRoute
    });
    const AppSettingsRoute = _appsettings.Route.update({
      id: "/settings",
      path: "/settings",
      getParentRoute: () => AppRoute
    });
    const AppRouteChildren = {
      AppAiRoute,
      AppAlarmsRoute,
      AppAnalyticsRoute,
      AppPlannerRoute,
      AppProfileRoute,
      AppRoomsRoute,
      AppSettingsRoute,
      AppIndexRoute
    };
    const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
    const rootRouteChildren = {
      IndexRoute,
      AppRoute: AppRouteWithChildren,
      ForgotPasswordRoute,
      LoginRoute,
      OtpRoute,
      QrDismissRoute,
      RegisterRoute,
      SitemapDotxmlRoute
    };
    const routeTree = ___root.Route._addFileChildren(rootRouteChildren)._addFileTypes();
export { routeTree };
