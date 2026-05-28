import { Heart, Home, LogOut, Menu, MessageCircle, Plus, ShieldCheck, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Bosh sahifa", icon: Home },
  { to: "/listings", label: "E’lonlar", icon: Menu },
  { to: "/favorites", label: "Sevimli", icon: Heart },
  { to: "/messages", label: "Xabarlar", icon: MessageCircle }
];

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-normal">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-white">GA</span>
            GeoAuto
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.slice(0, 2).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn("rounded-md px-3 py-2 text-sm font-medium text-muted-foreground", isActive && "bg-muted text-foreground")
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user?.role === "ADMIN" ? (
              <NavLink to="/admin" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
                Admin
              </NavLink>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/add">
                <Plus className="h-4 w-4" />
                E’lon berish
              </Link>
            </Button>
            {user ? (
              <>
                <Button asChild variant="outline" className="hidden sm:inline-flex">
                  <Link to="/profile">
                    <User className="h-4 w-4" />
                    Profil
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={logout} aria-label="Chiqish">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button asChild variant="outline">
                <Link to="/login">Kirish</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white md:hidden">
        <div className="grid h-16 grid-cols-5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn("flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground", isActive && "text-primary")
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
          <NavLink to={user?.role === "ADMIN" ? "/admin" : "/add"} className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground">
            {user?.role === "ADMIN" ? <ShieldCheck className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {user?.role === "ADMIN" ? "Admin" : "Qo‘shish"}
          </NavLink>
        </div>
      </nav>
    </>
  );
};
