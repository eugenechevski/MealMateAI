const sizeClasses = {
  sm: "w-16 p-2 text-sm",
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
  size?: "sm" | "md" | "lg";
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
