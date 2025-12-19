import { ReactNode } from "react";
import ConnectionsTabs from "../../../../components/gema/ConnectionsTabs";

export default function ConnectionsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { username: string };
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <ConnectionsTabs username={params.username} />
      {children}
    </div>
  );
}
