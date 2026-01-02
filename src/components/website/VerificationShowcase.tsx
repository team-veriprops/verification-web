import { mockProperties } from "@data/mockData";
import { CheckCircle, AlertTriangle, MapPin, Ruler, Building, FileX } from "lucide-react";

const VerificationShowcase = () => {
  return (
    <section id="verification" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Real Results
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Sample Verification Results
          </h2>
          <p className="text-lg text-muted-foreground">
            See the kind of insights we uncover. These are examples of actual verification patterns we find.
          </p>
        </div>

        {/* Property Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {mockProperties.slice(0, 4).map((property, index) => (
            <div
              key={property.id}
              className={`bg-card rounded-2xl border shadow-soft overflow-hidden opacity-0 animate-fade-up ${
                property.status === "flagged" ? "border-danger/30" : "border-border"
              }`}
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              {/* Header */}
              <div className={`px-6 py-4 ${
                property.status === "verified" ? "bg-success/5 border-b border-success/20" :
                property.status === "flagged" ? "bg-danger/5 border-b border-danger/20" :
                "bg-muted/50 border-b border-border"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      property.type === "land" ? "bg-primary/10 text-primary" : "bg-secondary/20 text-secondary-foreground"
                    }`}>
                      {property.type === "land" ? <MapPin className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">{property.id}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {property.location}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    property.status === "verified" ? "bg-success/10 text-success" :
                    property.status === "flagged" ? "bg-danger/10 text-danger" :
                    "bg-warning/10 text-warning"
                  }`}>
                    {property.status === "verified" ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Risk Score */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm text-muted-foreground">Risk Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          property.riskScore < 0.3 ? "bg-success" :
                          property.riskScore < 0.6 ? "bg-warning" : "bg-danger"
                        }`}
                        style={{ width: `${property.riskScore * 100}%` }}
                      />
                    </div>
                    <span className={`font-display font-bold text-sm ${
                      property.riskScore < 0.3 ? "text-success" :
                      property.riskScore < 0.6 ? "text-warning" : "text-danger"
                    }`}>
                      {property.riskScore.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                {property.type === "land" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Ruler className="w-4 h-4" /> Claimed Size
                      </span>
                      <span className="font-medium text-foreground">{property.claimedSize} sqm</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <FileX className="w-4 h-4" /> Survey Doc
                      </span>
                      <span className={`font-medium ${property.surveyDocSize ? "text-foreground" : "text-danger"}`}>
                        {property.surveyDocSize ? `${property.surveyDocSize} sqm` : "Not Found"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Satellite Est.</span>
                      <span className="font-medium text-foreground">{property.satelliteEstimate} sqm</span>
                    </div>
                  </div>
                )}

                {property.type === "building" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Claimed Floors</span>
                      <span className="font-medium text-foreground">{property.claimedFloors}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Found Floors</span>
                      <span className="font-medium text-foreground">{property.foundFloors}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Approved Plan</span>
                      <span className={`font-medium ${property.approvedPlan ? "text-success" : "text-danger"}`}>
                        {property.approvedPlan ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Status Indicators */}
                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-border">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.ownerVerified ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  }`}>
                    Owner: {property.ownerVerified ? "Verified" : "Not Verified"}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    !property.dispute ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  }`}>
                    Dispute: {property.dispute ? "Found" : "None"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Micro-copy */}
        <p className="text-center text-muted-foreground text-sm mt-10">
          💡 <span className="text-foreground font-medium">We checked the facts for you.</span> Every report tells the real story.
        </p>
      </div>
    </section>
  );
};

export default VerificationShowcase;