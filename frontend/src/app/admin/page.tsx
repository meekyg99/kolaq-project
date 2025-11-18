'use client';

import Image from 'next/image';
import { type ChangeEvent, type ComponentType, type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { Bell, Check, Edit, Filter, LogOut, Package, Pencil, Plus, Search, Trash2, TrendingUp, X } from 'lucide-react';


import type { Product, ProductCategory } from '@/data/products';
import { formatCurrency } from '@/lib/currency';
import {
  useActivityLog,
  useAdminNotifications,
  useAdminUsers,
  useInventory,
  type AdminActivity,
  type AdminNotification,
  type AdminUser,
} from '@/components/providers/inventory-provider';
import { AnalyticsPanel } from '@/components/admin/AnalyticsPanel';
import { useAPIProducts } from '@/components/providers/api-products-provider';

type AdminTab = 'overview' | 'inventory' | 'users' | 'notifications' | 'activity' | 'analytics';

type ProductFormState = {
  name: string;
  sku: string;
  description: string;
  priceNGN: string;
  priceUSD: string;
  stock: string;
  tastingNotes: string;
  image: string;
  category: ProductCategory;
  size: string;
  isFeatured: boolean;
};

type UserFormState = {
  name: string;
  email: string;
  role: AdminUser['role'];
  status: AdminUser['status'];
};

type NotificationFormState = {
  title: string;
  message: string;
  audience: AdminNotification['audience'];
  severity: AdminNotification['severity'];
};

const ADMIN_EMAIL = 'admin@kolaqbitters.com';
const ADMIN_PASSCODE = 'Herbal#2025';
const AUTH_STORAGE_KEY = 'kolaq-admin-auth-v1';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const isBrowser = typeof window !== 'undefined';
  const [isAuthenticated, setAuthenticated] = useState(() => {
    if (!isBrowser) {
      return false;
    }
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const authChecked = isBrowser;
  const [loginError, setLoginError] = useState('');

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const passcode = String(form.get('passcode') ?? '').trim();

    if (email === ADMIN_EMAIL && passcode === ADMIN_PASSCODE) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use the issued admin email and passcode.');
    }
  };

  const handleSignOut = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthenticated(false);
  };

  if (!authChecked) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="rounded-[24px] border border-slate-200 bg-white px-12 py-16 text-center shadow-sm">
          <p className="text-sm text-slate-500">Checking admin credentials…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">Admin Access</h1>
            <p className="text-sm text-slate-600">
              Enter your assigned email and passcode to manage inventory, users, and notifications.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)]"
                placeholder="admin@kolaqbitters.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="passcode" className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Passcode
              </label>
              <input
                id="passcode"
                name="passcode"
                type="password"
                required
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)]"
                placeholder="Your secure passcode"
              />
            </div>
            {loginError && <p className="text-sm text-red-500">{loginError}</p>}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-neutral-800"
            >
              Unlock Dashboard
            </button>
          </form>
          <p className="text-center text-xs text-slate-400">
            Tip: Use the default demo credentials ({ADMIN_EMAIL}) until the auth backend is connected.
          </p>
        </div>
      </div>
    );
  }

  return <AdminWorkspace activeTab={activeTab} onTabChange={setActiveTab} onSignOut={handleSignOut} />;
}

