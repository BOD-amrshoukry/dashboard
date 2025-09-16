import { useState } from 'react';
import EmployeeTicketsTable from './employee-tickets-table';
import PageHead from '../../../shared/components/page-head';
import { useTranslation } from 'react-i18next';
import PageAction from '../../../shared/components/page-action';
import EmployeeTicketForm from './employee-ticket-form';

const EmployeeTickets = ({ data }: { data: { name: string } }) => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  return (
    <>
      <div className="flex gap-[24px] items-center mb-[32px] mt-[64px] flex-wrap">
        <PageHead
          size="sm"
          head={`(${data?.name}) ${t("general.text.'s")} ${t(
            'tickets.text.tickets',
          )}`}
        />

        <div className="flex items-center gap-[16px]">
          <PageAction
            href={undefined}
            onClick={() => setIsEnabled(true)}
            disabled={isEnabled}>
            +
          </PageAction>
        </div>
      </div>
      <div className="mb-[32px]">
        <EmployeeTicketForm isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
      </div>
      <EmployeeTicketsTable />
    </>
  );
};

export default EmployeeTickets;

