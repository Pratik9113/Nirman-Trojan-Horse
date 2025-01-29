import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';
import * as ttServices from '@tomtom-international/web-sdk-services';
const RouteOptimization = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const waypoints = [

    { lng: -58.4291585182098, lat: -34.621069575185025 },
    { lng: -58.4291585182098, lat: -34.621069575185025 },
    { lng: -58.39616319351775, lat: -34.64432584874411 },
    { lng: -58.3820916579873, lat: -34.649116030727164 },
    { lng: -58.37032494293145, lat: -34.644525445185074 },
    { lng: -58.367534897092995, lat: -34.63224937024358 },
    { lng: -58.37481327753967, lat: -34.61388176866088 },
    { lng: -58.379058999466935, lat: -34.605295517356446 },
    { lng: -58.41787702851779, lat: -34.61807473144602 },
    { lng: -58.427338923098105, lat: -34.64043362210506 },
    { lng: -58.40368418664637, lat: -34.63474465455527 },
    { lng: -58.4291585182098, lat: -34.621069575185025 }
  ];


  // useEffect(() => {
  //   const fetchWaypoints = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/api/waypoints"); // Adjust URL if needed
  //       setWaypoints(response.data);
  //     } catch (error) {
  //       console.error("Error fetching waypoints:", error);
  //     }
  //   };

  //   fetchWaypoints();
  // }, []);

  const API_KEY = "MYTGdoL8kXWFHiG6GVfZktKFyZSZ104h";

  useEffect(() => {
    // Load external scripts
    const loadMapScripts = () => {
      const script = document.createElement('script');
      script.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.15.0/maps/maps-web.min.js';
      script.async = true;
      script.onload = () => {
        const mapInstance = tt.map({
          key: API_KEY,
          container: 'map',
          center: waypoints[0],
          bearing: 0,
          maxZoom: 21,
          minZoom: 1,
          pitch: 60,
          zoom: 14,
        });
        setMap(mapInstance);
      };
      document.body.appendChild(script);
    };

    loadMapScripts();

    return () => {
      if (map) {
        map.remove(); // Cleanup map instance on unmount
      }
    };
  }, []);

  const createMarker = (icon, position, color, popupText) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'marker';

    const markerContentElement = document.createElement('div');
    markerContentElement.className = 'marker-content';
    markerContentElement.style.backgroundColor = color;
    markerElement.appendChild(markerContentElement);

    const iconElement = document.createElement('div');
    iconElement.className = 'marker-icon';
    iconElement.style.backgroundImage = `url(${icon})`;
    markerContentElement.appendChild(iconElement);

    const popup = new tt.Popup({ offset: 50 }).setText(popupText);
    const marker = new tt.Marker({ element: markerElement, anchor: 'bottom' })
      .setLngLat(position)
      .setPopup(popup)
      .addTo(map);

    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  useEffect(() => {
    if (map) {
      map.on('load', () => {
        createMarker('van.jpeg', waypoints[0], 'orange', 'Origin');

        waypoints.forEach((location, index) => {
          if (index !== 0) {
            const marker = new tt.Marker()
              .setLngLat(location)
              .addTo(map);
            setMarkers((prevMarkers) => [...prevMarkers, marker]);
          }
        });

        const URL = `https://api.tomtom.com/routing/waypointoptimization/1/best?key=${API_KEY}`;

        axios.post(URL, {
          waypoints: waypoints.map((element) => ({
            point: {
              latitude: element.lat,
              longitude: element.lng,
            },
          })),
        })
          .then((response) => {
            const solution = response.data.optimizedOrder;
            const locations = solution.map((order, index) => {
              const popup = new tt.Popup({ offset: 50 }).setText(`Destination #${index}`);
              markers[order].setPopup(popup);
              return waypoints[order];
            });

            createRoute({ key: API_KEY, locations });
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  }, [map, markers]);

  const createRoute = (options) => {
    ttServices.services.calculateRoute(options).then((response) => {
      const features = response.toGeoJson().features;
      features.forEach((feature, index) => {
        map.addLayer({
          id: `route${index}`,
          type: 'line',
          source: {
            type: 'geojson',
            data: feature,
          },
          paint: {
            'line-color': 'blue',
            'line-opacity': 0.7,
            'line-width': 10,
            'line-dasharray': [1, 0, 1, 0],
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
        });
      });
    });
  };

  return (
    <div style={{ width: '100vw', height: '80vh' }} id="map" className="map"></div>
  );
};

export default RouteOptimization;