function AdminWorkspace({ activeTab, onTabChange, onSignOut }: {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onSignOut: () => void;
}) {
  const { products: apiProducts, refetch: refetchProducts } = useAPIProducts();
  const products = apiProducts;
  const {
    state: { activity },
    adjustStock,
    addProduct,
    updateProduct,
    deleteProduct,
    addNotification,
  } = useInventory();
  const { users, addUser, updateUser, deleteUser } = useAdminUsers();
  const { notifications, markNotification, markAllNotifications } = useAdminNotifications();
  const activityFeed = useActivityLog(40);

  const lowStock = useMemo(() => products.filter((product) => product.stock < 20), [products]);
  const inventoryValue = useMemo(
    () =>
      products.reduce(
        (totals, product) => {
          return {
            NGN: totals.NGN + product.price.NGN * product.stock,
            USD: totals.USD + product.price.USD * product.stock,
          };
        },
        { NGN: 0, USD: 0 }
      ),
    [products]
  );
  const unreadAlerts = notifications.filter((notification) => !notification.read && notification.audience !== 'user');

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'users', label: 'Users' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div className="container space-y-8 py-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Control</span>
          <h1 className="text-3xl font-semibold text-slate-900">Operations dashboard</h1>
          <p className="text-sm text-slate-600">
            Monitor catalogue health, manage accounts, broadcast announcements, and track critical activity.
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          <LogOut size={16} /> Sign out
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Package}
          title="Active products"
          metric={products.length.toString()}
          context={`${lowStock.length} low stock`}
        />
        <StatCard
          icon={TrendingUp}
          title="Inventory value"
          metric={formatCurrency(inventoryValue.NGN, 'NGN')}
          context={`≈ ${formatCurrency(inventoryValue.USD, 'USD')}`}
        />
        <StatCard
          icon={Bell}
          title="Unseen alerts"
          metric={unreadAlerts.length.toString()}
          context={`${notifications.length} total notifications`}
          warning={unreadAlerts.length > 0}
        />
      </section>

      <nav className="flex flex-wrap items-center gap-2 rounded-[24px] border border-slate-200 bg-white p-2 text-sm text-slate-600">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-[18px] px-4 py-2 transition ${
                isActive
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === 'overview' && (
          <OverviewPanel products={products} users={users} notifications={notifications} activity={activity} />
        )}
        {activeTab === 'analytics' && <AnalyticsPanel />}
        {activeTab === 'inventory' && (
          <InventoryManager
            products={products}
            activity={activity}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onAdjustStock={adjustStock}
            onRaiseNotification={addNotification}
            refetch={refetchProducts}
          />
        )}
        {activeTab === 'users' && (
          <UserManager users={users} onAddUser={addUser} onUpdateUser={updateUser} onDeleteUser={deleteUser} />
        )}
        {activeTab === 'notifications' && (
          <NotificationCenter
            notifications={notifications}
            onAddNotification={addNotification}
            onMarkNotification={markNotification}
            onMarkAll={markAllNotifications}
          />
        )}
        {activeTab === 'activity' && <ActivityPanel activity={activityFeed} />}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  metric,
  context,
  warning = false,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  metric: string;
  context?: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{title}</p>
        <p className={`text-2xl font-semibold ${warning ? 'text-amber-600' : 'text-slate-900'}`}>{metric}</p>
        {context && <p className="text-xs text-slate-500">{context}</p>}
      </div>
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        <Icon size={20} />
      </span>
    </div>
  );
}

