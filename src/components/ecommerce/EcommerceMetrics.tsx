import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import Badge from "../ui/badge/Badge";

interface MetricCardProps {
  title: string;
  value: string;
  percentage: string;
  isUp: boolean;
  icon: React.ElementType;
}

const MetricCard = ({ title, value, percentage, isUp, icon: Icon }: MetricCardProps) => (
  <div className="group rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:shadow-lg hover:shadow-orange-500/5 dark:border-gray-800 dark:bg-black md:p-6">
    <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-xl transition-colors group-hover:bg-orange-100 dark:bg-orange-500/10">
      {/* Icon uses a vibrant orange to stand out against the white/black background */}
      <Icon className="text-orange-600 size-6 dark:text-orange-500" strokeWidth={2} />
    </div>

    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <h4 className="mt-2 text-2xl font-bold text-black dark:text-white">
          {value}
        </h4>
      </div>
      
      {/* Badge colors adjusted for a cleaner aesthetic */}
      <Badge color={isUp ? "success" : "error"}>
        <div className="flex items-center gap-0.5">
          {isUp ? (
            <ArrowUpRight className="size-3.5" />
          ) : (
            <ArrowDownRight className="size-3.5" />
          )}
          <span className="font-semibold">{percentage}</span>
        </div>
      </Badge>
    </div>
  </div>
);

export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      <MetricCard
        title="Total Customers"
        value="3,782"
        percentage="11.01%"
        isUp={true}
        icon={Users}
      />

      <MetricCard
        title="Total Orders"
        value="5,359"
        percentage="9.05%"
        isUp={false}
        icon={ShoppingBag}
      />

      <MetricCard
        title="Total Revenue"
        value="$24,500"
        percentage="18.2%"
        isUp={true}
        icon={DollarSign}
      />

      <MetricCard
        title="Total Profit"
        value="$12,420"
        percentage="4.35%"
        isUp={true}
        icon={TrendingUp}
      />
    </div>
  );
}