import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Target,
  ArrowUpRight,
  Map as MapIcon,
  Crosshair,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { StoreMaster } from '../types/store';

const MapStrategy: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [stores, setStores] = useState<StoreMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Fetch stores from Supabase
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('store_master')
          .select('*')
          .not('lat', 'is', null)
          .not('lng', 'is', null)
          .order('name');

        if (error) {
          console.error('Error fetching stores:', error);
          setMapError('매장 데이터를 불러오는데 실패했습니다.');
        } else {
          setStores(data || []);
          if (data && data.length > 0) {
            setSelectedStore(data[0].id);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setMapError('네트워크 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.address_road?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.address_raw?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Initialize map after stores are loaded
  useEffect(() => {
    if (loading || stores.length === 0) return;

    console.log("MapStrategy: Attempting to initialize map...");
    const initMap = () => {
      if (!(window as any).naver) {
        console.error("MapStrategy: window.naver is not defined");
        return;
      }

      console.log("MapStrategy: Initializing Naver Map...");
      try {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const firstStore = stores.find(s => s.lat && s.lng);
        const centerLat = firstStore?.lat || 37.4979;
        const centerLng = firstStore?.lng || 127.0276;

        const mapOptions = {
          center: new (window as any).naver.maps.LatLng(centerLat, centerLng),
          zoom: 13,
          zoomControl: false,
          mapTypeControl: false,
        };

        const map = new (window as any).naver.maps.Map('map', mapOptions);
        mapRef.current = map;
        console.log("MapStrategy: Map initialized successfully");

        // Add markers for stores with coordinates
        stores.forEach((store) => {
          if (!store.lat || !store.lng) return;

          const markerColor = store.brand_type === 'guksunamu' ? '#7C3AED' : '#6B7280';

          const marker = new (window as any).naver.maps.Marker({
            position: new (window as any).naver.maps.LatLng(store.lat, store.lng),
            map: map,
            title: store.name,
            icon: {
              content: `
                <div style="position: relative;">
                  <div style="width: 16px; height: 16px; background: ${markerColor}; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);"></div>
                </div>
              `,
              anchor: new (window as any).naver.maps.Point(8, 8),
            }
          });

          (window as any).naver.maps.Event.addListener(marker, 'click', () => {
            setSelectedStore(store.id);
            map.panTo(new (window as any).naver.maps.LatLng(store.lat, store.lng));
          });

          markersRef.current.push(marker);
        });
      } catch (err: any) {
        console.error("MapStrategy: Error initializing map", err);
        setMapError(err.message || "Failed to initialize map");
      }
    };

    if ((window as any).naver) {
      initMap();
    } else {
      console.log("MapStrategy: Waiting for window.naver...");
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if ((window as any).naver) {
          initMap();
          clearInterval(interval);
        } else if (attempts > 50) {
          clearInterval(interval);
          setMapError("Naver Maps SDK failed to load within 5 seconds.");
          console.error("MapStrategy: Timeout waiting for window.naver");
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loading, stores]);

  // Update map center when selected store changes
  useEffect(() => {
    if (selectedStore && mapRef.current) {
      const store = stores.find(s => s.id === selectedStore);
      if (store && store.lat && store.lng) {
        const moveLatLon = new (window as any).naver.maps.LatLng(store.lat, store.lng);
        mapRef.current.panTo(moveLatLon);
      }
    }
  }, [selectedStore, stores]);

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
                <option>전체 지역</option>
                <option>서울</option>
                <option>경기</option>
                <option>인천</option>
              </select>
            </div>
            <div className="relative group">
              <MapIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black" size={14} />
              <select className="bg-gray-50 border-none rounded-2xl text-[11px] font-black uppercase pl-9 pr-8 py-3.5 outline-none focus:ring-2 focus:ring-black transition-all appearance-none">
                <option>전체 브랜드</option>
                <option>국수나무</option>
                <option>경쟁점포</option>
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
        {/* Main Map Content - Now with Naver Maps */}
        <div className="flex-1 bg-white rounded-[48px] shadow-sm border border-gray-100 relative overflow-hidden group">
          <div id="map" className="absolute inset-0 w-full h-full" onClick={(e) => e.stopPropagation()}>
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-red-500 font-bold p-4 text-center z-50">
                <p>지도를 불러오는 중 오류가 발생했습니다: {mapError}<br /><span className="text-sm font-normal text-gray-600">콘솔 로그를 확인해주세요. (F12)</span></p>
              </div>
            )}
          </div>

          {/* Map Layer Controls */}
          <div className="absolute top-8 left-8 flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-lg z-10">
            <button className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-tight">Standard</button>
            <button className="px-4 py-2 text-gray-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-tight transition-colors">Satellite</button>
            <button className="px-4 py-2 text-gray-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-tight transition-colors">Density</button>
          </div>

          {/* Floating Action Controls */}
          <div className="absolute top-8 right-8 flex flex-col gap-2 z-10">
            <button
              className="w-12 h-12 bg-white border border-gray-100 rounded-2xl shadow-xl flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-all"
              onClick={() => {
                if (mapRef.current && (window as any).navigator.geolocation) {
                  (window as any).navigator.geolocation.getCurrentPosition((position: any) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const newCenter = new (window as any).naver.maps.LatLng(lat, lng);
                    mapRef.current.setCenter(newCenter);
                  });
                }
              }}
            >
              <Crosshair size={22} />
            </button>
            <div className="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden mt-2">
              <button
                onClick={() => mapRef.current?.setZoom(mapRef.current.getZoom() + 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50 border-b border-gray-50 text-xl"
              >+</button>
              <button
                onClick={() => mapRef.current?.setZoom(mapRef.current.getZoom() - 1)}
                className="w-12 h-12 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50 text-xl"
              >-</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Store List Panel */}
        <div className="w-96 bg-white rounded-[48px] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter">매장 탐색 결과</h4>
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                {loading ? '...' : filteredStores.length}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">검색된 매장을 선택하여 지도에서 확인하세요.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store.id)}
                  className={`p-5 rounded-[28px] border transition-all cursor-pointer group flex items-start gap-4 ${selectedStore === store.id
                    ? 'bg-black border-black shadow-xl shadow-black/10'
                    : 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${selectedStore === store.id ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-white'
                    }`}>
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${selectedStore === store.id
                        ? 'bg-white/20 text-white'
                        : store.brand_type === 'guksunamu' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                        {store.brand_type === 'guksunamu' ? '국수나무' : '경쟁점포'}
                      </span>
                      {store.region_sigungu && (
                        <span className={`text-[10px] font-medium ${selectedStore === store.id ? 'text-white/60' : 'text-gray-400'}`}>
                          {store.region_sigungu}
                        </span>
                      )}
                    </div>
                    <h5 className={`text-sm font-bold truncate ${selectedStore === store.id ? 'text-white' : 'text-gray-900'}`}>
                      {store.name_display || store.name}
                    </h5>
                    <p className={`text-[10px] font-medium truncate mt-0.5 ${selectedStore === store.id ? 'text-white/50' : 'text-gray-400'}`}>
                      {store.address_road || store.address_raw || '-'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
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
