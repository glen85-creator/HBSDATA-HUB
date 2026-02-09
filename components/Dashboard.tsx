
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
// Added Zap to imports
import { TrendingUp, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, MoreHorizontal, ChevronRight, Zap } from 'lucide-react';

const mockSalesData = [
  { name: 'Jan', sales: 4200, traffic: 2400 },
  { name: 'Feb', sales: 3800, traffic: 1398 },
  { name: 'Mar', sales: 5200, traffic: 9800 },
  { name: 'Apr', sales: 4800, traffic: 3908 },
  { name: 'May', sales: 6100, traffic: 4800 },
  { name: 'Jun', sales: 5900, traffic: 3800 },
  { name: 'Jul', sales: 7200, traffic: 4300 },
];

const mockStorePerformance = [
  { name: '강남본점', value: 85, color: '#8B5CF6' },
  { name: '명동1호', value: 65, color: '#10B981' },
  { name: '성수지점', value: 45, color: '#F59E0B' },
  { name: '부산센터', value: 92, color: '#EC4899' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="전체 매출" value="₩12.4B" change="+12.5%" isUp={true} icon={ShoppingBag} color="bg-purple-500" />
        <StatCard title="방문 고객수" value="1.2M" change="+5.2%" isUp={true} icon={Users} color="bg-emerald-500" />
        <StatCard title="활성 매장" value="248" change="-1.4%" isUp={false} icon={TrendingUp} color="bg-amber-500" />
        <StatCard title="평균 체류시간" value="24.5m" change="+0.8%" isUp={true} icon={Users} color="bg-blue-500" />
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">매출 및 트래픽 추이</h3>
              <p className="text-sm text-gray-400 mt-1">지난 7개월간의 성과 분석 데이터입니다.</p>
            </div>
            <select className="bg-gray-50 border-none rounded-xl text-xs font-bold p-2 outline-none">
              <option>월간 보기</option>
              <option>주간 보기</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">상위 성과 매장</h3>
            <button className="text-gray-400 hover:text-black transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="space-y-6">
            {mockStorePerformance.map((store, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">{store.name}</span>
                  <span className="text-xs font-black" style={{ color: store.color }}>{store.value}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 group-hover:opacity-80" 
                    style={{ width: `${store.value}%`, backgroundColor: store.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-gray-50 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-900">지역별 매출 비중</h4>
                  <MoreHorizontal size={16} className="text-gray-400" />
              </div>
              <div className="flex gap-2 h-4">
                  <div className="h-full bg-purple-500 rounded-l-full" style={{width: '40%'}}></div>
                  <div className="h-full bg-emerald-500" style={{width: '25%'}}></div>
                  <div className="h-full bg-amber-500" style={{width: '20%'}}></div>
                  <div className="h-full bg-blue-500 rounded-r-full" style={{width: '15%'}}></div>
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400">
                  <span>수도권 40%</span>
                  <span>경상 25%</span>
                  <span>충청 20%</span>
                  <span>기타 15%</span>
              </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">최근 데이터 업데이트</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(item => (
              <div key={item} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  {/* Added Zap to fix: Cannot find name 'Zap' */}
                  <Zap size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">강남본점 실시간 재고 연동 완료</p>
                  <p className="text-xs text-gray-400">2분 전 • 시스템 동기화</p>
                </div>
                <button className="text-[10px] font-black uppercase text-purple-600 tracking-widest px-3 py-1 bg-purple-50 rounded-lg">Success</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">데이터 블랙홀 (신규 공고)</h3>
          <div className="space-y-4">
            <div className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50 hover:bg-gray-50 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase">입찰공고</span>
                <span className="text-xs text-gray-400">D-3</span>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">2024년 중소벤처기업부 스마트 매장 구축 사업</p>
              <p className="text-xs text-gray-400">기관: 중소벤처기업진흥공단</p>
            </div>
            <div className="p-5 border border-gray-100 rounded-3xl hover:bg-gray-50 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded uppercase">알림</span>
                <span className="text-xs text-gray-400">오늘</span>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">상반기 소상공인 정책자금 융자 공고</p>
              <p className="text-xs text-gray-400">기관: 소상공인시장진흥공단</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: any;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isUp, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color} text-white shadow-lg shadow-current/20`}>
          <Icon size={22} />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-lg ${isUp ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
        <h4 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h4>
      </div>
    </div>
  );
};

export default Dashboard;
