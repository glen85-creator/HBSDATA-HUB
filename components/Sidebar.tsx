
import React from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  BarChart2, 
  Zap, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: NavTab.Dashboard, label: '대시보드', icon: LayoutDashboard },
    { id: NavTab.MapStrategy, label: 'MAP 기반 브랜드 전략', icon: MapIcon },
    { id: NavTab.StoreAnalysis, label: '매장 데이터 분석', icon: BarChart2 },
    { id: NavTab.DataBlackhole, label: '데이터 블랙홀', icon: Zap },
    { id: NavTab.Settings, label: '설정 및 프로필', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white h-screen flex flex-col border-r border-gray-100 shadow-sm z-50">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <BarChart2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">HBS</h1>
            <p className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-wider">Store Data Hub</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-black text-white shadow-lg shadow-black/10' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8">
        {/* Replaced Premium Upgrade with System Status Card */}
        <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 mb-8 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-tight">시스템 보안 센터</h3>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-3">내부 데이터 보안 정책에 따라 모든 활동은 로그에 기록됩니다.</p>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-400">네트워크 상태: 양호</span>
                </div>
            </div>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-4 p-4 w-full text-gray-400 hover:text-red-500 transition-colors font-medium text-sm"
        >
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
