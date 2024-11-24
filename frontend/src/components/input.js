import { forwardRef } from "react";

const Input = ({
  bodyClass = "",
  htmlFor,
  label,
  children,
  warning = false,
  warningType = 0,
  ...props
}, ref) => {
  return (
    <div className={bodyClass}>
      <label htmlFor={htmlFor} className="w-full">
        {children ? (
          children
        ) : (
          <p className={"mb-2 " + (warning ? "text-error" : "")}>{label}</p>
        )}
        <input
          id={htmlFor}
          ref={ref}
          className={
            "rounded-lg px-4 py-3 lg:py-[15.5px] w-full bg-background placeholder-placeholer text-up text-sm border-2 border-solitude focus:border-primary outline-none" +
            (warning ? "border-2 border-error" : "")
          }
          {...props}
        />
        {warning && (
          <p
            className={
              " mt-2 transition duration-400 ease-in-out text-xs " +
              (warningType ? "text-success" : "text-error")
            }
          >
            <span
              className={
                "w-2 h-2 mr-4 rounded inline-block " +
                (warningType ? "bg-success" : "bg-error")
              }
            ></span>
            {warning}
          </p>
        )}
      </label>
    </div>
  )
}

export default forwardRef(Input)
