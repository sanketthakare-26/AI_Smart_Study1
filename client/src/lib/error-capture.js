var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};


function _nullishCoalesce(lhs, rhsFn) {
      if (lhs != null) {
        return lhs;
      } else {
        return rhsFn();
      }
    }

    let lastCapturedError;
    const TTL_MS = 5e3;
    function record(error) {
      lastCapturedError = { error, at: Date.now() };
    }

    if (typeof globalThis.addEventListener === "function") {
      globalThis.addEventListener("error", (event) => record(_nullishCoalesce(event.error, () => event)));
      globalThis.addEventListener(
        "unhandledrejection",
        (event) => record(event.reason)
      );
    }
    function consumeLastCapturedError() {
      if (!lastCapturedError) return void 0;
      if (Date.now() - lastCapturedError.at > TTL_MS) {
        lastCapturedError = void 0;
        return void 0;
      }
      const { error } = lastCapturedError;
      lastCapturedError = void 0;
      return error;
    }

export { consumeLastCapturedError };
