import type { ReactNode } from "react";

export const EmptyState = ({ title, children }: { title: string; children?: ReactNode }) => (
  <div className="rounded-lg border border-dashed border-border p-8 text-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    {children ? <p className="mt-2 text-sm text-muted-foreground">{children}</p> : null}
  </div>
);
