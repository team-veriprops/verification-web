import { Card, CardContent, CardHeader, CardTitle } from '@3rdparty/ui/card';
import { Label } from '@3rdparty/ui/label';
import { Input } from '@3rdparty/ui/input';
import { Textarea } from '@3rdparty/ui/textarea';
import { Checkbox } from '@3rdparty/ui/checkbox';
import { Button } from '@3rdparty/ui/button';
import { Badge } from '@3rdparty/ui/badge';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { QueryTaskDto } from '../../models';

interface FieldAgentFormProps {
  task: QueryTaskDto;
  data: any;
  onChange: (data: any) => void;
}

export function FieldAgentForm({ task, data, onChange }: FieldAgentFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const startVisit = () => {
    const visitData = {
      timestamp: new Date().toISOString(),
      gps: { lat: 6.4341, lng: 3.5008 }, // Simulated
    };
    updateField('visitStart', visitData);
    toast.success('Visit started — location captured 📍');
  };

  const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    updateField('witnessOTP', otp);
    toast.info(`Witness OTP: ${otp}`, {
      description: 'Share this code with the witness',
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🧍 Field Inspection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Visit Start</Label>
            {!data.visitStart ? (
              <Button onClick={startVisit} className="gap-2">
                <MapPin className="h-4 w-4" />
                Start Visit
              </Button>
            ) : (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Started at {new Date(data.visitStart.timestamp).toLocaleTimeString()}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label>Condition Checklist *</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accessRoad"
                  checked={data.conditions?.accessRoad || false}
                  onCheckedChange={(checked) => 
                    updateField('conditions', { ...data.conditions, accessRoad: checked })
                  }
                />
                <Label htmlFor="accessRoad" className="font-normal">
                  Access road present and accessible
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="boundaryMarks"
                  checked={data.conditions?.boundaryMarks || false}
                  onCheckedChange={(checked) => 
                    updateField('conditions', { ...data.conditions, boundaryMarks: checked })
                  }
                />
                <Label htmlFor="boundaryMarks" className="font-normal">
                  Boundary marks visible
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="occupied"
                  checked={data.conditions?.occupied || false}
                  onCheckedChange={(checked) => 
                    updateField('conditions', { ...data.conditions, occupied: checked })
                  }
                />
                <Label htmlFor="occupied" className="font-normal">
                  Property is occupied
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="witnessName">Witness Information</Label>
            <Input
              id="witnessName"
              placeholder="Witness name"
              value={data.witnessName || ''}
              onChange={(e) => updateField('witnessName', e.target.value)}
            />
            <Input
              id="witnessPhone"
              placeholder="Witness phone"
              type="tel"
              value={data.witnessPhone || ''}
              onChange={(e) => updateField('witnessPhone', e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={generateOTP}>
                Generate OTP
              </Button>
              {data.witnessOTP && (
                <Input
                  placeholder="Enter OTP"
                  value={data.witnessOTPEntered || ''}
                  onChange={(e) => updateField('witnessOTPEntered', e.target.value)}
                  className="flex-1"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fieldNotes">Field Notes *</Label>
            <Textarea
              id="fieldNotes"
              placeholder="Describe what you observed during the inspection..."
              value={data.fieldNotes || ''}
              onChange={(e) => updateField('fieldNotes', e.target.value)}
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
