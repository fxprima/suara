import { ReactNode } from "react";
import ConnectionsTabs from "../../../../components/gema/ConnectionsTabs";

export default async function ConnectionsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <div className="max-w-2xl mx-auto">
      <ConnectionsTabs username={username} />
      {children}
    </div>
  );
}
