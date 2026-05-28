import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { Listing } from "@/lib/types";
import { formatUsd } from "@/lib/utils";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export const ListingMap = ({ listings }: { listings: Listing[] }) => {
  const first = listings[0];
  const center: [number, number] = first ? [Number(first.latitude), Number(first.longitude)] : [41.3111, 69.2797];

  return (
    <MapContainer center={center} zoom={first ? 11 : 6} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {listings.map((listing) => (
        <Marker key={listing.id} position={[Number(listing.latitude), Number(listing.longitude)]} icon={icon}>
          <Popup>
            <strong>{listing.brand} {listing.model}</strong>
            <br />
            {formatUsd(listing.priceUsd)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
