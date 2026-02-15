import { VerificationTier } from "@components/portal/verifications/checkout/models";
import { VerificationCategory } from "@components/portal/verifications/models";


export const verificationTiers: VerificationTier[] = [
  {
    id: VerificationCategory.BASIC,
    name: 'Basic Verification',
    description: 'Essential document checks for straightforward transactions',
    features: [
      'Title document verification',
      'Ownership confirmation',
      'Registry search',
    ],
    label: 'Best for low-risk properties',
    priceNGN: 75000,
  },
  {
    id: VerificationCategory.STANDARD,
    name: 'Standard Verification',
    description: 'Comprehensive verification with physical inspection',
    features: [
      'Everything in Basic, plus:',
      'Physical site inspection',
      'Boundary and location confirmation',
    ],
    label: 'Recommended for most buyers',
    priceNGN: 150000,
    recommended: true,
  },
  {
    id: VerificationCategory.PREMIUM,
    name: 'Premium Verification',
    description: 'Complete due diligence with legal assessment',
    features: [
      'Everything in Standard, plus:',
      'Legal opinion',
      'Fraud and risk assessment',
    ],
    label: 'Ideal for high-value or disputed properties',
    priceNGN: 300000,
  },
];

// export const VAT_RATE = 0.075; // 7.5%

// export const fxRates: Record<string, number> = {
//   NGN: 1,
//   USD: 0.00063, // ~1590 NGN per USD
//   GBP: 0.00050, // ~2000 NGN per GBP
//   EUR: 0.00058, // ~1720 NGN per EUR
// };

// export const currencySymbols: Record<string, string> = {
//   NGN: '₦',
//   USD: '$',
//   GBP: '£',
//   EUR: '€',
// };

// export const currencyNames: Record<string, string> = {
//   NGN: 'Nigerian Naira',
//   USD: 'US Dollar',
//   GBP: 'British Pound',
//   EUR: 'Euro',
// };
