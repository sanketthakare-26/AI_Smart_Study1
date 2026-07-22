var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _lucidereact from "lucide-react";
import * as _utils from "@/lib/utils";
import * as _button from "@/components/ui/button";

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

    var React = _interopRequireWildcard(_react);
    
    
    
    const Pagination = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV.call(
      void 0,
      "nav",
      {
        role: "navigation",
        "aria-label": "pagination",
        className: _utils.cn("mx-auto flex w-full justify-center", className),
        ...props
      },
      void 0,
      false,

    ), "Pagination");
    Pagination.displayName = "Pagination";
    const PaginationContent = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("ul", { ref, className: _utils.cn("flex flex-row items-center gap-1", className), ...props }, void 0, false)
    );
    PaginationContent.displayName = "PaginationContent";
    const PaginationItem = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("li", { ref, className: _utils.cn("", className), ...props }, void 0, false)
    );
    PaginationItem.displayName = "PaginationItem";
    const PaginationLink = /* @__PURE__ */ __name(({ className, isActive, size = "icon", ...props }) => _jsxdevruntime.jsxDEV.call(
      void 0,
      "a",
      {
        "aria-current": isActive ? "page" : void 0,
        className: _utils.cn.call(
          void 0,
          _button.buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size
          }),
          className
        ),
        ...props
      },
      void 0,
      false,

    ), "PaginationLink");
    PaginationLink.displayName = "PaginationLink";
    const PaginationPrevious = /* @__PURE__ */ __name(({
      className,
      ...props
    }) => _jsxdevruntime.jsxDEV(PaginationLink, {
      "aria-label": "Go to previous page",
      size: "default",
      className: _utils.cn("gap-1 pl-2.5", className),
      ...props,
      children: [
        _jsxdevruntime.jsxDEV(_lucidereact.ChevronLeft, { className: "h-4 w-4" }, void 0, false),
        _jsxdevruntime.jsxDEV("span", { children: "Previous" }, void 0, false)
      ]
    }, void 0, true), "PaginationPrevious");
    PaginationPrevious.displayName = "PaginationPrevious";
    const PaginationNext = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV(PaginationLink, {
      "aria-label": "Go to next page",
      size: "default",
      className: _utils.cn("gap-1 pr-2.5", className),
      ...props,
      children: [
        _jsxdevruntime.jsxDEV("span", { children: "Next" }, void 0, false),
        _jsxdevruntime.jsxDEV(_lucidereact.ChevronRight, { className: "h-4 w-4" }, void 0, false)
      ]
    }, void 0, true), "PaginationNext");
    PaginationNext.displayName = "PaginationNext";
    const PaginationEllipsis = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV("span", {
      "aria-hidden": true,
      className: _utils.cn("flex h-9 w-9 items-center justify-center", className),
      ...props,
      children: [
        _jsxdevruntime.jsxDEV(_lucidereact.MoreHorizontal, { className: "h-4 w-4" }, void 0, false),
        _jsxdevruntime.jsxDEV("span", { className: "sr-only", children: "More pages" }, void 0, false)
      ]
    }, void 0, true), "PaginationEllipsis");
    PaginationEllipsis.displayName = "PaginationEllipsis";
export { Pagination, PaginationContent, PaginationLink, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis };
