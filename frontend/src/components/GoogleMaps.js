import React, { useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

export default function GoogleMaps({ center, position, setMarkerPosition }) {
  // Google map apis configuration
  const { isLoaded } = useJsApiLoader({
    googleMapApiKey: "AIzaSyDZcW-cuRgaufD1hv5SwrCsRn4qT0RgTIY",
    libraries: ["places"], // this enables autocomplete feature
  });

  // finding route part

  // source and destination
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  // duration and distance
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");

  const [directionResponse, setDirectionResponse] = useState(null);

  const findRoute = async (e) => {
    if (source.trim().length > 0 && destination.trim().length > 0) {
      // this below comment is important if u remove it, it gives an error
      // 'google' is not loaded to avoid this below comment is used.('eslint-disable-next-line no-undef)
      // eslint-disable-next-line no-undef
      const directionService = new google.maps.DirectionsService();
      // we need direction service to find the routes and it returns a promise

      const result = await directionService.route({
        origin: source,
        destination: destination,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirectionResponse(result);
      // here result.routes is an array of all possible routes
      // here i am calculating distance of first route only and duration for that route only
      setDistance(result.routes[0].legs[0].distance.text);
      setDistance(result.routes[0].legs[0].duration.text);
      console.log("result is ", result);
      console.log("distatnce is ", distance);
      console.log("duration is ", duration);
    }
    return;
  };

  const clearRoutes = () => {
    setDuration("");
    setDistance("");
    setDirectionResponse(null);
    setSource("");
    setDestination("");
    console.log("source is ", source);
    console.log("destination is ", destination);
  };
  console.log("source is ", source);
  console.log("destination is ", destination);

  const [markerState, setMarkerState] = useState(center);
  console.log("state", markerState);
  if (!isLoaded) {
    console.log("loading");
    return <div>Google Maps is loading</div>;
  }
  if (isLoaded) {
    console.log("map has loaded");
  }
  //   console.log("marker state", markerState);
  return (
    <div className="space-y-3 ">
      <div className="flex py-3 px-3 space-x-3">
        {/* this autocomplete component takes only one element as input if u add more then it gives an error */}
        <div>
          <Autocomplete>
            <div>
              <input
                className="border-2 rounded-lg focus:outline-none focus:border-blue-600 focus:rounded px-4 "
                type="text"
                placeholder="source"
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                }}
              />
            </div>
          </Autocomplete>
        </div>
        <div>
          <Autocomplete>
            <div>
              <input
                className="border-2 rounded-lg focus:outline-none focus:border-blue-600 focus:rounded px-4 "
                type="text"
                value={destination}
                placeholder="destination"
                onChange={(e) => {
                  setDestination(e.target.value);
                }}
              />
            </div>
          </Autocomplete>
        </div>
        <div>
          <button
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={findRoute}
          >
            Route
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div>
          <button
          className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none "
            onClick={(e) => {
              console.log("clicked");
              setMarkerState(center);
            }}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white text-black rounded-md group-hover:bg-opacity-0">CENTER</span>
          </button>
        </div>
        <div>
          <button 
          className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 "

          onClick={clearRoutes}>
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white text-black rounded-md group-hover:bg-opacity-0">Clear Routes</span>
          </button>
        </div>
      </div>
      <div>
        <GoogleMap
          center={markerState}
          mapContainerStyle={{
            position: "absolute",
            minWidth:"60%",
            minHeight:"60%",
            overflow:'clip',
            
          }}
          zoom={10}
        >
          <Marker
            position={markerState}
            onDragEnd={(e) => {
              console.log("onchange", e.latLng.toString());
              setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              setMarkerState({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }}
            draggable={true}
          ></Marker>
        </GoogleMap>
      </div>
    </div>
  );
}
