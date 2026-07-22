var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactradiogroup from "@radix-ui/react-radio-group";
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
    
    var RadioGroupPrimitive = _interopRequireWildcard(_reactradiogroup);
    
    
    const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
      return _jsxdevruntime.jsxDEV(RadioGroupPrimitive.Root, { className: _utils.cn("grid gap-2", className), ...props, ref }, void 0, false);
    });
    RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
    const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
      return _jsxdevruntime.jsxDEV(RadioGroupPrimitive.Item, {
        ref,
        className: _utils.cn.call(
          void 0,
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ...props,
        children: _jsxdevruntime.jsxDEV(RadioGroupPrimitive.Indicator, {
          className: "flex items-center justify-center",
          children: _jsxdevruntime.jsxDEV(_lucidereact.Circle, { className: "h-3.5 w-3.5 fill-primary" }, void 0, false)
        }, void 0, false)
      }, void 0, false);
    });
    RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
export { RadioGroup, RadioGroupItem };
