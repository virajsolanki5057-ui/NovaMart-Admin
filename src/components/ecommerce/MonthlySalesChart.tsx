import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState } from "react";

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    // Primary Orange color for the bars
    colors: ["#ea580c"], 
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
      // Ensures the chart background is transparent to show our White/Black container
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#9ca3af", // Gray-400
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9ca3af",
        },
      },
    },
    grid: {
      borderColor: "#e5e7eb", // Light gray for white mode
      strokeDashArray: 4,
      xaxis: {
        lines: { show: false },
      },
      yaxis: {
        lines: { show: true },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: ["#f97316"], // Lighter orange at the top
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    tooltip: {
      theme: "dark", // Black tooltips for the "Black" theme element
      x: { show: false },
      marker: { show: true },
    },
  };

  const series = [
    {
      name: "Sales",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 pt-5 transition-all dark:border-gray-800 dark:bg-black sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-black dark:text-white">
            Monthly Sales
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total performance this year</p>
        </div>
        
        <div className="relative inline-block">
          <button 
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <MoreDotIcon className="text-gray-400 size-5" />
          </button>
          
          <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            className="w-40 p-2 border-gray-100 dark:border-gray-800 dark:bg-black"
          >
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-medium text-gray-600 rounded-lg hover:bg-orange-50 hover:text-orange-600 dark:text-gray-400 dark:hover:bg-orange-500/10 dark:hover:text-orange-500"
            >
              Download Report
            </DropdownItem>
            <DropdownItem
              onItemClick={() => setIsOpen(false)}
              className="flex w-full font-medium text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              Delete Data
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="mt-6 max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-4 min-w-[650px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={220} />
        </div>
      </div>
    </div>
  );
}