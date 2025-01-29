// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '@tomtom-international/web-sdk-maps/dist/maps.css';
// import tt from '@tomtom-international/web-sdk-maps';
// import * as ttServices from '@tomtom-international/web-sdk-services';
// const RouteOptimization = () => {
//   const [map, setMap] = useState(null);
//   const [markers, setMarkers] = useState([]);
//   const [currentLocation, setCurrentLocation] = useState(null);

//   const waypoints = [

//     { lng: 77.2090, lat: 28.6139 }, // New Delhi
//     { lng: 77.0369, lat: 28.6465 }, // Near New Delhi
//     { lng: 80.2785, lat: 13.0827 }, // Chennai
//     { lng: 72.8777, lat: 19.0760 }, // Mumbai
//     { lng: 78.4867, lat: 17.3850 }, // Hyderabad
//     { lng: 88.3639, lat: 22.5726 }, // Kolkata
//     { lng: 76.7100, lat: 30.7333 }, // Chandigarh
//     { lng: 72.8544, lat: 18.9642 }, // Near Mumbai (Thane)
//     { lng: 77.4416, lat: 28.5777 }, // Gurgaon, Haryana
//     { lng: 79.1758, lat: 21.1466 }, // Nagpur
//     { lng: 85.8384, lat: 20.2961 }, // Bhubaneswar
//     { lng: 77.2090, lat: 28.6139 }  // New Delhi (same as first point)
//   ];


//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({ lat: latitude, lng: longitude });
//         },
//         (error) => {
//           console.error('Error getting current location:', error);
//         }
//       );
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
//   }, []);

//   // useEffect(() => {
//   //   const fetchWaypoints = async () => {
//   //     try {
//   //       const response = await axios.get("http://localhost:5000/api/waypoints");    
//   //       setWaypoints(response.data);
//   //     } catch (error) {
//   //       console.error("Error fetching waypoints:", error);
//   //     }
//   //   };

//   //   fetchWaypoints();
//   // }, []);

//   const API_KEY = "MYTGdoL8kXWFHiG6GVfZktKFyZSZ104h";

//   useEffect(() => {
//     // Load external scripts
//     const loadMapScripts = () => {
//       const script = document.createElement('script');
//       script.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.15.0/maps/maps-web.min.js';
//       script.async = true;
//       script.onload = () => {
//         const mapInstance = tt.map({
//           key: API_KEY,
//           container: 'map',
//           center: waypoints[0],
//           bearing: 0,
//           maxZoom: 21,
//           minZoom: 1,
//           pitch: 60,
//           zoom: 14,
//         });
//         setMap(mapInstance);
//       };
//       document.body.appendChild(script);
//     };

//     loadMapScripts();

//     return () => {
//       if (map) {
//         map.remove();
//       }
//     };
//   }, []);

//   const createMarker = (icon, position, color, popupText) => {
//     const markerElement = document.createElement('div');
//     markerElement.className = 'marker';

//     const markerContentElement = document.createElement('div');
//     markerContentElement.className = 'marker-content';
//     markerContentElement.style.backgroundColor = color;
//     markerElement.appendChild(markerContentElement);

//     const iconElement = document.createElement('div');
//     iconElement.className = 'marker-icon';
//     iconElement.style.backgroundImage = `url(${icon})`;
//     markerContentElement.appendChild(iconElement);

//     const popup = new tt.Popup({ offset: 50 }).setText(popupText);
//     const marker = new tt.Marker({ element: markerElement, anchor: 'bottom' })
//       .setLngLat(position)
//       .setPopup(popup)
//       .addTo(map);

//     setMarkers((prevMarkers) => [...prevMarkers, marker]);
//   };

//   useEffect(() => {
//     if (map) {
//       map.on('load', () => {
//         createMarker('van.jpeg', waypoints[0], 'orange', 'Origin');

//         waypoints.forEach((location, index) => {
//           if (index !== 0) {
//             const marker = new tt.Marker()
//               .setLngLat(location)
//               .addTo(map);
//             setMarkers((prevMarkers) => [...prevMarkers, marker]);
//           }
//         });

//         const URL = `https://api.tomtom.com/routing/waypointoptimization/1/best?key=${API_KEY}`;

//         axios.post(URL, {
//           waypoints: waypoints.map((element) => ({
//             point: {
//               latitude: element.lat,
//               longitude: element.lng,
//             },
//           })),
//         })
//           .then((response) => {
//             const solution = response.data.optimizedOrder;
//             const locations = solution.map((order, index) => {
//               const popup = new tt.Popup({ offset: 50 }).setText(`Destination #${index}`);
//               markers[order].setPopup(popup);
//               return waypoints[order];
//             });

//             createRoute({ key: API_KEY, locations });
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//       });
//     }
//   }, [map, markers]);

//   const createRoute = (options) => {
//     ttServices.services.calculateRoute(options).then((response) => {
//       const features = response.toGeoJson().features;
//       features.forEach((feature, index) => {
//         map.addLayer({
//           id: `route${index}`,
//           type: 'line',
//           source: {
//             type: 'geojson',
//             data: feature,
//           },
//           paint: {
//             'line-color': 'blue',
//             'line-opacity': 0.7,
//             'line-width': 10,
//             'line-dasharray': [1, 0, 1, 0],
//           },
//           layout: {
//             'line-cap': 'round',
//             'line-join': 'round',
//           },
//         });
//       });
//     });
//   };


