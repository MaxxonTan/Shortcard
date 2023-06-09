export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-6 py-8 sm:px-10">{children}</div>;
}
