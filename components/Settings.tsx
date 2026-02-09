
import React from 'react';
import { User, Bell, Lock, Database, Globe, Sliders } from 'lucide-react';

// Moved helper components above the main component and fixed 'children' prop requirement
const SettingGroup = ({ title, children }: { title: string; children?: React.ReactNode }) => (
    <div className="space-y-4">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">{title}</h4>
        <div className="bg-white rounded-[32px] p-2 shadow-sm border border-gray-100 space-y-1">
            {children}
        </div>
    </div>
);

const SettingItem = ({ icon: Icon, label, desc }: { icon: any; label: string; desc: string }) => (
    <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all text-left group">
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all shadow-sm">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-sm font-bold text-gray-900">{label}</p>
            <p className="text-[11px] text-gray-400 font-medium">{desc}</p>
        </div>
    </button>
);

const StatusRow = ({ label, status, time }: { label: string; status: string; time: string }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-bold text-gray-900">{label}</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-medium">{time}</span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tight px-2 py-0.5 bg-emerald-100 rounded-lg">{status}</span>
        </div>
    </div>
);

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center gap-8">
            <div className="relative group">
                <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-purple-100 to-indigo-100 p-1">
                    <img src="https://picsum.photos/seed/admin/300" alt="Profile" className="w-full h-full object-cover rounded-[38px] shadow-lg" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <User size={18} />
                </button>
            </div>
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">관리자 계정</h2>
                <p className="text-gray-400 font-medium">admin@hbs-hub.com • Super Admin</p>
                <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase">Verified</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-black uppercase">Pro Plan</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Added optional children to type to fix 'children' missing error */}
            <SettingGroup title="개인 설정">
                <SettingItem icon={User} label="프로필 정보" desc="계정 기본 정보 및 담당 지역 설정" />
                <SettingItem icon={Bell} label="알림 설정" desc="중요 공고 및 매장 이슈 푸시 알림" />
                <SettingItem icon={Lock} label="보안" desc="비밀번호 변경 및 2단계 인증" />
            </SettingGroup>

            <SettingGroup title="데이터 연동">
                <SettingItem icon={Database} label="API 관리" desc="NAVER Maps, 공공데이터 API 연동" />
                <SettingItem icon={Globe} label="지역 필터" desc="메인 대시보드 기본 표시 지역 설정" />
                <SettingItem icon={Sliders} label="커스텀 지표" desc="대시보드 KPI 우선순위 관리" />
            </SettingGroup>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">데이터 연동 현황</h3>
            <div className="space-y-4">
                <StatusRow label="네이버 맵 API" status="Connected" time="Today, 09:00" />
                <StatusRow label="중기부 사업공고 스크래퍼" status="Running" time="2 hours ago" />
                <StatusRow label="전국 매장 POS 연동" status="Healthy" time="Real-time" />
            </div>
        </div>
    </div>
  );
};

export default Settings;
