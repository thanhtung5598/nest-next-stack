import { BarChart } from '@mui/x-charts/BarChart';

const uData = [200, 300, 200, 278, 189, 239, 349];
const pData = [240, 139, 100, 390, 200, 380, 400];

const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const BarChartComponent = () => {
  return (
    <BarChart
      width={740}
      height={300}
      series={[
        { data: pData, label: 'Total borrowing', id: 'pvId' },
        { data: uData, label: 'Total return', id: 'uvId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band' }]}
    />
  );
};

export default BarChartComponent;
