import React from "react";
import { Icon } from "../foundations/Icon";

export interface MapMarker {
  latitude: number;
  longitude: number;
  label: string;
}

type KakaoLatLng = object;
interface KakaoBounds {
  extend: (position: KakaoLatLng) => void;
}
interface KakaoMapInstance {
  setBounds: (bounds: KakaoBounds) => void;
}
interface KakaoMaps {
  load: (callback: () => void) => void;
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
  LatLngBounds: new () => KakaoBounds;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMapInstance;
  Marker: new (options: { map: KakaoMapInstance; position: KakaoLatLng; title: string }) => object;
}

interface KakaoWindow {
  kakao?: { maps: KakaoMaps };
}

const APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined;
let sdkPromise: Promise<KakaoMaps> | null = null;

function loadKakaoMaps(): Promise<KakaoMaps> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const current = (window as unknown as KakaoWindow).kakao?.maps;
    if (current) {
      current.load(() => resolve(current));
      return;
    }
    if (!APP_KEY) {
      reject(new Error("카카오맵 키가 설정되지 않았습니다."));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      const loaded = (window as unknown as KakaoWindow).kakao?.maps;
      if (!loaded) {
        reject(new Error("카카오맵 SDK를 불러오지 못했습니다."));
        return;
      }
      loaded.load(() => resolve(loaded));
    };
    script.onerror = () => reject(new Error("카카오맵 SDK를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export function KakaoMap({ markers, height = 170 }: { markers: MapMarker[]; height?: number }): JSX.Element {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container || markers.length === 0) return;
    void loadKakaoMaps()
      .then((maps) => {
        if (cancelled) return;
        const first = new maps.LatLng(markers[0].latitude, markers[0].longitude);
        const map = new maps.Map(container, { center: first, level: 5 });
        const bounds = new maps.LatLngBounds();
        markers.forEach((marker) => {
          const position = new maps.LatLng(marker.latitude, marker.longitude);
          bounds.extend(position);
          new maps.Marker({ map, position, title: marker.label });
        });
        if (markers.length > 1) map.setBounds(bounds);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [markers]);

  if (failed) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--surface-soft)", color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 12 }}>
        <Icon name="map-pin-off" size={16} color="var(--muted)" />
        지도 키를 확인해주세요.
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: "100%", height, background: "var(--surface-soft)" }} />;
}
