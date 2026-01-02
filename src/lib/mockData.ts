// export type Money = number; // NGN as integer for precision

// export type CommonFilters = {
//   price_min?: Money;
//   price_max?: Money;
//   sort: 'recommended' | 'newest' | 'priceAsc' | 'priceDesc' | 'sqft' | 'lot' | 'pricePerSqft';
//   layout: 'split' | 'map' | 'grid' | 'list';
// };

// export type HouseFilters = CommonFilters & {
//   beds?: { min?: number; max?: number } | 'any' | 'studio';
//   baths?: 1 | 1.5 | 2 | 2.5 | 3 | 4 | 0; // 0 means Any
//   home_types?: Array<'apartment' | 'duplex' | 'bungalow' | 'terrace' | 'detached' | 'semiDetached' | 'mansion' | 'shortlet'>;
//   title_docs?: string[];
//   stage?: string[];
//   utilities?: { electricity?: boolean; water?: boolean; road?: 'paved' | 'unpaved'; drainage?: boolean };
//   proximity?: { categories: string[]; distanceKm: number };
//   zoning?: Array<'residential' | 'commercial' | 'mixed' | 'agricultural' | 'industrial'>;
// };

// export type LandFilters = CommonFilters & {
//   landTypes?: Array<'residential' | 'commercial' | 'agricultural' | 'industrial' | 'mixed' | 'allocation' | 'estatePlot' | 'waterfront' | 'cornerPiece'>;
//   title_docs?: string[];
//   stage?: string[];
//   utilities?: { electricity?: boolean; water?: boolean; road?: 'paved' | 'unpaved'; drainage?: boolean };
//   proximity?: { categories: string[]; distanceKm: number };
//   zoning?: Array<'residential' | 'commercial' | 'mixed' | 'agricultural' | 'industrial'>;
// };

// export interface House {
//   id: string;
//   title: string;
//   location: { state: string; city: string; area: string };
//   price: Money;
//   beds: number;
//   baths: number;
//   sqft: number;
//   pricePerSqft: number;
//   home_type: 'apartment' | 'duplex' | 'bungalow' | 'terrace' | 'detached' | 'semiDetached' | 'mansion' | 'shortlet';
//   images: string[];
//   title_docs: string[];
//   stage: string;
//   utilities: { electricity: boolean; water: boolean; road: 'paved' | 'unpaved'; drainage: boolean };
//   proximity: string[];
//   zoning: 'residential' | 'commercial' | 'mixed';
//   created_at: string;
// }

// export interface Land {
//   id: string;
//   title: string;
//   location: { state: string; city: string; area: string };
//   price: Money;
//   size: number; // sqm
//   pricePerSqft: number;
//   landType: 'residential' | 'commercial' | 'agricultural' | 'industrial' | 'mixed' | 'allocation' | 'estatePlot' | 'waterfront' | 'cornerPiece';
//   images: string[];
//   title_docs: string[];
//   stage: string;
//   utilities: { electricity: boolean; water: boolean; road: 'paved' | 'unpaved'; drainage: boolean };
//   proximity: string[];
//   zoning: 'residential' | 'commercial' | 'mixed' | 'agricultural' | 'industrial';
//   created_at: string;
// }

