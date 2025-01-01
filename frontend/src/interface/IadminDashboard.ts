export type StatCardProps = {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
  };
  
  export type AnalyticsData = {
    name: string;
    sales: number;
    revenue: number;
    customers: number;
  };
  
  export type SidebarProps = {
    isOpen: boolean;
    toggle: () => void;
  };