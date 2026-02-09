
import React, { useState } from 'react';
import { 
  MapPin, 
  Info, 
  Layers, 
  Crosshair, 
  Filter, 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Target,
  ArrowUpRight,
  Map as MapIcon,
  Navigation
} from 'lucide-react';

const mockStores = [
  { id: '1', name: '강남 삼성타운점', brand: 'HBS Premium', sales: '+18.5%', status: 'Active', address: '서울 강남구 테헤란로' },
  { id: '2', name: '서초 본점', brand: 'HBS Black', sales: '+12.2%', status: 'Active', address: '서울 서초구 반포동' },
  { id: '3', name: '잠실 롯데타워점', brand: 'HBS Premium', sales: '+5.7%', status: 'Warning', address: '서울 송파구 잠실동' },
  { id: '4', name: '압구정 로데오', brand: 'HBS Classic', sales: '-2.1%', status: 'Active', address: '서울 강남구 신사동' },
  { id: '5', name: '신사 가로수길점', brand: 'HBS Black', sales: '+24.1%', status: 'Active', address: '서울 강남구 도산대로' },
  { id: '6', name: '청담 플래그십', brand: 'HBS Premium', sales: '+8.9%', status: 'Active', address: '서울 강남구 압구정로' },
  { id: '7', name: '코엑스몰 지점', brand: 'HBS Classic', sales: '+0.5%', status: 'Active', address: '서울 강남구 영동대로' },
];

const MapStrategy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string | null>('1');

  const filteredStores = mockStores.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden animate-in fade-in duration-500">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="매장명, 지역, 상권 키워드로 검색..." 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black outline-none transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative group">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black" size={14} />
              <select className="bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase pl-9 pr-8 py-3.5 outline-none focus:ring-2 focus:ring-black transition-all appearance-none">
                <option>서울 전체</option>
                <option>강남/서초</option>
                <option>송파/강동</option>
                <option>영등포/마포</option>
              </select>
            </div>
            <div className="relative group">
              <MapIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black" size={14} />
              <select className="bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase pl-9 pr-8 py-3.5 outline-none focus:ring-2 focus:ring-black transition-all appearance-none">
                <option>브랜드 전체</option>
                <option>HBS Premium</option>
                <option>HBS Black</option>
                <option>HBS Classic</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:opacity-90 transition-all">
            <Target size={14} />
            상권 분석 실행
          </button>
        </div>
      </div>

      {/* Map & List Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Map Content */}
        <div className="flex-1 bg-white rounded-[48px] shadow-sm border border-gray-100 relative overflow-hidden group">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-[#F1F3F5] flex items-center justify-center">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
            
            {/* Mock Map Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none">
              <path d="M0,100 L1000,400 M200,0 L500,800 M0,600 L1000,200" stroke="black" strokeWidth="20" fill="none" />
            </svg>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Navigation size={40} className="text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-400">지도를 드래그하여 상권을 탐색하세요</p>
            </div>
          </div>

          {/* Map Layer Controls */}
          <div className="absolute top-8 left-8 flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-lg z-10">
            <button className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-tight">Standard</button>
            <button className="px-4 py-2 text-gray-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-tight transition-colors">Satellite</button>
            <button className="px-4 py-2 text-gray-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-tight transition-colors">Density</button>
          </div>

          {/* Floating Action Controls */}
          <div className="absolute top-8 right-8 flex flex-col gap-2 z-10">
              <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl shadow-xl flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-all"><Crosshair size={22} /></button>
              <div className="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden mt-2">
                <button className="w-12 h-12 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50 border-b border-gray-50 text-xl">+</button>
                <button className="w-12 h-12 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50 text-xl">-</button>
              </div>
          </div>

          {/* Selected Marker Detail Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative group cursor-pointer">
              <div className="w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow-lg animate-ping absolute inset-0"></div>
              <div className="w-4 h-4 bg-purple-600 rounded-full border-2 border-white shadow-lg relative"></div>
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4">
                <div className="bg-black text-white p-5 rounded-[24px] shadow-2xl w-56 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-black leading-none mb-1">강남 삼성타운점</h5>
                      <p className="text-[10px] text-white/50 font-medium tracking-tight">서울 강남구 테헤란로</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <div className="text-center">
                      <p className="text-[9px] text-white/50 font-black uppercase tracking-tighter mb-0.5">매출 성장</p>
                      <p className="text-xs font-black text-emerald-400">+18.5%</p>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10"></div>
                    <div className="text-center">
                      <p className="text-[9px] text-white/50 font-black uppercase tracking-tighter mb-0.5">유동 인구</p>
                      <p className="text-xs font-black">24.5k</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Store List Panel */}
        <div className="w-96 bg-white rounded-[48px] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter">매장 탐색 결과</h4>
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{filteredStores.length}</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">검색된 매장을 선택하여 지도에서 확인하세요.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredStores.map((store) => (
              <div 
                key={store.id} 
                onClick={() => setSelectedStore(store.id)}
                className={`p-5 rounded-[28px] border transition-all cursor-pointer group flex items-start gap-4 ${
                  selectedStore === store.id 
                    ? 'bg-black border-black shadow-xl shadow-black/10' 
                    : 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedStore === store.id ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                }`}>
                  <MapPin size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                      selectedStore === store.id 
                        ? 'bg-white/20 text-white' 
                        : store.brand.includes('Premium') ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {store.brand}
                    </span>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${selectedStore === store.id ? 'text-emerald-400' : 'text-emerald-500'}`}>
                      <ArrowUpRight size={12} />
                      {store.sales}
                    </div>
                  </div>
                  <h5 className={`text-sm font-bold truncate ${selectedStore === store.id ? 'text-white' : 'text-gray-900'}`}>{store.name}</h5>
                  <p className={`text-[10px] font-medium truncate mt-0.5 ${selectedStore === store.id ? 'text-white/50' : 'text-gray-400'}`}>{store.address}</p>
                </div>
              </div>
            ))}
            {filteredStores.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm font-bold text-gray-400">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-gray-50/50 border-t border-gray-50">
            <button className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-white hover:border-black transition-all shadow-sm">
              전체 리스트 내려받기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapStrategy;
