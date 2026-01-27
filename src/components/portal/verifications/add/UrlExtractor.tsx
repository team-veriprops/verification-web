import { useState } from 'react';
import { Link2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '@components/3rdparty/ui/input';
import { Button } from '@components/3rdparty/ui/button';
import { Alert, AlertDescription } from '@components/3rdparty/ui/alert';
import { PropertyPreview } from './PropertyPreview';
import { detectPlatform, extractPropertyFromUrl, isValidUrl, supportedPlatforms, SupportedPlatform } from '@lib/mockUrlExtractor';
import { cn } from '@lib/utils';
import { PropertyDetails } from './models';

interface UrlExtractorProps {
  onExtract: (data: Partial<PropertyDetails>) => void;
}

export function UrlExtractor({ onExtract }: UrlExtractorProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Partial<PropertyDetails> | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<SupportedPlatform | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    setError(null);
    setExtractedData(null);

    if (value && isValidUrl(value)) {
      const platform = detectPlatform(value);
      setDetectedPlatform(platform);
    } else {
      setDetectedPlatform(null);
    }
  };

  const handleExtract = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    if (!detectedPlatform) {
      setError('URL is not from a supported Nigerian property platform');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await extractPropertyFromUrl(url);
      if (data) {
        setExtractedData(data);
      } else {
        setError('Could not extract property details from this URL');
      }
    } catch (err) {
      setError('Failed to extract property details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseData = () => {
    if (extractedData) {
      onExtract(extractedData);
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Property Listing URL
        </label>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://propertypro.ng/property/..."
            className="pl-10"
          />
        </div>

        {/* Platform Detection */}
        {detectedPlatform && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">Detected:</span>
            <span
              className="font-medium px-2 py-0.5 rounded-full text-white text-xs"
              style={{ backgroundColor: detectedPlatform.color }}
            >
              {detectedPlatform.name}
            </span>
          </div>
        )}

        <Button
          type="button"
          onClick={handleExtract}
          disabled={isLoading || !url || !detectedPlatform}
          className="w-full"
          variant="default"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Extracting...
            </>
          ) : (
            'Extract Property Details'
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Extracted Data Preview */}
      {extractedData && (
        <div className="space-y-4">
          <PropertyPreview data={extractedData} showSource />
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setUrl('');
                setExtractedData(null);
                setDetectedPlatform(null);
              }}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={handleUseData}
              variant="default"
              className="flex-1"
            >
              Use This Data
            </Button>
          </div>
        </div>
      )}

      {/* Supported Platforms */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">Supported Nigerian platforms:</p>
        <div className="flex flex-wrap gap-2">
          {supportedPlatforms.map((platform) => (
            <span
              key={platform.id}
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                detectedPlatform?.id === platform.id
                  ? "text-white"
                  : "bg-muted text-muted-foreground"
              )}
              style={detectedPlatform?.id === platform.id ? { backgroundColor: platform.color } : undefined}
            >
              {platform.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
