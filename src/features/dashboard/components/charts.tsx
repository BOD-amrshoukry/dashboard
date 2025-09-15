import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useGetStats from '../hooks/use-get-stats';
import Loading from '../../../shared/components/loading';

export default function Charts() {
  const { isError, isPending, data } = useGetStats();
  const COLORS = ['#f87171', '#fbbf24', '#60a5fa'];

  const hexData = [
    { metric: 'Employees', value: data?.employees },
    { metric: 'Managers', value: data?.managers },
    { metric: 'Total Tickets', value: data?.tickets.total },
    { metric: 'Open Tickets', value: data?.tickets.byState.open },
    { metric: 'Pending Tickets', value: data?.tickets.byState.pending },
    { metric: 'Unassigned', value: data?.tickets.unassigned },
  ];

  const ticketStateData = [
    { name: 'Open', value: data?.tickets.byState.open },
    { name: 'Pending', value: data?.tickets.byState.pending },
    { name: 'Completed', value: data?.tickets.byState.completed },
  ];

  console.log('dataa', data);

  if (isPending) return <Loading />;

  const colors = ['#60a5fa', '#facc15', '#34d399'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
      {/* Tickets per Day */}
      <div className="bg-white p-4 rounded-2xl shadow 2xl:col-span-2 order-2 xl:order-1">
        <div className="h-[500px] ">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={'80%'} data={hexData} cx="50%" cy="50%">
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              <Radar
                name="Stats"
                dataKey="value"
                stroke="#60a5fa"
                fill="#60a5fa"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 order-3 xl:order-2">
        <div className="bg-white p-4 rounded-2xl shadow w-full order-2 xl:order-1">
          <h3 className="text-lg font-semibold">Total Employees</h3>
          <p className="text-2xl">{data?.employees}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow order-3 xl:order-2">
          <h3 className="text-lg font-semibold">Employees without Tickets</h3>
          <p className="text-2xl">{data?.tickets.employeesWithoutTickets}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow order-1 xl:order-3">
          <h3 className="text-lg font-semibold mb-4">Tickets by State</h3>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketStateData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label>
                  {ticketStateData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 order-4 xl:order-3">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">Total Managers</h3>
          <p className="text-2xl">{data?.managers}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">Total Tickets</h3>
          <p className="text-2xl">{data?.tickets.total}</p>
        </div>

        {/* <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">Unassigned Tickets</h3>
          <p className="text-2xl">
            {data?.tickets.unassigned} (
            {data?.tickets.unassignedPercentage.toFixed(1)}%)
          </p>
        </div> */}

        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-2">Deleted Tickets</h3>
          <p className="text-2xl font-bold">{data?.tickets.deleted}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow 2xl:col-span-2 order-1 xl:order-4">
        <h3 className="text-lg font-semibold mb-4">Top Employees</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.tickets.topEmployees}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ticketCount" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tickets by state */}

      {/* Top Employees */}
    </div>
  );
}

