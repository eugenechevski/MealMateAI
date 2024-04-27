const sizeClasses = {
  sm: "w-16 p-2 text-sm",
  // could not change the button size by className here or on page tsx
  // leaving old stuff here just adding a one fits all and putting the breakpoints here
  buttonSize: "w-16 p-1 text-xs sm:w-32 sm:p-4 sm:text-lg sm:mt-8",
  md: "w-32 p-4 text-md",
  lg: "w-64 p-8 text-lg",
};

export default function Button({
  children,
  hanlderOnClick,
  classes,
  size,
}: {
  children: any;
  classes?: string;
  size?: "buttonSize" | "sm" | "md" | "lg";
  hanlderOnClick?: () => void;
}) {
  return (
    <button
      onClick={hanlderOnClick}
      className={"primary-button " + sizeClasses[size || "md"] + " " + classes}
    >
      {children}
    </button>
  );
}
