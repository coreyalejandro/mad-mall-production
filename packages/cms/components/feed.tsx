import type { ReactNode } from "react";

export const Feed = ({ children }: { children: (data: any[]) => ReactNode; queries: any[] }) => {
  // Return an empty structure that matches basic expectations of CMS components
  return <>{children([{ blog: { posts: { items: [], item: null } }, legalPages: { items: [] } }])}</>;
};
