var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _classvarianceauthority from "class-variance-authority";
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

    var React = _interopRequireWildcard(_react);
    
    
    const alertVariants = _classvarianceauthority.cva.call(
      void 0,
      "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
      {
        variants: {
          variant: {
            default: "bg-background text-foreground",
            destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
          }
        },
        defaultVariants: {
          variant: "default"
        }
      }
    );
    const Alert = React.forwardRef(({ className, variant, ...props }, ref) => _jsxdevruntime.jsxDEV("div", { ref, role: "alert", className: _utils.cn(alertVariants({ variant }), className), ...props }, void 0, false));
    Alert.displayName = "Alert";
    const AlertTitle = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
        void 0,
        "h5",
        {
          ref,
          className: _utils.cn("mb-1 font-medium leading-none tracking-tight", className),
          ...props
        },
        void 0,
        false,

      )
    );
    AlertTitle.displayName = "AlertTitle";
    const AlertDescription = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("div", { ref, className: _utils.cn("text-sm [&_p]:leading-relaxed", className), ...props }, void 0, false));
    AlertDescription.displayName = "AlertDescription";
export { Alert, AlertTitle, AlertDescription };
