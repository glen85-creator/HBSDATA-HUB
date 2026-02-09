
import React from 'react';
import { Search, Filter, Download, MoreVertical, ExternalLink } from 'lucide-react';

const mockStores = [
  { id: '001', name: 'HBS 강남본점', region: '서울 강남구', brand: 'HBS Premium', sales: '₩125,000K', growth: '+12.5%', status: 'Active' },
  { id: '002', name: 'HBS 명동1호점', region: '서울 중구', brand: 'HBS Classic', sales: '₩98,200K', growth: '-2.1%', status: 'Active' },
  { id: '003', name: 'HBS 성수플래그십', region: '서울 성동구', brand: 'HBS Black', sales: '₩142,500K', growth: '+22.4%', status: 'Active' },
  { id: '004', name: 'HBS 부산해운대', region: '부산 해운대구', brand: 'HBS Premium', sales: '₩88,400K', growth: '+5.2%', status: 'Warning' },
  { id: '005', name: 'HBS 대구중앙', region: '대구 중구', brand: 'HBS Classic', sales: '₩76,100K', growth: '+0.8%', status: 'Active' },
  { id: '006', name: 'HBS 판교테크노', region: '경기 성남시', brand: 'HBS Premium', sales: '₩110,300K', growth: '+15.1%', status: 'Active' },
];

const StoreAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h3 className="text-xl font-bold text-gray-900">매장별 성과 분석</h3>
              <p className="text-sm text-gray-400">전국 HBS 매장의 상세 운영 데이터 및 성과 지표</p>
          </div>
          <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-all">
                  <Download size={14} />
                  엑셀 내보내기
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold shadow-lg shadow-black/10 hover:opacity-90 transition-all">
                  <ExternalLink size={14} />
                  상세 리포트
              </button>
          </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="매장명 또는 지역 검색..." 
                    className="pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black w-full sm:w-80"
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <FilterButton label="전체 지역" />
                <FilterButton label="브랜드: HBS Premium" active />
                <FilterButton label="매출: 5천만원 이상" />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">매장 정보</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">브랜드</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right">당월 매출</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right">전월 대비</th>
                        <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">상태</th>
                        <th className="px-6 py-4 text-center"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {mockStores.map((store) => (
                        <tr key={store.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">{store.id}</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{store.name}</p>
                                        <p className="text-[11px] text-gray-400">{store.region}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${store.brand.includes('Premium') ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {store.brand}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <p className="text-sm font-black text-gray-900">{store.sales}</p>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <span className={`text-xs font-bold ${store.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {store.growth}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${store.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${store.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                    {store.status}
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <button className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 opacity-0 group-hover:opacity-100">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">총 248개의 매장 중 6개 표시 중</p>
            <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-gray-100 rounded-lg text-xs font-bold text-gray-400 cursor-not-allowed">이전</button>
                <button className="px-3 py-1.5 bg-black text-white rounded-lg text-xs font-bold">1</button>
                <button className="px-3 py-1.5 border border-gray-100 rounded-lg text-xs font-bold hover:bg-gray-50">2</button>
                <button className="px-3 py-1.5 border border-gray-100 rounded-lg text-xs font-bold hover:bg-gray-50">3</button>
                <button className="px-3 py-1.5 border border-gray-100 rounded-lg text-xs font-bold hover:bg-gray-50">다음</button>
            </div>
        </div>
      </div>
    </div>
  );
};

const FilterButton = ({ label, active = false }: { label: string; active?: boolean }) => (
    <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${active ? 'bg-black text-white border-black shadow-lg shadow-black/10' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}>
        {label}
    </button>
);

export default StoreAnalysis;
