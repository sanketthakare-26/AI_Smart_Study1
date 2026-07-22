var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactavatar from "@radix-ui/react-avatar";
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
    
    var AvatarPrimitive = _interopRequireWildcard(_reactavatar);
    
    const Avatar = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      AvatarPrimitive.Root,
      {
        ref,
        className: _utils.cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
        ...props
      },
      void 0,
      false,

    ));
    Avatar.displayName = AvatarPrimitive.Root.displayName;
    const AvatarImage = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      AvatarPrimitive.Image,
      {
        ref,
        className: _utils.cn("aspect-square h-full w-full", className),
        ...props
      },
      void 0,
      false,

    ));
    AvatarImage.displayName = AvatarPrimitive.Image.displayName;
    const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      AvatarPrimitive.Fallback,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "flex h-full w-full items-center justify-center rounded-full bg-muted",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
export { Avatar, AvatarImage, AvatarFallback };
