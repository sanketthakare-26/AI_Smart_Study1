var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactnavigationmenu from "@radix-ui/react-navigation-menu";
import * as _classvarianceauthority from "class-variance-authority";
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
    
    var NavigationMenuPrimitive = _interopRequireWildcard(_reactnavigationmenu);
    
    
    
    const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(NavigationMenuPrimitive.Root, {
      ref,
      className: _utils.cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className),
      ...props,
      children: [
        children,
        _jsxdevruntime.jsxDEV(NavigationMenuViewport, {}, void 0, false)
      ]
    }, void 0, true));
    NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
    const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      NavigationMenuPrimitive.List,
      {
        ref,
        className: _utils.cn("group flex flex-1 list-none items-center justify-center space-x-1", className),
        ...props
      },
      void 0,
      false,

    ));
    NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
    const NavigationMenuItem = NavigationMenuPrimitive.Item;
    const navigationMenuTriggerStyle = _classvarianceauthority.cva.call(
      void 0,
      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
    );
    const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(NavigationMenuPrimitive.Trigger, {
      ref,
      className: _utils.cn(navigationMenuTriggerStyle(), "group", className),
      ...props,
      children: [
        children,
        " ",
        _jsxdevruntime.jsxDEV.call(
          void 0,
          _lucidereact.ChevronDown,
          {
            className: "relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180",
            "aria-hidden": "true"
          },
          void 0,
          false,

        )
      ]
    }, void 0, true));
    NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
    const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      NavigationMenuPrimitive.Content,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
    const NavigationMenuLink = NavigationMenuPrimitive.Link;
    const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("div", {
      className: _utils.cn("absolute left-0 top-full flex justify-center"),
      children: _jsxdevruntime.jsxDEV.call(
        void 0,
        NavigationMenuPrimitive.Viewport,
        {
          className: _utils.cn.call(
            void 0,
            "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
            className
          ),
          ref,
          ...props
        },
        void 0,
        false,

      )
    }, void 0, false));
    NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;
    const NavigationMenuIndicator = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(NavigationMenuPrimitive.Indicator, {
      ref,
      className: _utils.cn.call(
        void 0,
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
        className
      ),
      ...props,
      children: _jsxdevruntime.jsxDEV("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" }, void 0, false)
    }, void 0, false));
    NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;
export { navigationMenuTriggerStyle, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport };
