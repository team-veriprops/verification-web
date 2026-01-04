import { Badge } from "@components/3rdparty/ui/badge";
import { Button } from "@components/3rdparty/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/3rdparty/ui/dropdown-menu";
import PageHeader from "@components/ui/PageHeader";
import { formatMoney } from "@lib/utils";
import { Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { PageDetails } from "types/models";
import { useTransactionStore } from "./libs/useTransactionStore";

export default function TransactionHeader({ title, description }: PageDetails) {
  const { walletBalance } = useTransactionStore();

  return (
    <div className="flex items-center justify-between">
      <PageHeader title={title} description={description} />
      <div className="flex gap-2">
        {/* Mobile: Dropdown Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                <Wallet className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
              <DropdownMenuItem
              //   onClick={() => toast.success("Deposit to wallet dialog opened")}
              >
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Deposit
              </DropdownMenuItem>
              <DropdownMenuItem
              //   onClick={() => toast.success("Withdraw from wallet dialog opened")}
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw
                {walletBalance && <Badge variant="secondary" className="ml-auto">
                  {formatMoney(walletBalance)}
                </Badge>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop: Individual Buttons */}
        <div className="hidden md:flex gap-2">
          <Button
            variant="outline"
            // onClick={() => toast.success("Deposit to wallet dialog opened")}
          >
            <ArrowDownLeft className="h-4 w-4 mr-2" />
            Deposit
          </Button>
          <Button
          // onClick={() => toast.success("Withdraw from wallet dialog opened")}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Withdraw
            {walletBalance && <Badge variant="secondary" className="ml-2">
              {formatMoney(walletBalance)}
            </Badge>}
          </Button>
        </div>
      </div>
    </div>
  );
}
