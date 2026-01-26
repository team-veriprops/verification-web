import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@components/3rdparty/ui/button';
import { Input } from '@components/3rdparty/ui/input';
import { Textarea } from '@components/3rdparty/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/3rdparty/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/3rdparty/ui/form';
import { FormStepIndicator } from './FormStepIndicator';
import { AddressPicker } from './AddressPicker';
import { DocumentUploader } from './DocumentUploader';
import { nigerianStates, getLgasForState } from '@lib/nigerianLocations';
import { cn } from '@lib/utils';
import { AddressDetails, PropertyDetails, UploadedDocument } from './models';
import { PropertyPreview } from './PropertyPreview';
import { CategorySelector } from '../checkout/CategorySelector';
import { useCheckout } from '@components/portal/verifications/checkout/libs/useCheckout';
import { fxRates } from '@data/verificationTiers';
import AddressSearchForm from '@components/ui/AddressSearchForm';

const steps = [
  { id: 1, title: 'Property Details', description: 'Basic property information' },
  { id: 2, title: 'Category', description: 'Property verification category' },
  { id: 3, title: 'Location', description: 'Property address and location' },
  { id: 4, title: 'Ownership', description: 'Owner and seller information' },
  { id: 5, title: 'Documents', description: 'Upload supporting documents' },
];

// Step 1 Schema
const step1Schema = z.object({
  propertyType: z.enum(['residential', 'commercial', 'land', 'industrial'], {
    error: 'Please select a property type',
  }),
  propertyTitle: z.string().min(5, 'Property title must be at least 5 characters'),
  plotSize: z.string().min(1, 'Plot size is required'),
  plotSizeUnit: z.enum(['sqm', 'hectares', 'acres', 'plots']),
  estimatedPrice: z.string().min(1, 'Estimated price is required'),
  currency: z.enum(['NGN', 'USD', 'GBP', 'EUR']),
});

// Step 3 Schema
const step3Schema = z.object({
  address: z.string().min(10, 'Address must be at least 10 characters'),
  formattedAddress: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  lga: z.string().min(1, 'LGA is required'),
});

// Step 4 Schema
const step4Schema = z.object({
  ownerFullName: z.string().min(3, 'Owner name must be at least 3 characters'),
  sellerFullName: z.string().min(3, 'Seller name must be at least 3 characters'),
  sellerCompany: z.string().optional(),
  sellerEmail: z.string().email('Please enter a valid email'),
  sellerPhone: z.string().min(10, 'Please enter a valid phone number'),
  surveyPlanNumber: z.string().optional(),
  beaconNumbers: z.string().optional(),
  additionalDetails: z.string().optional(),
});

// Combined schema
const formSchema = step1Schema.merge(step3Schema).merge(step4Schema);

type FormData = z.infer<typeof formSchema>;

interface PropertyFormProps {
  initialData?: Partial<PropertyDetails>;
  onSubmit: (data: PropertyDetails) => void;
  isSubmitting?: boolean;
}

