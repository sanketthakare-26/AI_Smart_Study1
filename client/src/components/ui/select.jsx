var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactselect from "@radix-ui/react-select";
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
    
    var SelectPrimitive = _interopRequireWildcard(_reactselect);
    
    
    const Select = SelectPrimitive.Root;
    const SelectGroup = SelectPrimitive.Group;
    const SelectValue = SelectPrimitive.Value;
    const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(SelectPrimitive.Trigger, {
      ref,
      className: _utils.cn.call(
        void 0,
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      ),
      ...props,
      children: [
        children,
        _jsxdevruntime.jsxDEV(SelectPrimitive.Icon, {
          asChild: true,
          children: _jsxdevruntime.jsxDEV(_lucidereact.ChevronDown, { className: "h-4 w-4 opacity-50" }, void 0, false)
        }, void 0, false)
      ]
    }, void 0, true));
    SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
    const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(SelectPrimitive.ScrollUpButton, {
      ref,
      className: _utils.cn("flex cursor-default items-center justify-center py-1", className),
      ...props,
      children: _jsxdevruntime.jsxDEV(_lucidereact.ChevronUp, { className: "h-4 w-4" }, void 0, false)
    }, void 0, false));
    SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
    const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(SelectPrimitive.ScrollDownButton, {
      ref,
      className: _utils.cn("flex cursor-default items-center justify-center py-1", className),
      ...props,
      children: _jsxdevruntime.jsxDEV(_lucidereact.ChevronDown, { className: "h-4 w-4" }, void 0, false)
    }, void 0, false));
    SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
    const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => _jsxdevruntime.jsxDEV(SelectPrimitive.Portal, {
      children: _jsxdevruntime.jsxDEV(SelectPrimitive.Content, {
        ref,
        className: _utils.cn.call(
          void 0,
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
          position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        ),
        position,
        ...props,
        children: [
          _jsxdevruntime.jsxDEV(SelectScrollUpButton, {}, void 0, false),
          _jsxdevruntime.jsxDEV(SelectPrimitive.Viewport, {
            className: _utils.cn.call(
              void 0,
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            ),
            children
          }, void 0, false),
          _jsxdevruntime.jsxDEV(SelectScrollDownButton, {}, void 0, false)
        ]
      }, void 0, true)
    }, void 0, false));
    SelectContent.displayName = SelectPrimitive.Content.displayName;
    const SelectLabel = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      SelectPrimitive.Label,
      {
        ref,
        className: _utils.cn("px-2 py-1.5 text-sm font-semibold", className),
        ...props
      },
      void 0,
      false,

    ));
    SelectLabel.displayName = SelectPrimitive.Label.displayName;
    const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(SelectPrimitive.Item, {
      ref,
      className: _utils.cn.call(
        void 0,
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        _jsxdevruntime.jsxDEV("span", {
          className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
          children: _jsxdevruntime.jsxDEV(SelectPrimitive.ItemIndicator, {
            children: _jsxdevruntime.jsxDEV(_lucidereact.Check, { className: "h-4 w-4" }, void 0, false)
          }, void 0, false)
        }, void 0, false),
        _jsxdevruntime.jsxDEV(SelectPrimitive.ItemText, { children }, void 0, false)
      ]
    }, void 0, true));
    SelectItem.displayName = SelectPrimitive.Item.displayName;
    const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      SelectPrimitive.Separator,
      {
        ref,
        className: _utils.cn("-mx-1 my-1 h-px bg-muted", className),
        ...props
      },
      void 0,
      false,

    ));
    SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton };
