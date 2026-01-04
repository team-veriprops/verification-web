import TransactionsComponentPage from "@components/portal/transactions/TransactionsComponentPage";
import { Metadata } from "next";

const title = "Transactions";
const description =
  "Manage and track your property transactions with complete transparency";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function TransactionsPage(){
    return (
        <TransactionsComponentPage title={title} description={description}  />
    );
}