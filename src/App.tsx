import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import { AppPasswordForm } from '@/components/auth/AppPasswordForm';
import { useBankingStore } from '@/stores/bankingStore';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const { appPassword } = useBankingStore();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            !appPassword ? <Navigate to="/app-password" /> : <Index />
          } 
        />
        <Route path="/app-password" element={<AppPasswordForm />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
