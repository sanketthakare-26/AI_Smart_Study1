var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _lucidereact from "lucide-react";
import * as _reactdaypicker from "react-day-picker";
import * as _utils from "@/lib/utils";
import * as _button from "@/components/ui/button";

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

    function _optionalChain(ops) {
      let lastAccessLHS = void 0;
      let value = ops[0];
      let i = 1;
      while (i < ops.length) {
        const op = ops[i];
        const fn = ops[i + 1];
        i += 2;
        if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
          return void 0;
        }
        if (op === "access" || op === "optionalAccess") {
          lastAccessLHS = value;
          value = fn(value);
        } else if (op === "call" || op === "optionalCall") {
          value = fn((...args) => value.call(lastAccessLHS, ...args));
          lastAccessLHS = void 0;
        }
      }
      return value;
    }

    "use client";
    
    var React = _interopRequireWildcard(_react);
    
    
    
    
    function Calendar({
      className,
      classNames,
      showOutsideDays = true,
      captionLayout = "label",
      buttonVariant = "ghost",
      formatters,
      components,
      ...props
    }) {
      const defaultClassNames = _reactdaypicker.getDefaultClassNames.call(void 0);
      return _jsxdevruntime.jsxDEV.call(
        void 0,
        _reactdaypicker.DayPicker,
        {
          showOutsideDays,
          className: _utils.cn.call(
            void 0,
            "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
            String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
            String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
            className
          ),
          captionLayout,
          formatters: {
            formatMonthDropdown: /* @__PURE__ */ __name((date) => date.toLocaleString("default", { month: "short" }), "formatMonthDropdown"),
            ...formatters
          },
          classNames: {
            root: _utils.cn("w-fit", defaultClassNames.root),
            months: _utils.cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
            month: _utils.cn("flex w-full flex-col gap-4", defaultClassNames.month),
            nav: _utils.cn.call(
              void 0,
              "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
              defaultClassNames.nav
            ),
            button_previous: _utils.cn.call(
              void 0,
              _button.buttonVariants({ variant: buttonVariant }),
              "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
              defaultClassNames.button_previous
            ),
            button_next: _utils.cn.call(
              void 0,
              _button.buttonVariants({ variant: buttonVariant }),
              "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
              defaultClassNames.button_next
            ),
            month_caption: _utils.cn.call(
              void 0,
              "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
              defaultClassNames.month_caption
            ),
            dropdowns: _utils.cn.call(
              void 0,
              "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
              defaultClassNames.dropdowns
            ),
            dropdown_root: _utils.cn.call(
              void 0,
              "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
              defaultClassNames.dropdown_root
            ),
            dropdown: _utils.cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
            caption_label: _utils.cn.call(
              void 0,
              "select-none font-medium",
              captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
              defaultClassNames.caption_label
            ),
            table: "w-full border-collapse",
            weekdays: _utils.cn("flex", defaultClassNames.weekdays),
            weekday: _utils.cn.call(
              void 0,
              "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
              defaultClassNames.weekday
            ),
            week: _utils.cn("mt-2 flex w-full", defaultClassNames.week),
            week_number_header: _utils.cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
            week_number: _utils.cn.call(
              void 0,
              "text-muted-foreground select-none text-[0.8rem]",
              defaultClassNames.week_number
            ),
            day: _utils.cn.call(
              void 0,
              "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
              defaultClassNames.day
            ),
            range_start: _utils.cn("bg-accent rounded-l-md", defaultClassNames.range_start),
            range_middle: _utils.cn("rounded-none", defaultClassNames.range_middle),
            range_end: _utils.cn("bg-accent rounded-r-md", defaultClassNames.range_end),
            today: _utils.cn.call(
              void 0,
              "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
              defaultClassNames.today
            ),
            outside: _utils.cn.call(
              void 0,
              "text-muted-foreground aria-selected:text-muted-foreground",
              defaultClassNames.outside
            ),
            disabled: _utils.cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
            hidden: _utils.cn("invisible", defaultClassNames.hidden),
            ...classNames
          },
          components: {
            Root: /* @__PURE__ */ __name(({ className: className2, rootRef, ...props2 }) => {
              return _jsxdevruntime.jsxDEV("div", { "data-slot": "calendar", ref: rootRef, className: _utils.cn(className2), ...props2 }, void 0, false);
            }, "Root"),
            Chevron: /* @__PURE__ */ __name(({ className: className2, orientation, ...props2 }) => {
              if (orientation === "left") {
                return _jsxdevruntime.jsxDEV(_lucidereact.ChevronLeftIcon, { className: _utils.cn("size-4", className2), ...props2 }, void 0, false);
              }
              if (orientation === "right") {
                return _jsxdevruntime.jsxDEV(_lucidereact.ChevronRightIcon, { className: _utils.cn("size-4", className2), ...props2 }, void 0, false);
              }
              return _jsxdevruntime.jsxDEV(_lucidereact.ChevronDownIcon, { className: _utils.cn("size-4", className2), ...props2 }, void 0, false);
            }, "Chevron"),
            DayButton: CalendarDayButton,
            WeekNumber: /* @__PURE__ */ __name(({ children, ...props2 }) => {
              return _jsxdevruntime.jsxDEV("td", {
                ...props2,
                children: _jsxdevruntime.jsxDEV("div", {
                  className: "flex size-(--cell-size) items-center justify-center text-center",
                  children
                }, void 0, false)
              }, void 0, false);
            }, "WeekNumber"),
            ...components
          },
          ...props
        },
        void 0,
        false,
        this
      );
    }

    function CalendarDayButton({
      className,
      day,
      modifiers,
      ...props
    }) {
      const defaultClassNames = _reactdaypicker.getDefaultClassNames.call(void 0);
      const ref = React.useRef(null);
      React.useEffect(() => {
        if (modifiers.focused) _optionalChain([ref, "access", (_) => _.current, "optionalAccess", (_2) => _2.focus, "call", (_3) => _3()]);
      }, [modifiers.focused]);
      return _jsxdevruntime.jsxDEV.call(
        void 0,
        _button.Button,
        {
          ref,
          variant: "ghost",
          size: "icon",
          "data-day": day.date.toLocaleDateString(),
          "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
          "data-range-start": modifiers.range_start,
          "data-range-end": modifiers.range_end,
          "data-range-middle": modifiers.range_middle,
          className: _utils.cn.call(
            void 0,
            "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
            defaultClassNames.day,
            className
          ),
          ...props
        },
        void 0,
        false,
        this
      );
    }

export { Calendar, CalendarDayButton };
