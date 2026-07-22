var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactcheckbox from "@radix-ui/react-checkbox";
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

    var React = _interopRequireWildcard(_react);
    
    var CheckboxPrimitive = _interopRequireWildcard(_reactcheckbox);
    
    
    const Checkbox = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(CheckboxPrimitive.Root, {
      ref,
      className: _utils.cn.call(
        void 0,
        "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      ),
      ...props,
      children: _jsxdevruntime.jsxDEV(CheckboxPrimitive.Indicator, {
        className: _utils.cn("grid place-content-center text-current"),
        children: _jsxdevruntime.jsxDEV(_lucidereact.Check, { className: "h-4 w-4" }, void 0, false)
      }, void 0, false)
    }, void 0, false));
    Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export { Checkbox };
