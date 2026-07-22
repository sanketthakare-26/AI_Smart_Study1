var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactalertdialog from "@radix-ui/react-alert-dialog";
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
    
    var AlertDialogPrimitive = _interopRequireWildcard(_reactalertdialog);
    
    
    const AlertDialog = AlertDialogPrimitive.Root;
    const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
    const AlertDialogPortal = AlertDialogPrimitive.Portal;
    const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      AlertDialogPrimitive.Overlay,
      {
        className: _utils.cn.call(
          void 0,
          "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        ),
        ...props,
        ref
      },
      void 0,
      false,

    ));
    AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
    const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(AlertDialogPortal, { children: [
      _jsxdevruntime.jsxDEV(AlertDialogOverlay, {}, void 0, false),
      _jsxdevruntime.jsxDEV.call(
        void 0,
        AlertDialogPrimitive.Content,
        {
          ref,
          className: _utils.cn.call(
            void 0,
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
            className
          ),
          ...props
        },
        void 0,
        false,

      )
    ] }, void 0, true));
    AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
    const AlertDialogHeader = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV("div", { className: _utils.cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props }, void 0, false), "AlertDialogHeader");
    AlertDialogHeader.displayName = "AlertDialogHeader";
    const AlertDialogFooter = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV.call(
      void 0,
      "div",
      {
        className: _utils.cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
      },
      void 0,
      false,

    ), "AlertDialogFooter");
    AlertDialogFooter.displayName = "AlertDialogFooter";
    const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      AlertDialogPrimitive.Title,
      {
        ref,
        className: _utils.cn("text-lg font-semibold", className),
        ...props
      },
      void 0,
      false,

    ));
    AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
    const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      AlertDialogPrimitive.Description,
      {
        ref,
        className: _utils.cn("text-sm text-muted-foreground", className),
        ...props
      },
      void 0,
      false,

    ));
    AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
    const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(AlertDialogPrimitive.Action, { ref, className: _utils.cn(_button.buttonVariants.call(void 0), className), ...props }, void 0, false));
    AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
    const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      AlertDialogPrimitive.Cancel,
      {
        ref,
        className: _utils.cn(_button.buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
        ...props
      },
      void 0,
      false,

    ));
    AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel };
