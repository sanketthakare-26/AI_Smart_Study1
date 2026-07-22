var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _lucidereact from "lucide-react";
import * as _reactresizablepanels from "react-resizable-panels";
import * as _utils from "@/lib/utils";

const ResizablePanelGroup = /* @__PURE__ */ __name(({ className, ...props }) => _jsxdevruntime.jsxDEV.call(
      void 0,
      _reactresizablepanels.Group,
      {
        className: _utils.cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className),
        ...props
      },
      void 0,
      false,

    ), "ResizablePanelGroup");
    const ResizablePanel = _reactresizablepanels.Panel;
    const ResizableHandle = /* @__PURE__ */ __name(({
      withHandle,
      className,
      ...props
    }) => _jsxdevruntime.jsxDEV(_reactresizablepanels.Separator, {
      className: _utils.cn.call(
        void 0,
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      ),
      ...props,
      children: withHandle && _jsxdevruntime.jsxDEV("div", {
        className: "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border",
        children: _jsxdevruntime.jsxDEV(_lucidereact.GripVertical, { className: "h-2.5 w-2.5" }, void 0, false)
      }, void 0, false)
    }, void 0, false), "ResizableHandle");
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
