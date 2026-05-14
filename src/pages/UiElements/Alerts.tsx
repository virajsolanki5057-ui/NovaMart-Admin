import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { StaticAlert, useAlert } from "../../components/ui/alert/Alert";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";

export default function Alerts() {
  const alert = useAlert();

  return (
    <>
      <PageMeta
        title="Premium Notifications | Ecommerce Admin"
        description="Experience the world-class stacked notification system with glassmorphism and smart timers."
      />
      <PageBreadcrumb pageTitle="Alerts" />

      <div className="mb-8">
        <ComponentCard title="World-Class Notification System">
          <div className="mb-8">
            <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Premium Features</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400 list-disc pl-5">
              <li><strong>Glassmorphism UI</strong>: Beautiful backdrop-blur effects and soft shadows.</li>
              <li><strong>Hover to Pause</strong>: Auto-dismiss timers pause when you hover over an alert.</li>
              <li><strong>Smart Queue</strong>: Automatically manages overflow by showing only the latest 5 alerts.</li>
              <li><strong>Animated Progress</strong>: Visual countdown for each individual notification.</li>
              <li><strong>Spring Physics</strong>: Natural feeling transitions and layout shifts.</li>
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => alert.success("Product has been added to inventory.", "System Update")} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
              Trigger Success
            </Button>
            <Button onClick={() => alert.error("Could not connect to the database. Please try again.", "Network Error")} className="bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20">
              Trigger Error
            </Button>
            <Button onClick={() => alert.warn("Your subscription expires in 3 days.", "Billing Warning")} className="bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20">
              Trigger Warning
            </Button>
            <Button onClick={() => alert.info("New order #8829 received from John Doe.", "New Order")} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
              Trigger Info
            </Button>
            <Button onClick={() => alert.clear()} variant="outline" className="border-gray-300 dark:border-gray-700">
              Clear All
            </Button>
          </div>
        </ComponentCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComponentCard title="Static Success State">
          <StaticAlert
            type="success"
            title="Update Complete"
            message="All database records have been synchronized successfully."
          />
        </ComponentCard>

        <ComponentCard title="Static Error State">
          <StaticAlert
            type="error"
            title="Access Denied"
            message="You do not have the required permissions to perform this action."
          />
        </ComponentCard>

        <ComponentCard title="Static Warning State">
          <StaticAlert
            type="warning"
            title="Low Stock"
            message="Some items in your inventory are running low. Consider restocking."
          />
        </ComponentCard>

        <ComponentCard title="Static Info State">
          <StaticAlert
            type="info"
            title="Maintenance Scheduled"
            message="The admin panel will be offline for 15 minutes at 2:00 AM UTC."
          />
        </ComponentCard>
      </div>
    </>
  );
}
