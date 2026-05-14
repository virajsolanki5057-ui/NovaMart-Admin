import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import TextArea from "../../form/input/TextArea";
import type { Product, ProductPayload } from "../../../api/productsApi";

export interface ProductFormValues extends ProductPayload {
  imageFile?: File | null;
}

interface ProductFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialProduct: Product | null;
  isPrefilling: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => Promise<void>;
}

const CATEGORY_OPTIONS = ["Electronics", "Fashion", "Clothing", "Accessories", "Home", "Other"];

const emptyFormValues: ProductFormValues = {
  name: "",
  category: "",
  price: 0,
  stock: 0,
  description: "",
  shortDescription: "",
  image: "",
  brand: "",
  imageFile: null,
};

export default function ProductFormModal({
  isOpen,
  mode,
  initialProduct,
  isPrefilling,
  isSubmitting,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const [formValues, setFormValues] = useState<ProductFormValues>(emptyFormValues);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialProduct) {
        setFormValues({
          name: initialProduct.name || "",
          category: initialProduct.category || "",
          price: initialProduct.price || 0,
          stock: initialProduct.stock || 0,
          description: initialProduct.description || "",
          shortDescription: initialProduct.shortDescription || "",
          image: initialProduct.image || "",
          brand: initialProduct.brand || "",
          imageFile: null,
        });
      } else {
        setFormValues(emptyFormValues);
      }
    }
  }, [isOpen, mode, initialProduct]);

  const setFieldValue = <K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) => {
    setFormValues((curr) => ({ ...curr, [field]: value }));
  };

  const onDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setFieldValue("image", e.target.result as string);
    };
    setFieldValue("imageFile", file);
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formValues);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="max-w-[900px] w-[95%] md:w-full max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 md:p-6"
    >
      {isPrefilling ? (
        <div className="space-y-4">
          <div className="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative flex flex-col min-h-full">
          {/* HEADER: Simplified without buttons */}
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {mode === "add" ? "Add New Product" : "Edit Product"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Fill in the details to manage your store inventory.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div>
                  <Label>Product Name</Label>
                  <input
                    value={formValues.name}
                    onChange={(e) => setFieldValue("name", e.target.value)}
                    className="input w-full border border-gray-300 dark:border-gray-700 bg-transparent p-2 rounded text-gray-900 dark:text-white"
                    placeholder="e.g. Wireless Headphones"
                    required
                  />
                </div>
                <div>
                  <Label>Short Description</Label>
                  <input
                    value={formValues.shortDescription}
                    onChange={(e) => setFieldValue("shortDescription", e.target.value)}
                    className="input w-full border border-gray-300 dark:border-gray-700 bg-transparent p-2 rounded text-gray-900 dark:text-white"
                    placeholder="Brief summary"
                  />
                </div>
                <div>
                  <Label>Full Description</Label>
                  <TextArea
                    rows={5}
                    value={formValues.description}
                    onChange={(val) => setFieldValue("description", val)}
                  />
                </div>
              </section>

              <section className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Price ($)</Label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={formValues.price}
                    onChange={(e) => setFieldValue("price", Number(e.target.value))}
                    className="input w-full border border-gray-300 dark:border-gray-700 bg-transparent p-2 rounded text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <Label>Stock Quantity</Label>
                  <input
                    type="number"
                    min={0}
                    value={formValues.stock}
                    onChange={(e) => setFieldValue("stock", Number(e.target.value))}
                    className="input w-full border border-gray-300 dark:border-gray-700 bg-transparent p-2 rounded text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                <Label>Product Image</Label>
                <div
                  {...getRootProps()}
                  className={`mt-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <input {...getInputProps()} />
                  {formValues.image ? (
                    <div className="relative group">
                      <img src={formValues.image} className="w-full h-48 object-cover rounded-lg" alt="Preview" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                        <p className="text-white text-sm">Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Drag & drop or click to upload</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div>
                  <Label>Category</Label>
                  <select
                    value={formValues.category}
                    onChange={(e) => setFieldValue("category", e.target.value)}
                    className="input w-full border border-gray-300 dark:border-gray-700 bg-transparent p-2 rounded dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Brand</Label>
                  <input
                    value={formValues.brand}
                    onChange={(e) => setFieldValue("brand", e.target.value)}
                    className="input w-full border border-gray-300 dark:border-gray-700 bg-transparent p-2 rounded text-gray-900 dark:text-white"
                    placeholder="Brand name"
                    required
                  />
                </div>
              </section>
            </div>
          </div>

          {/* FOOTER: Save button moved here, aligned to the right */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
             <Button 
                type="submit" 
                isLoading={isSubmitting} 
                className="w-full sm:w-auto px-10 py-3 shadow-lg shadow-primary-500/20"
              >
                {mode === "add" ? "Save Product" : "Update Product"}
              </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}