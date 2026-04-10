type PageLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  extraContent?: React.ReactNode;
};

export function PageLayout({ title, description, children, extraContent }: PageLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">{children}</div>

      {extraContent && (
        <div className="mt-12 space-y-8 text-muted-foreground">{extraContent}</div>
      )}
    </div>
  );
}
