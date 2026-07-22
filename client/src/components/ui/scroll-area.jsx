var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactscrollarea from "@radix-ui/react-scroll-area";
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
    
    var ScrollAreaPrimitive = _interopRequireWildcard(_reactscrollarea);
    
    const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(ScrollAreaPrimitive.Root, {
      ref,
      className: _utils.cn("relative overflow-hidden", className),
      ...props,
      children: [
        _jsxdevruntime.jsxDEV(ScrollAreaPrimitive.Viewport, {
          className: "h-full w-full rounded-[inherit]",
          children
        }, void 0, false),
        _jsxdevruntime.jsxDEV(ScrollBar, {}, void 0, false),
        _jsxdevruntime.jsxDEV(ScrollAreaPrimitive.Corner, {}, void 0, false)
      ]
    }, void 0, true));
    ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
    const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => _jsxdevruntime.jsxDEV(ScrollAreaPrimitive.ScrollAreaScrollbar, {
      ref,
      orientation,
      className: _utils.cn.call(
        void 0,
        "flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      ),
      ...props,
      children: _jsxdevruntime.jsxDEV(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" }, void 0, false)
    }, void 0, false));
    ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
export { ScrollArea, ScrollBar };
