import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import OrdersTable from "../../../components/tables/orders/OrdersTable";

export default function Orders() {
  return (
    <>
      <PageMeta
        title="Orders | Ecommerce Admin"
        description="Manage customer orders with responsive view, update, and delete flows."
      />
      <PageBreadcrumb pageTitle="Orders" />
      <div className="space-y-6">
        <OrdersTable />
      </div>
    </>
  );
}
