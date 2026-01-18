import { useBodyOverflowHidden } from "@hooks/useBodyOverflowHidden";
import { AnimatePresence, motion } from "framer-motion";
import MobileNavigationBottomPadding from "@components/ui/MobileNavigationBottomPadding";
import { Button } from "@components/3rdparty/ui/button";
import {
  Building2,
  CheckCircle2,
  Compass,
  MapPin,
  PartyPopper,
  Scale,
  User2,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@components/3rdparty/ui/badge";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/3rdparty/ui/tabs";
import {
  VerifierRole,
  TaskAvailabilityStatus,
  TaskStatus,
} from "../models";
import { formatSLATimeRemaining, SLAProgressBar } from "../SLAProgressBar";
import { useGlobalSettings } from "@stores/useGlobalSettings";
import TaskAuditTimeline from "./TaskAuditTimeline";
import { useTaskStore } from "../libs/useTaskStore";
import TaskResponseForm from "./TaskResponseForm";
import { DeclineDialog } from "./dialogs/TaskDeclineDialog";
import { SignatureDialog } from "./dialogs/TaskSignatureDialog";
import TaskOverviewComponent from "./TaskOverviewComponent";

export const verifierRoleIcons: Record<VerifierRole, any> = {
  Lawyer: Scale,
  Surveyor: Compass,
  FieldAgent: User2,
  Registry: Building2,
};
export default function TaskDetailsDrawer() {
  const { settings } = useGlobalSettings();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDecline, setShowDecline] = useState(false);

  const {
    viewCurrentTask,
    setViewCurrentTask,
    currentTask,
    setCurrentTask,
  } = useTaskStore();

  // Lock body scroll when modal is open
  useBodyOverflowHidden(viewCurrentTask);

  const onOpenChange = (open: boolean) => {
    setViewCurrentTask(false);
    if (!open) {
      // Delay clearing until AFTER exit animation finishes
      setTimeout(() => setCurrentTask(null!), 300);
    }
  };

  const RoleIcon = verifierRoleIcons[currentTask?.role_required ?? VerifierRole.LAWYER];
  const showAcceptDecline =
    currentTask?.availability_status ===
      TaskAvailabilityStatus.PENDING &&
    currentTask?.status === TaskStatus.ASSIGNED;

  const handleAccept = () => {
    // acceptTask(task.id);
  };

  const handleDecline = (reason: string) => {
    // declineTask(task.id, reason);
    // setShowDecline(false);
    // onClose();
  };

  const handleSubmit = (signature: any) => {
    // submitTask(task.id, signature);
    // setShowSignature(false);
    // onClose();
  };

  return (
    <>
      <AnimatePresence>
        {viewCurrentTask && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(viewCurrentTask)}
              className="fixed inset-0 w-full h-full bg-background/80 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={
                "fixed right-0 top-0 h-full w-full bg-card border-l border-border shadow-2xl z-50 overflow-y-auto sm:max-w-[850px]"
              }
            >
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2
                      id="task-title"
                      className="text-lg font-semibold text-foreground capitalize"
                    >
                      {currentTask?.property_title}
                    </h2>
                    {/* <SheetTitle className="text-xl">
                    {currentTask?.property_title}
                  </SheetTitle> */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 capitalize">
                      <MapPin className="h-4 w-4" />
                      {currentTask?.location.address}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      <RoleIcon className="mr-1 h-3 w-3" />
                      {currentTask?.role_required}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenChange(viewCurrentTask)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* SLA Banner */}
                <div>
                  <SLAProgressBar
                    start_date={currentTask?.date_assigned ?? ""}
                    due_date={currentTask?.date_due ?? ""}
                    current_date={settings.currentTime}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatSLATimeRemaining(
                      settings.currentTime,
                      currentTask?.date_due ?? ""
                    )}
                  </div>
                </div>

                {showAcceptDecline && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDecline(true)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    <Button
                      onClick={handleAccept}
                      className="bg-success hover:bg-success/90"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Accept Task
                    </Button>
                  </div>
                )}
              </div>

              {/* Confetti Overlay */}
              {showConfetti &&
                currentTask?.status ===
                  TaskStatus.SUBMITTED && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/95 z-10 flex items-center justify-center p-8"
                  >
                    <div className="text-center">
                      <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        🎉 You have already responded to this task!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for helping make Veriprops safer.
                      </p>
                      <Button onClick={() => setShowConfetti(false)}>
                        View your response
                      </Button>
                    </div>
                  </motion.div>
                )}

              <Tabs defaultValue="overview" className="mx-4 mt-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="form">Your response</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <TaskOverviewComponent />
                  <MobileNavigationBottomPadding />
                </TabsContent>
                <TabsContent value="form" className="space-y-4 mt-4">
                  <TaskResponseForm />
                  <MobileNavigationBottomPadding />
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <TaskAuditTimeline />
                  <MobileNavigationBottomPadding />
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SignatureDialog onConfirm={handleSubmit} />

      <DeclineDialog onConfirm={handleDecline} />
    </>
  );
}
