import { useState, useMemo, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CC } from './theme';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { Plus, Upload, Trash2, TrendingUp, TrendingDown, DollarSign, ArrowUpDown, X } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BUSINESS_CATEGORIES = {
  income: ['Programme Fees', 'Product Sales', 'Consulting', 'Speaking', 'Sponsorship', 'Other Income'],
  expense: ['Marketing', 'Tools & Software', 'Travel', 'Meals & Entertainment', 'Office', 'Salaries', 'Contractors', 'Insurance', 'Rent', 'VAT', 'Tax Provision', 'API Costs', 'Other Expense'],
};

const PERSONAL_CATEGORIES = {
  income: ['Salary Draw', 'Investments', 'Rental Income', 'Side Income', 'Other Income'],
  expense: ['Rent/Bond', 'Groceries', 'Utilities', 'Transport', 'Insurance', 'Medical', 'Entertainment', 'Subscriptions', 'Clothing', 'Education', 'Savings', 'Other Expense'],
};

const PIE_COLORS = [CC.teal, CC.gold, CC.success, CC.blue, CC.warning, CC.error, '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'];

type AccountType = 'business' | 'personal';

interface Transaction {
  id: string;
  transaction_date: string;
  account_type: string;
  transaction_type: string;
  category: string;
  description: string | null;
  amount: number;
  source: string | null;
}

