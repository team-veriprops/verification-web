import TaskComponentPage from "@components/portal/tasks/TaskComponentPage";
import { Metadata } from "next";

const title = "Welcome back";
const description =
  "Here are your assigned verification tasks. Let's build trust, one property at a time.";

export const metadata: Metadata = {
  title: `${title} | Veriprops`,
  description: description,
};

export default function TaskPage() {

  return <TaskComponentPage title={title} description={description} />;
}
