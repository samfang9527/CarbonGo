
import styled from "styled-components";
import { useEffect } from "react";
import mapboxgl from 'mapbox-gl';

const MapContainer = styled.div`
    width: 100%;
    height: 100vh;
`;

const Map: React.FC = () => {

    const mapBoxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    useEffect(() => {
        // 建立地圖容器n
        mapboxgl.accessToken = mapBoxAccessToken;
        const map = new mapboxgl.Map({
            container: 'map-container', // 地圖容器的 ID 或參考
            style: 'mapbox://styles/mapbox/streets-v11', // 地圖樣式 URL
            center: [121.5654, 25.0330], // 地圖中心點的經緯度座標
            zoom: 10, // 地圖縮放級別
        });
    
        // 清除地圖資源
        return () => map.remove();
    }, [mapBoxAccessToken]);
    
    return <MapContainer id="map-container" />;
}

export default Map;

