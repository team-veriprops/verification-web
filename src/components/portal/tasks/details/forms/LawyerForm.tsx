import { Card, CardContent, CardHeader, CardTitle } from '@3rdparty/ui/card';
import { Label } from '@3rdparty/ui/label';
import { Input } from '@3rdparty/ui/input';
import { Textarea } from '@3rdparty/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@3rdparty/ui/radio-group';
import { Checkbox } from '@3rdparty/ui/checkbox';
import { QueryTaskDto } from '../../models';

interface LawyerFormProps {
  task: QueryTaskDto;
  data: any;
  onChange: (data: any) => void;
}

export function LawyerForm({ task, data, onChange }: LawyerFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">⚖️ Legal Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="registryRef">Registry Reference Number</Label>
            <Input
              id="registryRef"
              placeholder="e.g., LAG/REG/2024/123"
              value={data.registryRef || ''}
              onChange={(e) => updateField('registryRef', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Encumbrance Check *</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="encumbranceCheck"
                checked={data.encumbranceCheck || false}
                onCheckedChange={(checked) => updateField('encumbranceCheck', checked)}
              />
              <Label htmlFor="encumbranceCheck" className="font-normal">
                Encumbrance search completed
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownershipChain">Ownership Chain</Label>
            <Textarea
              id="ownershipChain"
              placeholder="List previous owners with years..."
              value={data.ownershipChain || ''}
              onChange={(e) => updateField('ownershipChain', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalOpinion">Legal Opinion *</Label>
            <Textarea
              id="legalOpinion"
              placeholder="Provide your professional legal opinion..."
              value={data.legalOpinion || ''}
              onChange={(e) => updateField('legalOpinion', e.target.value)}
              rows={4}
              required
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