// // Mock Houses Data
// export const mockHouses: House[] = [
//   {
//     id: 'h1',
//     title: 'Luxury 4-Bedroom Duplex in Lekki Phase 1',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Lekki Phase 1' },
//     price: 85000000,
//     beds: 4,
//     baths: 3,
//     sqft: 2500,
//     pricePerSqft: 34000,
//     home_type: 'duplex',
//     images: ['/placeholder.svg'],
//     title_docs: ['C of O', 'Survey Plan'],
//     stage: 'Completed',
//     utilities: { electricity: true, water: true, road: 'paved', drainage: true },
//     proximity: ['Schools', 'Hospitals', 'Markets'],
//     zoning: 'residential',
//     created_at: '2024-01-15'
//   },
//   {
//     id: 'h2',
//     title: 'Modern 3-Bedroom Apartment in Victoria Island',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Victoria Island' },
//     price: 120000000,
//     beds: 3,
//     baths: 2,
//     sqft: 1800,
//     pricePerSqft: 66667,
//     home_type: 'apartment',
//     images: ['/placeholder.svg'],
//     title_docs: ['C of O', 'Governor\'s Consent'],
//     stage: 'Completed',
//     utilities: { electricity: true, water: true, road: 'paved', drainage: true },
//     proximity: ['Schools', 'Transit', 'Markets'],
//     zoning: 'commercial',
//     created_at: '2024-01-20'
//   },
//   {
//     id: 'h3',
//     title: 'Spacious 5-Bedroom Detached House in Ikoyi',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Ikoyi' },
//     price: 180000000,
//     beds: 5,
//     baths: 4,
//     sqft: 3200,
//     pricePerSqft: 56250,
//     home_type: 'detached',
//     images: ['/placeholder.svg'],
//     title_docs: ['C of O', 'Deed of Assignment'],
//     stage: 'Completed',
//     utilities: { electricity: true, water: true, road: 'paved', drainage: true },
//     proximity: ['Schools', 'Hospitals'],
//     zoning: 'residential',
//     created_at: '2024-01-10'
//   },
//   {
//     id: 'h4',
//     title: 'Cozy 2-Bedroom Bungalow in Ikeja',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Ikeja' },
//     price: 45000000,
//     beds: 2,
//     baths: 2,
//     sqft: 1200,
//     pricePerSqft: 37500,
//     home_type: 'bungalow',
//     images: ['/placeholder.svg'],
//     title_docs: ['Survey Plan'],
//     stage: 'Completed',
//     utilities: { electricity: true, water: false, road: 'paved', drainage: true },
//     proximity: ['Markets', 'Transit'],
//     zoning: 'residential',
//     created_at: '2024-01-25'
//   },
//   {
//     id: 'h5',
//     title: 'Executive 4-Bedroom Terrace in Magodo',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Magodo' },
//     price: 65000000,
//     beds: 4,
//     baths: 3,
//     sqft: 2200,
//     pricePerSqft: 29545,
//     home_type: 'terrace',
//     images: ['/placeholder.svg'],
//     title_docs: ['C of O', 'Governor\'s Consent'],
//     stage: 'Completed',
//     utilities: { electricity: true, water: true, road: 'paved', drainage: true },
//     proximity: ['Schools', 'Markets'],
//     zoning: 'residential',
//     created_at: '2024-01-18'
//   }
// ];

// // Mock Lands Data
// export const mockLands: Land[] = [
//   {
//     id: 'l1',
//     title: '1000sqm Residential Land in Banana Island',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Banana Island' },
//     price: 150000000,
//     size: 1000,
//     pricePerSqft: 150000,
//     landType: 'residential',
//     images: ['/placeholder.svg'],
//     title_docs: ['C of O', 'Survey Plan'],
//     stage: 'Cleared',
//     utilities: { electricity: true, water: true, road: 'paved', drainage: true },
//     proximity: ['Schools', 'Hospitals', 'Markets'],
//     zoning: 'residential',
//     created_at: '2024-01-12'
//   },
//   {
//     id: 'l2',
//     title: '500sqm Commercial Plot in Victoria Island',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Victoria Island' },
//     price: 200000000,
//     size: 500,
//     pricePerSqft: 400000,
//     landType: 'commercial',
//     images: ['/placeholder.svg'],
//     title_docs: ['C of O', 'Governor\'s Consent'],
//     stage: 'Fenced',
//     utilities: { electricity: true, water: true, road: 'paved', drainage: true },
//     proximity: ['Transit', 'Markets'],
//     zoning: 'commercial',
//     created_at: '2024-01-22'
//   },
//   {
//     id: 'l3',
//     title: '2000sqm Agricultural Land in Epe',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Epe' },
//     price: 20000000,
//     size: 2000,
//     pricePerSqft: 10000,
//     landType: 'agricultural',
//     images: ['/placeholder.svg'],
//     title_docs: ['Survey Plan', 'Excision'],
//     stage: 'Bare land',
//     utilities: { electricity: false, water: false, road: 'unpaved', drainage: false },
//     proximity: [],
//     zoning: 'agricultural',
//     created_at: '2024-01-08'
//   },
//   {
//     id: 'l4',
//     title: '800sqm Estate Plot in Ajah',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Ajah' },
//     price: 35000000,
//     size: 800,
//     pricePerSqft: 43750,
//     landType: 'estatePlot',
//     images: ['/placeholder.svg'],
//     title_docs: ['C of O', 'Deed of Assignment'],
//     stage: 'Gated estate',
//     utilities: { electricity: true, water: true, road: 'paved', drainage: true },
//     proximity: ['Schools', 'Markets'],
//     zoning: 'residential',
//     created_at: '2024-01-16'
//   },
//   {
//     id: 'l5',
//     title: '1500sqm Waterfront Land in Ikoyi',
//     location: { state: 'Lagos', city: 'Lagos', area: 'Ikoyi' },
//     price: 300000000,
//     size: 1500,
//     pricePerSqft: 200000,
//     landType: 'waterfront',
//     images: ['/placeholder.svg'],
//     title_docs: ['C of O', 'Governor\'s Consent'],
//     stage: 'Cleared',
//     utilities: { electricity: true, water: true, road: 'paved', drainage: true },
//     proximity: ['Schools', 'Hospitals'],
//     zoning: 'residential',
//     created_at: '2024-01-05'
//   }
// ];

