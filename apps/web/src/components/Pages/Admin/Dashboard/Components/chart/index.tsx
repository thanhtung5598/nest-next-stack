import BarChartComponent from './bar-chart';
import PieChartComponent from './pie-chart';

const ChartComponent = () => {
  return (
    <div className="w-[70%] mt-6">
      <div className="border border-[#D6D6D6] rounded-2xl p-6 mb-8">
        <BarChartComponent />
      </div>
      <div className="border border-[#D6D6D6] rounded-2xl max-w-xl p-6">
        <div className="mb-4">
          <h4 className="text-[#16161D] font-bold">Device status</h4>
        </div>
        <PieChartComponent />
      </div>
    </div>
  );
};

export default ChartComponent;
