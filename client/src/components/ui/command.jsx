var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _cmdk from "cmdk";
import * as _lucidereact from "lucide-react";
import * as _utils from "@/lib/utils";
import * as _dialog from "@/components/ui/dialog";

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
    
    
    
    
    const Command = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _cmdk.Command,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    Command.displayName = _cmdk.Command.displayName;
    const CommandDialog = /* @__PURE__ */ __name(({ children, ...props }) => {
      return _jsxdevruntime.jsxDEV(_dialog.Dialog, {
        ...props,
        children: _jsxdevruntime.jsxDEV(_dialog.DialogContent, {
          className: "overflow-hidden p-0",
          children: _jsxdevruntime.jsxDEV(Command, {
            className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
            children
          }, void 0, false)
        }, void 0, false)
      }, void 0, false);
    }, "CommandDialog");
    const CommandInput = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
      _jsxdevruntime.jsxDEV(_lucidereact.Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }, void 0, false),
      _jsxdevruntime.jsxDEV.call(
        void 0,
        _cmdk.Command.Input,
        {
          ref,
          className: _utils.cn.call(
            void 0,
            "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          ),
          ...props
        },
        void 0,
        false,

      )
    ] }, void 0, true));
    CommandInput.displayName = _cmdk.Command.Input.displayName;
    const CommandList = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _cmdk.Command.List,
      {
        ref,
        className: _utils.cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
        ...props
      },
      void 0,
      false,

    ));
    CommandList.displayName = _cmdk.Command.List.displayName;
    const CommandEmpty = React.forwardRef((props, ref) => _jsxdevruntime.jsxDEV(_cmdk.Command.Empty, { ref, className: "py-6 text-center text-sm", ...props }, void 0, false));
    CommandEmpty.displayName = _cmdk.Command.Empty.displayName;
    const CommandGroup = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _cmdk.Command.Group,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    CommandGroup.displayName = _cmdk.Command.Group.displayName;
    const CommandSeparator = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _cmdk.Command.Separator,
      {
        ref,
        className: _utils.cn("-mx-1 h-px bg-border", className),
        ...props
      },
      void 0,
      false,

    ));
    CommandSeparator.displayName = _cmdk.Command.Separator.displayName;
    const CommandItem = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _cmdk.Command.Item,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    CommandItem.displayName = _cmdk.Command.Item.displayName;
    const CommandShortcut = /* @__PURE__ */ __name(({ className, ...props }) => {
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
    }, "CommandShortcut");
    CommandShortcut.displayName = "CommandShortcut";
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator };
