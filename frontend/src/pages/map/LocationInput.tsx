
import styled from "styled-components";
import React, { ChangeEvent } from "react";
import { useEffect, useState, useContext, useRef } from "react";
import { MapContext, MapContextType } from "./MapPage";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import MapboxGeocoding, { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { DefaultLocation } from "../../constant";
import axios from "axios";
import MyLocationIcon from '@mui/icons-material/MyLocation';

const Container = styled.div`
    position: absolute;
    width: 40%;
    left: 5%;
    top: 5%;
    background-color: white;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;

    @media (max-width: 420px) {
        width: 90%;
    }
`;

const Heading = styled.h1`
    font-size: 40px;
    align-self: flex-start;
    margin: 10px 0px 10px 10px;
`;

const MyLocationInputBlock = styled.div`
    width: 95%;
    height: 30px;
    border: none;
    font-size: 16px;
    margin: 10px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const MyLocationInput = styled.input`
    width: 100%;
    height: 30px;
    font-size: 16px;
    border: none;
    background-color: whitesmoke;
    margin: 5px 0px;
    padding: 20px 2.5rem 20px 10px;
    display: inline;
`;

const Input = styled.input`
    width: 95%;
    height: 30px;
    border: none;
    background-color: whitesmoke;
    font-size: 16px;
    margin: 5px 0;
    padding: 20px 10px;
`;

const AutoCompleteUl = styled.ul`
    list-style: none;
    padding-left: 10px;
    padding-bottom: 15px;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #fff;
    margin: 0;
`;

const AutoCompleteLi = styled.li`
    display: block;
    font-size: 14px;
    margin: 3px 0;
    padding: 5px 5px 5px 20px;
    height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    :hover {
        background-color: #eee;
        cursor: pointer;
    }
`;

const LocationIcon = styled.div`
    width: 24px;
    height: 24px;
    position: absolute;
    right: 2.5rem;

    :hover {
        background-color: #eee;
        cursor: pointer;
    }
`

async function getDirections(
        map: mapboxgl.Map,
        startPoint: GeocodeFeature,
        endPoint: GeocodeFeature,
        setDistance: React.Dispatch<React.SetStateAction<number>> | null
    ) {
    const originalLayer = map.getLayer("route");
    if (originalLayer) {
        map.removeLayer("route");
        map.removeSource("route");
    }

    const service = "directions";
    const profile = "driving-traffic";
    const geometries = "geojson";
    const [startLng, startLat] = startPoint.center;
    const [endLng, endLat] = endPoint.center;

    const targetAPIUrl = `https://api.mapbox.com/${service}/v5/mapbox/${profile}/${startLng},${startLat};${endLng},${endLat}?geometries=${geometries}&access_token=${mapboxgl.accessToken}`
    const response = await axios.get(targetAPIUrl);
    const { routes } = response.data;
    if (!routes) return;

    if (setDistance) setDistance(routes[0].distance | 0);

    const routeCoordinates = routes[0].geometry.coordinates;
    const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString, GeoJSON.GeoJsonProperties> = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: routeCoordinates,
        },
        properties: {},
    };

    // 創建地圖上的路線圖層
    map.addSource("route", {
        type: "geojson",
        data: routeGeoJSON,
    });

    map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
            "line-join": "round",
            "line-cap": "round",
        },
        paint: {
            "line-color": "#888",
            "line-width": 6,
        },
    });

    // 計算路線的範圍
    const bounds = new mapboxgl.LngLatBounds(
        routeCoordinates[0],
        routeCoordinates[0],
    )

    for (const coord of routeCoordinates) {
        bounds.extend(coord);
    }

    map.fitBounds(bounds, {
        padding: 40
    });
}

const LocationInput: React.FC = () => {

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const mapContext: MapContextType | null = useContext(MapContext);
    const { setStartPoint, setEndPoint, map, setDistance } = mapContext;

    const [startPointSearchText, setStartPointSearchText] = useState('');
    const [startPointSuggestions, setStartPointSuggestions] = useState<GeocodeFeature[]>([]);
    const startPointMarkerRef = useRef<mapboxgl.Marker | null>(null);

    const [endPointSearchText, setEndPointSearchText] = useState('');
    const [endPointSuggestions, setEndPointSuggestions] = useState<GeocodeFeature[]>([]);
    const endPointMarkerRef = useRef<mapboxgl.Marker | null>(null);

    const [isFocusOnStartPoint, setIsFocusOnStartPoint] = useState<boolean>(true);
    const [selectedStartPoint, setSelectedStartPoint] = useState<GeocodeFeature | null>(null);
    const [selectedEndPoint, setSelectedEndPoint] = useState<GeocodeFeature | null>(null);
    const [isSelected, setIsSelected] = useState<boolean>(false);

    useEffect(() => {
        const options = {
            enableHighAccuracy: false,
            maximumAge: Infinity,
        };

        function getLocationSuccess(pos: GeolocationPosition) {
            const crd = pos.coords;
            if (map) {
                const center: LngLatLike = [crd.longitude, crd.latitude];
                map.flyTo({center})
            }
        }

        function getLOcationError(err: GeolocationPositionError) {
            console.error(err);
        }

        navigator.geolocation.getCurrentPosition(getLocationSuccess, getLOcationError, options)
    }, [map])

    useEffect(() => {
        async function searchPlaces() {

            const geocodingClient = MapboxGeocoding({
                accessToken: mapboxgl.accessToken,
            });

            if (isSelected) {
                setIsSelected(false);
                return;
            }

            if (isFocusOnStartPoint) {
                if (startPointSearchText === '' || startPointSearchText.length > 20) return;

            } else {
                if (endPointSearchText === '' || endPointSearchText.length > 20) return;
            }
            
            const response = await geocodingClient.forwardGeocode({
                query: isFocusOnStartPoint ? startPointSearchText : endPointSearchText,
                countries: ['TW'],
                autocomplete: true,
                proximity: [121.5654, 25.033],
            }).send();

            const features = response?.body?.features;
            const suggestions = features?.map((feature) => feature);
            
            if (isFocusOnStartPoint) {
                setStartPointSuggestions(suggestions);
            } else {
                setEndPointSuggestions(suggestions);
            }
        }

        searchPlaces()

    }, [isFocusOnStartPoint, startPointSearchText, endPointSearchText, isSelected])

    // start point marker
    useEffect(() => {
        if (map && selectedStartPoint) {
            const { center } = selectedStartPoint;
            const [ lng, lat ] = center;
            console.log('center: ', center);
            map.flyTo({center: [lng, lat], zoom: 14});

            if (startPointMarkerRef?.current) {
                startPointMarkerRef.current.remove();
            }
            const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
            startPointMarkerRef.current = marker;
        }

    }, [selectedStartPoint, map])

    // end point marker
    useEffect(() => {
        if (map && selectedEndPoint) {
            const { center } = selectedEndPoint;
            const [ lng, lat ] = center;
            map.flyTo({center: [lng, lat], zoom: 14});

            if (endPointMarkerRef?.current) {
                endPointMarkerRef.current.remove();
            }
            const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
            endPointMarkerRef.current = marker;
        }

    }, [selectedEndPoint, map])

    // routes
    useEffect(() => {
        if (map && selectedStartPoint && selectedEndPoint) {
            getDirections(map, selectedStartPoint, selectedEndPoint, setDistance);
        }

    }, [selectedStartPoint, selectedEndPoint, map, setDistance])

    async function handleStartPoint(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setIsFocusOnStartPoint(true);
        setStartPointSearchText(e.target.value);
        if (setStartPoint) setStartPoint(DefaultLocation);
    }
    
    async function handleEndPoint(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setIsFocusOnStartPoint(false);
        setEndPointSearchText(e.target.value);
        if (setEndPoint) setEndPoint(DefaultLocation);
    }

    function handleSelection(idx: number) {
        setIsSelected(true);
        if (isFocusOnStartPoint) {
            setSelectedStartPoint(startPointSuggestions[idx]);
            setStartPointSearchText(startPointSuggestions[idx].place_name)
            setStartPointSuggestions([]);

        } else {
            setSelectedEndPoint(endPointSuggestions[idx]);
            setEndPointSearchText(endPointSuggestions[idx].place_name)
            setEndPointSuggestions([]);

        }
    }

    function handleMyLocation(e: React.MouseEvent<HTMLSpanElement>) {
        e.preventDefault();

        const options = {
            enableHighAccuracy: false,
            maximumAge: Infinity
        }

        async function getLocationSuccess(pos: GeolocationPosition) {
            const crd = pos.coords;
            const center: LngLatLike = [crd.longitude, crd.latitude];
            if (map) {
                map.flyTo({center, zoom: 14});
                
                const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${crd.longitude},${crd.latitude}.json?access_token=${mapboxgl.accessToken}&limit=1`)
                const { features } = res.data;
                if ( features ) {
                    if (setStartPoint) setStartPoint(center);
                    console.log(features)
                    setSelectedStartPoint(features[0]);
                    setStartPointSearchText(features[0].place_name);
                    setStartPointSuggestions([]);
                }
            }
        }

        function getLOcationError(err: GeolocationPositionError) {
            console.error('mylocation error: ', err);
        }

        navigator.geolocation.getCurrentPosition(getLocationSuccess, getLOcationError, options)
    }

    return (
        <Container>
            <Heading>立即預約搭乘</Heading>
            <MyLocationInputBlock>
                <MyLocationInput type="text" placeholder="輸入上車地點" value={startPointSearchText} onChange={handleStartPoint} onFocus={handleStartPoint} />
                <LocationIcon onClick={handleMyLocation}>
                    <MyLocationIcon />
                </LocationIcon>
            </MyLocationInputBlock>
            <Input type="text" placeholder="輸入目的地" value={endPointSearchText} onChange={handleEndPoint} onFocus={handleEndPoint} />
            {isFocusOnStartPoint && startPointSuggestions?.length > 0 && (
                <AutoCompleteUl>
                {startPointSuggestions?.map((suggestion, idx) => (
                    <AutoCompleteLi
                        key={suggestion.place_name}
                        onClick={() => handleSelection(idx)}
                    >{suggestion.place_name}</AutoCompleteLi>
                ))}
                </AutoCompleteUl>
            )}
            {!isFocusOnStartPoint && endPointSuggestions?.length > 0 && (
                <AutoCompleteUl>
                {endPointSuggestions?.map((suggestion, idx) => (
                    <AutoCompleteLi
                        key={suggestion.place_name}
                        onClick={() => handleSelection(idx)}
                    >{suggestion.place_name}</AutoCompleteLi>
                ))}
                </AutoCompleteUl>
            )}
        </Container>
    )
}

export default LocationInput;