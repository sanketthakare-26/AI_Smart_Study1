var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactaccordion from "@radix-ui/react-accordion";
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
    
    var AccordionPrimitive = _interopRequireWildcard(_reactaccordion);
    
    
    const Accordion = AccordionPrimitive.Root;
    const AccordionItem = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV(AccordionPrimitive.Item, { ref, className: _utils.cn("border-b", className), ...props }, void 0, false));
    AccordionItem.displayName = "AccordionItem";
    const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(AccordionPrimitive.Header, {
      className: "flex",
      children: _jsxdevruntime.jsxDEV(AccordionPrimitive.Trigger, {
        ref,
        className: _utils.cn.call(
          void 0,
          "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
          className
        ),
        ...props,
        children: [
          children,
          _jsxdevruntime.jsxDEV(_lucidereact.ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" }, void 0, false)
        ]
      }, void 0, true)
    }, void 0, false));
    AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
    const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => _jsxdevruntime.jsxDEV(AccordionPrimitive.Content, {
      ref,
      className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      ...props,
      children: _jsxdevruntime.jsxDEV("div", { className: _utils.cn("pb-4 pt-0", className), children }, void 0, false)
    }, void 0, false));
    AccordionContent.displayName = AccordionPrimitive.Content.displayName;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
