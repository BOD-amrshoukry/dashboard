import { queryClient } from '../../lib/tanstackquery';
import { QueryClientProvider } from '@tanstack/react-query';

const TanstackqueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackqueryProvider;
