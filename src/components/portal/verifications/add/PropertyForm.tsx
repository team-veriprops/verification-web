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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/3rdparty/ui/form';
import { FormStepIndicator } from './FormStepIndicator';
import { DocumentUploader } from './DocumentUploader';
import { cn } from '@lib/utils';
import { PropertyPreview } from './PropertyPreview';
import { CategorySelector } from '../checkout/CategorySelector';
import { fxRates, verificationTiers } from '@data/verificationTiers';
import AddressSearchForm from '@components/ui/AddressSearchForm';
import { ExactLocation, MeasurementUnit, Money, PropertyType, TransactionCurrency } from 'types/models';
import { useCheckoutStore } from '../checkout/libs/useCheckoutStore';
import { CreateVerificationDto, UpdateVerificationDto, VerificationDocument } from '../models';

const steps = [
  { id: 1, title: 'Property Details', description: 'Basic property information' },
  { id: 2, title: 'Category', description: 'Property verification category' },
  { id: 3, title: 'Location', description: 'Property address and location' },
  { id: 4, title: 'Ownership', description: 'Owner and seller information' },
  { id: 5, title: 'Documents', description: 'Upload supporting documents' },
  { id: 6, title: 'Review', description: 'Review your submission' },
];

// Step 1 Schema
const step1Schema = z.object({
  propertyType: z.enum([PropertyType.RESIDENTIAL, PropertyType.COMMERCIAL, PropertyType.LAND, PropertyType.INDUSTRIAL], {
    error: 'Please select a property type',
  }),
  propertyTitle: z.string().min(5, 'Property title must be at least 5 characters'),
  propertyPlotSize: z.string().min(1, 'Plot size is required'),
  propertyPlotSizeUnit: z.enum([MeasurementUnit.SQM, MeasurementUnit.HECTARES, MeasurementUnit.ACRES, MeasurementUnit.PLOTS]),
  propertyEstimatedPrice: z.string().min(1, 'Estimated price is required'),
  currency: z.enum([TransactionCurrency.NGN, TransactionCurrency.USD, TransactionCurrency.GBP, TransactionCurrency.EUR]),
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

const formSchema = step1Schema.and(step4Schema);

type FormData = z.infer<typeof formSchema>;

interface PropertyFormProps {
  initialData?: Partial<CreateVerificationDto | UpdateVerificationDto>;
  onSubmit: (data: CreateVerificationDto | UpdateVerificationDto) => void;
  isSubmitting?: boolean;
}

export function PropertyForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: PropertyFormProps) {
  const [location, setLocation] = useState<ExactLocation | undefined>(undefined);
  const [locationIsValid, setLocationIsValid] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [documents, setDocuments] = useState<VerificationDocument[]>(
    initialData?.documents || []
  );
  const maxStep = 6

  const {
    selectedCategory,
    selectedCurrency,
    handleCategoryChange,
  } = useCheckoutStore();

  const addressRequiredErrorMsg = 'Property physical address is required';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      propertyType: initialData?.propertyType || undefined,
      propertyTitle: initialData?.propertyTitle || '',
      propertyPlotSize: initialData?.propertyPlotSize?.value.toString() || '',
      propertyPlotSizeUnit: initialData?.propertyPlotSize?.unit ?? MeasurementUnit.SQM,

      propertyEstimatedPrice: initialData?.propertyEstimatedPrice?.getValue().toString() || '0.0',
      currency: initialData?.propertyEstimatedPrice?.getCurrency() ?? TransactionCurrency.NGN,

      ownerFullName: initialData?.ownerFullName || '',
      sellerFullName: initialData?.sellerInfo?.fullName || '',
      sellerCompany: initialData?.sellerInfo?.company || '',
      sellerEmail: initialData?.sellerInfo?.email || '',
      sellerPhone: initialData?.sellerInfo?.phone || '',
      surveyPlanNumber: initialData?.surveyPlanNumber || '',
      beaconNumbers: initialData?.beaconNumbers || '',
      additionalDetails: initialData?.additionalDetails || '',
      // documents: initialData?.documents || [],
    },
  });

  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          'propertyType',
          'propertyTitle',
          'propertyPlotSize',
          'propertyPlotSizeUnit',
          'propertyEstimatedPrice',
          'currency',
        ];
        break;
      case 2:
        return !!selectedCategory;
      case 3: {
        const addressIsSet = !!location;
        setLocationIsValid(addressIsSet);
        return true; // TODO: return addressIsSet
      }
      case 4:
        fieldsToValidate = [
          'ownerFullName',
          'sellerFullName',
          'sellerEmail',
          'sellerPhone',
        ];
        break;
      case 5:
        // fieldsToValidate = [
        //   'documents',
        // ];
        // break;
        return true;
    }

    return form.trigger(fieldsToValidate);
  };

  const handleNext = async () => {
    console.log("NEXT CLICKED");
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < maxStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if(currentStep == 7){
        setCurrentStep(5);
      } else{
      setCurrentStep((prev) => prev - 1);
      }
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    console.log("FORM SUBMITTED");
    const propertyData: CreateVerificationDto | UpdateVerificationDto = {
      propertyType: data.propertyType,
      propertyTitle: data.propertyTitle,
      propertyPlotSize: {value: parseFloat(data.propertyPlotSize), unit: data.propertyPlotSizeUnit},
      propertyEstimatedPrice: Money.from({value: parseFloat(data.propertyEstimatedPrice), currency: data.currency}),
      category: selectedCategory,
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
      location,
      documents,
    };

    onSubmit(propertyData);
};

  const formValues = form.watch();
  const previewData: Partial<CreateVerificationDto | UpdateVerificationDto> = {
    propertyType: formValues.propertyType,
    propertyTitle: formValues.propertyTitle,
    propertyPlotSize: {value: parseFloat(formValues.propertyPlotSize), unit: formValues.propertyPlotSizeUnit},
    propertyEstimatedPrice: Money.from({value: parseFloat(formValues.propertyEstimatedPrice), currency: formValues.currency}),
    category: selectedCategory,
    ownerFullName: formValues.ownerFullName,
    sellerInfo: formValues.sellerFullName
      ? {
          fullName: formValues.sellerFullName,
          company: formValues.sellerCompany,
          email: formValues.sellerEmail,
          phone: formValues.sellerPhone,
        }
      : undefined,
    location,
    documents,
  };

  const onAddressChange = (location: ExactLocation | undefined) => {
    setLocation(location);
  };

  // const requiredDocuments: MediaType[] = [
  //   {
  //     key: "CofO",
  //     type: "image",
  //     title: "CofO"
  //   }, 
  //   {
      
  //     key: "Deep of transfer",
  //     type: "image",
  //     title: "Deep of transfer"
  //   }
  //   ]

  return (
     <Form {...form}>
      <form 
      onSubmit={(e) => {
          console.log("Submit fired: step= ", currentStep)
        if (currentStep < maxStep) {
          e.preventDefault(); // stop form submission
          handleNext();       // advance to next step
        } else {
          form.handleSubmit(handleFormSubmit)(e); // actually submit at step 5
        }
      }} 
      className="space-y-8">
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
                      <SelectItem value={PropertyType.RESIDENTIAL}>Residential</SelectItem>
                      <SelectItem value={PropertyType.COMMERCIAL}>Commercial</SelectItem>
                      <SelectItem value={PropertyType.LAND}>Land</SelectItem>
                      <SelectItem value={PropertyType.INDUSTRIAL}>Industrial</SelectItem>
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
                name="propertyPlotSize"
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
                name="propertyPlotSizeUnit"
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
                        <SelectItem value={MeasurementUnit.SQM}>Square Meters (sqm)</SelectItem>
                        <SelectItem value={MeasurementUnit.HECTARES}>Hectares</SelectItem>
                        <SelectItem value={MeasurementUnit.ACRES}>Acres</SelectItem>
                        <SelectItem value={MeasurementUnit.PLOTS}>Plots</SelectItem>
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
                name="propertyEstimatedPrice"
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
                  tiers={verificationTiers}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  currency={selectedCurrency}
                  fxRate={fxRates[selectedCurrency]}
              />
          </section>

          {/* Step 3: Location */}
          <div className={cn("space-y-6", currentStep !== 3 && "hidden")}>
            <AddressSearchForm onChange={onAddressChange} />
            {!locationIsValid && (
          <p className="text-sm text-red-500">
            {addressRequiredErrorMsg}
          </p>
        )}
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

            {/* <DocumentUploadField
                            control={form.control}
                            name="documents"
                            label="Required Documents *"
                            // description="Upload all required property verification documents. Survey Plan and C of O are mandatory."
                            requiredTypes={requiredDocuments}
                            maxFiles={requiredDocuments.length}
                            propertyId="property-123"
                            placeholder="Tap to upload required documents"
                          /> */}
          </div>
          {/* Step 6: Preview */}
          <div className={cn("space-y-6", currentStep !== 6 && "hidden")}>
            {currentStep === 6 && (
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
            className={cn(currentStep === 1 && 'invisible')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>


          <Button type="submit" variant="default">
            {currentStep < maxStep ? (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Verification Request'
            )}
          </Button>
{/* 
          {currentStep < 6 ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Verification Request'
              )}
            </Button>
          )} */}
        </div>
      </form>
    </Form>
  );
}
