import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, Target } from 'lucide-react';

export default function Budgets() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: budgets, isLoading: budgetsLoading } = useQuery({
    queryKey: ['budgets', currentMonth, currentYear],
    queryFn: async () => {
      const { data } = await api.get(`/budgets?month=${currentMonth}&year=${currentYear}`);
      return data;
    }
  });

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/dashboard');
      return data;
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newBudget: any) => {
      const { data } = await api.post('/budgets', newBudget);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsAddModalOpen(false);
      setFormData({
        category: 'Food',
        limit: '',
        month: currentMonth,
        year: currentYear
      });
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Error creating budget');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    }
  });

  const [formData, setFormData] = useState({
    category: 'Food',
    limit: '',
    month: currentMonth,
    year: currentYear
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    addMutation.mutate({
      ...formData,
      limit: Number(formData.limit)
    });
  };

  const categories = ['Food', 'Shopping', 'Bills', 'Travel', 'Health', 'Entertainment', 'Education', 'Rent', 'Fuel', 'Investment', 'Miscellaneous'];
  const expensesByCategory = dashboardData?.expensesByCategory || [];

  const getSpentAmount = (category: string) => {
    const expense = expensesByCategory.find((e: any) => e._id === category);
    return expense ? expense.total : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">Set limits and track your spending</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      {(budgetsLoading || dashboardLoading) ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : budgets?.length === 0 ? (
        <div className="glass rounded-xl border border-white/10 p-16 text-center text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-4 text-primary/50" />
          <p className="text-lg font-medium text-foreground">No budgets set for this month</p>
          <p>Create a budget to keep your spending in check.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets?.map((budget: any) => {
            const spent = getSpentAmount(budget.category);
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const isExceeded = spent > budget.limit;

            return (
              <motion.div
                key={budget._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 rounded-xl border border-white/10 relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground inline-block mb-2">
                      {budget.category}
                    </span>
                    <h3 className="text-2xl font-bold">₹{budget.limit}</h3>
                  </div>
                  <button 
                    onClick={() => deleteMutation.mutate(budget._id)}
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition p-2 rounded-md hover:bg-muted"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent: <span className="font-medium text-foreground">₹{spent}</span></span>
                    <span className={`font-medium ${isExceeded ? 'text-destructive' : 'text-emerald-500'}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isExceeded ? 'bg-destructive' : 'bg-primary'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {isExceeded && (
                    <p className="text-xs text-destructive pt-1 flex items-center gap-1">
                      <span>⚠️</span> Budget exceeded by ₹{(spent - budget.limit).toFixed(2)}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass border border-white/20 p-6 rounded-2xl shadow-2xl relative z-10 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Set Monthly Budget</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 hover:bg-muted rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-lg text-sm mb-4 border border-destructive/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Limit (₹)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.limit}
                    onChange={(e) => setFormData({...formData, limit: e.target.value})}
                    className="w-full px-3 py-2 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6"
                >
                  {addMutation.isPending ? 'Saving...' : 'Set Budget'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
