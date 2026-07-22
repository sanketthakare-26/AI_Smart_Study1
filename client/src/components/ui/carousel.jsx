var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _emblacarouselreact from "embla-carousel-react";
import * as _lucidereact from "lucide-react";
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

    var React = _interopRequireWildcard(_react);
    
    
    
    
    
    const CarouselContext = React.createContext(null);
    function useCarousel() {
      const context = React.useContext(CarouselContext);
      if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
      }
      return context;
    }

    const Carousel = React.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
      const [carouselRef, api] = _emblacarouselreact.default.call(
        void 0,
        {
          ...opts,
          axis: orientation === "horizontal" ? "x" : "y"
        },
        plugins
      );
      const [canScrollPrev, setCanScrollPrev] = React.useState(false);
      const [canScrollNext, setCanScrollNext] = React.useState(false);
      const onSelect = React.useCallback((api2) => {
        if (!api2) {

        }
        setCanScrollPrev(api2.canScrollPrev());
        setCanScrollNext(api2.canScrollNext());
      }, []);
      const scrollPrev = React.useCallback(() => {
        _optionalChain([api, "optionalAccess", (_) => _.scrollPrev, "call", (_2) => _2()]);
      }, [api]);
      const scrollNext = React.useCallback(() => {
        _optionalChain([api, "optionalAccess", (_3) => _3.scrollNext, "call", (_4) => _4()]);
      }, [api]);
      const handleKeyDown = React.useCallback(
        (event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollPrev();
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollNext();
          }
        },
        [scrollPrev, scrollNext]
      );
      React.useEffect(() => {
        if (!api || !setApi) {

        }
        setApi(api);
      }, [api, setApi]);
      React.useEffect(() => {
        if (!api) {

        }
        onSelect(api);
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        return () => {
          _optionalChain([api, "optionalAccess", (_5) => _5.off, "call", (_6) => _6("select", onSelect)]);
        };
      }, [api, onSelect]);
      return _jsxdevruntime.jsxDEV(CarouselContext.Provider, {
        value: {
          carouselRef,
          api,
          opts,
          orientation: orientation || (_optionalChain([opts, "optionalAccess", (_7) => _7.axis]) === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext
        },
        children: _jsxdevruntime.jsxDEV("div", {
          ref,
          onKeyDownCapture: handleKeyDown,
          className: _utils.cn("relative", className),
          role: "region",
          "aria-roledescription": "carousel",
          ...props,
          children
        }, void 0, false)
      }, void 0, false);
    });
    Carousel.displayName = "Carousel";
    const CarouselContent = React.forwardRef(
      ({ className, ...props }, ref) => {
        const { carouselRef, orientation } = useCarousel();
        return _jsxdevruntime.jsxDEV("div", {
          ref: carouselRef,
          className: "overflow-hidden",
          children: _jsxdevruntime.jsxDEV.call(
            void 0,
            "div",
            {
              ref,
              className: _utils.cn.call(
                void 0,
                "flex",
                orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
                className
              ),
              ...props
            },
            void 0,
            false,

          )
        }, void 0, false);
      }
    );
    CarouselContent.displayName = "CarouselContent";
    const CarouselItem = React.forwardRef(
      ({ className, ...props }, ref) => {
        const { orientation } = useCarousel();
        return _jsxdevruntime.jsxDEV.call(
          void 0,
          "div",
          {
            ref,
            role: "group",
            "aria-roledescription": "slide",
            className: _utils.cn.call(
              void 0,
              "min-w-0 shrink-0 grow-0 basis-full",
              orientation === "horizontal" ? "pl-4" : "pt-4",
              className
            ),
            ...props
          },
          void 0,
          false,

        );
      }
    );
    CarouselItem.displayName = "CarouselItem";
    const CarouselPrevious = React.forwardRef(
      ({ className, variant = "outline", size = "icon", ...props }, ref) => {
        const { orientation, scrollPrev, canScrollPrev } = useCarousel();
        return _jsxdevruntime.jsxDEV(_button.Button, {
          ref,
          variant,
          size,
          className: _utils.cn.call(
            void 0,
            "absolute  h-8 w-8 rounded-full",
            orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
            className
          ),
          disabled: !canScrollPrev,
          onClick: scrollPrev,
          ...props,
          children: [
            _jsxdevruntime.jsxDEV(_lucidereact.ArrowLeft, { className: "h-4 w-4" }, void 0, false),
            _jsxdevruntime.jsxDEV("span", { className: "sr-only", children: "Previous slide" }, void 0, false)
          ]
        }, void 0, true);
      }
    );
    CarouselPrevious.displayName = "CarouselPrevious";
    const CarouselNext = React.forwardRef(
      ({ className, variant = "outline", size = "icon", ...props }, ref) => {
        const { orientation, scrollNext, canScrollNext } = useCarousel();
        return _jsxdevruntime.jsxDEV(_button.Button, {
          ref,
          variant,
          size,
          className: _utils.cn.call(
            void 0,
            "absolute h-8 w-8 rounded-full",
            orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
            className
          ),
          disabled: !canScrollNext,
          onClick: scrollNext,
          ...props,
          children: [
            _jsxdevruntime.jsxDEV(_lucidereact.ArrowRight, { className: "h-4 w-4" }, void 0, false),
            _jsxdevruntime.jsxDEV("span", { className: "sr-only", children: "Next slide" }, void 0, false)
          ]
        }, void 0, true);
      }
    );
    CarouselNext.displayName = "CarouselNext";
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
