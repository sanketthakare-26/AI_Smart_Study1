var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _clsx from "clsx";
import * as _tailwindmerge from "tailwind-merge";

function cn(...inputs) {
      return _tailwindmerge.twMerge(_clsx.clsx(inputs));
    }

export { cn };
