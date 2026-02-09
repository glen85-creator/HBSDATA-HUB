
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings as SettingsIcon, User, X, Check } from 'lucide-react';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const getTitle = () => {
    switch (activeTab) {
      case NavTab.Dashboard: return '대시보드';
      case NavTab.MapStrategy: return 'MAP 전략';
      case NavTab.StoreAnalysis: return '데이터 분석';
      case NavTab.DataBlackhole: return '데이터 블랙홀';
      case NavTab.Settings: return '설정';
      default: return 'HBS Hub';
    }
  };

  const notifications = [
    { id: 1, title: '시스템 공지', message: '데이터 동기화가 완료되었습니다.', time: '5분 전', read: false },
    { id: 2, title: '성과 리포트', message: '강남본점 주간 리포트가 생성되었습니다.', time: '1시간 전', read: false },
    { id: 3, title: '보안 알림', message: '새로운 브라우저에서 로그인이 감지되었습니다.', time: '3시간 전', read: true },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white/50 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search stores or data..." 
            className="bg-gray-100 border-none rounded-2xl pl-12 pr-6 py-2.5 text-sm focus:ring-2 focus:ring-black w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        <button 
          onClick={() => onTabChange(NavTab.Settings)}
          className={`p-3 rounded-full transition-all border shadow-sm ${
            activeTab === NavTab.Settings 
              ? 'bg-black text-white border-black' 
              : 'text-gray-500 hover:bg-white border-transparent hover:border-gray-100'
          }`}
        >
          <SettingsIcon size={20} />
        </button>
        
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-3 text-gray-500 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-100 shadow-sm relative ${showNotifications ? 'bg-gray-50' : ''}`}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 bg-white rounded-[24px] shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">최근 알림</h3>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-black">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-none flex gap-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">{n.title}</span>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 leading-snug">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50/50 text-center">
                <button className="text-[11px] font-black text-purple-600 uppercase hover:underline">모든 알림 읽음 처리</button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900">Admin User</p>
            <p className="text-[10px] text-gray-400 font-medium">관리자 계정</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
            <img src="https://picsum.photos/seed/admin/200" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
