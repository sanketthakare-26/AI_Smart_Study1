var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactpopover from "@radix-ui/react-popover";
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
    
    var PopoverPrimitive = _interopRequireWildcard(_reactpopover);
    
    const Popover = PopoverPrimitive.Root;
    const PopoverTrigger = PopoverPrimitive.Trigger;
    const PopoverAnchor = PopoverPrimitive.Anchor;
    const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => _jsxdevruntime.jsxDEV(PopoverPrimitive.Portal, {
      children: _jsxdevruntime.jsxDEV.call(
        void 0,
        PopoverPrimitive.Content,
        {
          ref,
          align,
          sideOffset,
          className: _utils.cn.call(
            void 0,
            "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
            className
          ),
          ...props
        },
        void 0,
        false,

      )
    }, void 0, false));
    PopoverContent.displayName = PopoverPrimitive.Content.displayName;
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
