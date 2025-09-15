import { useTranslation } from 'react-i18next';
import useGetEmployeeStats from '../hooks/use-get-employee-stats';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useParams } from 'react-router-dom';

const EmployeeStats = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isError, isPending, data } = useGetEmployeeStats(id);

  const ticketStateData = data?.ticketsByState.map((t: any) => ({
    name: t.state,
    value: t.count,
  }));

  const COLORS = ['#60a5fa', '#facc15', '#f87171']; // colors for open/pending/closed

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Total Tickets */}

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Total Tickets</h3>
          <p className="text-3xl font-bold">{data?.totalTickets}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Rank</h3>
          <p className="text-3xl font-bold">{data?.rank}</p>
        </div>
      </div>
      {/* Deleted Tickets */}
      {/* <div className="bg-white p-4 rounded-2xl shadow text-center">
        <h3 className="text-lg font-semibold mb-2">Deleted Tickets</h3>
        <p className="text-3xl font-bold">{data?.deletedTickets}</p>
      </div> */}

      {/* Unassigned Tickets */}
      {/* <div className="bg-white p-4 rounded-2xl shadow text-center md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Unassigned Tickets</h3>
        <p className="text-3xl font-bold">{data?.unassignedTickets}</p>
      </div> */}

      {/* Tickets by State */}
      <div className="bg-white p-4 rounded-2xl shadow lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Tickets by State
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ticketStateData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label>
                {ticketStateData?.map((entry: any, index: number) => (
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
  );
};

export default EmployeeStats;

