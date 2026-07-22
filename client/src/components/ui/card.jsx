var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
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
    
    const Card = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
        void 0,
        "div",
        {
          ref,
          className: _utils.cn("rounded-xl border bg-card text-card-foreground shadow", className),
          ...props
        },
        void 0,
        false,

      )
    );
    Card.displayName = "Card";
    const CardHeader = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("div", { ref, className: _utils.cn("flex flex-col space-y-1.5 p-6", className), ...props }, void 0, false)
    );
    CardHeader.displayName = "CardHeader";
    const CardTitle = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
        void 0,
        "div",
        {
          ref,
          className: _utils.cn("font-semibold leading-none tracking-tight", className),
          ...props
        },
        void 0,
        false,

      )
    );
    CardTitle.displayName = "CardTitle";
    const CardDescription = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("div", { ref, className: _utils.cn("text-sm text-muted-foreground", className), ...props }, void 0, false)
    );
    CardDescription.displayName = "CardDescription";
    const CardContent = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("div", { ref, className: _utils.cn("p-6 pt-0", className), ...props }, void 0, false)
    );
    CardContent.displayName = "CardContent";
    const CardFooter = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("div", { ref, className: _utils.cn("flex items-center p-6 pt-0", className), ...props }, void 0, false)
    );
    CardFooter.displayName = "CardFooter";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
