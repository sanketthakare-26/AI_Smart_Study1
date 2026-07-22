var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactdropdownmenu from "@radix-ui/react-dropdown-menu";
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

    "use client";
    
    var React = _interopRequireWildcard(_react);
    
    var DropdownMenuPrimitive = _interopRequireWildcard(_reactdropdownmenu);
    
    
    const DropdownMenu = DropdownMenuPrimitive.Root;
    const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
    const DropdownMenuGroup = DropdownMenuPrimitive.Group;
    const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
    const DropdownMenuSub = DropdownMenuPrimitive.Sub;
    const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
    const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => _jsxdevruntime.jsxDEV(DropdownMenuPrimitive.SubTrigger, {
      ref,
      className: _utils.cn.call(
        void 0,
        "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className
      ),
      ...props,
      children: [
        children,
        _jsxdevruntime.jsxDEV(_lucidereact.ChevronRight, { className: "ml-auto" }, void 0, false)
      ]
    }, void 0, true));
    DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
    const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      DropdownMenuPrimitive.SubContent,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
    const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => _jsxdevruntime.jsxDEV(DropdownMenuPrimitive.Portal, {
      children: _jsxdevruntime.jsxDEV.call(
        void 0,
        DropdownMenuPrimitive.Content,
        {
          ref,
          sideOffset,
          className: _utils.cn.call(
            void 0,
            "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
            className
          ),
          ...props
        },
        void 0,
        false,

      )
    }, void 0, false));
    DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
    const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      DropdownMenuPrimitive.Item,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
          inset && "pl-8",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
    const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => _jsxdevruntime.jsxDEV(DropdownMenuPrimitive.CheckboxItem, {
      ref,
      className: _utils.cn.call(
        void 0,
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      checked,
      ...props,
      children: [
        _jsxdevruntime.jsxDEV("span", {
          className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
          children: _jsxdevruntime.jsxDEV(DropdownMenuPrimitive.ItemIndicator, {
            children: _jsxdevruntime.jsxDEV(_lucidereact.Check, { className: "h-4 w-4" }, void 0, false)
          }, void 0, false)
        }, void 0, false),
        children
      ]
    }, void 0, true));
    DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
    const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(DropdownMenuPrimitive.RadioItem, {
      ref,
      className: _utils.cn.call(
        void 0,
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        _jsxdevruntime.jsxDEV("span", {
          className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
          children: _jsxdevruntime.jsxDEV(DropdownMenuPrimitive.ItemIndicator, {
            children: _jsxdevruntime.jsxDEV(_lucidereact.Circle, { className: "h-2 w-2 fill-current" }, void 0, false)
          }, void 0, false)
        }, void 0, false),
        children
      ]
    }, void 0, true));
    DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
    const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      DropdownMenuPrimitive.Label,
      {
        ref,
        className: _utils.cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
        ...props
      },
      void 0,
      false,

    ));
    DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
    const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      DropdownMenuPrimitive.Separator,
      {
        ref,
        className: _utils.cn("-mx-1 my-1 h-px bg-muted", className),
        ...props
      },
      void 0,
      false,

    ));
    DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
    const DropdownMenuShortcut = /* @__PURE__ */ __name(({ className, ...props }) => {
      return _jsxdevruntime.jsxDEV("span", { className: _utils.cn("ml-auto text-xs tracking-widest opacity-60", className), ...props }, void 0, false);
    }, "DropdownMenuShortcut");
    DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup };
