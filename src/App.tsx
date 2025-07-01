import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Index from './pages/Index';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import Account from './pages/Account';
import TrialExpired from './pages/TrialExpired';
import AdminAuth from './pages/AdminAuth';
import Admin from './pages/Admin';
import AdminAvisos from './pages/AdminAvisos';
import AdminTemplates from './pages/AdminTemplates';
import TemplatesProntos from './pages/TemplatesProntos';
import TemplatesUpgrade from './pages/TemplatesUpgrade';
import SharedFunnel from './pages/SharedFunnel';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:id" element={<Builder />} />
          <Route path="/account" element={<Account />} />
          <Route path="/trial-expired" element={<TrialExpired />} />
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/avisos" element={<AdminAvisos />} />
          <Route path="/admin/templates" element={<AdminTemplates />} />
          <Route path="/templates-prontos" element={<TemplatesProntos />} />
          <Route path="/templates-upgrade" element={<TemplatesUpgrade />} />
          <Route path="/shared/:shareToken" element={<SharedFunnel />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
