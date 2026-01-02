// export interface PropertyDetails {
//   id: string;
//   title: string;
//   price: number;
//   address: string;
//   location: {
//     state: string;
//     city: string;
//     area: string;
//     coordinates: { lat: number; lng: number };
//   };
//   basics: {
//     beds: number;
//     baths: number;
//     parking: number;
//     yearBuilt: number;
//     plotSize: number;
//     sqft: number;
//     pricePerSqft: number;
//     propertyType: string;
//     daysOnVeriprops: number;
//   };
//   description: string;
//   highlights: string[];
//   images: {
//     all: string[];
//     bedroom: string[];
//     living: string[];
//     kitchen: string[];
//     bathroom: string[];
//     exterior: string[];
//   };
//   interior: {
//     bedrooms: string;
//     bathrooms: string;
//     flooring: string;
//     kitchen: string;
//     livingArea: string;
//   };
//   parking: {
//     spaces: number;
//     visitorParking: boolean;
//     garageType: string;
//     covered: boolean;
//     street: boolean;
//   };
//   exterior: {
//     plotSize: number;
//     garden: boolean;
//     fence: string;
//     balcony: boolean;
//   };
//   utilities: {
//     electricity: boolean;
//     water: boolean;
//     internet: boolean;
//     wasteDisposal: boolean;
//   };
//   verification: {
//     veripropsVerified: boolean;
//     title_docs: string[];
//     zoning: string;
//     developmentStage: string;
//   };
//   nearbyPlaces: {
//     schools: Array<{ name: string; distance: string }>;
//     hospitals: Array<{ name: string; distance: string }>;
//     places: Array<{ name: string; distance: string }>;
//     transit: Array<{ name: string; distance: string }>;
//   };
// }

// export const mockPropertyDetails: PropertyDetails = {
//   id: "prop-123",
//   title: "Luxury 4-Bedroom Duplex in Lekki Phase 1",
//   price: 85000000,
//   address: "12 Admiralty Way, Lekki Phase 1, Lagos",
//   location: {
//     state: "Lagos",
//     city: "Lagos",
//     area: "Lekki Phase 1",
//     coordinates: { lat: 6.4318, lng: 3.4214 }
//   },
//   basics: {
//     beds: 4,
//     baths: 3,
//     parking: 2,
//     yearBuilt: 2020,
//     plotSize: 600,
//     sqft: 2500,
//     pricePerSqft: 34000,
//     propertyType: "Duplex",
//     daysOnVeriprops: 12
//   },
//   description: "Discover this stunning 4-bedroom duplex in the heart of Lekki Phase 1. Built with premium materials and modern finishes, this home offers the perfect blend of luxury and comfort. The spacious layout features an open-plan living area, modern kitchen with island, and a master suite with walk-in closet. Located in a secure, gated community with 24/7 security and excellent infrastructure.",
//   highlights: [
//     "Prime Lekki Phase 1 location",
//     "Gated community with 24/7 security",
//     "Modern kitchen with granite countertops",
//     "Master suite with walk-in closet",
//     "Covered parking for 2 cars",
//     "Generator backup power"
//   ],
//   images: {
//     all: [
//       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
//     ],
//     bedroom: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"],
//     living: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&h=600&fit=crop"],
//     kitchen: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"],
//     bathroom: ["https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"],
//     exterior: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"]
//   },
//   interior: {
//     bedrooms: "4 bedrooms with built-in wardrobes",
//     bathrooms: "3 full bathrooms with modern fixtures",
//     flooring: "Marble tiles throughout",
//     kitchen: "Modern kitchen with granite countertops and island",
//     livingArea: "Open-plan living and dining area"
//   },
//   parking: {
//     spaces: 2,
//     visitorParking: true,
//     garageType: "Covered carport",
//     covered: true,
//     street: false
//   },
//   exterior: {
//     plotSize: 600,
//     garden: true,
//     fence: "Perimeter wall with gate",
//     balcony: true
//   },
//   utilities: {
//     electricity: true,
//     water: true,
//     internet: true,
//     wasteDisposal: true
//   },
//   verification: {
//     veripropsVerified: true,
//     title_docs: ["Certificate of Occupancy", "Survey Plan"],
//     zoning: "Residential",
//     developmentStage: "Completed"
//   },
//   nearbyPlaces: {
//     schools: [
//       { name: "Corona Schools", distance: "0.8 km" },
//       { name: "Greensprings School", distance: "1.2 km" },
//       { name: "Dowen College", distance: "2.1 km" }
//     ],
//     hospitals: [
//       { name: "Reddington Hospital", distance: "1.5 km" },
//       { name: "Lagoon Hospitals", distance: "2.3 km" },
//       { name: "Evercare Hospital", distance: "3.1 km" }
//     ],
//     places: [
//       { name: "Palms Shopping Mall", distance: "3.2 km" },
//       { name: "Circle Mall", distance: "4.1 km" },
//       { name: "Elegushi Beach", distance: "5.2 km" }
//     ],
//     transit: [
//       { name: "Admiralty Bus Stop", distance: "0.3 km" },
//       { name: "Lekki Phase 1 Gate", distance: "0.8 km" },
//       { name: "Toll Gate", distance: "2.5 km" }
//     ]
//   }
// };

export const mockRecommendedProperties = [
  {
    id: "rec-1",
    title: "3-Bedroom Apartment in Victoria Island",
    price: 120000000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: "/placeholder.svg",
    location: "Victoria Island, Lagos"
  },
  {
    id: "rec-2",
    title: "5-Bedroom Detached House in Ikoyi",
    price: 180000000,
    beds: 5,
    baths: 4,
    sqft: 3200,
    image: "/placeholder.svg",
    location: "Ikoyi, Lagos"
  },
  {
    id: "rec-3",
    title: "2-Bedroom Bungalow in Ikeja",
    price: 45000000,
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "/placeholder.svg",
    location: "Ikeja, Lagos"
  }
];

// export const formatMoney = (price: number): string => {
//   if (price >= 1000000) {
//     return `₦${(price / 1000000).toFixed(0)}M`;
//   }
//   return `₦${price.toLocaleString()}`;
// };
