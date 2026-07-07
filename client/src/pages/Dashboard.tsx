import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, IndianRupee, Download } from 'lucide-react';
import { exportToCSV } from '../utils/export.utils';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export default function Dashboard() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/dashboard');
      return data;
    }
  });

  const { data: insights } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const { data } = await api.get('/insights');
      return data.insights;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your financial health</p>
        </div>
        <button 
          onClick={() => summary?.lastTransactions && exportToCSV(summary.lastTransactions, 'recent-transactions')}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Balance', value: summary?.currentBalance || 0, icon: Wallet, color: 'text-primary', bg: 'bg-primary/10' },
          { title: 'Total Income', value: summary?.totalIncome || 0, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Total Expense', value: summary?.totalExpense || 0, icon: TrendingDown, color: 'text-destructive', bg: 'bg-destructive/10' },
          { title: 'Savings', value: `${summary?.savings || 0}%`, icon: IndianRupee, color: 'text-amber-500', bg: 'bg-amber-500/10', isPercentage: true },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, translateY: -5 }}
            transition={{ delay: i * 0.1, duration: 0.2 }}
            className="glass p-6 rounded-xl border border-white/10 relative overflow-hidden group hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{kpi.title}</p>
              <div className={`p-2 rounded-lg ${kpi.bg} group-hover:scale-110 transition-transform`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold">
              {!kpi.isPercentage && '₹'}{kpi.value}
            </h3>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-2xl group-hover:from-primary/20 transition-all duration-500" />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-xl border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-6">Expenses by Category</h3>
          <div className="h-[300px] w-full">
            {summary?.expensesByCategory?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="total"
                    nameKey="_id"
                  >
                    {summary.expensesByCategory.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value}`}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No expense data for this month
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-xl border border-white/10 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold">Smart Insights</h3>
          </div>
          
          <div className="flex-1 space-y-4">
            {insights?.map((insight: string, idx: number) => (
              <div key={idx} className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex gap-3">
                <span className="text-primary mt-0.5">•</span>
                <p className="text-sm leading-relaxed">{insight}</p>
              </div>
            ))}
            {(!insights || insights.length === 0) && (
              <p className="text-muted-foreground text-sm">No insights available right now.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-xl border border-white/10 overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {summary?.lastTransactions?.map((tx: any) => (
                <tr key={tx._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium">{tx.title || tx.source}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                      {tx.category || 'Income'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${tx.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                  </td>
                </tr>
              ))}
              {(!summary?.lastTransactions || summary.lastTransactions.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No recent transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
