var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reacttoggle from "@radix-ui/react-toggle";
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

    var React = _interopRequireWildcard(_react);
    
    var TogglePrimitive = _interopRequireWildcard(_reacttoggle);
    
    
    const toggleVariants = _classvarianceauthority.cva.call(
      void 0,
      "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      {
        variants: {
          variant: {
            default: "bg-transparent",
            outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
          },
          size: {
            default: "h-9 px-2 min-w-9",
            sm: "h-8 px-1.5 min-w-8",
            lg: "h-10 px-2.5 min-w-10"
          }
        },
        defaultVariants: {
          variant: "default",
          size: "default"
        }
      }
    );
    const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      TogglePrimitive.Root,
      {
        ref,
        className: _utils.cn(toggleVariants({ variant, size, className })),
        ...props
      },
      void 0,
      false,

    ));
    Toggle.displayName = TogglePrimitive.Root.displayName;
export { Toggle, toggleVariants };
