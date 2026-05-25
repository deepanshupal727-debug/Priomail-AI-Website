import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const AVATARS = [
  "https://images.unsplash.com/photo-1758534063829-a72058381e21?crop=entropy&cs=srgb&fm=jpg&w=200&q=80",
  "https://images.unsplash.com/photo-1769636929231-3cd7f853d038?crop=entropy&cs=srgb&fm=jpg&w=200&q=80",
  "https://images.unsplash.com/photo-1766022411633-e88e3650538b?crop=entropy&cs=srgb&fm=jpg&w=200&q=80",
  "https://images.pexels.com/photos/36623225/pexels-photo-36623225.jpeg?auto=compress&cs=tinysrgb&w=200",
];

const QUOTES = [
  {
    quote: "I almost missed a $400K wire approval because it was buried under 87 newsletter emails. PrioMail's alarm woke me up at 2am — and saved the deal.",
    name: "Aarav Mehta",
    title: "CFO, Falcon Logistics",
    avatar: AVATARS[0],
    stars: 5,
  },
  {
    quote: "The phishing radar caught a fake invoice from someone pretending to be our biggest vendor. That alone paid for the year.",
    name: "Priya Sharma",
    title: "Founder, NorthStack",
    avatar: AVATARS[1],
    stars: 5,
  },
  {
    quote: "My inbox went from 11,000 unread to 23 in two weeks. The auto-drafts feel like I wrote them. Pretty close to magic.",
    name: "Marcus Reyes",
    title: "VP Engineering, Plydex",
    avatar: AVATARS[2],
    stars: 5,
  },
  {
    quote: "I run a 40-person team. Before PrioMail, we lost critical client emails weekly. Now nothing slips. Game changer.",
    name: "Lena Costa",
    title: "COO, BrightForge Studios",
    avatar: AVATARS[3],
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 md:py-32 bg-card/30 border-y border-border" data-testid="testimonials">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-12 gap-8 mb-16"
        >
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-bold text-primary mb-4">
              Loved by 12,000+ professionals
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter leading-[0.95]">
              Stories from inboxes<br />we rescued<span className="text-primary">.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 grid grid-cols-3 gap-4 self-end">
            <div>
              <div className="font-display text-4xl text-primary">4.9</div>
              <div className="text-xs text-muted-foreground mt-1">avg rating</div>
            </div>
            <div>
              <div className="font-display text-4xl">12k+</div>
              <div className="text-xs text-muted-foreground mt-1">active users</div>
            </div>
            <div>
              <div className="font-display text-4xl">11h</div>
              <div className="text-xs text-muted-foreground mt-1">saved per week</div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {QUOTES.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-2xl p-7 hover:border-white/20 transition-colors flex flex-col"
              data-testid={`testimonial-${i}`}
            >
              <Quote className="w-6 h-6 text-primary/40 mb-4" />
              <p className="text-sm text-foreground leading-relaxed mb-6 flex-1">{t.quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground">{t.title}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
