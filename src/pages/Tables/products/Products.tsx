import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ProductsTable from "../../../components/tables/products/ProductsTable";

export default function Products() {
  return (
    <>
      <PageMeta
        title="Products | Ecommerce Admin"
        description="Manage products with responsive add, edit, view, and delete flows."
      />
      <PageBreadcrumb pageTitle="Products" />
      <div className="space-y-6">
          <ProductsTable />
      </div>
    </>
  );
}
