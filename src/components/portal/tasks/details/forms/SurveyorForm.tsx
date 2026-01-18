import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@3rdparty/ui/card';
import { Label } from '@3rdparty/ui/label';
import { Input } from '@3rdparty/ui/input';
import { Textarea } from '@3rdparty/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@3rdparty/ui/radio-group';
import { Button } from '@3rdparty/ui/button';
import { Badge } from '@3rdparty/ui/badge';
import { MapPin, Play, Square } from 'lucide-react';
import { toast } from 'sonner';
import { QueryTaskDto } from '../../models';

interface SurveyorFormProps {
  task: QueryTaskDto;
  data: any;
  onChange: (data: any) => void;
}

export function SurveyorForm({ task, data, onChange }: SurveyorFormProps) {
  const [recording, setRecording] = useState(false);

  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const startGPSWalk = () => {
    setRecording(true);
    const startTime = Date.now();
    updateField('gpsWalkStart', new Date().toISOString());
    toast.success('GPS boundary walk started 🧭');
  };

  const stopGPSWalk = () => {
    setRecording(false);
    updateField('gpsWalkEnd', new Date().toISOString());
    
    // Simulate GPS trace
    const mockTrace = {
      points: 12,
      perimeter: '180.5m',
      coordinates: [
        { lat: 6.4341, lng: 3.5008 },
        { lat: 6.4342, lng: 3.5009 },
        // ... more points
      ]
    };
    updateField('gpsTrace', mockTrace);
    toast.success('GPS boundary walk completed ✅', {
      description: `Captured ${mockTrace.points} waypoints`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🧭 Survey Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>GPS Boundary Walk *</Label>
            <div className="flex gap-2">
              {!recording && !data.gpsTrace ? (
                <Button onClick={startGPSWalk} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Walk
                </Button>
              ) : recording ? (
                <Button onClick={stopGPSWalk} variant="destructive" className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop Walk
                </Button>
              ) : (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <MapPin className="mr-1 h-3 w-3" />
                  Walk completed: {data.gpsTrace.points} points
                </Badge>
              )}
            </div>
            {recording && (
              <p className="text-xs text-muted-foreground animate-pulse-soft">
                Recording GPS coordinates...
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinateCheck">Coordinate Verification</Label>
            <Input
              id="coordinateCheck"
              placeholder="Check against official plan..."
              value={data.coordinateCheck || ''}
              onChange={(e) => updateField('coordinateCheck', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldNotes">Field Notes</Label>
            <Textarea
              id="fieldNotes"
              placeholder="Any observations during the survey..."
              value={data.fieldNotes || ''}
              onChange={(e) => updateField('fieldNotes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Suggested Verdict *</Label>
            <RadioGroup
              value={data.verdict || ''}
              onValueChange={(value) => updateField('verdict', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pass" id="pass" />
                <Label htmlFor="pass" className="font-normal">Pass</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="conditional" id="conditional" />
                <Label htmlFor="conditional" className="font-normal">Conditional Pass</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fail" id="fail" />
                <Label htmlFor="fail" className="font-normal">Fail</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
