import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FolderTree, 
  Receipt, 
  BarChart3,
  Leaf,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderTree },
  { name: "Transactions", href: "/admin/transactions", icon: Receipt },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const AdminSidebar = () => {
  const location = useLocation();
  
  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-ocean flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display text-lg font-semibold text-foreground block">
              Atlas Sanctum
            </span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Back to site */}
      <div className="p-4 border-t border-border">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
