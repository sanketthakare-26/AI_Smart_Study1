import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

export const jsxDEV = (type, props, key, isStaticCallback, source, self) => {
  // In production, delegate jsxDEV to the production jsx runtime
  return jsx(type, props, key);
};

export { Fragment };
export default { jsxDEV, Fragment };
