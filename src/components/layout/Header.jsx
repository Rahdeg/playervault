import { NavLink } from "react-router-dom";
import { House, Search, Info, Scale } from "lucide-react";

function NavItem({ to, children, end, icon }) {
  const IconComponent = icon;

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "group relative flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:tracking-[0.14em] sm:uppercase",
          isActive
            ? "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(230,76,160,0.35)]"
            : "text-muted-foreground hover:text-foreground",
        ].join(" ")
      }
    >
      <IconComponent className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden sm:inline">{children}</span>
      <span className="sr-only sm:hidden">{children}</span>
    </NavLink>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-border/80 bg-card/70 px-3 py-2 shadow-[0_12px_40px_rgba(205,88,151,0.18)] backdrop-blur-xl sm:px-5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full border border-primary/40 text-sm text-primary">✧</span>
          <span className="hidden text-xs font-bold tracking-[0.2em] uppercase text-foreground/90 sm:inline">PlayerVault</span>
        </div>

        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          <NavItem to="/" end icon={House}>Home</NavItem>
          <NavItem to="/search" icon={Search}>Find</NavItem>
          <NavItem to="/compare" icon={Scale}>Compare</NavItem>
          <NavItem to="/about" icon={Info}>Info</NavItem>
        </nav>
      </div>
    </header>
  );
}
