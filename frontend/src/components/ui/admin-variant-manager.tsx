'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import type { ProductVariant } from '@/data/products';
import { formatCurrency } from '@/lib/currency';

type VariantFormState = {
  name: string;
  sku: string;
  bottleSize: string;
  priceNGN: string;
  priceUSD: string;
  stock: string;
  image: string;
  isActive: boolean;
  sortOrder: string;
};

interface AdminVariantManagerProps {
  productId: string;
  productName: string;
  variants: ProductVariant[];
  onCreateVariant: (productId: string, variantData: Omit<ProductVariant, 'id'>) => void;
  onUpdateVariant: (variantId: string, updates: Partial<ProductVariant>) => void;
  onDeleteVariant: (variantId: string) => void;
}

export function AdminVariantManager({
  productId,
  productName,
  variants = [],
  onCreateVariant,
  onUpdateVariant,
  onDeleteVariant,
}: AdminVariantManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setShowForm(true);
  };

  const handleCreate = (variantData: Omit<ProductVariant, 'id'>) => {
    onCreateVariant(productId, variantData);
    setShowForm(false);
  };

  const handleUpdate = (variantId: string, updates: Partial<ProductVariant>) => {
    onUpdateVariant(variantId, updates);
    setShowForm(false);
    setEditingVariant(null);
  };

  const handleDelete = (variantId: string) => {
    if (confirm('Delete this variant? This action cannot be undone.')) {
      onDeleteVariant(variantId);
    }
  };

  const sortedVariants = [...variants].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Product Variants</h3>
          <p className="text-sm text-slate-600">
            Manage sizes, prices, and images for {productName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingVariant(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800"
        >
          <Plus size={16} /> Add Variant
        </button>
      </div>

      {sortedVariants.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-600">No variants yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedVariants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
            >
              {variant.image && (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={variant.image}
                    alt={variant.name}
                    fill
                    className="object-contain"
                    unoptimized={variant.image.startsWith('http')}
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{variant.name}</h4>
                    <p className="text-sm text-slate-600">{variant.bottleSize}</p>
                    {variant.sku && (
                      <p className="text-xs text-slate-400">SKU: {variant.sku}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {variant.isActive ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(variant.priceNGN, 'NGN')} / {formatCurrency(variant.priceUSD, 'USD')}
                  </span>
                  <span className="text-slate-600">Stock: {variant.stock}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(variant)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  title="Edit variant"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(variant.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:border-red-300 hover:bg-red-50"
                  title="Delete variant"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <VariantEditor
          key={editingVariant?.id ?? 'new'}
          initialVariant={editingVariant ?? undefined}
          onClose={() => {
            setShowForm(false);
            setEditingVariant(null);
          }}
          onCreate={handleCreate}
          onUpdate={(updates) => editingVariant && handleUpdate(editingVariant.id, updates)}
        />
      )}
    </div>
  );
}

function VariantEditor({
  initialVariant,
  onClose,
  onCreate,
  onUpdate,
}: {
  initialVariant?: ProductVariant;
  onClose: () => void;
  onCreate: (variantData: Omit<ProductVariant, 'id'>) => void;
  onUpdate: (updates: Partial<ProductVariant>) => void;
}) {
  const [form, setForm] = useState<VariantFormState>(() =>
    initialVariant
      ? {
          name: initialVariant.name,
          sku: initialVariant.sku || '',
          bottleSize: initialVariant.bottleSize,
          priceNGN: String(initialVariant.priceNGN),
          priceUSD: String(initialVariant.priceUSD),
          stock: String(initialVariant.stock),
          image: initialVariant.image || '',
          isActive: initialVariant.isActive,
          sortOrder: String(initialVariant.sortOrder),
        }
      : {
          name: '',
          sku: '',
          bottleSize: '750ml',
          priceNGN: '',
          priceUSD: '',
          stock: '0',
          image: '',
          isActive: true,
          sortOrder: '0',
        }
  );
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof VariantFormState) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (field === 'isActive') {
      setForm((prev) => ({ ...prev, isActive: event.target.checked }));
      return;
    }
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setForm((prev) => ({ ...prev, image: result }));
      setUploadPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.bottleSize.trim()) {
      setError('Name and bottle size are required.');
      return;
    }
    const priceNGN = Number(form.priceNGN);
    const priceUSD = Number(form.priceUSD);
    const stock = Math.max(Number(form.stock), 0);
    const sortOrder = Math.max(Number(form.sortOrder), 0);

    if (Number.isNaN(priceNGN) || Number.isNaN(priceUSD)) {
      setError('Prices must be numeric.');
      return;
    }

    const payload: Omit<ProductVariant, 'id'> = {
      name: form.name.trim(),
      sku: form.sku.trim() || undefined,
      bottleSize: form.bottleSize.trim(),
      priceNGN,
      priceUSD,
      image: form.image || undefined,
      stock,
      isActive: form.isActive,
      sortOrder,
    };

    if (initialVariant) {
      onUpdate(payload);
    } else {
      onCreate(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {initialVariant ? 'Edit Variant' : 'Create Variant'}
            </h3>
            <p className="text-sm text-slate-600">
              Set size, pricing, stock, and image for this variant.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Variant Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={handleInputChange('name')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                placeholder="e.g. Standard, Premium"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">SKU</label>
              <input
                value={form.sku}
                onChange={handleInputChange('sku')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                placeholder="e.g. KA-EB-001-750"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Bottle Size <span className="text-red-500">*</span>
              </label>
              <input
                value={form.bottleSize}
                onChange={handleInputChange('bottleSize')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                placeholder="e.g. 750ml, 1L"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={handleInputChange('stock')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Price (NGN) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.priceNGN}
                onChange={handleInputChange('priceNGN')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.priceUSD}
                onChange={handleInputChange('priceUSD')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Variant Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm"
            />
            {(uploadPreview || form.image) && (
              <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src={uploadPreview || form.image}
                  alt="Preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Sort Order
              </label>
              <input
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={handleInputChange('sortOrder')}
                className="w-full rounded-[16px] border border-slate-200 px-3 py-2"
              />
              <p className="text-xs text-slate-500">Lower numbers appear first</p>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={handleInputChange('isActive')}
                className="h-4 w-4 rounded border-slate-300"
              />
              <label htmlFor="isActive" className="text-sm text-slate-700">
                Active (visible to customers)
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              {initialVariant ? 'Update Variant' : 'Create Variant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
