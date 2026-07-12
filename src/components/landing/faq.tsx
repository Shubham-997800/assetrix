"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How are allocation conflicts prevented?",
    answer:
      "Assetrix uses a real-time allocation engine that checks asset availability before confirming any booking or allocation. If a conflict is detected, the system prevents the overlap and suggests alternative time slots or assets.",
  },
  {
    question: "How does maintenance approval work?",
    answer:
      "Maintenance requests follow a configurable approval workflow. Requests are routed to the appropriate manager based on asset value, department rules, and SLA requirements. Escalation rules ensure nothing falls through the cracks.",
  },
  {
    question: "How are audit cycles handled?",
    answer:
      "Assetrix supports scheduled audit cycles with automated reminders. Auditors can perform physical verification using mobile devices, flag discrepancies, and generate compliance reports. All audit trails are immutable and filterable.",
  },
  {
    question: "How does booking overlap validation work?",
    answer:
      "The booking system validates overlaps in real-time using a calendar-based conflict detection algorithm. Double-bookings are prevented at the API level, and users receive suggestions for alternative slots when conflicts arise.",
  },
  {
    question: "Can the platform scale with our growth?",
    answer:
      "Yes. Assetrix is built on a horizontally scalable microservices architecture. We support multi-tenant deployments and can handle millions of asset records without performance degradation.",
  },
  {
    question: "Do you support integrations with existing systems?",
    answer:
      "We provide pre-built connectors for SAP, Oracle, Microsoft Dynamics, NetSuite, and 50+ other platforms. We also offer a REST API, webhooks, and an integration SDK for custom connections.",
  },
];

export function FAQ() {
  return (
    <section className="border-b border-border bg-background py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <Accordion className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-border bg-card px-5"
            >
              <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
