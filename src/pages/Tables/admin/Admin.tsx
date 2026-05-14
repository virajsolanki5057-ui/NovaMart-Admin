import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import AdminTable from "../../../components/tables/AdminTable/AdminTable";

export default function Admins() {
  return (
    <>
      <PageMeta
        title="Admins | Ecommerce Admin"
        description="Manage administrators with responsive view, edit, and delete functionality."
      />
      <PageBreadcrumb pageTitle="Admins" />
      <div className="space-y-6">
        <AdminTable />
      </div>
    </>
  );
}
