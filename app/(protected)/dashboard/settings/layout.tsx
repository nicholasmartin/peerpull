export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      {children}
    </div>
  );
}
