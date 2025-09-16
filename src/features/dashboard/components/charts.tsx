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
  LabelList,
} from 'recharts';
import useGetStats from '../hooks/use-get-stats';
import Loading from '../../../shared/components/loading';
import { extractUserConditions } from '../../../shared/utils/auth';
import EmployeeStats from '../../users/components/employee-stats';
import useUser from '../../../shared/hooks/use-user';
import DashboardCard from '../../../shared/components/dashboard-card';
import { useTranslation } from 'react-i18next';
import ChartTooltip from '../../../shared/components/chart-tooltip';
import DataDisplay from '../../../shared/components/data-display';

export default function Charts() {
  const { isError, isPending, data, refetch } = useGetStats();
  const { t } = useTranslation();
  const COLORS = [
    'var(--color-main)',
    'var(--color-main-hover)',
    'var(--color-disabled)',
  ];
  const {
    isPending: isPendingMe,
    data: myData,
    isError: isErrorMe,
  } = useUser();

  const isEmployee = myData?.type === 'employee';
  const id = myData?.id;

  const hexData = [
    { metric: t('dashboard.text.employees'), value: data?.employees },
    { metric: t('dashboard.text.managers'), value: data?.managers },
    { metric: t('dashboard.text.totalTickets'), value: data?.tickets.total },
    {
      metric: t('dashboard.text.openTickets'),
      value: data?.tickets.byState.open,
    },
    {
      metric: t('dashboard.text.pendingTickets'),
      value: data?.tickets.byState.pending,
    },
    {
      metric: t('dashboard.text.pendingTickets'),
      value: data?.tickets.unassigned,
    },
  ];

  const ticketStateData = [
    { name: t('dashboard.text.open'), value: data?.tickets.byState.open },
    { name: t('dashboard.text.pending'), value: data?.tickets.byState.pending },
    {
      name: t('dashboard.text.completed'),
      value: data?.tickets.byState.completed,
    },
  ];

  if (isEmployee) {
    return <EmployeeStats userId={id} />;
  }

  return (
    <DataDisplay
      refetch={refetch}
      isLoading={isPending || isPendingMe}
      data={data}
      error={isError || isErrorMe ? t('dashboard.errors.load') : undefined}>
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {/* Tickets per Day */}
        <DashboardCard className={'2xl:col-span-2 order-2 xl:order-1'}>
          <div className="h-[500px] ">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={'80%'} data={hexData} cx="50%" cy="50%">
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar
                  name={t('general.text.count')}
                  dataKey="value"
                  stroke="var(--color-main)"
                  color="green"
                  fill="var(--color-main)"
                  fillOpacity={0.6}
                />
                <ChartTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 order-3 xl:order-2">
          <DashboardCard className={'order-2 xl:order-1'}>
            <h3 className="text-lg font-semibold">
              {t('dashboard.text.totalEmployees')}
            </h3>
            <p className="text-2xl">{data?.employees}</p>
          </DashboardCard>
          <DashboardCard className={'order-3 xl:order-2'}>
            <h3 className="text-lg font-semibold">
              {t('dashboard.text.noTickets')}
            </h3>
            <p className="text-2xl">{data?.tickets.employeesWithoutTickets}</p>
          </DashboardCard>
          <DashboardCard className={'order-1 xl:order-3'}>
            <h3 className="text-lg font-semibold mb-4">
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
                      const radius =
                        innerRadius + (outerRadius - innerRadius) / 2;
                      const x =
                        cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y =
                        cy + radius * Math.sin(-midAngle * (Math.PI / 180));

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

        <div className="grid grid-cols-1 gap-6 order-4 xl:order-3">
          <DashboardCard>
            <h3 className="text-lg font-semibold">
              {t('dashboard.text.totalManagers')}
            </h3>
            <p className="text-2xl">{data?.managers}</p>
          </DashboardCard>

          <DashboardCard>
            <h3 className="text-lg font-semibold">
              {t('dashboard.text.totalTickets')}
            </h3>
            <p className="text-2xl">{data?.tickets.total}</p>
          </DashboardCard>

          {/* <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">Unassigned Tickets</h3>
          <p className="text-2xl">
            {data?.tickets.unassigned} (
            {data?.tickets.unassignedPercentage.toFixed(1)}%)
          </p>
        </div> */}

          <DashboardCard>
            <h3 className="text-lg font-semibold mb-2">
              {t('dashboard.text.deletedTickets')}
            </h3>
            <p className="text-2xl font-bold">{data?.tickets.deleted}</p>
          </DashboardCard>
        </div>

        <DashboardCard className={'order-1 xl:order-4 2xl:col-span-2 '}>
          <h3 className="text-lg font-semibold mb-4">
            {t('dashboard.text.topEmployees')}
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.tickets.topEmployees}
                margin={{ bottom: 16 }}>
                <XAxis
                  dataKey="name"
                  tick={{ angle: -45, textAnchor: 'end' }} // rotate labels
                  interval={0} // show all labels
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip />
                <Bar dataKey="ticketCount" fill="var(--color-main)"></Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Tickets by state */}

        {/* Top Employees */}
      </div>
    </DataDisplay>
  );
}

