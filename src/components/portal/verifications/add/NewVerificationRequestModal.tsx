"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, Link2, FileText, X } from 'lucide-react';
import { Button } from '@components/3rdparty/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/3rdparty/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/3rdparty/ui/card';
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/contexts/AuthContext';
import { PropertyDetails } from '@components/portal/verifications/add/models';
import { PropertyForm } from '@components/portal/verifications/add/PropertyForm';
import { UrlExtractor } from '@components/portal/verifications/add/UrlExtractor';
import { toast } from '@components/3rdparty/ui/use-toast';
import { useVerificationStore } from '../libs/useVerificationStore';
import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useBodyOverflowHidden } from '@hooks/useBodyOverflowHidden';
import CheckoutComponentModal from '../checkout/CheckoutComponentModal';

export default function NewVerificationRequestModal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'url'>('manual');
  const [extractedData, setExtractedData] = useState<Partial<PropertyDetails> | null>(null);
  const { viewAddVerificationModal, setViewAddVerificationModal, viewVerificationCheckoutModal, setViewVerificationCheckoutModal } = useVerificationStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  
  // Lock body scroll when modal is open
  useBodyOverflowHidden(viewAddVerificationModal);

  useEffect(()=>{
    setViewVerificationCheckoutModal(true)
  }, [setViewVerificationCheckoutModal])

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("add")
    replace(`${pathname}?${params.toString()}`);

    setViewAddVerificationModal(false)
  }
    

  const handleExtractedData = (data: Partial<PropertyDetails>) => {
    setExtractedData(data);
    setActiveTab('manual');
    toast({
      title: 'Data Extracted',
      description: 'Property details have been pre-filled. Please review and complete the form.',
    });
  };

  const handleSubmit = async (data: PropertyDetails) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Verification Request Submitted',
        description: 'Your property verification request has been submitted successfully. We will review it shortly.',
      });

      handleClose();
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit verification request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z- bg-background"
    >
      {/* Header */}
            <header className="border-b border-border bg-card">
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-lg font-display font-semibold text-foreground">
                New Verification Request
              </h1>
              <p className="text-sm text-muted-foreground">
                Submit property details for verification
              </p>
            </div>
            <button onClick={handleClose} className="text-gray-600 hover:text-black">
            <X className="w-6 h-6" />
          </button>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClose()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='h-[calc(100%-4rem)] overflow-y-auto'>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            <CardDescription>
              Enter property details manually or extract from a property listing URL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'manual' | 'url')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Enter Manually
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Extract from URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-0">
                <PropertyForm
                  initialData={extractedData || undefined}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>

              <TabsContent value="url" className="mt-0">
                <UrlExtractor onExtract={handleExtractedData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <h3 className="text-sm font-medium text-foreground mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground">
            Our verification process typically takes 3-5 business days. For urgent requests or questions, 
            please contact our support team at support@veriprops.ng
          </p>
        </div>
      </main>
      </div>
    </motion.div>
  );
}
