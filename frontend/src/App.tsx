import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from "./components/Dashboard";
import TransactionsPage from './pages/TransactionsPage';
import GeneratedQRPage from './pages/GeneratedQRPage';
import { useAppDispatch } from './store/hooks';
import { fetchQRCodes } from './store/slices/qrCodesSlice';
import { fetchTransactionStats } from './store/slices/transactionsSlice';

// Dashboard component with Redux integration and auto-refresh
function DashboardWithRedux() {
  const dispatch = useAppDispatch();

  // Auto-refresh data every 1 minute - ONLY for dashboard
  useEffect(() => {
    console.log('🏠 Dashboard mounted - Loading dashboard data...');
    // Initial data load
    dispatch(fetchQRCodes());
    dispatch(fetchTransactionStats({})); // Only fetch stats for dashboard performance

    // Set up auto-refresh interval (1 minute = 60000ms)
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data from backend...');
      dispatch(fetchQRCodes());
      dispatch(fetchTransactionStats({})); // Only refresh stats for dashboard
    }, 60000); // 1 minute

    // Cleanup: Stop auto-refresh when leaving dashboard
    return () => {
      console.log('🏠 Dashboard unmounted - Stopping auto-refresh...');
      clearInterval(refreshInterval);
    };
  }, [dispatch]);

  return <Dashboard />;
}

// Transactions page with Redux integration
function TransactionsPageWithRedux() {
  console.log('📊 Transactions page mounted');
  return <TransactionsPage />;
}

// Generated QR page with Redux integration
function GeneratedQRPageWithRedux() {
  return <GeneratedQRPage />;
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardWithRedux />} />
          <Route path="/transactions" element={<TransactionsPageWithRedux />} />
          <Route path="/generated-qr" element={<GeneratedQRPageWithRedux />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
