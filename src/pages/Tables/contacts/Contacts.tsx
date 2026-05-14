import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ContactsTable from "../../../components/tables/contacts/ContactsTable";

export default function ContactsTableRoute() {
  return (
    <>
      <PageMeta
        title="Contacts | Admin Dashboard"
        description="View and manage contact messages"
      />
      <PageBreadcrumb pageTitle="Contacts" />
      <div className="space-y-6">
        <ContactsTable />
      </div>
    </>
  );
}