export function PropertyForm({ initialData, onSubmit, isSubmitting = false }: PropertyFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [documents, setDocuments] = useState<UploadedDocument[]>(initialData?.documents || []);
  const {
      selectedCategory,
      selectedCurrency,
      tiers,
      handleCategoryChange,
    } = useCheckout();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      propertyType: initialData?.propertyType || undefined,
      propertyTitle: initialData?.propertyTitle || '',
      plotSize: initialData?.plotSize || '',
      plotSizeUnit: initialData?.plotSizeUnit || 'sqm',
      estimatedPrice: initialData?.estimatedPrice?.toString() || '',
      currency: initialData?.currency ?? 'NGN',
      address: initialData?.address || '',
      formattedAddress: initialData?.formattedAddress || '',
      state: initialData?.state || '',
      lga: initialData?.lga || '',
      ownerFullName: initialData?.ownerFullName || '',
      sellerFullName: initialData?.sellerInfo?.fullName || '',
      sellerCompany: initialData?.sellerInfo?.company || '',
      sellerEmail: initialData?.sellerInfo?.email || '',
      sellerPhone: initialData?.sellerInfo?.phone || '',
      surveyPlanNumber: initialData?.surveyPlanNumber || '',
      beaconNumbers: initialData?.beaconNumbers || '',
      additionalDetails: initialData?.additionalDetails || '',
    },
  });

  const watchState = form.watch('state');
  const lgas = watchState ? getLgasForState(watchState) : [];

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['propertyType', 'propertyTitle', 'plotSize', 'plotSizeUnit', 'estimatedPrice', 'currency'];
        break;
      case 2:
        return true; // Verification category is  not validated
      case 3:
        fieldsToValidate = ['address', 'state', 'lga'];
        break;
      case 4:
        fieldsToValidate = ['ownerFullName', 'sellerFullName', 'sellerEmail', 'sellerPhone'];
        break;
      case 5:
        return true; // Documents are optional
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handleAddressChange = (address: AddressDetails) => {
    form.setValue('address', address.address);
    form.setValue('formattedAddress', address.formattedAddress);
    if (address.state) {
      form.setValue('state', address.state);
    }
    if (address.lga) {
      form.setValue('lga', address.lga);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    const propertyData: PropertyDetails = {
      propertyType: data.propertyType,
      propertyTitle: data.propertyTitle,
      plotSize: data.plotSize,
      plotSizeUnit: data.plotSizeUnit,
      address: data.address,
      formattedAddress: data.formattedAddress || data.address,
      lga: data.lga,
      state: data.state,
      estimatedPrice: parseFloat(data.estimatedPrice),
      category: selectedCategory,
      currency: data.currency,
      surveyPlanNumber: data.surveyPlanNumber,
      beaconNumbers: data.beaconNumbers,
      ownerFullName: data.ownerFullName,
      sellerInfo: {
        fullName: data.sellerFullName,
        company: data.sellerCompany,
        email: data.sellerEmail,
        phone: data.sellerPhone,
      },
      additionalDetails: data.additionalDetails,
      documents,
    };

    onSubmit(propertyData);
  };

  const formValues = form.watch();
  const previewData: Partial<PropertyDetails> = {
    propertyType: formValues.propertyType,
    propertyTitle: formValues.propertyTitle,
    plotSize: formValues.plotSize,
    plotSizeUnit: formValues.plotSizeUnit,
    address: formValues.address,
    formattedAddress: formValues.formattedAddress,
    state: formValues.state,
    lga: formValues.lga,
    estimatedPrice: formValues.estimatedPrice ? parseFloat(formValues.estimatedPrice) : undefined,
    currency: formValues.currency,
    ownerFullName: formValues.ownerFullName,
    sellerInfo: formValues.sellerFullName ? {
      fullName: formValues.sellerFullName,
      company: formValues.sellerCompany,
      email: formValues.sellerEmail,
      phone: formValues.sellerPhone,
    } : undefined,
    documents,
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Step Indicator */}
        <FormStepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Step Content */}
        <div className="min-h-100">
          {/* Step 1: Property Details */}
          <div className={cn("space-y-6", currentStep !== 1 && "hidden")}>
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., 5-Bedroom Duplex at Ibeju-Lekki"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="plotSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plot Size *</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="e.g., 500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plotSizeUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sqm">Square Meters (sqm)</SelectItem>
                        <SelectItem value="hectares">Hectares</SelectItem>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="plots">Plots</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimatedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Price *</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="e.g., 50000000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Step 2: Property Verification Category */}
          <section className={cn("space-y-6", currentStep !== 2 && "hidden")}>
              <CategorySelector
                  tiers={tiers}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  currency={selectedCurrency}
                  fxRate={fxRates[selectedCurrency]}
              />
          </section>

          {/* Step 3: Location */}
          <div className={cn("space-y-6", currentStep !== 3 && "hidden")}>
            <AddressSearchForm />
            {/* <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address *</FormLabel>
                  <FormControl>
                    <AddressPicker
                      value={field.value}
                      onChange={handleAddressChange}
                      error={form.formState.errors.address?.message}
                      placeholder="Start typing to search for address..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('lga', ''); // Reset LGA when state changes
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local Government Area *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!watchState}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={watchState ? "Select LGA" : "Select state first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lgas.map((lga) => (
                          <SelectItem key={lga.value} value={lga.value}>
                            {lga.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </div>

          {/* Step 4: Ownership & Survey */}
          <div className={cn("space-y-6", currentStep !== 4 && "hidden")}>
            <FormField
              control={form.control}
              name="ownerFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Owner Full Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the property owner's full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
              <h4 className="text-sm font-medium text-foreground">Seller Information</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sellerFullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Seller's full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellerCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Company name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sellerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="seller@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+234 800 000 0000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="surveyPlanNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Survey Plan Number (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., LSP/2024/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="beaconNumbers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beacon Numbers (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Comma-separated" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Any other relevant information about the property..."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Step 5: Documents */}
          <div className={cn("space-y-6", currentStep !== 5 && "hidden")}>
            <DocumentUploader
              documents={documents}
              onChange={setDocuments}
            />

            {/* Preview */}
            {currentStep === 4 && (
              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-4">Review Your Submission</h4>
                <PropertyPreview data={previewData} showSource={false} />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(currentStep === 1 && "invisible")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button type="button" onClick={handleNext} variant="default">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Verification Request'
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
