var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _jsxdevruntime from "react/jsx-dev-runtime";
import * as _react from "react";
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
    
    const Table = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("div", {
        className: "relative w-full overflow-auto",
        children: _jsxdevruntime.jsxDEV("table", { ref, className: _utils.cn("w-full caption-bottom text-sm", className), ...props }, void 0, false)
      }, void 0, false)
    );
    Table.displayName = "Table";
    const TableHeader = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("thead", { ref, className: _utils.cn("[&_tr]:border-b", className), ...props }, void 0, false));
    TableHeader.displayName = "TableHeader";
    const TableBody = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("tbody", { ref, className: _utils.cn("[&_tr:last-child]:border-0", className), ...props }, void 0, false));
    TableBody.displayName = "TableBody";
    const TableFooter = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      "tfoot",
      {
        ref,
        className: _utils.cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
        ...props
      },
      void 0,
      false,

    ));
    TableFooter.displayName = "TableFooter";
    const TableRow = React.forwardRef(
      ({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
        void 0,
        "tr",
        {
          ref,
          className: _utils.cn.call(
            void 0,
            "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
            className
          ),
          ...props
        },
        void 0,
        false,

      )
    );
    TableRow.displayName = "TableRow";
    const TableHead = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      "th",
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    TableHead.displayName = "TableHead";
    const TableCell = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV.call(
      void 0,
      "td",
      {
        ref,
        className: _utils.cn.call(
          void 0,
          "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          className
        ),
        ...props
      },
      void 0,
      false,

    ));
    TableCell.displayName = "TableCell";
    const TableCaption = React.forwardRef(({ className, ...props }, ref) => _jsxdevruntime.jsxDEV("caption", { ref, className: _utils.cn("mt-4 text-sm text-muted-foreground", className), ...props }, void 0, false));
    TableCaption.displayName = "TableCaption";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
