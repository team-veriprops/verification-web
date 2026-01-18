import { Shield, MapPin, FileCheck, AlertTriangle, Camera } from 'lucide-react';
import trustHeroImage from '@assets/trust-hero.jpg';
import Image from 'next/image';

const trustFeatures = [
  { icon: FileCheck, text: 'Ownership, title, and physical existence confirmation' },
  { icon: AlertTriangle, text: 'Encumbrance, dispute, and government claim checks' },
  { icon: Shield, text: 'Forgery and document consistency detection' },
  { icon: MapPin, text: 'Survey plan, beacon, and boundary validation' },
  { icon: Camera, text: 'On-site inspection with photo and geo-tagged evidence' },
];

export function TrustPanel() {
  return (
    <div className="trust-panel relative hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:items-center lg:p-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-60">
          <Image
            src={trustHeroImage}
            alt="Trust background"
            fill
            priority
            className="object-cover"
          />
        </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/95 via-primary/90 to-primary/85" />
      
      {/* Content */}
      <div className="relative z-10 max-w-md my-auto animate-fade-in-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-white/90 tracking-wide uppercase">
            Property Verification Service
          </span>
        </div>
        
        {/* Main Heading */}
        <h1 className="font-display text-4xl lg:text-5xl text-white leading-tight mb-6">
          {"Before You Pay, let's verify it!"}
        </h1>
        
        {/* Subheading */}
        <p className="text-lg text-white/80 mb-10 leading-relaxed">
          We verify property authenticity and legal standing before you commit your money.
        </p>
        
        {/* Floating Trust Card */}
        <div className="floating-card bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 animate-fade-in-delayed">
          <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-5">
            Our Verification Process
          </h3>
          
          <ul className="space-y-4">
            {trustFeatures.map((feature, index) => (
              <li 
                key={index} 
                className="trust-check-item"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/20">
                  <feature.icon className="trust-check-icon w-4 h-4" />
                </div>
                <span className="text-white/90">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
    </div>
  );
}
