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
import DashboardCard from '../../../shared/components/dashboard-card';
import ChartTooltip from '../../../shared/components/chart-tooltip';

const EmployeeStats = ({ userId }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const finalId = userId || id;
  const { isError, isPending, data } = useGetEmployeeStats(finalId);

  const ticketStateData = data?.ticketsByState.map((t: any) => ({
    name: t.state,
    value: t.count,
  }));

  const COLORS = [
    'var(--color-main)',
    'var(--color-main-hover)',
    'var(--color-disabled)',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Total Tickets */}

      <div className="grid grid-cols-1 gap-6">
        <DashboardCard className={'lg:col-span-2'}>
          <h3 className="text-lg font-semibold mb-2">
            {t('dashboard.text.totalTickets')}
          </h3>
          <p className="text-3xl font-bold">{data?.totalTickets}</p>
        </DashboardCard>

        <DashboardCard className={'lg:col-span-2'}>
          <h3 className="text-lg font-semibold mb-2">
            {t('dashboard.text.rank')}
          </h3>
          <p className="text-3xl font-bold">{data?.rank}</p>
        </DashboardCard>
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
      <DashboardCard className={'lg:col-span-2'}>
        <h3 className="text-lg font-semibold mb-4 text-center">
          {t('dashboard.text.ticketsState')}
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
                outerRadius={100}
                fill="green"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  value,
                }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) / 2;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="var(--color-second-background)"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight="bold">
                      {`${value} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  );
                }}>
                {ticketStateData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>
    </div>
  );
};

export default EmployeeStats;

