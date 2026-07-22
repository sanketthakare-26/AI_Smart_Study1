var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _inputotp from "input-otp";
import * as _lucidereact from "lucide-react";
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
    
    
    
    const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _inputotp.OTPInput,
      {
        ref,
        containerClassName: _utils.cn.call(
          void 0,
          "flex items-center gap-2 has-[:disabled]:opacity-50",
          containerClassName
        ),
        className: _utils.cn("disabled:cursor-not-allowed", className),
        ...props
      },
      void 0,
      false,

    ));
    InputOTP.displayName = "InputOTP";
    const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("div", { ref, className: _utils.cn("flex items-center", className), ...props }, void 0, false));
    InputOTPGroup.displayName = "InputOTPGroup";
    const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
      const inputOTPContext = React.useContext(_inputotp.OTPInputContext);
      const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
      return _jsxdevruntime.jsxDEV("div", {
        ref,
        className: _utils.cn.call(
          void 0,
          "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
          isActive && "z-10 ring-1 ring-ring",
          className
        ),
        ...props,
        children: [
          char,
          hasFakeCaret && _jsxdevruntime.jsxDEV("div", {
            className: "pointer-events-none absolute inset-0 flex items-center justify-center",
            children: _jsxdevruntime.jsxDEV("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }, void 0, false)
          }, void 0, false)
        ]
      }, void 0, true);
    });
    InputOTPSlot.displayName = "InputOTPSlot";
    const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => _jsxdevruntime.jsxDEV("div", {
      ref,
      role: "separator",
      ...props,
      children: _jsxdevruntime.jsxDEV(_lucidereact.Minus, {}, void 0, false)
    }, void 0, false));
    InputOTPSeparator.displayName = "InputOTPSeparator";
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
