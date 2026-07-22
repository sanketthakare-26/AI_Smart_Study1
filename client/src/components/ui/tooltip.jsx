var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reacttooltip from "@radix-ui/react-tooltip";
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
    
    var TooltipPrimitive = _interopRequireWildcard(_reacttooltip);
    
    const TooltipProvider = TooltipPrimitive.Provider;
    const Tooltip = TooltipPrimitive.Root;
    const TooltipTrigger = TooltipPrimitive.Trigger;
    const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => _jsxdevruntime.jsxDEV(TooltipPrimitive.Portal, {
      children: _jsxdevruntime.jsxDEV.call(
        void 0,
        TooltipPrimitive.Content,
        {
          ref,
          sideOffset,
          className: _utils.cn.call(
            void 0,
            "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
            className
          ),
          ...props
        },
        void 0,
        false,

      )
    }, void 0, false));
    TooltipContent.displayName = TooltipPrimitive.Content.displayName;
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
