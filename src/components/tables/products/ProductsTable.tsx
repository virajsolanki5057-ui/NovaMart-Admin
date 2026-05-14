import { useEffect, useMemo, useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { type Product } from "../../../api/productsApi";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchProducts,
  fetchProductById,
  addProduct,
  editProduct,
  removeProduct,
} from "../../../store/productsSlice";
import { showAlert } from "../../../store/alertSlice";
import ProductFormModal, { type ProductFormValues } from "./ProductFormModal";
import ProductViewModal from "./ProductViewModal";
import Pagination from "../../ui/pagination/Pagination";
import SearchBar from "../../ui/search-bar/SearchBar";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

import { useSearchParams } from "react-router";

export default function ProductsTable() {
  const [urlParams] = useSearchParams();
  const initialSearch = urlParams.get("search") || "";

  const dispatch = useAppDispatch();
  const {
    products,
    loading: isLoading,
    error: reduxError,
  } = useAppSelector((state) => state.products);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const q = urlParams.get("search");
    if (q !== null) {
      setSearchTerm(q);
    }
  }, [urlParams]);

  useEffect(() => {
    if (reduxError) {
      dispatch(
        showAlert({
          title: "Error",
          message: reduxError,
          type: "error",
        }),
      );
    }
  }, [reduxError, dispatch]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    void dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) return products;

    return products.filter((product) =>
      [product.name, product.category, product.brand, product.id]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [products, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const paginatedProducts = useMemo(() => {
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const openAddModal = () => {
    setFormMode("add");
    setSelectedProduct(null);
    setIsFormLoading(false);
    setIsFormOpen(true);
  };

  const openViewModal = async (productId: string) => {
    try {
      setIsViewOpen(true);
      setIsViewLoading(true);
      const product = await dispatch(fetchProductById(productId)).unwrap();
      setSelectedProduct(product);
    } catch (viewError: any) {
      dispatch(
        showAlert({
          title: "Error",
          message: viewError.message || "Failed to load product.",
          type: "error",
        }),
      );
      setIsViewOpen(false);
    } finally {
      setIsViewLoading(false);
    }
  };

  const openEditModal = async (productId: string) => {
    try {
      setFormMode("edit");
      setIsFormOpen(true);
      setIsFormLoading(true);
      const product = await dispatch(fetchProductById(productId)).unwrap();
      setSelectedProduct(product);
    } catch (editError: any) {
      dispatch(
        showAlert({
          title: "Error",
          message: editError.message || "Failed to load product.",
          type: "error",
        }),
      );
      setIsFormOpen(false);
    } finally {
      setIsFormLoading(false);
    }
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setIsFormLoading(false);
    setSelectedProduct(null);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setIsViewLoading(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      if (formMode === "add") {
        await dispatch(addProduct(values)).unwrap();
        dispatch(
          showAlert({
            title: "Product Added",
            message: "The new product has been successfully created.",
            type: "success",
          }),
        );
      } else if (selectedProduct) {
        const updatedProduct = await dispatch(
          editProduct({ id: selectedProduct.id, payload: values }),
        ).unwrap();
        setSelectedProduct(updatedProduct);
        dispatch(
          showAlert({
            title: "Product Updated",
            message: "The product details have been successfully updated.",
            type: "success",
          }),
        );
      }
      setIsFormOpen(false);
    } catch (submitError: any) {
      dispatch(
        showAlert({
          title: "Submission Failed",
          message: submitError.message || "Failed to save product.",
          type: "error",
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);
      await dispatch(removeProduct(selectedProduct.id)).unwrap();
      dispatch(
        showAlert({
          title: "Product Deleted",
          message: `Product "${selectedProduct.name}" has been removed.`,
          type: "success",
        }),
      );
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    } catch (deleteError: any) {
      dispatch(
        showAlert({
          title: "Delete Failed",
          message: deleteError.message || "Failed to delete product.",
          type: "error",
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Product Inventory
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage your product stock.
            </p>
          </div>
          <Button onClick={openAddModal} className="w-full sm:w-auto">
            Add Product
          </Button>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onClear={() => setSearchTerm("")}
          placeholder="Search by product name, category, or brand..."
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Image
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Product Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Category
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Price
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Stock
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <TableCell key={i} className="px-5 py-4">
                        <div className="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-400"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        No products found
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        We couldn't find any products matching "{searchTerm}".
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                        className="mt-6 rounded-xl"
                      >
                        Clear Search
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="px-5 py-4 text-sm text-gray-900 dark:text-white">
                      {product.id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                        <img
                          src={
                            product.image || "/images/product/product-01.jpg"
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {product.category}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm">
                      <span
                        className={
                          product.stock <= 0
                            ? "text-error-500 font-bold"
                            : "text-gray-900 dark:text-white"
                        }
                      >
                        {product.stock <= 0 ? "Out of Stock" : product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => void openViewModal(product.id)}
                          className="text-gray-500 hover:text-brand-500 transition"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M2.5 10C3.75 6.5 6.6 4.16 10 4.16C13.4 4.16 16.25 6.5 17.5 10C16.25 13.5 13.4 15.84 10 15.84C6.6 15.84 3.75 13.5 2.5 10Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => void openEditModal(product.id)}
                          className="text-gray-500 hover:text-brand-500 transition"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M11.25 3.75L16.25 8.75M3.3 16.7H7.9L16.6 7.9C16.8 7.7 16.9 7.4 16.9 7.1C16.9 6.8 16.8 6.5 16.6 6.3L13.7 3.4C13.5 3.2 13.2 3.1 12.9 3.1C12.6 3.1 12.3 3.2 12.1 3.4L3.3 12.2V16.7Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="text-gray-500 hover:text-error-500 transition"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M4.1 5.8H15.9M8.3 8.3V12.5M11.6 8.3V12.5M5 5.8L5.8 14.5C5.9 15.3 6.6 16 7.4 16H12.5C13.3 16 14 15.3 14.1 14.5L14.9 5.8M7.5 5.8V4.1C7.5 3.7 7.8 3.3 8.3 3.3H11.6C12.1 3.3 12.4 3.7 12.4 4.1V5.8"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="border-t border-gray-100 dark:border-white/[0.05]"
        />
      </div>

      <ProductFormModal
        isOpen={isFormOpen}
        mode={formMode}
        initialProduct={selectedProduct}
        isPrefilling={isFormLoading}
        isSubmitting={isSubmitting}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <ProductViewModal
        isOpen={isViewOpen}
        product={selectedProduct}
        isLoading={isViewLoading}
        onClose={closeViewModal}
        onEdit={() => {
          if (!selectedProduct) return;
          setIsViewOpen(false);
          void openEditModal(selectedProduct.id);
        }}
      />

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="max-w-[400px] p-6"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-600 dark:bg-error-500/10">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
            Delete Product
          </h4>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              "{selectedProduct?.name}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="mt-8 flex w-full gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              isLoading={isSubmitting}
              className="flex-1 bg-error-600 hover:bg-error-700 dark:bg-error-600"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
