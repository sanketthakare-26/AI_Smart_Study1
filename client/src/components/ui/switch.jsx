var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactswitch from "@radix-ui/react-switch";
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
    
    var SwitchPrimitives = _interopRequireWildcard(_reactswitch);
    
    const Switch = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(SwitchPrimitives.Root, {
      className: _utils.cn.call(
        void 0,
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      ),
      ...props,
      ref,
      children: _jsxdevruntime.jsxDEV.call(
        void 0,
        SwitchPrimitives.Thumb,
        {
          className: _utils.cn.call(
            void 0,
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          )
        },
        void 0,
        false,

      )
    }, void 0, false));
    Switch.displayName = SwitchPrimitives.Root.displayName;
export { Switch };
