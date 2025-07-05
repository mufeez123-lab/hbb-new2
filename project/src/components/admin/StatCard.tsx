import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, isPositive, icon, color }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow p-5"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-neutral-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
        </div>
        <div className={`${color} rounded-full h-12 w-12 flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <ArrowUpRight size={16} className="mr-1" />
          ) : (
            <ArrowDownRight size={16} className="mr-1" />
          )}
          {change}
        </span>
        <span className="text-sm text-neutral-500 ml-2">from last month</span>
      </div>
    </motion.div>
  );
};

export default StatCard;