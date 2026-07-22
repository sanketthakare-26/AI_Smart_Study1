var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _vaul from "vaul";
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
    
    
    const Drawer = /* @__PURE__ */ __name(({
      shouldScaleBackground = true,
      ...props
    }) => _jsxdevruntime.jsxDEV(_vaul.Drawer.Root, { shouldScaleBackground, ...props }, void 0, false), "Drawer");
    Drawer.displayName = "Drawer";
    const DrawerTrigger = _vaul.Drawer.Trigger;
    const DrawerPortal = _vaul.Drawer.Portal;
    const DrawerClose = _vaul.Drawer.Close;
    const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _vaul.Drawer.Overlay,
      {
        ref,
        className: _utils.cn("fixed inset-0 z-50 bg-black/80", className),
        ...props
      },
      void 0,
      false,

    ));
    DrawerOverlay.displayName = _vaul.Drawer.Overlay.displayName;
    const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(DrawerPortal, { children: [
      _jsxdevruntime.jsxDEV(DrawerOverlay, {}, void 0, false),
      _jsxdevruntime.jsxDEV(_vaul.Drawer.Content, {
        ref,
        className: _utils.cn.call(
          void 0,
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
          className
        ),
        ...props,
        children: [
          _jsxdevruntime.jsxDEV("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }, void 0, false),
          children
        ]
      }, void 0, true)
    ] }, void 0, true));
    DrawerContent.displayName = "DrawerContent";
    const DrawerHeader = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV("div", { className: _utils.cn("grid gap-1.5 p-4 text-center sm:text-left", className), ...props }, void 0, false), "DrawerHeader");
    DrawerHeader.displayName = "DrawerHeader";
    const DrawerFooter = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV("div", { className: _utils.cn("mt-auto flex flex-col gap-2 p-4", className), ...props }, void 0, false), "DrawerFooter");
    DrawerFooter.displayName = "DrawerFooter";
    const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _vaul.Drawer.Title,
      {
        ref,
        className: _utils.cn("text-lg font-semibold leading-none tracking-tight", className),
        ...props
      },
      void 0,
      false,

    ));
    DrawerTitle.displayName = _vaul.Drawer.Title.displayName;
    const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _vaul.Drawer.Description,
      {
        ref,
        className: _utils.cn("text-sm text-muted-foreground", className),
        ...props
      },
      void 0,
      false,

    ));
    DrawerDescription.displayName = _vaul.Drawer.Description.displayName;
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription };
