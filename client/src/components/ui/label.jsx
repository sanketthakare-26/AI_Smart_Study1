var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactlabel from "@radix-ui/react-label";
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

    "use client";
    
    var React = _interopRequireWildcard(_react);
    
    var LabelPrimitive = _interopRequireWildcard(_reactlabel);
    
    
    const labelVariants = _classvarianceauthority.cva.call(
      void 0,
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    );
    const Label = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(LabelPrimitive.Root, { ref, className: _utils.cn(labelVariants(), className), ...props }, void 0, false));
    Label.displayName = LabelPrimitive.Root.displayName;
export { Label };
