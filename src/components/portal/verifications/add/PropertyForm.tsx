import { useState, useCallback } from 'react';
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
import { PropertyPreview } from './PropertyPreview';
import { CategorySelector } from '../checkout/CategorySelector';
import AddressSearchForm from '@components/ui/AddressSearchForm';

import { cn } from '@lib/utils';
// import { fxRates, verificationTiers } from '@data/verificationTiers';
import { useCheckoutStore } from '../checkout/libs/useCheckoutStore';

import {
  ExactLocation,
  MeasurementUnit,
  Money,
  PropertyType,
  TransactionCurrency,
} from 'types/models';

import {
  CreateVerificationDto,
  UpdateVerificationDto,
  VerificationDocument,
} from '../models';
import { useVerificationQueries } from '../libs/useVerificationQueries';
import { AsyncStateComponent } from '@components/ui/AsyncStateComponent';

/* ---------------- Steps ---------------- */

const steps = [
  { id: 1, title: 'Property Details', description: 'Basic property information' },
  { id: 2, title: 'Category', description: 'Property verification category' },
  { id: 3, title: 'Location', description: 'Property address and location' },
  { id: 4, title: 'Ownership', description: 'Owner and seller information' },
  { id: 5, title: 'Documents', description: 'Upload supporting documents' },
  { id: 6, title: 'Review', description: 'Review your submission' },
];

/* ---------------- Schemas ---------------- */

const step1Schema = z.object({
  propertyType: z.enum(PropertyType,
    { error: () => ({ message: 'Please select a property type' }) }
  ),

  propertyTitle: z
    .string()
    .min(5, 'Property title must be at least 5 characters'),

  propertyPlotSize: z
    .string()
    .min(1, 'Plot size is required')
    .refine(v => Number(v) > 0, 'Plot size must be greater than zero'),

  propertyPlotSizeUnit: z.enum(MeasurementUnit,
    { error: () => ({ message: 'Please select a plot size unit' }) }
  ),

  propertyEstimatedPrice: z
    .string()
    .min(1, 'Estimated price is required')
    .refine(v => Number(v) > 0, 'Price must be greater than zero'),

  currency: z.enum(TransactionCurrency,
    { error: () => ({ message: 'Please select a currency' }) }
  ),
});

const step4Schema = z.object({
  ownerFullName: z
    .string()
    .min(3, 'Owner name must be at least 3 characters'),

  sellerFullName: z
    .string()
    .min(3, 'Seller name must be at least 3 characters'),

  sellerCompany: z.string().optional(),

  sellerEmail: z
    .string()
    .email('Please enter a valid email'),

  sellerPhone: z
    .string()
    .min(10, 'Please enter a valid phone number'),

  surveyPlanNumber: z.string().optional(),

  beaconNumbers: z.string().optional(),

  additionalDetails: z.string().optional(),
});

const formSchema = step1Schema.and(step4Schema);
type FormDataSchema = z.infer<typeof formSchema>;

const MAX_STEP = 6;

/* ---------------- Component ---------------- */

