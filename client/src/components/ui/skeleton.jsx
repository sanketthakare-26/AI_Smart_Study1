var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _utils from "@/lib/utils";

function Skeleton({ className, ...props }) {
      return _jsxdevruntime.jsxDEV("div", { className: _utils.cn("animate-pulse rounded-md bg-primary/10", className), ...props }, void 0, false);
    }

export { Skeleton };
