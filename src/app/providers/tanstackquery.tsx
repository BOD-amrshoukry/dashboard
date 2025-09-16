import type React from 'react';
import { queryClient } from '../../lib/tanstackquery';
import { QueryClientProvider } from '@tanstack/react-query';

const TanstackqueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackqueryProvider;

