import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { CampaignList } from './components/CampaignList';
import { CampaignForm } from './components/CampaignForm';
import { CampaignDetail } from './components/CampaignDetail';
import { Navigation } from './components/Navigation';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-[var(--surface-01)]">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/new" element={<CampaignForm />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/campaigns/:id/edit" element={<CampaignForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}