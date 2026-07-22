var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _sonner from "sonner";

const Toaster = /* @__PURE__ */ __name(({ ...props }) => {
      return _jsxdevruntime.jsxDEV.call(
        void 0,
        _sonner.Toaster,
        {
          className: "toaster group",
          toastOptions: {
            classNames: {
              toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
              description: "group-[.toast]:text-muted-foreground",
              actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
              cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
            }
          },
          ...props
        },
        void 0,
        false,

      );
    }, "Toaster");
export { Toaster };
