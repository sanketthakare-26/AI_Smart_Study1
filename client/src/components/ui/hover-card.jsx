var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reacthovercard from "@radix-ui/react-hover-card";
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
    
    var HoverCardPrimitive = _interopRequireWildcard(_reacthovercard);
    
    const HoverCard = HoverCardPrimitive.Root;
    const HoverCardTrigger = HoverCardPrimitive.Trigger;
    const HoverCardContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      HoverCardPrimitive.Content,
      {
        ref,
        align,
        sideOffset,
        className: _utils.cn.call(
          void 0,
          "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-hover-card-content-transform-origin)",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;
export { HoverCard, HoverCardTrigger, HoverCardContent };
