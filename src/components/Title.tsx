import type { ReactNode } from "react";

function Title({ children }: { children: ReactNode }) {
    return(
        <h1 className="w-full min-w-0 text-cyan-950 text-xl font-bold">{children}</h1>
    )
}

export default Title;
