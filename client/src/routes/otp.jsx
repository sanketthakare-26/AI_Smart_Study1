var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _reactrouter from "@tanstack/react-router";
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

    const Route = _reactrouter.createFileRoute("/otp")({
      head: () => ({ meta: [{ title: "Verify email \u2014 VediQ" }] }),
      component: OtpPage
    });
    
    function OtpPage() {
      const navigate = _reactrouter.useNavigate.call(void 0);
      const [digits, setDigits] = _react.useState(["", "", "", "", "", ""]);
      const [loading, setLoading] = _react.useState(false);
      const refs = _react.useRef([]);
      const handleChange = /* @__PURE__ */ __name((i, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...digits];
        next[i] = val;
        setDigits(next);
        if (val && i < 5) _optionalChain([refs, "access", (_) => _.current, "access", (_2) => _2[i + 1], "optionalAccess", (_3) => _3.focus, "call", (_4) => _4()]);
      }, "handleChange");
      const handleKeyDown = /* @__PURE__ */ __name((i, e) => {
        if (e.key === "Backspace" && !digits[i] && i > 0) _optionalChain([refs, "access", (_5) => _5.current, "access", (_6) => _6[i - 1], "optionalAccess", (_7) => _7.focus, "call", (_8) => _8()]);
      }, "handleKeyDown");
      const complete = digits.every((d) => d !== "");
      const verify = /* @__PURE__ */ __name(async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1100));
        setLoading(false);
        navigate({ to: "/app" });
      }, "verify");
      return _jsxdevruntime.jsxDEV(_AuthLayout.AuthLayout, {
        title: "Verify your email",
        subtitle: "Enter the 6-digit code we sent to your inbox.",
        children: _jsxdevruntime.jsxDEV("div", { className: "space-y-6", children: [
          _jsxdevruntime.jsxDEV("div", {
            className: "flex items-center justify-center gap-2 sm:gap-3",
            children: digits.map((d, i) => _jsxdevruntime.jsxDEV.call(
              void 0,
              _framermotion.motion.input,
              {
                ref: (el) => {
                  refs.current[i] = el;
                },
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: i * 0.06 },
                value: d,
                onChange: /* @__PURE__ */ __name((e) => handleChange(i, e.target.value), "onChange"),
                onKeyDown: /* @__PURE__ */ __name((e) => handleKeyDown(i, e), "onKeyDown"),
                inputMode: "numeric",
                maxLength: 1,
                "aria-label": `Digit ${i + 1}`,
                className: "h-13 w-11 rounded-xl border border-input bg-card text-center font-display text-xl font-bold outline-none transition-all focus:border-primary focus:ring-4 focus:ring-ring/15 sm:h-14 sm:w-12"
              },
              i,
              false,
              this
            ))
          }, void 0, false),
          _jsxdevruntime.jsxDEV("button", {
            onClick: verify,
            disabled: !complete || loading,
            className: "btn-gradient flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50",
            children: loading ? _jsxdevruntime.jsxDEV(_jsxdevruntime.Fragment, { children: [_jsxdevruntime.jsxDEV(_lucidereact.Loader2, { className: "h-4 w-4 animate-spin" }, void 0, false), " Verifying\u2026"] }, void 0, true) : _jsxdevruntime.jsxDEV(_jsxdevruntime.Fragment, { children: [_jsxdevruntime.jsxDEV(_lucidereact.ShieldCheck, { className: "h-4 w-4" }, void 0, false), " Verify & continue"] }, void 0, true)
          }, void 0, false),
          _jsxdevruntime.jsxDEV("p", { className: "text-center text-xs text-muted-foreground", children: [
            "Didn't get a code? ",
            _jsxdevruntime.jsxDEV("button", { className: "font-semibold text-primary hover:underline", children: "Resend" }, void 0, false)
          ] }, void 0, true)
        ] }, void 0, true)
      }, void 0, false);
    }

export { Route };
