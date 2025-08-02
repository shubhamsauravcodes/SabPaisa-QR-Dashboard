import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from "./components/Dashboard";
import TransactionsPage from './pages/TransactionsPage';
import GeneratedQRPage from './pages/GeneratedQRPage';
import { useAppDispatch } from './store/hooks';
import { fetchQRCodes } from './store/slices/qrCodesSlice';
import { fetchTransactions } from './store/slices/transactionsSlice';

// Dashboard component with Redux integration and auto-refresh
function DashboardWithRedux() {
  const dispatch = useAppDispatch();

  // Auto-refresh data every 1 minute
  useEffect(() => {
    // Initial data load
    dispatch(fetchQRCodes());
    dispatch(fetchTransactions());

    // Set up auto-refresh interval (1 minute = 60000ms)
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing data from backend...');
      dispatch(fetchQRCodes());
      dispatch(fetchTransactions());
    }, 60000); // 1 minute

    return () => {
      clearInterval(refreshInterval);
    };
  }, [dispatch]);

  return <Dashboard />;
}

// Transactions page with Redux integration
function TransactionsPageWithRedux() {
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
