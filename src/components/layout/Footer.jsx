import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import logoSm from "@/assets/logosm.svg";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-border/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center" aria-label="Go to home">
          <img src={logoSm} alt="PlayerVault" className="h-10 w-10 sm:hidden" />
          <img src={logo} alt="PlayerVault" className="hidden h-auto w-44 sm:block md:w-52" />
        </Link>
        <p className="font-medium tracking-wide text-foreground/90">© {new Date().getFullYear()} PlayerVault</p>
        
      </div>
    </footer>
  );
}
