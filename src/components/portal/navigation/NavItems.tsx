// components/portal/NavItems.tsx
import {
  Home,
  FileText,
  CheckSquare,
  MessageSquare,
  CreditCard,
  Users,
  Lightbulb,
  HelpCircle,
  Settings as SettingsIcon,
  MoreHorizontal,
  ShoppingCart,
  HandCoins,
  SearchCheck,
  Handshake,
} from "lucide-react";

export type NavItem = {
  name: string;
  path: string;
  icon?: any;
  label?: string;
};

export const mainNavItems: NavItem[] = [
  { name: "Dashboard", path: "/portal/dashboard", icon: Home },
  // { name: "Documents", path: "/portal/documents", icon: FileText },
  // { name: "Disputes", path: "/portal/disputes", icon: CheckSquare },
  { name: "Messages / Discussions", path: "/portal/conversations", icon: MessageSquare },
  { name: "Transactions", path: "/portal/transactions", icon: CreditCard },
  { name: "My For Sale", path: "/portal/my-for-sale", icon: HandCoins },
  { name: "My Purchases", path: "/portal/purchases", icon: ShoppingCart },
  { name: "Team & Access", path: "/portal/companies/company_id/team", icon: Users },
  // { name: "Saved Searches", path: "/portal/searches", icon: SearchCheck },
  // { name: "Search Partners", path: "/portal/search-partners", icon: Handshake },
];

export const bottomNavItems: NavItem[] = [
  { name: "Dashboard", path: "/portal/dashboard", icon: Home, label: "Dashboard" },
  { name: "Tasks", path: "/portal/tasks", icon: CheckSquare, label: "Tasks" },
  { name: "Messages", path: "/portal/messages", icon: MessageSquare, label: "Messages" },
  { name: "More", path: "#", icon: MoreHorizontal, label: "More" },
];

export const auxiliaryNavItems: NavItem[] = [
  { name: "Help Center", path: "/portal/help", icon: HelpCircle },
  { name: "Settings", path: "/portal/settings", icon: SettingsIcon },
];

export const moreMenuItems: NavItem[] = [
  { name: "Billing & Payments", path: "/portal/billing", icon: CreditCard },
  { name: "Team & Access", path: "/portal/team", icon: Users },
  { name: "Feature Requests", path: "/portal/features", icon: Lightbulb },
  { name: "Help Center", path: "/portal/help", icon: HelpCircle },
  { name: "Settings", path: "/portal/settings", icon: SettingsIcon },
];
