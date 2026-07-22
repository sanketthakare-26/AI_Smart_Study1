var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactslot from "@radix-ui/react-slot";
import * as _lucidereact from "lucide-react";
import * as _utils from "@/lib/utils";

function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }

    function _nullishCoalesce(lhs, rhsFn) {
      if (lhs != null) {
        return lhs;
      } else {
        return rhsFn();
      }
    }

    var React = _interopRequireWildcard(_react);
    
    
    
    const Breadcrumb = React.forwardRef(({ ...props }, ref) => _jsxdevruntime.jsxDEV("nav", { ref, "aria-label": "breadcrumb", ...props }, void 0, false));
    Breadcrumb.displayName = "Breadcrumb";
    const BreadcrumbList = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
        void 0,
        "ol",
        {
          ref,
          className: _utils.cn.call(
            void 0,
            "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
            className
          ),
          ...props
        },
        void 0,
        false,

      )
    );
    BreadcrumbList.displayName = "BreadcrumbList";
    const BreadcrumbItem = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("li", { ref, className: _utils.cn("inline-flex items-center gap-1.5", className), ...props }, void 0, false)
    );
    BreadcrumbItem.displayName = "BreadcrumbItem";
    const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
      const Comp = asChild ? _reactslot.Slot : "a";
      return _jsxdevruntime.jsxDEV.call(
        void 0,
        Comp,
        {
          ref,
          className: _utils.cn("transition-colors hover:text-foreground", className),
          ...props
        },
        void 0,
        false,

      );
    });
    BreadcrumbLink.displayName = "BreadcrumbLink";
    const BreadcrumbPage = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
        void 0,
        "span",
        {
          ref,
          role: "link",
          "aria-disabled": "true",
          "aria-current": "page",
          className: _utils.cn("font-normal text-foreground", className),
          ...props
        },
        void 0,
        false,

      )
    );
    BreadcrumbPage.displayName = "BreadcrumbPage";
    const BreadcrumbSeparator = /* @__PURE__ */ __name(({ children, className, ...props }) => _jsxdevruntime.jsxDEV("li", {
      role: "presentation",
      "aria-hidden": "true",
      className: _utils.cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
      ...props,
      children: _nullishCoalesce(children, () => _jsxdevruntime.jsxDEV(_lucidereact.ChevronRight, {}, void 0, false))
    }, void 0, false), "BreadcrumbSeparator");
    BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
    const BreadcrumbEllipsis = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV("span", {
      role: "presentation",
      "aria-hidden": "true",
      className: _utils.cn("flex h-9 w-9 items-center justify-center", className),
      ...props,
      children: [
        _jsxdevruntime.jsxDEV(_lucidereact.MoreHorizontal, { className: "h-4 w-4" }, void 0, false),
        _jsxdevruntime.jsxDEV("span", { className: "sr-only", children: "More" }, void 0, false)
      ]
    }, void 0, true), "BreadcrumbEllipsis");
    BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
