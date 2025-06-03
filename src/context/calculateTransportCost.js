import { getDistance } from 'geolib';
import cities from '../data/cities.json';

const barcelonaTransportCost = 100;
const costPerMeter = 0.01;

export default function calculateTransportCost(needsPickup, destinationCity) {
  let transportCost = null;
  if (needsPickup && destinationCity !== '') {
    if (destinationCity === 'Barcelona') {
      transportCost = barcelonaTransportCost;
    } else {
      const clientCity = cities.find(city => city.municipio === destinationCity);
      const distanceMeters = getDistance(
        { latitude: 41.384, longitude: 2.176 },
        { latitude: clientCity.lat, longitude: clientCity.lon }
      );
      transportCost = Math.round((barcelonaTransportCost * 0.9) + (distanceMeters * costPerMeter));
    }
  }
  return transportCost;
}
