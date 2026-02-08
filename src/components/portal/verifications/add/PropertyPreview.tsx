import { Building2, MapPin, Banknote, User, FileText, ExternalLink, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/3rdparty/ui/card';
import { Badge } from '@components/3rdparty/ui/badge';
import { CreateVerificationDto, UpdateVerificationDto } from '../models';
import { formatMoney } from '@lib/utils';

interface PropertyPreviewProps {
  data: Partial<CreateVerificationDto | UpdateVerificationDto>;
  showSource?: boolean;
}

const propertyTypeLabels: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  land: 'Land',
  industrial: 'Industrial',
};

const plotSizeUnitLabels: Record<string, string> = {
  sqm: 'sqm',
  hectares: 'hectares',
  acres: 'acres',
  plots: 'plots',
};

export function PropertyPreview({ data, showSource = true }: PropertyPreviewProps) {
  const formatPrice = (price: number, currency: 'NGN' | 'USD') => {
    if (currency === 'NGN') {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
      }).format(price);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">Property Summary</CardTitle>
          {data.sourcePlatform && showSource && (
            <Badge variant="secondary" className="text-xs">
              From {data.sourcePlatform}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Info */}
        {(data.propertyTitle || data.propertyType) && (
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-primary mt-0.5" />
            <div>
              {data.propertyTitle && (
                <p className="font-medium text-foreground">{data.propertyTitle}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {data.propertyType && (
                  <Badge variant="outline" className="text-xs">
                    {propertyTypeLabels[data.propertyType] || data.propertyType}
                  </Badge>
                )}
                {data.propertyPlotSize && (
                  <span className="text-sm text-muted-foreground">
                    {data.propertyPlotSize.value} {plotSizeUnitLabels[data.propertyPlotSize.unit] || data.propertyPlotSize.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Location */}
        {(data.location) && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-foreground">
                {data?.location?.address}
              </p>
              {(data.location?.state || data.location?.city) && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {data.location?.city && `${data.location?.city}, `}
                  {data.location?.state && data.location?.state}
                </p>
              )}
            </div>
          </div>
        )}

        

        {/* Verification Category */}
        {data.category && (
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                {data.category}
              </p>
              <p className="text-xs text-muted-foreground">Verification Category</p>
            </div>
          </div>
        )}

        {/* Price */}
        {data.propertyEstimatedPrice && (
          <div className="flex items-start gap-3">
            <Banknote className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                {formatMoney(data.propertyEstimatedPrice)}
              </p>
              <p className="text-xs text-muted-foreground">Estimated Price</p>
            </div>
          </div>
        )}

        {/* Owner & Seller */}
        {(data.ownerFullName || data.sellerInfo?.fullName) && (
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              {data.ownerFullName && (
                <div>
                  <p className="text-sm text-foreground">{data.ownerFullName}</p>
                  <p className="text-xs text-muted-foreground">Property Owner</p>
                </div>
              )}
              {data.sellerInfo?.fullName && (
                <div className="mt-2">
                  <p className="text-sm text-foreground">{data.sellerInfo.fullName} <span className="text-xs text-muted-foreground">(Property Seller)</span></p>
                  {data.sellerInfo.company && (
                    <p className="text-xs text-muted-foreground">{data.sellerInfo.company}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {data.sellerInfo.email} • {data.sellerInfo.phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents */}
        {data.documents && data.documents.length > 0 && (
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-foreground">{data.documents.length} document(s) attached</p>
              <p className="text-xs text-muted-foreground">
                {data.documents.map(d => d.name).slice(0, 3).join(', ')}
                {data.documents.length > 3 && ` +${data.documents.length - 3} more`}
              </p>
            </div>
          </div>
        )}

        {/* Source URL */}
        {data.sourceUrl && showSource && (
          <div className="pt-2 border-t border-border">
            <a
              href={data.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              View original listing
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
