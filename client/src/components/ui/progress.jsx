var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactprogress from "@radix-ui/react-progress";
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
    
    var ProgressPrimitive = _interopRequireWildcard(_reactprogress);
    
    const Progress = React.forwardRef(({ className, value, ...props }, ref) => _jsxdevruntime.jsxDEV(ProgressPrimitive.Root, {
      ref,
      className: _utils.cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
      ...props,
      children: _jsxdevruntime.jsxDEV.call(
        void 0,
        ProgressPrimitive.Indicator,
        {
          className: "h-full w-full flex-1 bg-primary transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        },
        void 0,
        false,

      )
    }, void 0, false));
    Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };
