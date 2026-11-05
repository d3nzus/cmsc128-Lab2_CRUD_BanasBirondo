import type { ReactNode } from "react";

type TitleProps = {
  children: ReactNode;
  id?: string;
};

function Title({ children, id }: TitleProps) {
  return (
    <h2 id={id} className="w-full min-w-0 text-lg font-bold tracking-tight text-cyan-950 sm:text-xl">
      {children}
    </h2>
  );
}

export default Title;
