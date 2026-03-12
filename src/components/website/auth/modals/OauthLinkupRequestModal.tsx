"use client";

import { useState } from 'react';
import { XIcon, ArrowDownRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@components/3rdparty/ui/dialog';
import { Button } from '@components/3rdparty/ui/button';
import { SocialLoginUserInfoDto } from '../models';

export default function OauthLinkupRequestModal({userInfo}:{userInfo: SocialLoginUserInfoDto | null}) {
  const [open, setOpen] = useState(true);
  const router = useRouter();


  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing programmatically
      if (!newOpen) return; // ignore backdrop clicks
      }}
    >
      <DialogOverlay className="fixed inset-0 bg-black/5 backdrop-blur-sm" />
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold capitalize">Link {userInfo?.provider} Account Instead</DialogTitle>
          <button
            type="button"
            className="absolute -top-2 right-2 p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          An account already exists. Please login to link your {userInfo?.provider} account.
        </p>

        <div className="flex gap-3 mt-2">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
          <Button className="flex-1"
          onClick={() => {
            setOpen(false);
            router.push("/auth/sign-in")
          }}
          >
            <AnimatePresence mode="wait">
                <motion.span key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Continue with Login Form
                </motion.span>
                <ArrowDownRight />
            </AnimatePresence>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
