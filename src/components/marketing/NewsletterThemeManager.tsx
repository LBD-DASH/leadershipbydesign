import { useState, useEffect } from 'react';
import { Calendar, Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const AVAILABLE_PRODUCTS = [
  'SHIFT Leadership Development',
  'Leadership Index Diagnostic',
  'Executive Coaching',
  'Contagious Identity Workbook',
  'Team Alignment Workshop',
  'Feedback Formula',
];

interface ThemeRow {
  id: string;
  year: number;
  month: number;
  theme: string;
  pain_point_cluster: string;
  featured_products: string[];
}

interface EditingTheme {
  id?: string;
  year: number;
  month: number;
  theme: string;
  pain_point_cluster: string;
  featured_products: string[];
}

export default function NewsletterThemeManager() {
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<EditingTheme | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const adminToken = sessionStorage.getItem('admin_token') || '';

  const fetchThemes = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-newsletters`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'list_themes' }),
        }
      );
      const data = await res.json();
      if (data.themes) setThemes(data.themes);
    } catch (err) {
      console.error('Failed to fetch themes:', err);
      toast.error('Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchThemes(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.theme.trim()) { toast.error('Theme is required'); return; }
    if (!editing.pain_point_cluster.trim()) { toast.error('Pain point cluster is required'); return; }
    if (editing.featured_products.length === 0) { toast.error('Select at least one featured product'); return; }

    setSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-newsletters`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: editing.id ? 'update_theme' : 'create_theme',
            ...(editing.id ? { id: editing.id } : {}),
            year: editing.year,
            month: editing.month,
            theme: editing.theme.trim(),
            pain_point_cluster: editing.pain_point_cluster.trim(),
            featured_products: editing.featured_products,
          }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(editing.id ? 'Theme updated' : 'Theme created');
      setEditing(null);
      fetchThemes();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-newsletters`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'delete_theme', id }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success('Theme deleted');
      fetchThemes();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete theme');
    } finally {
      setDeleting(null);
    }
  };

  const toggleProduct = (product: string) => {
    if (!editing) return;
    const current = editing.featured_products;
    setEditing({
      ...editing,
      featured_products: current.includes(product)
        ? current.filter(p => p !== product)
        : [...current, product],
    });
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const newTheme = (): EditingTheme => {
    // Find next month without a theme
    const existing = new Set(themes.filter(t => t.year === currentYear).map(t => t.month));
    let nextMonth = 1;
    for (let m = 1; m <= 12; m++) {
      if (!existing.has(m)) { nextMonth = m; break; }
    }
    return { year: currentYear, month: nextMonth, theme: '', pain_point_cluster: '', featured_products: [] };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Monthly Theme Calendar</h3>
          <p className="text-sm text-muted-foreground">
            Each month's theme locks newsletter content to a specific pain point and product bridge.
          </p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(newTheme())} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Theme
          </Button>
        )}
      </div>

      {/* Editing Form */}
      {editing && (
        <Card className="p-6 border-primary/30 bg-primary/5">
          <h4 className="font-semibold text-foreground mb-4">
            {editing.id ? 'Edit Theme' : 'New Theme'}
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Year</label>
              <Select
                value={String(editing.year)}
                onValueChange={(v) => setEditing({ ...editing, year: Number(v) })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Month</label>
              <Select
                value={String(editing.month)}
                onValueChange={(v) => setEditing({ ...editing, month: Number(v) })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONTH_NAMES.slice(1).map((name, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground mb-1 block">Theme</label>
              <Input
                value={editing.theme}
                onChange={(e) => setEditing({ ...editing, theme: e.target.value })}
                placeholder="e.g., Accountability & Execution"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground mb-1 block">Pain Point Cluster</label>
              <Textarea
                value={editing.pain_point_cluster}
                onChange={(e) => setEditing({ ...editing, pain_point_cluster: e.target.value })}
                placeholder="Teams missing targets, leaders not following through, lack of ownership culture..."
                rows={3}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-foreground mb-1 block">Featured Products</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {AVAILABLE_PRODUCTS.map(product => (
                  <Badge
                    key={product}
                    variant={editing.featured_products.includes(product) ? 'default' : 'outline'}
                    className="cursor-pointer select-none"
                    onClick={() => toggleProduct(product)}
                  >
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editing.id ? 'Update' : 'Create'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)} className="gap-2">
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Theme List */}
      <div className="grid gap-3">
        {themes.length === 0 && !editing && (
          <Card className="p-8 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No themes configured yet. Add your first monthly theme to get started.</p>
          </Card>
        )}
        {themes.map(t => {
          const isCurrentMonth = t.year === currentYear && t.month === currentMonth;
          return (
            <Card
              key={t.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${isCurrentMonth ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-muted-foreground">
                    {MONTH_NAMES[t.month]} {t.year}
                  </span>
                  {isCurrentMonth && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0">ACTIVE</Badge>
                  )}
                </div>
                <p className="font-semibold text-foreground">{t.theme}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.pain_point_cluster}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.featured_products.map(p => (
                    <Badge key={p} variant="secondary" className="text-[11px]">{p}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditing({
                    id: t.id,
                    year: t.year,
                    month: t.month,
                    theme: t.theme,
                    pain_point_cluster: t.pain_point_cluster,
                    featured_products: t.featured_products,
                  })}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  disabled={deleting === t.id}
                  onClick={() => handleDelete(t.id)}
                >
                  {deleting === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
