import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMapEvents } from "react-leaflet/hooks";
import L from "leaflet";
import iconImagePath from "../icons/noun-wind-turbine-1086527.png";
import { useNavigate } from "react-router-dom";

const customIcon = L.icon({
  iconUrl: iconImagePath,
  iconSize: [95, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

export function Map({
  setCoordinates,
  coordinates,
  windFarms,
  setSelectedWindFarmId,
}) {
  const navigate = useNavigate();

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        const { latlng } = e;
        setCoordinates({ lat: latlng.lat, lng: latlng.lng });
      },
    });

    return null;
  };

  return (
    <div style={{ height: "100vh", width: "60vw" }}>
      <MapContainer
        style={{ height: "100vh", width: "60vw" }}
        center={[44.8125, 20.4612]}
        zoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {windFarms?.windFarms?.map(
          ({ location, name, currentProfit, overallProfit, _id }) => {
            return (
              <Marker
                key={_id}
                icon={customIcon}
                position={[location?.x, location?.y]}
                eventHandlers={{
                  click: () => {
                    setCoordinates({ lat: location?.x, lng: location?.y });
                    setSelectedWindFarmId(_id);
                  },
                }}
              >
                <Popup>
                  <ul>
                    <li>Name: {name}</li>
                    <li>
                      Coordinates: {location?.x} {location?.y}
                    </li>
                    <li>Current Profit: {currentProfit}</li>
                    <li>Total Profit: {overallProfit}</li>
                  </ul>
                  <button onClick={() => navigate(`/user/wind-farm/${_id}`)}>
                    Details
                  </button>
                </Popup>
              </Marker>
            );
          }
        )}
        <MapEvents />
      </MapContainer>
    </div>
  );
}
