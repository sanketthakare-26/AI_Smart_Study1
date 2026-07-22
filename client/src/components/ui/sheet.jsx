var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactdialog from "@radix-ui/react-dialog";
import * as _classvarianceauthority from "class-variance-authority";
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

    "use client";
    
    var React = _interopRequireWildcard(_react);
    
    var SheetPrimitive = _interopRequireWildcard(_reactdialog);
    
    
    
    const Sheet = SheetPrimitive.Root;
    const SheetTrigger = SheetPrimitive.Trigger;
    const SheetClose = SheetPrimitive.Close;
    const SheetPortal = SheetPrimitive.Portal;
    const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      SheetPrimitive.Overlay,
      {
        className: _utils.cn.call(
          void 0,
          "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        ),
        ...props,
        ref
      },
      void 0,
      false,

    ));
    SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
    const sheetVariants = _classvarianceauthority.cva.call(
      void 0,
      "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
      {
        variants: {
          side: {
            top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
            bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
            right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
          }
        },
        defaultVariants: {
          side: "right"
        }
      }
    );
    const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(SheetPortal, { children: [
      _jsxdevruntime.jsxDEV(SheetOverlay, {}, void 0, false),
      _jsxdevruntime.jsxDEV(SheetPrimitive.Content, { ref, className: _utils.cn(sheetVariants({ side }), className), ...props, children: [
        _jsxdevruntime.jsxDEV(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
          _jsxdevruntime.jsxDEV(_lucidereact.X, { className: "h-4 w-4" }, void 0, false),
          _jsxdevruntime.jsxDEV("span", { className: "sr-only", children: "Close" }, void 0, false)
        ] }, void 0, true),
        children
      ] }, void 0, true)
    ] }, void 0, true));
    SheetContent.displayName = SheetPrimitive.Content.displayName;
    const SheetHeader = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV("div", { className: _utils.cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props }, void 0, false), "SheetHeader");
    SheetHeader.displayName = "SheetHeader";
    const SheetFooter = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV.call(
      void 0,
      "div",
      {
        className: _utils.cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
      },
      void 0,
      false,

    ), "SheetFooter");
    SheetFooter.displayName = "SheetFooter";
    const SheetTitle = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      SheetPrimitive.Title,
      {
        ref,
        className: _utils.cn("text-lg font-semibold text-foreground", className),
        ...props
      },
      void 0,
      false,

    ));
    SheetTitle.displayName = SheetPrimitive.Title.displayName;
    const SheetDescription = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      SheetPrimitive.Description,
      {
        ref,
        className: _utils.cn("text-sm text-muted-foreground", className),
        ...props
      },
      void 0,
      false,

    ));
    SheetDescription.displayName = SheetPrimitive.Description.displayName;
export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
