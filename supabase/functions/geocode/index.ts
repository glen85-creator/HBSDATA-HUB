// Supabase Edge Function: geocode
// 주소를 받아 네이버 Geocoding API로 위경도를 반환

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NAVER_CLIENT_ID = Deno.env.get("NAVER_CLIENT_ID") || "";
const NAVER_CLIENT_SECRET = Deno.env.get("NAVER_CLIENT_SECRET") || "";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GeocodeResponse {
    status: string;
    meta: {
        totalCount: number;
        page: number;
        count: number;
    };
    addresses: Array<{
        roadAddress: string;
        jibunAddress: string;
        englishAddress: string;
        x: string; // longitude
        y: string; // latitude
    }>;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { address } = await req.json();

        if (!address) {
            return new Response(
                JSON.stringify({ error: "address is required" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const encodedAddress = encodeURIComponent(address);
        const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodedAddress}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
                "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Naver API error:", errorText);
            return new Response(
                JSON.stringify({ error: "Geocoding failed", details: errorText }),
                { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const data: GeocodeResponse = await response.json();

        if (data.addresses && data.addresses.length > 0) {
            const result = {
                lat: parseFloat(data.addresses[0].y),
                lng: parseFloat(data.addresses[0].x),
                roadAddress: data.addresses[0].roadAddress,
                jibunAddress: data.addresses[0].jibunAddress,
            };
            return new Response(
                JSON.stringify(result),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        } else {
            return new Response(
                JSON.stringify({ error: "No results found", address }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error", message: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
