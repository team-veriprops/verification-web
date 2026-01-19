import TrustHeader from "@components/website/auth/TrustHeader";
import { TrustPanel } from "@components/website/auth/TrustPanel";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-background relative">
      {/* Left Panel - Trust Narrative (Desktop Only) */}
      <TrustPanel />
      
      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          

          {/* Logo */}
            <div className="
              absolute lg:top-8 lg:right-8 lg:left-auto
              left-2/5 right-auto
            ">
              <div className="flex items-center gap-2 mb-8 animate-fade-in">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-display font-bold text-xl">V</span>
                </div>
                <span className="text-xl font-display font-semibold text-foreground">
                  Veriprops
                </span>
              </div>
            </div>

          
          {/* <TrustHeader /> */}
          
          {/* Form Content */}
          <div className="animate-fade-in-up pt-14" style={{ animationDelay: '0.1s' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