export default function BudgetTab() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [account, setAccount] = useState<AccountType>('business');
  const [month, setMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: 'expense' as 'income' | 'expense', category: '', description: '', amount: '', date: format(new Date(), 'yyyy-MM-dd') });

  const monthStart = startOfMonth(parseISO(month + '-01'));
  const monthEnd = endOfMonth(monthStart);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['budget', account, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budget_transactions')
        .select('*')
        .eq('account_type', account)
        .gte('transaction_date', format(monthStart, 'yyyy-MM-dd'))
        .lte('transaction_date', format(monthEnd, 'yyyy-MM-dd'))
        .order('transaction_date', { ascending: false });
      if (error) throw error;
      return (data || []) as Transaction[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (tx: { transaction_date: string; account_type: string; transaction_type: string; category: string; description: string; amount: number; source: string }) => {
      const { error } = await supabase.from('budget_transactions').insert(tx);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['budget'] }); toast.success('Transaction added'); setShowAdd(false); setForm({ type: 'expense', category: '', description: '', amount: '', date: format(new Date(), 'yyyy-MM-dd') }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('budget_transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['budget'] }); toast.success('Deleted'); },
  });

  const bulkMutation = useMutation({
    mutationFn: async (rows: { transaction_date: string; account_type: string; transaction_type: string; category: string; description: string; amount: number; source: string; batch_id: string }[]) => {
      const { error } = await supabase.from('budget_transactions').insert(rows);
      if (error) throw error;
      return rows.length;
    },
    onSuccess: (count) => { qc.invalidateQueries({ queryKey: ['budget'] }); toast.success(`${count} transactions imported`); },
    onError: (e: Error) => toast.error(e.message),
  });

  const cats = account === 'business' ? BUSINESS_CATEGORIES : PERSONAL_CATEGORIES;

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.transaction_type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.transaction_type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return { income, expenses, net: income - expenses };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.transaction_type === 'expense').forEach(t => { map[t.category] = (map[t.category] || 0) + Number(t.amount); });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const barData = useMemo(() => {
    return [
      { name: 'Income', value: stats.income, fill: CC.success },
      { name: 'Expenses', value: stats.expenses, fill: CC.error },
      { name: 'Net', value: stats.net, fill: stats.net >= 0 ? CC.teal : CC.warning },
    ];
  }, [stats]);

  const handleSubmit = () => {
    if (!form.category || !form.amount) return toast.error('Category and amount required');
    addMutation.mutate({
      transaction_date: form.date,
      account_type: account,
      transaction_type: form.type,
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      source: 'manual',
    });
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const delimiter = text.includes(';') && !text.split('\n')[0].includes(',') ? ';' : ',';
      const lines = parseCSVLines(text, delimiter).filter(l => l.length > 1);
      if (lines.length < 2) return toast.error('CSV needs a header row and data');

      const headers = lines[0].map(h => h.trim().toLowerCase());
      const dateIdx = headers.findIndex(h => /date|posted|trans.*date|value.*date/.test(h));
      const amountIdx = headers.findIndex(h => h.includes('amount'));
      const debitIdx = headers.findIndex(h => /debit|dr/.test(h));
      const creditIdx = headers.findIndex(h => /credit|cr/.test(h));
      const descIdx = headers.findIndex(h => /desc|reference|narration|particular|detail|memo/.test(h));
      const categoryIdx = headers.findIndex(h => /category|type/.test(h));

      const hasSplitColumns = debitIdx >= 0 || creditIdx >= 0;
      if (amountIdx < 0 && !hasSplitColumns) return toast.error('CSV must have an "amount" column (or debit/credit columns)');

      const batchId = `csv-${Date.now()}`;
      const rows = lines.slice(1).map(cols => {
        let rawAmount = 0;
        let isIncome = false;

        if (hasSplitColumns) {
          const debit = debitIdx >= 0 ? parseFloat(cols[debitIdx]?.replace(/[^0-9.\-]/g, '') || '0') : 0;
          const credit = creditIdx >= 0 ? parseFloat(cols[creditIdx]?.replace(/[^0-9.\-]/g, '') || '0') : 0;
          if (!isNaN(credit) && credit > 0) { rawAmount = credit; isIncome = true; }
          else if (!isNaN(debit) && debit > 0) { rawAmount = debit; isIncome = false; }
          else return null;
        } else {
          rawAmount = parseFloat(cols[amountIdx]?.replace(/[^0-9.\-]/g, '') || '0');
          if (isNaN(rawAmount) || rawAmount === 0) return null;
          isIncome = rawAmount > 0;
          rawAmount = Math.abs(rawAmount);
        }

        const desc = descIdx >= 0 ? cols[descIdx]?.trim() || '' : '';

        return {
          transaction_date: dateIdx >= 0 && cols[dateIdx] ? parseCSVDate(cols[dateIdx].trim()) : format(new Date(), 'yyyy-MM-dd'),
          account_type: account,
          transaction_type: isIncome ? 'income' : 'expense',
          category: categoryIdx >= 0 && cols[categoryIdx]?.trim() ? cols[categoryIdx].trim() : autoCategory(desc, isIncome),
          description: desc,
          amount: rawAmount,
          source: 'csv',
          batch_id: batchId,
        };
      }).filter(Boolean) as any[];

      if (rows.length === 0) return toast.error('No valid rows found');
      toast.info(`Importing ${rows.length} transactions…`);
      bulkMutation.mutate(rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* Toggle + Month Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: CC.border }}>
          {(['business', 'personal'] as const).map(a => (
            <button key={a} onClick={() => setAccount(a)} className="px-5 py-2.5 text-sm font-medium transition-all capitalize"
              style={{ background: account === a ? CC.teal : CC.cardBg, color: account === a ? '#fff' : CC.muted }}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm border" style={{ background: CC.cardBg, borderColor: CC.border, color: CC.text }} />
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: CC.teal, color: '#fff' }}>
            <Plus className="w-4 h-4" /> Add
          </button>
          <input type="file" ref={fileRef} accept=".csv" onChange={handleCSV} className="hidden" />
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{ borderColor: CC.border, color: CC.muted }}>
            <Upload className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Income', value: stats.income, icon: TrendingUp, color: CC.success },
          { label: 'Expenses', value: stats.expenses, icon: TrendingDown, color: CC.error },
          { label: 'Net', value: stats.net, icon: DollarSign, color: stats.net >= 0 ? CC.teal : CC.warning },
        ].map(card => (
          <div key={card.label} className="rounded-xl p-5 border" style={{ background: CC.cardBg, borderColor: CC.border }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: CC.muted }}>{card.label}</span>
              <card.icon className="w-4 h-4" style={{ color: card.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: card.color }}>{fmt(card.value)}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl p-5 border" style={{ background: CC.cardBg, borderColor: CC.border }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: CC.text }}>Monthly Summary</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CC.border} />
              <XAxis dataKey="name" tick={{ fill: CC.muted, fontSize: 12 }} />
              <YAxis tick={{ fill: CC.muted, fontSize: 11 }} tickFormatter={v => `R${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: CC.cardBg, border: `1px solid ${CC.border}`, borderRadius: 8, color: CC.text }}
                formatter={(v: number) => fmt(v)} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl p-5 border" style={{ background: CC.cardBg, borderColor: CC.border }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: CC.text }}>Expense Breakdown</h3>
          {categoryBreakdown.length === 0 ? (
            <p className="text-center py-12 text-sm" style={{ color: CC.muted }}>No expenses this month</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: CC.muted }}>
                  {categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: CC.cardBg, border: `1px solid ${CC.border}`, borderRadius: 8, color: CC.text }}
                  formatter={(v: number) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: CC.cardBg, borderColor: CC.border }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: CC.border }}>
          <h3 className="text-sm font-medium" style={{ color: CC.text }}>Transactions ({transactions.length})</h3>
          <ArrowUpDown className="w-3.5 h-3.5" style={{ color: CC.muted }} />
        </div>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${CC.border}` }}>
                {['Date', 'Type', 'Category', 'Description', 'Amount', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider" style={{ color: CC.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: CC.muted }}>Loading…</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: CC.muted }}>No transactions yet. Add one or upload a CSV.</td></tr>
              ) : transactions.map(tx => (
                <tr key={tx.id} className="transition-colors" style={{ borderBottom: `1px solid ${CC.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = CC.cardHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-2.5" style={{ color: CC.text }}>{format(parseISO(tx.transaction_date), 'dd MMM')}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: tx.transaction_type === 'income' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: tx.transaction_type === 'income' ? CC.success : CC.error,
                    }}>{tx.transaction_type}</span>
                  </td>
                  <td className="px-4 py-2.5" style={{ color: CC.text }}>{tx.category}</td>
                  <td className="px-4 py-2.5" style={{ color: CC.muted }}>{tx.description || '—'}</td>
                  <td className="px-4 py-2.5 font-medium" style={{ color: tx.transaction_type === 'income' ? CC.success : CC.error }}>
                    {tx.transaction_type === 'income' ? '+' : '-'}{fmt(Number(tx.amount))}
                  </td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => deleteMutation.mutate(tx.id)} className="opacity-40 hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3.5 h-3.5" style={{ color: CC.error }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowAdd(false)}>
          <div className="rounded-xl p-6 w-full max-w-md space-y-4" style={{ background: CC.bg, border: `1px solid ${CC.border}` }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium" style={{ color: CC.text }}>Add Transaction</h3>
              <button onClick={() => setShowAdd(false)}><X className="w-4 h-4" style={{ color: CC.muted }} /></button>
            </div>
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: CC.border }}>
              {(['expense', 'income'] as const).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t, category: '' }))} className="flex-1 px-4 py-2 text-sm font-medium capitalize"
                  style={{ background: form.type === t ? (t === 'income' ? CC.success : CC.error) : CC.cardBg, color: form.type === t ? '#fff' : CC.muted }}>
                  {t}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: CC.muted }}>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm border" style={{ background: CC.cardBg, borderColor: CC.border, color: CC.text }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: CC.muted }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm border" style={{ background: CC.cardBg, borderColor: CC.border, color: CC.text }}>
                <option value="">Select…</option>
                {cats[form.type].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: CC.muted }}>Amount (ZAR)</label>
              <input type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm border" style={{ background: CC.cardBg, borderColor: CC.border, color: CC.text }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: CC.muted }}>Description</label>
              <input type="text" placeholder="Optional" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm border" style={{ background: CC.cardBg, borderColor: CC.border, color: CC.text }} />
            </div>
            <button onClick={handleSubmit} disabled={addMutation.isPending} className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{ background: CC.teal, color: '#fff', opacity: addMutation.isPending ? 0.6 : 1 }}>
              {addMutation.isPending ? 'Adding…' : 'Add Transaction'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function parseCSVDate(raw: string): string {
  try {
    // Try common SA bank formats: dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy
    if (raw.includes('/')) {
      const parts = raw.split('/');
      if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
      return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
    }
    if (raw.includes('-')) {
      const parts = raw.split('-');
      if (parts[0].length === 4) return raw;
      return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
    }
    return format(new Date(), 'yyyy-MM-dd');
  } catch {
    return format(new Date(), 'yyyy-MM-dd');
  }
}
