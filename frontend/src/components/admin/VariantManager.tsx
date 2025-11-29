'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, X } from 'lucide-react';

export interface ProductVariantInput {
  id?: string;
  name: string;
  sku: string;
  bottleSize: string;
  priceNGN: string;
  priceUSD: string;
  image: string;
  stock: string;
  isActive: boolean;
}

interface VariantManagerProps {
  variants: ProductVariantInput[];
  onChange: (variants: ProductVariantInput[]) => void;
}

const bottleSizes = ['200ml', '350ml', '500ml', '750ml', '1L', '1.5L', '2L'];

const emptyVariant: ProductVariantInput = {
  name: '',
  sku: '',
  bottleSize: '750ml',
  priceNGN: '',
  priceUSD: '',
  image: '',
  stock: '0',
  isActive: true,
};

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addVariant = () => {
    const newVariant = { ...emptyVariant };
    onChange([...variants, newVariant]);
    setExpandedIndex(variants.length);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onChange(newVariants);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const updateVariant = (index: number, field: keyof ProductVariantInput, value: string | boolean) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onChange(newVariants);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-slate-900">Product Variants</h4>
          <p className="text-xs text-slate-500">Add different sizes and pricing options</p>
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={14} /> Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">No variants yet. Add variants for different sizes or options.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden"
            >
              {/* Header - Always visible */}
              <div 
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50"
                onClick={() => toggleExpand(index)}
              >
                <GripVertical size={16} className="text-slate-400" />
                <div className="flex-1 flex items-center gap-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variant.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {variant.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="font-medium text-slate-900">
                    {variant.name || `Variant ${index + 1}`}
                  </span>
                  <span className="text-sm text-slate-500">{variant.bottleSize}</span>
                  {variant.priceNGN && (
                    <span className="text-sm text-slate-600">
                      ₦{Number(variant.priceNGN).toLocaleString()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVariant(index);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Expanded Form */}
              {expandedIndex === index && (
                <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Variant Name</label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        placeholder="e.g., Large Bottle, Family Size"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">SKU</label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value.toUpperCase())}
                        placeholder="e.g., KOLAQ-750ML"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase tracking-wider outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Bottle Size</label>
                      <select
                        value={variant.bottleSize}
                        onChange={(e) => updateVariant(index, 'bottleSize', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                      >
                        {bottleSizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Price (₦)</label>
                      <input
                        type="number"
                        value={variant.priceNGN}
                        onChange={(e) => updateVariant(index, 'priceNGN', e.target.value)}
                        placeholder="0"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Price ($)</label>
                      <input
                        type="number"
                        value={variant.priceUSD}
                        onChange={(e) => updateVariant(index, 'priceUSD', e.target.value)}
                        placeholder="0"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Stock</label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                        min="0"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Image URL (optional)</label>
                      <input
                        type="url"
                        value={variant.image}
                        onChange={(e) => updateVariant(index, 'image', e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`variant-active-${index}`}
                      checked={variant.isActive}
                      onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    <label htmlFor={`variant-active-${index}`} className="text-sm text-slate-700">
                      Variant is active and available for purchase
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}