import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from "./components/Dashboard";
import TransactionsPage from './pages/TransactionsPage';
import GeneratedQRPage from './pages/GeneratedQRPage';
import { simulatePayment } from './utils/paymentSimulator';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { addTransactions } from './store/slices/transactionsSlice';

// Dashboard component with Redux integration
function DashboardWithRedux() {
  const dispatch = useAppDispatch();
  const qrCodes = useAppSelector((state) => state.qrCodes.qrCodes);

  // Global UPI simulation - runs regardless of current page
  useEffect(() => {
    const intervals = [];
    
    qrCodes.forEach((qr) => {
      if (qr.simulationActive && qr.status === "Active") {
        const interval = setInterval(() => {
          // Generate 1-2 random payments for this specific QR
          const numPayments = Math.floor(Math.random() * 2) + 1;
          const newTransactions = [];
          
          for (let i = 0; i < numPayments; i++) {
            const newTransaction = simulatePayment(qr.qrId, qr.maxAmount);
            newTransactions.push(newTransaction);
          }
          
          dispatch(addTransactions(newTransactions));
        }, 5000); // Every 5 seconds
        
        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [qrCodes, dispatch]);

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
