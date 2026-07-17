import React from "react";
import { Icon } from "../foundations/Icon";

const APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined;

// SDK는 앱 전체에서 한 번만 로드한다(싱글턴 Promise).
let sdkPromise: Promise<void> | null = null;
function loadKakaoSdk(): Promise<void> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<void>((resolve, reject) => {
    const w = window as unknown as { kakao?: { maps?: { load: (cb: () => void) => void } } };
    if (w.kakao?.maps) { w.kakao.maps.load(() => resolve()); return; }
    if (!APP_KEY) { reject(new Error("VITE_KAKAO_MAP_KEY 가 설정되지 않았습니다.")); return; }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      const kakao = (window as unknown as { kakao: { maps: { load: (cb: () => void) => void } } }).kakao;
      kakao.maps.load(() => resolve());
    };
    script.onerror = () => reject(new Error("Kakao Maps SDK 로드 실패"));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

const ESCAPE: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPE[c]);
}

/** 지도 영역 로딩 표시 — 스피너 + "지도를 불러오는 중…". 지도 영역과 동일한 높이를 차지한다. */
export function MapLoading({ height = 140, style = {} }: { height?: number; style?: React.CSSProperties }): JSX.Element {
  return (
    <div style={{ width: "100%", height, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--surface-soft)", color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 13, ...style }}>
      <style>{"@keyframes cl-map-spin{to{transform:rotate(360deg)}}"}</style>
      <Icon name="loader-2" size={18} color="var(--muted)" style={{ animation: "cl-map-spin 0.8s linear infinite" }} />
      <span>지도를 불러오는 중…</span>
    </div>
  );
}

export interface MapMarker {
  lat: number;
  lng: number;
  /** 마커 위에 표시할 라벨(카페 이름 등). */
  label?: string;
}

export interface KakaoMapProps {
  markers: MapMarker[];
  /** 확대 레벨(작을수록 더 확대). 마커가 2개 이상이면 모든 마커가 보이도록 자동 조정된다. */
  level?: number;
  height?: number;
  style?: React.CSSProperties;
}

/**
 * KakaoMap — 여러 좌표에 마커를 찍고, 각 마커 위에 라벨(카페 이름)을 표시한다.
 * 마커가 2개 이상이면 모두 보이도록 지도 범위를 자동으로 맞춘다.
 * 지도가 준비되기 전에는 로딩 표시를, SDK 로드 실패 시에는 실패 안내를 보여준다.
 */
export function KakaoMap({ markers, level = 4, height = 140, style = {} }: KakaoMapProps): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  // 마커 배열이 매 렌더마다 새 참조여도 실제 값이 같으면 재실행하지 않도록 키로 비교.
  const markersKey = markers.map((m) => `${m.lat},${m.lng},${m.label ?? ""}`).join("|");

  React.useEffect(() => {
    let cancelled = false;
    setReady(false);
    setFailed(false);
    if (markers.length === 0) return;
    loadKakaoSdk()
      .then(() => {
        if (cancelled || !ref.current) return;
        const kakao = (window as unknown as { kakao: any }).kakao;
        const positions = markers.map((m) => new kakao.maps.LatLng(m.lat, m.lng));
        const map = new kakao.maps.Map(ref.current, { center: positions[0], level });

        markers.forEach((m, i) => {
          new kakao.maps.Marker({ position: positions[i], map });
          if (m.label) {
            const overlay = new kakao.maps.CustomOverlay({
              position: positions[i],
              yAnchor: 2.3, // 마커 위쪽에 라벨 배치
              content:
                `<div style="padding:2px 7px;background:#fff;border:1px solid #e5e7eb;border-radius:7px;` +
                `font-family:sans-serif;font-size:11px;font-weight:600;color:#111;white-space:nowrap;` +
                `box-shadow:0 1px 3px rgba(0,0,0,.16);">${escapeHtml(m.label)}</div>`,
            });
            overlay.setMap(map);
          }
        });

        if (positions.length > 1) {
          const bounds = new kakao.maps.LatLngBounds();
          positions.forEach((p: unknown) => bounds.extend(p));
          map.setBounds(bounds);
        }

        setTimeout(() => map.relayout(), 0);
        if (!cancelled) setReady(true);
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersKey, level]);

  return (
    <div style={{ position: "relative", width: "100%", height, ...style }}>
      <div ref={ref} aria-label="약속 장소 지도" style={{ width: "100%", height }} />
      {!ready && !failed && (
        <div style={{ position: "absolute", inset: 0 }}><MapLoading height={height} /></div>
      )}
      {failed && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "var(--surface-soft)", color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 13 }}>
          <Icon name="map-pin-off" size={16} color="var(--muted)" />
          <span>지도를 표시할 수 없어요</span>
        </div>
      )}
    </div>
  );
}