//   useEffect(() => {
//     if (map && currentLocation) {
//       const arrowIcon = 'arrow-icon.png'; // Replace with an actual arrow icon URL
//       const markerElement = document.createElement('div');
//       markerElement.className = 'marker-arrow';
//       markerElement.style.transform = `rotate(${getBearing(currentLocation, waypoints[0])}deg)`;
//       markerElement.style.backgroundImage = `url(${arrowIcon})`;
//       markerElement.style.width = '30px';
//       markerElement.style.height = '30px';
//       markerElement.style.position = 'absolute';

//       const marker = new tt.Marker({ element: markerElement })
//         .setLngLat(currentLocation)
//         .addTo(map);
//     }
//   }, [currentLocation]);

//   return (
//     <div style={{ width: '100vw', height: '80vh' }} id="map" className="map"></div>
//   );
// };

// export default RouteOptimization;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';
import * as ttServices from '@tomtom-international/web-sdk-services';

const RouteOptimization = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const waypoints = [
    { lng: 72.8777, lat: 19.0760 },
    { lng: 72.8277, lat: 19.1760 },
    { lng: 72.7747, lat: 19.2760 },
    { lng: 72.9477, lat: 19.3760 },
    { lng: 72.8597, lat: 19.4760 },
    { lng: 72.8576, lat: 19.5760 },
    { lng: 72.8277, lat: 19.6760 },
    { lng: 72.8177, lat: 19.7760 },
    { lng: 72.9777, lat: 19.8760 },
  ];

  const API_KEY = 'MYTGdoL8kXWFHiG6GVfZktKFyZSZ104h';

  // Fetch current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const loadMapScripts = () => {
      const script = document.createElement('script');
      script.src =
        'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.15.0/maps/maps-web.min.js';
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
          zoom: 14
        });
        setMap(mapInstance);
      };
      document.body.appendChild(script);
    };

    loadMapScripts();

    return () => {
      if (map) {
        map.remove();
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
    if (map && currentLocation) {
      map.on('load', () => {
        // Create a marker for the user's current location
        createMarker(
          'current-location-icon.png', // Put an icon for the user's location here
          currentLocation,
          'blue',
          'Current Location'
        );

        // Create markers for the waypoints
        waypoints.forEach((location, index) => {
          if (index !== 0) {
            const marker = new tt.Marker().setLngLat(location).addTo(map);
            setMarkers((prevMarkers) => [...prevMarkers, marker]);
          }
        });

        // Get optimized route
        const URL = `https://api.tomtom.com/routing/waypointoptimization/1/best?key=${API_KEY}`;
        axios
          .post(URL, {
            waypoints: waypoints.map((element) => ({
              point: {
                latitude: element.lat,
                longitude: element.lng
              }
            }))
          })
          .then((response) => {
            const solution = response.data.optimizedOrder;
            const locations = solution.map((order) => waypoints[order]);
            createRoute({ key: API_KEY, locations });
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  }, [map, currentLocation]);

  const createRoute = (options) => {
    ttServices.services.calculateRoute(options).then((response) => {
      const features = response.toGeoJson().features;
      features.forEach((feature, index) => {
        map.addLayer({
          id: `route${index}`,
          type: 'line',
          source: {
            type: 'geojson',
            data: feature
          },
          paint: {
            'line-color': 'blue',
            'line-opacity': 0.7,
            'line-width': 10,
            'line-dasharray': [1, 0, 1, 0]
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          }
        });
      });
    });
  };

  // Add an arrow for direction (from current location to the first waypoint)
  useEffect(() => {
    if (map && currentLocation) {
      const arrowIcon = 'arrow-icon.png'; // Replace with an actual arrow icon URL
      const markerElement = document.createElement('div');
      markerElement.className = 'marker-arrow';
      markerElement.style.transform = `rotate(${getBearing(currentLocation, waypoints[0])}deg)`;
      markerElement.style.backgroundImage = `url(${arrowIcon})`;
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      markerElement.style.position = 'absolute';

      const marker = new tt.Marker({ element: markerElement })
        .setLngLat(currentLocation)
        .addTo(map);
    }
  }, [currentLocation]);

  // Define the getBearing function
  const getBearing = (from, to) => {
    const lat1 = from.lat * (Math.PI / 180); // Convert degrees to radians
    const lon1 = from.lng * (Math.PI / 180); // Convert degrees to radians
    const lat2 = to.lat * (Math.PI / 180); // Convert degrees to radians
    const lon2 = to.lng * (Math.PI / 180); // Convert degrees to radians

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const bearing = Math.atan2(y, x); // Calculate the bearing
    return (bearing * 180) / Math.PI; // Convert to degrees
  };

  return <div style={{ width: '100vw', height: '80vh' }} id="map" className="map"></div>;
};

export default RouteOptimization;
