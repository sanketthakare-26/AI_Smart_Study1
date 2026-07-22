var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
import * as _reactslot from "@radix-ui/react-slot";
import * as _reacthookform from "react-hook-form";
import * as _utils from "@/lib/utils";
import * as _label from "@/components/ui/label";

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

    function _nullishCoalesce(lhs, rhsFn) {
      if (lhs != null) {
        return lhs;
      } else {
        return rhsFn();
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
    
    
    
    
    const Form = _reacthookform.FormProvider;
    const FormFieldContext = React.createContext(null);
    const FormField = /* @__PURE__ */ __name(({
      ...props
    }) => {
      return _jsxdevruntime.jsxDEV(FormFieldContext.Provider, {
        value: { name: props.name },
        children: _jsxdevruntime.jsxDEV(_reacthookform.Controller, { ...props }, void 0, false)
      }, void 0, false);
    }, "FormField");
    const useFormField = /* @__PURE__ */ __name(() => {
      const fieldContext = React.useContext(FormFieldContext);
      const itemContext = React.useContext(FormItemContext);
      const { getFieldState, formState } = _reacthookform.useFormContext.call(void 0);
      if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
      }
      if (!itemContext) {
        throw new Error("useFormField should be used within <FormItem>");
      }
      const fieldState = getFieldState(fieldContext.name, formState);
      const { id } = itemContext;
      return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState
      };
    }, "useFormField");
    const FormItemContext = React.createContext(null);
    const FormItem = React.forwardRef(
      ({ className, ...props }, ref) => {
        const id = React.useId();
        return _jsxdevruntime.jsxDEV(FormItemContext.Provider, {
          value: { id },
          children: _jsxdevruntime.jsxDEV("div", { ref, className: _utils.cn("space-y-2", className), ...props }, void 0, false)
        }, void 0, false);
      }
    );
    FormItem.displayName = "FormItem";
    const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
      const { error, formItemId } = useFormField();
      return _jsxdevruntime.jsxDEV.call(
        void 0,
        _label.Label,
        {
          ref,
          className: _utils.cn(error && "text-destructive", className),
          htmlFor: formItemId,
          ...props
        },
        void 0,
        false,

      );
    });
    FormLabel.displayName = "FormLabel";
    const FormControl = React.forwardRef(({ ...props }, ref) => {
      const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
      return _jsxdevruntime.jsxDEV.call(
        void 0,
        _reactslot.Slot,
        {
          ref,
          id: formItemId,
          "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
          "aria-invalid": !!error,
          ...props
        },
        void 0,
        false,

      );
    });
    FormControl.displayName = "FormControl";
    const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
      const { formDescriptionId } = useFormField();
      return _jsxdevruntime.jsxDEV.call(
        void 0,
        "p",
        {
          ref,
          id: formDescriptionId,
          className: _utils.cn("text-[0.8rem] text-muted-foreground", className),
          ...props
        },
        void 0,
        false,

      );
    });
    FormDescription.displayName = "FormDescription";
    const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
      const { error, formMessageId } = useFormField();
      const body = error ? String(_nullishCoalesce(_optionalChain([error, "optionalAccess", (_) => _.message]), () => "")) : children;
      if (!body) {
        return null;
      }
      return _jsxdevruntime.jsxDEV("p", {
        ref,
        id: formMessageId,
        className: _utils.cn("text-[0.8rem] font-medium text-destructive", className),
        ...props,
        children: body
      }, void 0, false);
    });
    FormMessage.displayName = "FormMessage";
export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
