import Chart from 'react-apexcharts';

const ChartComponent = (props) => {
  const options = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: ['A', 'B', 'C', 'D', 'E'],
    },
  };

  const series = [
    {
      name: 'Series 1',
      data: [30, 40, 45, 50, 49],
    },
  ];

  return (
    <div>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default ChartComponent;