// // Price distribution for histogram (mock data)
// export const priceDistribution = [
//   { range: '0-20M', count: 15 },
//   { range: '20-40M', count: 25 },
//   { range: '40-60M', count: 35 },
//   { range: '60-80M', count: 28 },
//   { range: '80-100M', count: 20 },
//   { range: '100M+', count: 12 }
// ];

// export function getMockResults(category: 'houses' | 'lands', filters: Partial<HouseFilters | LandFilters>) {
//   const data = category === 'houses' ? mockHouses : mockLands;
//   let results = [...data];

//   // Apply filters
//   if (filters.price_min) {
//     results = results.filter(item => item.price >= filters.price_min!);
//   }
//   if (filters.price_max) {
//     results = results.filter(item => item.price <= filters.price_max!);
//   }

//   // Category-specific filters
//   if (category === 'houses') {
//     const houseFilters = filters as Partial<HouseFilters>;
//     const houseResults = results as House[];

//     if (houseFilters.beds && houseFilters.beds !== 'any') {
//       if (houseFilters.beds === 'studio') {
//         results = houseResults.filter(house => house.beds === 0);
//       } else if (typeof houseFilters.beds === 'object') {
//         const { min, max } = houseFilters.beds;
//         results = houseResults.filter(house => {
//           if (min && house.beds < min) return false;
//           if (max && house.beds > max) return false;
//           return true;
//         });
//       }
//     }

//     if (houseFilters.baths && houseFilters.baths > 0) {
//       results = houseResults.filter(house => house.baths >= houseFilters.baths!);
//     }

//     if (houseFilters.home_types && houseFilters.home_types.length > 0) {
//       results = houseResults.filter(house => houseFilters.home_types!.includes(house.home_type));
//     }
//   }

//   if (category === 'lands') {
//     const landFilters = filters as Partial<LandFilters>;
//     const landResults = results as Land[];

//     if (landFilters.landTypes && landFilters.landTypes.length > 0) {
//       results = landResults.filter(land => landFilters.landTypes!.includes(land.landType));
//     }
//   }

//   // Apply sorting
//   switch (filters.sort) {
//     case 'newest':
//       results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//       break;
//     case 'priceAsc':
//       results.sort((a, b) => a.price - b.price);
//       break;
//     case 'priceDesc':
//       results.sort((a, b) => b.price - a.price);
//       break;
//     case 'sqft':
//       results.sort((a, b) => {
//         const aSize = 'sqft' in a ? a.sqft : a.size;
//         const bSize = 'sqft' in b ? b.sqft : b.size;
//         return bSize - aSize;
//       });
//       break;
//     case 'lot':
//       results.sort((a, b) => {
//         const aSize = 'size' in a ? a.size : a.sqft;
//         const bSize = 'size' in b ? b.size : b.sqft;
//         return bSize - aSize;
//       });
//       break;
//     case 'pricePerSqft':
//       results.sort((a, b) => b.pricePerSqft - a.pricePerSqft);
//       break;
//     default: // recommended
//       break;
//   }

//   return results;
// }
