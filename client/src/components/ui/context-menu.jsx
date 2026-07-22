var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactcontextmenu from "@radix-ui/react-context-menu";
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
    
    var ContextMenuPrimitive = _interopRequireWildcard(_reactcontextmenu);
    
    
    const ContextMenu = ContextMenuPrimitive.Root;
    const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
    const ContextMenuGroup = ContextMenuPrimitive.Group;
    const ContextMenuPortal = ContextMenuPrimitive.Portal;
    const ContextMenuSub = ContextMenuPrimitive.Sub;
    const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
    const ContextMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => _jsxdevruntime.jsxDEV(ContextMenuPrimitive.SubTrigger, {
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
    ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;
    const ContextMenuSubContent = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      ContextMenuPrimitive.SubContent,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin)",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;
    const ContextMenuContent = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(ContextMenuPrimitive.Portal, {
      children: _jsxdevruntime.jsxDEV.call(
        void 0,
        ContextMenuPrimitive.Content,
        {
          ref,
          className: _utils.cn.call(
            void 0,
            "z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin)",
            className
          ),
          ...props
        },
        void 0,
        false,

      )
    }, void 0, false));
    ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;
    const ContextMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      ContextMenuPrimitive.Item,
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
    ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;
    const ContextMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => _jsxdevruntime.jsxDEV(ContextMenuPrimitive.CheckboxItem, {
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
          children: _jsxdevruntime.jsxDEV(ContextMenuPrimitive.ItemIndicator, {
            children: _jsxdevruntime.jsxDEV(_lucidereact.Check, { className: "h-4 w-4" }, void 0, false)
          }, void 0, false)
        }, void 0, false),
        children
      ]
    }, void 0, true));
    ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;
    const ContextMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(ContextMenuPrimitive.RadioItem, {
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
          children: _jsxdevruntime.jsxDEV(ContextMenuPrimitive.ItemIndicator, {
            children: _jsxdevruntime.jsxDEV(_lucidereact.Circle, { className: "h-4 w-4 fill-current" }, void 0, false)
          }, void 0, false)
        }, void 0, false),
        children
      ]
    }, void 0, true));
    ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;
    const ContextMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      ContextMenuPrimitive.Label,
      {
        ref,
        className: _utils.cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className),
        ...props
      },
      void 0,
      false,

    ));
    ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;
    const ContextMenuSeparator = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      ContextMenuPrimitive.Separator,
      {
        ref,
        className: _utils.cn("-mx-1 my-1 h-px bg-border", className),
        ...props
      },
      void 0,
      false,

    ));
    ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;
    const ContextMenuShortcut = /* @__PURE__ */ __name(({ className, ...props }) => {
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
    }, "ContextMenuShortcut");
    ContextMenuShortcut.displayName = "ContextMenuShortcut";
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup };
