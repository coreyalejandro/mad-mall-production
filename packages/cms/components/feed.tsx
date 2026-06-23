import type { ReactNode } from "react";

export const Feed = ({
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (data: any) => ReactNode;
  queries: unknown[];
}) => {
  // Return an empty structure that matches basic expectations of CMS components
  return <>{children([{ blog: { posts: { items: [], item: null } }, legalPages: { items: [] } }])}</>;
};
