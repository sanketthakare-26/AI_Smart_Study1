var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reacttabs from "@radix-ui/react-tabs";
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
    
    var TabsPrimitive = _interopRequireWildcard(_reacttabs);
    
    const Tabs = TabsPrimitive.Root;
    const TabsList = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      TabsPrimitive.List,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    TabsList.displayName = TabsPrimitive.List.displayName;
    const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      TabsPrimitive.Trigger,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
    const TabsContent = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      TabsPrimitive.Content,
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };
