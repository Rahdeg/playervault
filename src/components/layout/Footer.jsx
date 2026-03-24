export default function Footer() {
  return (
    <footer className="mt-10 border-t border-border/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium tracking-wide text-foreground/90">© {new Date().getFullYear()} PlayerVault</p>
        
      </div>
    </footer>
  );
}
