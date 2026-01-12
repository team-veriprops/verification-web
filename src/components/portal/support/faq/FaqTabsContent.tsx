import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/3rdparty/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@components/3rdparty/ui/card";
import { mockFAQs } from "@data/portalMockData";

export default function FaqTabsContent() {
  return (
      <Card className="border border-border py-4">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="space-y-4">
              {mockFAQs.map((faq, index) => (
                <AccordionItem
                  key={faq.id ?? index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </CardContent>
      </Card>
  );
}
