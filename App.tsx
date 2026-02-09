
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MapStrategy from './components/MapStrategy';
import StoreAnalysis from './components/StoreAnalysis';
import DataBlackhole from './components/DataBlackhole';
import Settings from './components/Settings';
import Login from './components/Login';
import { NavTab } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.Dashboard);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case NavTab.Dashboard:
        return <Dashboard />;
      case NavTab.MapStrategy:
        return <MapStrategy />;
      case NavTab.StoreAnalysis:
        return <StoreAnalysis />;
      case NavTab.DataBlackhole:
        return <DataBlackhole />;
      case NavTab.Settings:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={() => setIsLoggedIn(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