function OverviewPanel({
  products,
  users,
  notifications,
  activity,
}: {
  products: Product[];
  users: AdminUser[];
  notifications: AdminNotification[];
  activity: AdminActivity[];
}) {
  const featureCount = products.filter((product) => product.isFeatured).length;
  const avgStock = Math.round(
    products.reduce((total, product) => total + product.stock, 0) / Math.max(products.length, 1)
  );
  const unreadUserFacing = notifications.filter((notification) => notification.audience !== 'admin' && !notification.read);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Catalogue signals</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <OverviewCard title="Featured blends" metric={`${featureCount}`} description="Products currently highlighted on the storefront." />
          <OverviewCard title="Average stock" metric={`${avgStock}`} description="Average on-hand units across all SKUs." />
          <OverviewCard title="User alerts" metric={`${unreadUserFacing.length}`} description="Notifications visible to customers awaiting acknowledgement." />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50/60 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Latest activity</h3>
            <span className="text-xs text-slate-400">{activity.slice(0, 5).length} updates</span>
          </div>
          <ul className="space-y-3">
            {activity.slice(0, 5).map((entry) => (
              <li key={entry.id} className="rounded-[18px] border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-600">
                <p className="font-medium text-slate-900">{entry.summary}</p>
                {entry.details && <p className="text-xs text-slate-500">{entry.details}</p>}
                <div className="mt-1 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  <span>{new Date(entry.createdAt).toLocaleString()}</span>
                  <span>•</span>
                  <span>{entry.author}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 rounded-[24px] border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Team roster</h3>
          <ul className="space-y-3">
            {users.slice(0, 4).map((user) => (
              <li key={user.id} className="flex items-start justify-between gap-4 rounded-[18px] border border-slate-200/70 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{user.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function OverviewCard({ title, metric, description }: { title: string; metric: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{metric}</p>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function InventoryManager({
  products,
  activity,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAdjustStock,
  onRaiseNotification,
  refetch,
}: {
  products: Product[];
  activity: AdminActivity[];
  onAddProduct: (input: Omit<Product, 'id' | 'slug'> & { slug?: string }) => Promise<Product>;
  onUpdateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onAdjustStock: (productId: string, stock: number) => void;
  onRaiseNotification: (input: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => AdminNotification;
  refetch: () => Promise<void>;
}){
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [trackingProductId, setTrackingProductId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter((product) => [product.name, product.sku, product.category, product.size].join(' ').toLowerCase().includes(term));
  }, [products, searchTerm]);

  const productActivities = useMemo(() => {
    if (!trackingProductId) return [];
    return activity.filter((entry) => entry.entityId === trackingProductId).slice(0, 8);
  }, [activity, trackingProductId]);

  const handleCreate = async (data: Omit<Product, 'id' | 'slug'> & { slug?: string }) => {
    try {
      const created = await onAddProduct(data);
      if (created.stock < 15) {
        onRaiseNotification({
          title: 'New product low stock warning',
          message: `${created.name} launched with only ${created.stock} units.`,
          audience: 'admin',
          severity: 'warning',
        });
      }
      setShowForm(false);
      await refetch();
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  const handleUpdate = async (productId: string, updates: Partial<Product>) => {
    try {
      await onUpdateProduct(productId, updates);
      if (updates.stock !== undefined && updates.stock < 10) {
        const product = products.find((item) => item.id === productId);
        onRaiseNotification({
          title: 'Stock critically low',
          message: `${product?.name ?? 'Product'} stock dropped to ${updates.stock}.`,
          audience: 'admin',
          severity: 'critical',
        });
      }
      setShowForm(false);
      setEditingProduct(null);
      await refetch();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Remove ${product.name} from the catalogue?`)) {
      try {
        await onDeleteProduct(product.id);
        await refetch();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleAdjustStock = (product: Product, direction: 'increase' | 'decrease') => {
    const delta = direction === 'increase' ? 5 : -5;
    const nextStock = Math.max(product.stock + delta, 0);
    onAdjustStock(product.id, nextStock);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Inventory control</h2>
          <p className="text-sm text-slate-600">Add, edit, or track retail SKUs and guard against stockouts.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
            <Search size={16} className="text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products"
              className="bg-transparent text-sm text-slate-700 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800"
          >
            <Plus size={16} /> New product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm text-slate-600">
          <thead>
            <tr className="text-xs uppercase tracking-[0.3em] text-slate-400">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">SKU</th>
              <th className="pb-3 font-medium">Size</th>
              <th className="pb-3 font-medium">Price (₦)</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => {
              const isLow = product.stock < 15;
              return (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="py-3">
                    <div className="font-semibold text-slate-900">{product.name}</div>
                    <p className="text-xs text-slate-500">{product.description.slice(0, 80)}…</p>
                  </td>
                  <td className="py-3 text-xs uppercase tracking-[0.3em] text-slate-400">{product.category}</td>
                  <td className="py-3 text-xs uppercase tracking-[0.3em] text-slate-400">{product.sku}</td>
                  <td className="py-3 text-xs text-slate-500">{product.size}</td>
                  <td className="py-3 font-semibold text-slate-900">{formatCurrency(product.price.NGN, 'NGN')}</td>
                  <td className={`py-3 font-semibold ${isLow ? 'text-amber-600' : 'text-slate-800'}`}>{product.stock}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTrackingProductId(product.id === trackingProductId ? null : product.id)}
                        className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        <Filter size={14} /> Track
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                        className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="inline-flex h-9 items-center gap-1 rounded-full border border-red-200 px-3 text-xs font-medium text-red-500 transition hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-slate-300"
                        onClick={() => handleAdjustStock(product, 'decrease')}
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-slate-300"
                        onClick={() => handleAdjustStock(product, 'increase')}
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {trackingProductId && (
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Recent events</h3>
            <button
              type="button"
              className="text-xs uppercase tracking-[0.3em] text-slate-400 hover:text-slate-700"
              onClick={() => setTrackingProductId(null)}
            >
              Hide
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {productActivities.length === 0 && <li className="text-sm text-slate-500">No activity logged yet.</li>}
            {productActivities.map((entry) => (
              <li key={entry.id} className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                <p className="font-medium text-slate-900">{entry.summary}</p>
                {entry.details && <p className="text-xs text-slate-500">{entry.details}</p>}
                <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-slate-400">{new Date(entry.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <ProductEditor
          key={editingProduct?.id ?? 'new'}
          initialProduct={editingProduct ?? undefined}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onCreate={handleCreate}
          onUpdate={(updates) => editingProduct ? handleUpdate(editingProduct.id, updates) : Promise.resolve()}
        />
      )}
    </div>
  );
}

function ProductEditor({
  initialProduct,
  onClose,
  onCreate,
  onUpdate,
}: {
  initialProduct?: Product;
  onClose: () => void;
  onCreate: (input: Omit<Product, 'id' | 'slug'> & { slug?: string }) => Promise<void>;
  onUpdate: (updates: Partial<Product>) => Promise<void>;
}){
  const [form, setForm] = useState<ProductFormState>(() =>
    initialProduct
      ? {
          name: initialProduct.name,
          sku: initialProduct.sku,
          description: initialProduct.description,
          priceNGN: String(initialProduct.price.NGN),
          priceUSD: String(initialProduct.price.USD),
          stock: String(initialProduct.stock),
          tastingNotes: initialProduct.tastingNotes.join(', '),
          image: initialProduct.image,
          category: initialProduct.category,
          size: initialProduct.size,
          isFeatured: initialProduct.isFeatured,
        }
      : {
          name: '',
          sku: '',
          description: '',
          priceNGN: '',
          priceUSD: '',
          stock: '40',
          tastingNotes: '',
          image: '',
          category: 'Bitters',
          size: '750 ml',
          isFeatured: false,
        }
  );
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof ProductFormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (field === 'isFeatured') {
      const checkboxEvent = event as ChangeEvent<HTMLInputElement>;
      setForm((previous) => ({ ...previous, isFeatured: checkboxEvent.target.checked }));
      return;
    }
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSelectChange = (field: keyof ProductFormState) => (event: ChangeEvent<HTMLSelectElement>) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setForm((previous) => ({ ...previous, image: result }));
      setUploadPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.sku.trim()) {
      setError('Name and SKU are required.');
      return;
    }
    const priceNGN = Number(form.priceNGN);
    const priceUSD = Number(form.priceUSD);
    const stock = Math.max(Number(form.stock), 0);
    if (Number.isNaN(priceNGN) || Number.isNaN(priceUSD)) {
      setError('Prices must be numeric.');
      return;
    }

    const tastingNotes = form.tastingNotes
      .split(',')
      .map((note) => note.trim())
      .filter(Boolean);

    const payload: Omit<Product, 'id' | 'slug'> & { slug?: string } = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description.trim(),
      price: { NGN: priceNGN, USD: priceUSD },
      stock,
      tastingNotes: tastingNotes.length > 0 ? tastingNotes : ['Premium crafted'],
      image: form.image || initialProduct?.image || '/images/products/essence-bitter.jpg',
      category: form.category,
      size: form.size,
      isFeatured: form.isFeatured,
    };

    try {
      if (initialProduct) {
        await onUpdate({ ...payload });
      } else {
        await onCreate(payload);
      }
      onClose();
    } catch (error) {
      setError('Operation failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl my-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {initialProduct ? 'Edit product' : 'Create product'}
            </h3>
            <p className="text-sm text-slate-600">Provide catalogue metadata, pricing, and inventory levels.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm text-slate-700 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Product name" required>
              <input
                value={form.name}
                onChange={handleInputChange('name')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                required
              />
            </FormField>
            <FormField label="SKU" required>
              <input
                value={form.sku}
                onChange={handleInputChange('sku')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2 uppercase tracking-[0.3em]"
                required
              />
            </FormField>
            <FormField label="Price (₦)" required>
              <input
                value={form.priceNGN}
                onChange={handleInputChange('priceNGN')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                inputMode="numeric"
                required
              />
            </FormField>
            <FormField label="Price ($)" required>
              <input
                value={form.priceUSD}
                onChange={handleInputChange('priceUSD')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                inputMode="numeric"
                required
              />
            </FormField>
            <FormField label="Stock" required>
              <input
                value={form.stock}
                onChange={handleInputChange('stock')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                inputMode="numeric"
                required
              />
            </FormField>
            <FormField label="Size / Volume" required>
              <input
                value={form.size}
                onChange={handleInputChange('size')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                required
              />
            </FormField>
            <FormField label="Category" required>
              <select
                value={form.category}
                onChange={handleSelectChange('category')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                required
              >
                <option value="Bitters">Bitters</option>
                <option value="Elixirs">Elixirs</option>
                <option value="Aperitifs">Aperitifs</option>
                <option value="Limited">Limited</option>
              </select>
            </FormField>
            <FormField label="Featured on homepage">
              <label className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                <input type="checkbox" checked={form.isFeatured} onChange={handleInputChange('isFeatured')} />
                Highlight product
              </label>
            </FormField>
          </div>
          <FormField label="Tasting notes (comma separated)">
            <input
              value={form.tastingNotes}
              onChange={handleInputChange('tastingNotes')}
              className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
            />
          </FormField>
          <FormField label="Description" required>
            <textarea
              value={form.description}
              onChange={handleInputChange('description')}
              rows={3}
              className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
              required
            />
          </FormField>
          <FormField label="Product image">
            <input type="file" accept="image/*" onChange={handleFile} />
            {(uploadPreview || form.image) && (
              <div className="mt-2 flex items-center gap-3">
                <Image
                  src={uploadPreview ?? form.image}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-[14px] border border-slate-200 object-cover"
                  unoptimized
                />
                <span className="text-xs text-slate-400">Preview</span>
              </div>
            )}
          </FormField>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800"
            >
              {initialProduct ? 'Update product' : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
      <span>{label}</span>
      <div className="text-sm normal-case text-slate-700">{children}</div>
      {required && <span className="sr-only">Required</span>}
    </label>
  );
}

function UserManager({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: {
  users: AdminUser[];
  onAddUser: (user: Omit<AdminUser, 'id'>) => AdminUser;
  onUpdateUser: (userId: string, updates: Partial<AdminUser>) => void;
  onDeleteUser: (userId: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormState>({ name: '', email: '', role: 'viewer', status: 'invited' });

  const openForm = (user?: AdminUser) => {
    if (user) {
      setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
      setEditing(user);
    } else {
      setForm({ name: '', email: '', role: 'viewer', status: 'invited' });
      setEditing(null);
    }
    setShowForm(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
      lastActive: new Date().toISOString(),
      totalOrdersManaged: editing?.totalOrdersManaged ?? 0,
    };
    if (editing) {
      onUpdateUser(editing.id, payload);
    } else {
      onAddUser(payload);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Team management</h2>
          <p className="text-sm text-slate-600">Invite staff, adjust roles, or revoke access.</p>
        </div>
        <button
          type="button"
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800"
        >
          <Plus size={16} /> New teammate
        </button>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-base font-semibold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              <p className="text-xs text-slate-400">
                Last active {new Date(user.lastActive).toLocaleString()} · {user.totalOrdersManaged} orders managed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-500">
                {user.role}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                  user.status === 'active'
                    ? 'border border-emerald-200 text-emerald-600'
                    : 'border border-slate-200 text-slate-500'
                }`}
              >
                {user.status}
              </span>
              <button
                type="button"
                onClick={() => openForm(user)}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                <Edit size={14} /> Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteUser(user.id)}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-red-200 px-3 text-xs font-medium text-red-500 transition hover:border-red-300 hover:text-red-600"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {editing ? 'Edit user' : 'Invite user'}
                </h3>
                <p className="text-sm text-slate-600">Assign access level and confirm onboarding status.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
              <FormField label="Full name" required>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                  required
                />
              </FormField>
              <FormField label="Email" required>
                <input
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                  type="email"
                  required
                />
              </FormField>
              <FormField label="Role" required>
                <select
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as AdminUser['role'] }))}
                  className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="viewer">Viewer</option>
                </select>
              </FormField>
              <FormField label="Status" required>
                <select
                  value={form.status}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as AdminUser['status'] }))}
                  className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                  required
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="invited">Invited</option>
                </select>
              </FormField>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800"
                >
                  <Check size={16} /> {editing ? 'Save changes' : 'Send invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationCenter({
  notifications,
  onAddNotification,
  onMarkNotification,
  onMarkAll,
}: {
  notifications: AdminNotification[];
  onAddNotification: (input: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => AdminNotification;
  onMarkNotification: (notificationId: string, read?: boolean) => void;
  onMarkAll: () => void;
}) {
  const [form, setForm] = useState<NotificationFormState>({
    title: '',
    message: '',
    audience: 'all',
    severity: 'info',
  });
  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    onAddNotification({
      title: form.title.trim(),
      message: form.message.trim(),
      audience: form.audience,
      severity: form.severity,
    });
    setForm({ title: '', message: '', audience: 'all', severity: 'info' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Messaging & alerts</h2>
          <p className="text-sm text-slate-600">Broadcast operational notices to admins or end customers.</p>
        </div>
        <button
          type="button"
          onClick={() => onMarkAll()}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Mark all read
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <FormField label="Title" required>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
              required
            />
          </FormField>
          <FormField label="Message" required>
            <textarea
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              rows={3}
              className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
              required
            />
          </FormField>
        </div>
        <div className="space-y-4">
          <FormField label="Audience" required>
            <select
              value={form.audience}
              onChange={(event) => setForm((prev) => ({ ...prev, audience: event.target.value as AdminNotification['audience'] }))}
              className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
              required
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </FormField>
          <FormField label="Severity" required>
            <select
              value={form.severity}
              onChange={(event) => setForm((prev) => ({ ...prev, severity: event.target.value as AdminNotification['severity'] }))}
              className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
              required
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </FormField>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800"
          >
            <Bell size={16} /> Send notification
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {sortedNotifications.length === 0 && <p className="text-sm text-slate-500">No notifications yet.</p>}
        {sortedNotifications.map((notification) => {
          const isCritical = notification.severity === 'critical';
          return (
            <div key={notification.id} className={`rounded-[24px] border p-5 ${
              isCritical ? 'border-red-200 bg-red-50/60' : 'border-slate-200 bg-white'
            }`}>
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  <p className="text-sm text-slate-600">{notification.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-400">
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>{notification.audience} audience</span>
                    <span>•</span>
                    <span>{notification.severity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onMarkNotification(notification.id, !notification.read)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                      notification.read
                        ? 'border-slate-200 text-slate-500'
                        : 'border-[var(--accent)] text-[var(--accent)]'
                    }`}
                  >
                    {notification.read ? 'Mark unread' : 'Mark read'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityPanel({ activity }: { activity: AdminActivity[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">System ledger</h2>
      <div className="space-y-3">
        {activity.map((entry) => (
          <div key={entry.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{entry.summary}</p>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{entry.severity}</span>
            </div>
            {entry.details && <p className="mt-1 text-sm text-slate-600">{entry.details}</p>}
            <p className="mt-2 text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString()} · {entry.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

