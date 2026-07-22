var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactseparator from "@radix-ui/react-separator";
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
    
    var SeparatorPrimitive = _interopRequireWildcard(_reactseparator);
    
    const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      SeparatorPrimitive.Root,
      {
        ref,
        decorative,
        orientation,
        className: _utils.cn.call(
          void 0,
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    Separator.displayName = SeparatorPrimitive.Root.displayName;
export { Separator };
