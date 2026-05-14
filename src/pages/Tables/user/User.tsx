import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import UsersTable from "../../../components/tables/UserTable/UserTable";

export default function Users() {
  return (
    <>
      <PageMeta
        title="Users | Ecommerce Admin"
        description="Manage users with responsive view, edit, and delete functionality."
      />
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <UsersTable />
      </div>
    </>
  );
}