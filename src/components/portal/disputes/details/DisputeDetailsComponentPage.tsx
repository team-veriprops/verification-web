"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, MapPin, Users, Calendar, FileText, Download, Phone, CheckCircle,
  User, AlertCircle, Upload
} from "lucide-react";
import { Button } from "@components/3rdparty/ui/button";
import { Badge } from "@components/3rdparty/ui/badge";
import { cn } from "@lib/utils";
import { mockDisputes, formatDate, getStatusBadgeColor, getDisputeTypeBadgeColor, getDisputeTypeLabel } from "@data/portalMockData";
import { useToast } from "@hooks/use-toast";

export default function DisputeDetailsComponentPage () {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const id = params.id as string;
  const dispute = mockDisputes.find(d => d.id === id);

  if (!dispute) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Dispute not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/portal/disputes")}>
          Back to Disputes
        </Button>
      </div>
    );
  }

  function handleAddEvidence () {
    toast({ title: "Upload Evidence", description: "Evidence upload feature coming soon" });
  }

  function handleContactSupport () {
    router.push("/portal/support");
  }

  function handleRequestMediation () {
    toast({ title: "Mediation Requested", description: "Our team will contact you within 24 hours" });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" onClick={() => router.push("/portal/disputes")} className="w-fit">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Disputes
      </Button>

      <div className="bg-card border border-border rounded-xl p-6">
        <span className="font-mono text-sm text-muted-foreground">{dispute.id}</span>
        <h1 className="text-2xl font-bold">{dispute.title}</h1>
        <div className="flex flex-wrap gap-3 mt-2">
          <Badge className={cn("text-xs", getDisputeTypeBadgeColor(dispute.type))}>
            {getDisputeTypeLabel(dispute.type)}
          </Badge>
          <Badge className={cn("capitalize", getStatusBadgeColor(dispute.status))}>
            {dispute.status === "under_review" ? "Under Review" : dispute.status}
            {dispute.status === "active" && (
              <span className="ml-1.5 h-2 w-2 rounded-full bg-current animate-pulse" />
            )}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Property Information">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground">Location</div>
                <div className="text-sm font-medium">{dispute.propertyLocation}</div>
              </div>
            </div>
            <Link href={`/portal/verifications/${dispute.verificationId}`} className="text-sm text-primary hover:underline flex items-center gap-2 mt-2">
              <FileText className="h-4 w-4" /> {dispute.verificationId}
            </Link>
          </Section>

          <Section title="Dispute Description">
            <p className="text-sm text-muted-foreground">{dispute.description}</p>
          </Section>

          <Section title="Parties Involved">
            <div className="grid sm:grid-cols-2 gap-4">
              <PartyCard label="Claimant" party={dispute.parties.claimant} />
              <PartyCard label="Respondent" party={dispute.parties.respondent} />
            </div>

            {dispute.parties.thirdParties.length > 0 && (
              <div className="pt-4 border-t border-border mt-4">
                <div className="text-xs text-muted-foreground mb-2 uppercase">Third Parties</div>
                {dispute.parties.thirdParties.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {dispute.resolution && (
            <Section title="Resolution" className="border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">{dispute.resolution.outcome}</span>
              </div>
              <p className="text-sm text-muted-foreground">{dispute.resolution.decision}</p>
              <div className="text-xs text-muted-foreground">Resolved On: {formatDate(dispute.resolution.date)}</div>
            </Section>
          )}

          <Section title="Evidence & Documents">
            <Button variant="outline" size="sm" onClick={handleAddEvidence} className="w-fit mb-3">
              <Upload className="h-4 w-4 mr-2" /> Add Evidence
            </Button>

            {dispute.evidence.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.type} • {d.size} • {formatDate(d.uploadedAt)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
              </div>
            ))}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Timeline">
            {dispute.timeline.map((e, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-3 w-3 rounded-full bg-primary mt-1.5" />
                <div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formatDate(e.date)}
                  </div>
                  <div className="text-sm font-medium">{e.event}</div>
                  <div className="text-xs text-muted-foreground">{e.description}</div>
                </div>
              </div>
            ))}
          </Section>

          <Section title="Key Dates">
            <DateItem label="Filed Date" date={dispute.filedDate} />
            <DateItem label="Last Activity" date={dispute.lastActivity} />
          </Section>

          {dispute.status !== "resolved" && (
            <Section title="Actions">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleAddEvidence}>
                  <Upload className="h-4 w-4 mr-2" /> Add Evidence
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleContactSupport}>
                  <AlertCircle className="h-4 w-4 mr-2" /> Contact Support
                </Button>
                <Button className="w-full justify-start" onClick={handleRequestMediation}>
                  <Users className="h-4 w-4 mr-2" /> Request Mediation
                </Button>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* Reusable UI Helpers */
interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function Section({ title, children, className }: SectionProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-6 space-y-4", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

interface Party {
  name: string;
  role: string;
  contact?: string;
}

function PartyCard({ label, party }: { label: string; party: Party }) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
      <div className="text-xs text-muted-foreground uppercase">{label}</div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm font-medium">{party.name}</div>
          <div className="text-xs text-muted-foreground">{party.role}</div>
        </div>
      </div>
      {party.contact && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Phone className="h-3 w-3" /> {party.contact}
        </div>
      )}
    </div>
  );
}

function DateItem({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex items-center gap-3">
      <Calendar className="h-5 w-5 text-muted-foreground" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{formatDate(date)}</div>
      </div>
    </div>
  );
}
