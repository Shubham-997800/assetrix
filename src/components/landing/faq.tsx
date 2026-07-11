"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How secure is the platform?",
    answer:
      "Nexus is SOC 2 Type II certified, GDPR compliant, and supports HIPAA and ISO 27001 requirements. We use AES-256 encryption at rest, TLS 1.3 in transit, and undergo annual third-party audits.",
  },
  {
    question: "Can the platform scale with our growth?",
    answer:
      "Yes. Nexus is built on a horizontally scalable microservices architecture. We support multi-tenant deployments and can handle millions of concurrent workflows without performance degradation.",
  },
  {
    question: "Do you support integrations with existing systems?",
    answer:
      "We provide pre-built connectors for SAP, Oracle, Microsoft Dynamics, NetSuite, Salesforce, and 50+ other platforms. We also offer a REST API, webhooks, and an integration SDK for custom connections.",
  },
  {
    question: "Can workflows be customized?",
    answer:
      "Absolutely. Our visual workflow builder supports conditional logic, parallel branches, SLA timers, escalation rules, and custom approval chains. No coding required for standard workflows.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "All plans include email and chat support with 24-hour response time. Enterprise plans include 24/7 phone support, a dedicated customer success manager, and quarterly business reviews.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Typical enterprise deployments take 4 to 8 weeks depending on data migration complexity and integration requirements. Our professional services team provides a detailed timeline during onboarding.",
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
