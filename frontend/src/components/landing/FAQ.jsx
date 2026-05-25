import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How does PrioMail AI classify my emails?",
    a: "Every incoming message is sent (encrypted, in-transit) to Claude Haiku 4.5 with a tuned priority schema. We assign one of five labels — CRITICAL, URGENT, NORMAL, SPAM, PHISHING — based on sender, content, your past responses, and contextual signals. Average classification time is under 400ms.",
  },
  {
    q: "Is my email data safe?",
    a: "Yes. We use OAuth (read-only) for Gmail and Outlook — your passwords never touch our servers. Data is encrypted in transit (TLS 1.3) and at rest (AES-256). We're SOC 2 Type II compliant, never sell data, and you can revoke access in one click.",
  },
  {
    q: "What does the alarm-style notification actually do?",
    a: "For emails classified CRITICAL, we send a push notification through OneSignal that repeats every 60 seconds (up to 5 retries) until you tap to acknowledge or reply. You can mute the alarm by category, sender, or time-of-day in settings.",
  },
  {
    q: "Can I connect multiple inboxes?",
    a: "Yes. Pro supports 3 inboxes, Team supports 10, and Enterprise is unlimited. You can mix Gmail and Outlook accounts under the same dashboard.",
  },
  {
    q: "How does the AI auto-draft feature work?",
    a: "When an email sits unanswered past your usual response window, PrioMail drafts a reply in your writing style (learned from your past sent mail). You review, edit if needed, and send with one tap. We never auto-send anything.",
  },
  {
    q: "What happens if I cancel?",
    a: "You keep access until the end of your billing period. After that, we revoke OAuth tokens and delete your classification history within 30 days. No questions, no dark patterns.",
  },
  {
    q: "Do you support 2-month-free annual billing?",
    a: "Yes — annual plans across Pro and Team get 2 months free automatically. Switch monthly→annual any time from settings and we'll prorate the difference.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan supports 1 inbox and classifies up to 100 emails per day. No credit card required to start.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="relative py-24 md:py-32" data-testid="faq">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-primary mb-4">
            FAQ
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]">
            Questions, answered<span className="text-primary">.</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="w-full space-y-3" data-testid="faq-accordion">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-border rounded-2xl px-6 hover:border-white/20 transition-colors data-[state=open]:border-primary/40"
              data-testid={`faq-item-${i}`}
            >
              <AccordionTrigger className="font-display text-base md:text-lg tracking-tight text-left hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
