# Fix Plan

## Information Gathered
1. **ProductFormModal.tsx** exports `CreateProductPage` (a full page component), but `ProductsTable.tsx` expects a modal component with props: `isOpen`, `mode`, `initialProduct`, `isPrefilling`, `isSubmitting`, `onClose`, `onSubmit`.
2. **ProductViewModal.tsx** is missing the `isLoading` prop in its `Props` interface, but `ProductsTable.tsx` passes `isLoading={isViewLoading}`.

## Plan
1. Rewrite `src/components/tables/products/ProductFormModal.tsx` to be a proper modal with the expected props.
2. Add `isLoading?: boolean` to `src/components/tables/products/ProductViewModal.tsx` and handle loading state.

## Steps
- [x] Read all relevant files
- [x] Rewrite ProductFormModal.tsx
- [x] Update ProductViewModal.tsx
- [x] Verify files are correct

