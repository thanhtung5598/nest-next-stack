import { PieChart } from '@mui/x-charts/PieChart';

const PieChartComponent = () => {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'In stock' },
            { id: 1, value: 15, label: 'Retired' },
            { id: 2, value: 20, label: 'Maintaining' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
};

export default PieChartComponent;
