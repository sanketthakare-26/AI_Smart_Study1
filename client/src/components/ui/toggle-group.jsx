var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reacttogglegroup from "@radix-ui/react-toggle-group";
import * as _utils from "@/lib/utils";
import * as _toggle from "@/components/ui/toggle";

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
    
    var ToggleGroupPrimitive = _interopRequireWildcard(_reacttogglegroup);
    
    
    const ToggleGroupContext = React.createContext({
      size: "default",
      variant: "default"
    });
    const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => _jsxdevruntime.jsxDEV(ToggleGroupPrimitive.Root, {
      ref,
      className: _utils.cn("flex items-center justify-center gap-1", className),
      ...props,
      children: _jsxdevruntime.jsxDEV(ToggleGroupContext.Provider, { value: { variant, size }, children }, void 0, false)
    }, void 0, false));
    ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;
    const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
      const context = React.useContext(ToggleGroupContext);
      return _jsxdevruntime.jsxDEV(ToggleGroupPrimitive.Item, {
        ref,
        className: _utils.cn.call(
          void 0,
          _toggle.toggleVariants({
            variant: context.variant || variant,
            size: context.size || size
          }),
          className
        ),
        ...props,
        children
      }, void 0, false);
    });
    ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
export { ToggleGroup, ToggleGroupItem };
