var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactslider from "@radix-ui/react-slider";
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
    
    var SliderPrimitive = _interopRequireWildcard(_reactslider);
    
    const Slider = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(SliderPrimitive.Root, {
      ref,
      className: _utils.cn("relative flex w-full touch-none select-none items-center", className),
      ...props,
      children: [
        _jsxdevruntime.jsxDEV(SliderPrimitive.Track, {
          className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
          children: _jsxdevruntime.jsxDEV(SliderPrimitive.Range, { className: "absolute h-full bg-primary" }, void 0, false)
        }, void 0, false),
        _jsxdevruntime.jsxDEV(SliderPrimitive.Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" }, void 0, false)
      ]
    }, void 0, true));
    Slider.displayName = SliderPrimitive.Root.displayName;
export { Slider };