export function PropertyForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: {
  initialData?: Partial<CreateVerificationDto | UpdateVerificationDto>;
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
}) {
  
  const {useGetVerificationTierPage} = useVerificationQueries();
  const { data: verificationTiers, isLoading, isError } = useGetVerificationTierPage();

  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState<ExactLocation>();
  const [locationValid, setLocationValid] = useState(true);
  const [documents, setDocuments] = useState<VerificationDocument[]>(
    initialData?.documents || []
  );

  const {
    selectedCategory,
    selectedCurrency,
    handleCategoryChange,
  } = useCheckoutStore();

  const form = useForm<FormDataSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      propertyType: initialData?.propertyType,
      propertyTitle: initialData?.propertyTitle || '',
      propertyPlotSize: initialData?.propertyPlotSize?.value?.toString() || '',
      propertyPlotSizeUnit:
        initialData?.propertyPlotSize?.unit ?? MeasurementUnit.SQM,

      propertyEstimatedPrice:
        initialData?.propertyEstimatedPrice?.getValue()?.toString() || '',
      currency:
        initialData?.propertyEstimatedPrice?.getCurrency() ??
        TransactionCurrency.NGN,

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

  /* ---------------- Step validation ---------------- */

  const validateStep = useCallback(async () => {
    if (currentStep === 1) {
      return form.trigger([
        'propertyType',
        'propertyTitle',
        'propertyPlotSize',
        'propertyPlotSizeUnit',
        'propertyEstimatedPrice',
        'currency',
      ]);
    }

    if (currentStep === 2) return !!selectedCategory;

    if (currentStep === 3) {
      const ok = !!location;
      setLocationValid(ok);
      return ok;
    }

    if (currentStep === 4) {
      return form.trigger([
        'ownerFullName',
        'sellerFullName',
        'sellerEmail',
        'sellerPhone',
      ]);
    }

    return true;
  }, [currentStep, form, selectedCategory, location]);

  /* ---------------- Navigation ---------------- */

  const handleNext = async () => {
    if (await validateStep()) {
      setCurrentStep(s => Math.min(s + 1, MAX_STEP));
    }
  };

  const handleBack = () => setCurrentStep(s => Math.max(1, s - 1));

  const handleSubmitForm = (data: FormDataSchema) => {
    // const payload: CreateVerificationDto | UpdateVerificationDto = {
    //   propertyType: data.propertyType,
    //   propertyTitle: data.propertyTitle,
    //   propertyPlotSize: {
    //     value: Number(data.propertyPlotSize),
    //     unit: data.propertyPlotSizeUnit,
    //   },
    //   propertyEstimatedPrice: Money.from({
    //     value: Number(data.propertyEstimatedPrice),
    //     currency: data.currency,
    //   }),
    //   category: selectedCategory,
    //   ownerFullName: data.ownerFullName,
    //   sellerInfo: {
    //     fullName: data.sellerFullName,
    //     company: data.sellerCompany,
    //     email: data.sellerEmail,
    //     phone: data.sellerPhone,
    //   },
    //   surveyPlanNumber: data.surveyPlanNumber,
    //   beaconNumbers: data.beaconNumbers,
    //   additionalDetails: data.additionalDetails,
    //   location,
    //   documents,
    // };

    const formData = new FormData();

    formData.append('payload', JSON.stringify({
      propertyType: data.propertyType,
      propertyTitle: data.propertyTitle,
      propertyPlotSize: {
        value: Number(data.propertyPlotSize),
        unit: data.propertyPlotSizeUnit,
      },
      propertyEstimatedPrice: {
        value: Number(data.propertyEstimatedPrice),
        currency: data.currency,
      },
      ownerFullName: data.ownerFullName,
      sellerInfo: {
        fullName: data.sellerFullName,
        company: data.sellerCompany,
        email: data.sellerEmail,
        phone: data.sellerPhone,
      },
      category: selectedCategory,
      surveyPlanNumber: data.surveyPlanNumber,
      beaconNumbers: data.beaconNumbers,
      additionalDetails: data.additionalDetails,


      location,
      documents: documents.map(d => ({
        type: d.type,
        filename: d?.name ?? "",
      })),
    }));

    documents.forEach(doc => {
      formData.append('files', doc.file ?? ""); // multiple allowed
    });

    onSubmit(formData);
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

  return (
    <Form {...form}>
      <form className="space-y-8"
      onSubmit={(e) => {
          console.log("Submit fired: step= ", currentStep)
        if (currentStep < MAX_STEP) {
          e.preventDefault(); // stop form submission
          handleNext();       // advance to next step
        } else {
          form.handleSubmit(handleSubmitForm)(e); // actually submit at step 5
        }
      }}
      >
        <FormStepIndicator
          steps={steps}
          currentStep={currentStep}
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
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className={cn('space-y-6', currentStep !== 2 && 'hidden')}>
            <AsyncStateComponent
                    isLoading={isLoading}
                    isError={isError}
                    data={verificationTiers}
                    loadingText="Loading verification categories..."
                    errorText="Failed to load verification categories, please refresh the page, and try again later."
                    emptyText="No verification categories found."
                  >
                    {() => (
                      <CategorySelector
                          tiers={verificationTiers?.items ?? []}
                          selectedCategory={selectedCategory}
                          onCategoryChange={handleCategoryChange}
                          currency={selectedCurrency}
                      />
                    )}
            </AsyncStateComponent>
          </div>

          {/* Step 3: Location */}
          <div className={cn('space-y-6', currentStep !== 3 && 'hidden')}>
            <AddressSearchForm onChange={setLocation} />
            {!locationValid && (
              <p className="text-sm text-red-500">
                Property physical address is required
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
          </div>
          {/* Step 6: Preview */}
          <div className={cn('space-y-6', currentStep !== 6 && 'hidden')}>
            <PropertyPreview data={previewData} showSource={false} />
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
            {currentStep < MAX_STEP ? (
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
        </div>

        {/* Navigation
        // <div className="flex justify-between pt-6 border-t">
        //   <Button
        //     type="button"
        //     variant="outline"
        //     disabled={currentStep === 1}
        //     onClick={back}
        //     className={cn(currentStep === 1 && 'invisible')}
        //   >
        //     <ChevronLeft className="w-4 h-4 mr-2" />
        //     Back
        //   </Button>

        //   {currentStep < MAX_STEP ? (
        //     <Button type="button" onClick={next}>
        //       Next
        //       <ChevronRight className="w-4 h-4 ml-2" />
        //     </Button>
        //   ) : (
        //     <Button type="submit" disabled={isSubmitting}>
        //       {isSubmitting && (
        //         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        //       )}
        //       Submit Verification Request
        //     </Button>
        //   )}
        // </div> */}
      </form>
    </Form>
  );
}
