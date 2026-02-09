
import React from 'react';
import { Megaphone, FileText, Calendar, Share2, Bookmark, ExternalLink } from 'lucide-react';

const DataBlackhole: React.FC = () => {
  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h3 className="text-xl font-bold text-gray-900">데이터 블랙홀</h3>
                <p className="text-sm text-gray-400">기관별 주요 알림 및 사업 발주 공고 자동 수집 현황</p>
            </div>
            <div className="flex gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold shadow-lg shadow-black/10">최신순</button>
                <button className="px-4 py-2 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50">중요순</button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories */}
            <div className="lg:col-span-1 space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 mb-4">기관 카테고리</h4>
                <CategoryCard name="중소벤처기업부" count={12} icon={FileText} active />
                <CategoryCard name="소상공인진흥공단" count={24} icon={Megaphone} />
                <CategoryCard name="국세청 (정책알림)" count={8} icon={Calendar} />
                <CategoryCard name="지자체 발주공고" count={45} icon={Share2} />
            </div>

            {/* News Feed */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-gray-50">
                        <FileText size={120} strokeWidth={0.5} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-tight">Highlight</span>
                            <span className="text-xs text-gray-400">2024. 05. 20</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight">상반기 소상공인 버팀목 자금 및<br/>전용 대출 지원 사업 공고</h2>
                        <p className="text-sm text-gray-500 mb-8 max-w-lg leading-relaxed">
                            중소벤처기업부에서 주관하는 이번 지원 사업은 고금리로 어려움을 겪는 오프라인 매장 운영자들을 대상으로 최대 5천만원 한도의 융자 지원 및 이자 보전 사업을 포함하고 있습니다.
                        </p>
                        <div className="flex gap-3">
                            <button className="px-6 py-3 bg-black text-white rounded-2xl text-xs font-bold shadow-xl shadow-black/10 flex items-center gap-2">
                                <ExternalLink size={14} />
                                원문 보기
                            </button>
                            <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-black hover:bg-gray-100 transition-all">
                                <Bookmark size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-black group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all">
                                    <Megaphone size={20} />
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold">2024. 05. {18-i}</span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 mb-2 leading-snug group-hover:text-purple-600 transition-colors">스마트 상점 기술 보급 사업 참여 매장 모집 {i}차</h4>
                            <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">키오스크, 테이블 오더 등 매장 자동화 기술 도입 비용의 최대 70% 지원 사업...</p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                <span className="text-[10px] font-black text-gray-400 uppercase">소상공인시장진흥공단</span>
                                <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

const CategoryCard = ({ name, count, icon: Icon, active = false }: { name: string; count: number; icon: any; active?: boolean }) => (
    <button className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all border ${active ? 'bg-white border-white shadow-xl shadow-gray-200/50 text-black ring-1 ring-black/5' : 'bg-gray-50/50 border-transparent text-gray-500 hover:bg-white hover:shadow-lg'}`}>
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${active ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Icon size={18} />
            </div>
            <span className="text-sm font-bold">{name}</span>
        </div>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${active ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-400'}`}>{count}</span>
    </button>
);

const ChevronRight = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default DataBlackhole;
