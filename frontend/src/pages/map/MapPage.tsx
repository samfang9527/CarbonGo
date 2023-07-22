
import { useState, useEffect } from "react";
import { createContext } from "react";
import styled from "styled-components";
import LocationInput from "./LocationInput";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import { DefaultLocation } from "../../constant";
import InfoCard from "./InfoCard";
// import Navigation from "../../global/Navigation";

const Container = styled.div`
    width: 100%;
    height: 100vh;
`;

const MapContainer = styled.div`
    width: 100%;
    height: 100%;
`;

export interface MapContextType {
    startPoint: LngLatLike | null; // 經緯度的陣列
    endPoint: LngLatLike | null; // 經緯度的陣列
    setStartPoint: React.Dispatch<React.SetStateAction<LngLatLike | null>> | null; // 經緯度的陣列的狀態更新函式
    setEndPoint: React.Dispatch<React.SetStateAction<LngLatLike | null>> | null; // 經緯度的陣列的狀態更新函式
    map: mapboxgl.Map | null;
    distance: number;
    setDistance: React.Dispatch<React.SetStateAction<number>> | null;
}

export const MapContext = createContext<MapContextType>({
    startPoint: null,
    endPoint: null,
    setStartPoint: null,
    setEndPoint: null,
    map: null,
    distance: 0,
    setDistance: null,
});


const MapPage: React.FC = () => {

    const [startPoint, setStartPoint] = useState<LngLatLike | null>(null);
    const [endPoint, setEndPoint] = useState<LngLatLike | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [distance, setDistance] = useState<number>(0);

    const mapBoxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    useEffect(() => {
        const initializeMap = () => {
            const mapInstance = new mapboxgl.Map({
                container: 'map-container',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: DefaultLocation,
                zoom: 14,
            });
    
            setMap(mapInstance);
        };
    
        if (mapBoxAccessToken && !map) {
            initializeMap();
        }
        
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [mapBoxAccessToken, map]);

    return (
        <MapContext.Provider value={{
            startPoint,
            endPoint,
            setStartPoint,
            setEndPoint,
            map,
            distance,
            setDistance,
        }}>
            <Container>
                <MapContainer id="map-container" />
                <LocationInput />
                <InfoCard />
                {/* <Navigation /> */}
            </Container>
        </MapContext.Provider>
    )
}

export default MapPage;
