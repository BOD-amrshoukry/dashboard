import { useTranslation } from 'react-i18next';

const useTicketStates = () => {
  const { t } = useTranslation();

  const options = [
    { label: t('tickets.text.open'), value: 'open' },
    { label: t('tickets.text.pending'), value: 'pending' },
    { label: t('tickets.text.completed'), value: 'completed' },
  ];

  return options;
};

export default useTicketStates;

