import { Badge } from "@components/3rdparty/ui/badge";
import { Card } from "@components/3rdparty/ui/card";
import ToolTipComponent from "@components/ui/ToolTipComponent";
import { Money } from "@components/website/property/models";
import { formatMoney } from "@lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeInfo, ChevronDown } from "lucide-react";
import { memo, useState } from "react";

interface TransactionStatCardProps {
  totalMoney: Money;
  walletMoney: Money;
  escrowMoney: Money;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
  moneyColor?: string;
  toolTip: string;
  isTotalBalance?: boolean;
}
function TransactionStatCardComponent({
  totalMoney,
  walletMoney,
  escrowMoney,
  label,
  icon,
  iconBgColor,
  iconColor,
  moneyColor = "",
  toolTip,
  isTotalBalance = false,
}: TransactionStatCardProps) {
  const [openBreakDown, setOpenBreakDown] = useState(false);
  const Icon = icon;
  
  return (
    <Card className={`p-3 transition-shadow group relative ${isTotalBalance ? "bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-lg hover:shadow-xl" : "hover:shadow-md"}`}>
      <ToolTipComponent label={toolTip}>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <BadgeInfo tabIndex={0} className="h-4 w-4 text-muted-foreground" />
        </div>
      </ToolTipComponent>

      <div className="flex items-center justify-between">
        <div className={`p-1 rounded-xl ${iconBgColor}`}>
          {Icon && <Icon className={`h-6 w-6 ${iconColor}`} />}
        </div>
        {isTotalBalance && (
          <Badge variant="secondary" className="absolute top-10 right-4 text-xs">
            Total
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-3xl font-bold tabular-nums ${moneyColor}`}>
        {formatMoney(totalMoney)}
      </p>

      <button
        onClick={() => setOpenBreakDown((prev) => !prev)}
        aria-expanded={openBreakDown}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <span>View breakdown</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            openBreakDown ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {openBreakDown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1], // smoother cubic-bezier easing
            }}
            className="mt-1 pt-1 border-t border-border space-y-2"
          >
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">Wallet</span>
              <span className="font-medium tabular-nums">{formatMoney(walletMoney)}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">Escrow</span>
              <span className="font-medium tabular-nums">{formatMoney(escrowMoney)}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default memo(TransactionStatCardComponent);
