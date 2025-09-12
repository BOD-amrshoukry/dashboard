import './App.css';
import TanstackqueryProvider from './providers/tanstackquery';
import AppRoutes from './routes/routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <TanstackqueryProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </TanstackqueryProvider>
  );
}

export default App;

