var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactmenubar from "@radix-ui/react-menubar";
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
    
    var MenubarPrimitive = _interopRequireWildcard(_reactmenubar);
    
    
    function MenubarMenu({ ...props }) {
      return _jsxdevruntime.jsxDEV(MenubarPrimitive.Menu, { ...props }, void 0, false);
    }

    function MenubarGroup({ ...props }) {
      return _jsxdevruntime.jsxDEV(MenubarPrimitive.Group, { ...props }, void 0, false);
    }

    function MenubarPortal({ ...props }) {
      return _jsxdevruntime.jsxDEV(MenubarPrimitive.Portal, { ...props }, void 0, false);
    }

    function MenubarRadioGroup({ ...props }) {
      return _jsxdevruntime.jsxDEV(MenubarPrimitive.RadioGroup, { ...props }, void 0, false);
    }

    function MenubarSub({ ...props }) {
      return _jsxdevruntime.jsxDEV(MenubarPrimitive.Sub, { "data-slot": "menubar-sub", ...props }, void 0, false);
    }

    const Menubar = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      MenubarPrimitive.Root,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    Menubar.displayName = MenubarPrimitive.Root.displayName;
    const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      MenubarPrimitive.Trigger,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;
    const MenubarSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => _jsxdevruntime.jsxDEV(MenubarPrimitive.SubTrigger, {
      ref,
      className: _utils.cn.call(
        void 0,
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        inset && "pl-8",
        className
      ),
      ...props,
      children: [
        children,
        _jsxdevruntime.jsxDEV(_lucidereact.ChevronRight, { className: "ml-auto h-4 w-4" }, void 0, false)
      ]
    }, void 0, true));
    MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;
    const MenubarSubContent = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      MenubarPrimitive.SubContent,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin)",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;
    const MenubarContent = React.forwardRef(({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => _jsxdevruntime.jsxDEV(MenubarPrimitive.Portal, {
      children: _jsxdevruntime.jsxDEV.call(
        void 0,
        MenubarPrimitive.Content,
        {
          ref,
          align,
          alignOffset,
          sideOffset,
          className: _utils.cn.call(
            void 0,
            "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-menubar-content-transform-origin)",
            className
          ),
          ...props
        },
        void 0,
        false,

      )
    }, void 0, false));
    MenubarContent.displayName = MenubarPrimitive.Content.displayName;
    const MenubarItem = React.forwardRef(({ className, inset, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      MenubarPrimitive.Item,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          inset && "pl-8",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    MenubarItem.displayName = MenubarPrimitive.Item.displayName;
    const MenubarCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => _jsxdevruntime.jsxDEV(MenubarPrimitive.CheckboxItem, {
      ref,
      className: _utils.cn.call(
        void 0,
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      checked,
      ...props,
      children: [
        _jsxdevruntime.jsxDEV("span", {
          className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
          children: _jsxdevruntime.jsxDEV(MenubarPrimitive.ItemIndicator, {
            children: _jsxdevruntime.jsxDEV(_lucidereact.Check, { className: "h-4 w-4" }, void 0, false)
          }, void 0, false)
        }, void 0, false),
        children
      ]
    }, void 0, true));
    MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;
    const MenubarRadioItem = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(MenubarPrimitive.RadioItem, {
      ref,
      className: _utils.cn.call(
        void 0,
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        _jsxdevruntime.jsxDEV("span", {
          className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
          children: _jsxdevruntime.jsxDEV(MenubarPrimitive.ItemIndicator, {
            children: _jsxdevruntime.jsxDEV(_lucidereact.Circle, { className: "h-4 w-4 fill-current" }, void 0, false)
          }, void 0, false)
        }, void 0, false),
        children
      ]
    }, void 0, true));
    MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;
    const MenubarLabel = React.forwardRef(({ className, inset, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      MenubarPrimitive.Label,
      {
        ref,
        className: _utils.cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
        ...props
      },
      void 0,
      false,

    ));
    MenubarLabel.displayName = MenubarPrimitive.Label.displayName;
    const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      MenubarPrimitive.Separator,
      {
        ref,
        className: _utils.cn("-mx-1 my-1 h-px bg-muted", className),
        ...props
      },
      void 0,
      false,

    ));
    MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;
    const MenubarShortcut = /* @__PURE__ */ __name(({ className, ...props }) => {
      return _jsxdevruntime.jsxDEV.call(
        void 0,
        "span",
        {
          className: _utils.cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
          ...props
        },
        void 0,
        false,

      );
    }, "MenubarShortcut");
    MenubarShortcut.displayname = "MenubarShortcut";
export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarPortal, MenubarSubContent, MenubarSubTrigger, MenubarGroup, MenubarSub, MenubarShortcut };
