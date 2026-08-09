export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  zip: string;
  lat: number;
  lng: number;
}

export const STORES: StoreLocation[] = [
  {
    id: 'edimundo-audran',
    name: 'Loja 1 - Rua Edimundo Audran, 18',
    address: 'Rua Edimundo Audran, 18 - Cidade Tiradentes, São Paulo - SP',
    zip: '08473-532',
    lat: -23.58348,
    lng: -46.39188,
  },
  {
    id: 'salvador-vigano',
    name: 'Loja 2 - Rua Salvador Vigano, 175',
    address: 'Rua Salvador Vigano, 175 - Cidade Tiradentes, São Paulo - SP',
    zip: '08473-605',
    lat: -23.58740,
    lng: -46.39200,
  },
];

export interface DeliveryCalculationResult {
  distanceKm: number;
  fee: number;
  closestStore: StoreLocation;
  formattedFee: string;
  estimatedTime: string;
  deliveryType: string;
}

/**
 * Calculates straight-line distance in kilometers between two lat/lng points using Haversine formula.
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Gets approximate lat/lng coordinates for a Brazilian CEP.
 * Uses BrasilAPI CEP v2 endpoint with fallback to OpenStreetMap Nominatim or CEP prefix estimation.
 */
export async function getCoordinatesFromCep(cep: string): Promise<{ lat: number; lng: number } | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  // 1. Try BrasilAPI v2
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
    if (res.ok) {
      const data = await res.json();
      if (data.location && data.location.coordinates) {
        const lat = parseFloat(data.location.coordinates.latitude);
        const lng = parseFloat(data.location.coordinates.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          return { lat, lng };
        }
      }
    }
  } catch (err) {
    console.warn('BrasilAPI CEP lookup failed, trying fallback...', err);
  }

  // 2. Try OpenStreetMap Nominatim postalcode search
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${cleanCep}&country=Brazil&format=json`
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
    }
  } catch (err) {
    console.warn('Nominatim CEP lookup failed:', err);
  }

  // 3. Deterministic estimation based on SP CEP prefix relative to Cidade Tiradentes (08473)
  // Store reference: Cidade Tiradentes CEP ~08473 (lat: -23.585, lng: -46.392)
  const cepNum = parseInt(cleanCep, 10);
  if (!isNaN(cepNum)) {
    // Offset calculation for SP region CEPs (01000 - 09999)
    // CEP 08473 is ~0.0km away.
    const cepDiff = Math.abs(cepNum - 8473500) / 1000;
    // Approximating ~0.25 km per CEP unit difference within Eastern SP, minimum 1.0 km
    const estimatedDistanceKm = Math.max(1, Math.min(45, cepDiff * 0.25 + 1.2));
    
    // Reverse engineer synthetic coords around Cidade Tiradentes based on estimated distance
    const deltaLat = (estimatedDistanceKm / 111); // ~111km per degree lat
    return {
      lat: STORES[0].lat + deltaLat,
      lng: STORES[0].lng + deltaLat * 0.5,
    };
  }

  return null;
}

/**
 * Calculates delivery fee based on distance to the closest store location.
 * Fee rate: R$ 1.00 per kilometer (minimum R$ 1.00 for active delivery).
 */
export async function calculateDeliveryFee(
  cep: string,
  isStorePickup: boolean = false
): Promise<DeliveryCalculationResult> {
  if (isStorePickup) {
    return {
      distanceKm: 0,
      fee: 0,
      closestStore: STORES[0],
      formattedFee: 'Grátis (Retirada)',
      estimatedTime: 'Pronto em 1 hora',
      deliveryType: 'Retirada na Loja',
    };
  }

  const coords = await getCoordinatesFromCep(cep);
  
  if (!coords) {
    // Default fallback if CEP is invalid or unresolvable
    return {
      distanceKm: 3.5,
      fee: 3.50,
      closestStore: STORES[0],
      formattedFee: 'R$ 3,50',
      estimatedTime: 'Hoje (em até 3h)',
      deliveryType: 'Entrega Expressa por Distância',
    };
  }

  // Find closest store
  let minDistance = Infinity;
  let closestStore = STORES[0];

  for (const store of STORES) {
    const dist = haversineDistance(coords.lat, coords.lng, store.lat, store.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestStore = store;
    }
  }

  // Apply routing factor (driving distance is ~1.25x straight-line distance)
  const drivingDistance = minDistance * 1.25;
  const roundedKm = Math.round(drivingDistance * 10) / 10;
  
  // Fee = R$ 1.00 per km (minimum R$ 1.00)
  const calculatedFee = Math.max(1, Math.round(roundedKm * 100) / 100);

  const formattedFee = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(calculatedFee);

  let estimatedTime = 'Hoje (em até 3h)';
  if (roundedKm > 15) {
    estimatedTime = 'Em até 24h úteis';
  } else if (roundedKm > 8) {
    estimatedTime = 'Hoje (em até 5h)';
  }

  return {
    distanceKm: roundedKm,
    fee: calculatedFee,
    closestStore,
    formattedFee,
    estimatedTime,
    deliveryType: `Entrega (${roundedKm} km da ${closestStore.name})`,
  };
}
