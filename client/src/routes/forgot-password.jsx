var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _reactrouter from "@tanstack/react-router";
import * as _reacthookform from "react-hook-form";
import * as _react from "react";
import * as _lucidereact from "lucide-react";
import * as _framermotion from "framer-motion";
import * as _AuthLayout from "@/components/AuthLayout";

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

    const Route = _reactrouter.createFileRoute("/forgot-password")({
      head: () => ({ meta: [{ title: "Reset password \u2014 NeuroWake" }] }),
      component: ForgotPage
    });
    
    function ForgotPage() {
      const [loading, setLoading] = _react.useState(false);
      const [sent, setSent] = _react.useState(false);
      const { register, handleSubmit, formState: { errors } } = _reacthookform.useForm();
      const onSubmit = /* @__PURE__ */ __name(async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);
        setSent(true);
      }, "onSubmit");
      return _jsxdevruntime.jsxDEV(_AuthLayout.AuthLayout, {
        title: "Reset your password",
        subtitle: "We'll email you a secure reset link.",
        footer: _jsxdevruntime.jsxDEV(_reactrouter.Link, { to: "/login", className: "font-semibold text-primary hover:underline", children: "Back to login" }, void 0, false),
        children: sent ? _jsxdevruntime.jsxDEV(_framermotion.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "card-surface flex flex-col items-center p-8 text-center", children: [
          _jsxdevruntime.jsxDEV(_lucidereact.CheckCircle2, { className: "h-12 w-12 text-emerald-brand" }, void 0, false),
          _jsxdevruntime.jsxDEV("h3", { className: "mt-4 font-display text-lg font-semibold", children: "Check your inbox" }, void 0, false),
          _jsxdevruntime.jsxDEV("p", { className: "mt-1 text-sm text-muted-foreground", children: "If an account exists for that email, a reset link is on its way." }, void 0, false)
        ] }, void 0, true) : _jsxdevruntime.jsxDEV("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [
          _jsxdevruntime.jsxDEV.call(
            void 0,
            _AuthLayout.AuthInput,
            {
              label: "Email",
              type: "email",
              placeholder: "you@university.edu",
              error: _optionalChain([errors, "access", (_) => _.email, "optionalAccess", (_2) => _2.message]),
              ...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Enter a valid email" } })
            },
            void 0,
            false,
            this
          ),
          _jsxdevruntime.jsxDEV("button", {
            type: "submit",
            disabled: loading,
            className: "btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-70",
            children: loading ? _jsxdevruntime.jsxDEV(_jsxdevruntime.Fragment, { children: [_jsxdevruntime.jsxDEV(_lucidereact.Loader2, { className: "h-4 w-4 animate-spin" }, void 0, false), " Sending\u2026"] }, void 0, true) : "Send reset link"
          }, void 0, false)
        ] }, void 0, true)
      }, void 0, false);
    }

export { Route };
