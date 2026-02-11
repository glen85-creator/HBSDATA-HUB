// Supabase store_master 테이블 타입 정의

export interface StoreMaster {
    id: string;
    brand_type: 'guksunamu' | 'competitor';
    name: string;
    name_display: string | null;
    address_raw: string | null;
    address_road: string | null;
    postcode: string | null;
    lat: number | null;
    lng: number | null;
    region_sido: string | null;
    region_sigungu: string | null;
    region_dong: string | null;
    created_at: string;
    updated_at: string;
}

export interface StoreAlias {
    id: string;
    store_id: string;
    alias_name: string;
    source: string | null;
    created_at: string;
}
