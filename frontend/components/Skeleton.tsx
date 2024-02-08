import { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  round?: boolean;
}

const Skeleton = ({
  className,
  round = false,
  style,
  ...props
}: SkeletonProps) => {
  return (
    <span
      className={"skeleton " + className}
      {...props}
      style={
        style ?? {
          width: className ? undefined : "100%",
          borderRadius: round ? "50%" : undefined,
        }
      }
    >
      &zwnj;
    </span>
  );
};

export default Skeleton;
