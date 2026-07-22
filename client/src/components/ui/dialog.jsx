var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactdialog from "@radix-ui/react-dialog";
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
    
    var DialogPrimitive = _interopRequireWildcard(_reactdialog);
    
    
    const Dialog = DialogPrimitive.Root;
    const DialogTrigger = DialogPrimitive.Trigger;
    const DialogPortal = DialogPrimitive.Portal;
    const DialogClose = DialogPrimitive.Close;
    const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      DialogPrimitive.Overlay,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
    const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(DialogPortal, { children: [
      _jsxdevruntime.jsxDEV(DialogOverlay, {}, void 0, false),
      _jsxdevruntime.jsxDEV(DialogPrimitive.Content, {
        ref,
        className: _utils.cn.call(
          void 0,
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
          className
        ),
        ...props,
        children: [
          children,
          _jsxdevruntime.jsxDEV(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
            _jsxdevruntime.jsxDEV(_lucidereact.X, { className: "h-4 w-4" }, void 0, false),
            _jsxdevruntime.jsxDEV("span", { className: "sr-only", children: "Close" }, void 0, false)
          ] }, void 0, true)
        ]
      }, void 0, true)
    ] }, void 0, true));
    DialogContent.displayName = DialogPrimitive.Content.displayName;
    const DialogHeader = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV("div", { className: _utils.cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props }, void 0, false), "DialogHeader");
    DialogHeader.displayName = "DialogHeader";
    const DialogFooter = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV.call(
      void 0,
      "div",
      {
        className: _utils.cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
      },
      void 0,
      false,

    ), "DialogFooter");
    DialogFooter.displayName = "DialogFooter";
    const DialogTitle = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      DialogPrimitive.Title,
      {
        ref,
        className: _utils.cn("text-lg font-semibold leading-none tracking-tight", className),
        ...props
      },
      void 0,
      false,

    ));
    DialogTitle.displayName = DialogPrimitive.Title.displayName;
    const DialogDescription = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      DialogPrimitive.Description,
      {
        ref,
        className: _utils.cn("text-sm text-muted-foreground", className),
        ...props
      },
      void 0,
      false,

    ));
    DialogDescription.displayName = DialogPrimitive.Description.displayName;
export { Dialog, DialogPortal, DialogOverlay, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
