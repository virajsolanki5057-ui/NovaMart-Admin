import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import type { Product } from "../../../api/productsApi";
import { Tag, X, Box, Info } from "lucide-react";

interface Props {
  isOpen: boolean;
  product?: Product | null;
  isLoading?: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function ProductViewModal({
  isOpen,
  product,
  isLoading,
  onClose,
  onEdit,
}: Props) {
  if (!product && !isLoading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 overflow-hidden max-w-[820px] rounded-2xl border-none">
      {isLoading ? (
        <LoadingSkeleton />
      ) : product ? (
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          
          <div className="w-full md:w-5/12 bg-slate-50/50 dark:bg-white/5 flex items-center justify-center p-8 relative">
            <div className="absolute top-4 left-4">
               <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-white dark:bg-gray-800 shadow-sm text-gray-500">
                {product.category}
              </span>
            </div>
            <img
              src={product.image}
              className="w-full max-h-[300px] md:max-h-full object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              alt={product.name}
            />
          </div>

          <div className="w-full md:w-7/12 p-8 flex flex-col bg-white dark:bg-gray-950">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><Tag size={14} /> {product.brand}</span>
                  <span className="text-gray-200">|</span>
                  <span className="flex items-center gap-1"><Box size={14} /> ID: #{product.id.toString().slice(-5)}</span>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <span className="text-3xl font-black text-primary-600 dark:text-primary-400">
                Rs.{product.price.toLocaleString()}
              </span>
              <div className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                product.stock <= 0 
                  ? "border-red-200 text-red-500 bg-red-50/50" 
                  : "border-emerald-200 text-emerald-600 bg-emerald-50/50"
              }`}>
                {product.stock <= 0 ? "Out of Stock" : `${product.stock} Units Ready`}
              </div>
            </div>

            <div className="flex-1 space-y-5">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <Info size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Quick Summary</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.shortDescription}
                </p>
              </div>

              {product.description && (
                <div className="px-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Product Story</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col md:flex-row w-full animate-pulse h-[500px]">
      <div className="w-full md:w-5/12 bg-gray-100 dark:bg-gray-800" />
      <div className="w-full md:w-7/12 p-8 space-y-6">
        <div className="h-8 w-2/3 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        <div className="h-6 w-1/4 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        <div className="h-24 w-full bg-gray-50 dark:bg-gray-900 rounded-xl" />
        <div className="flex gap-3 pt-10">
          <div className="h-12 flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl" />
          <div className="h-12 flex-[1.5] bg-gray-100 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}