import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-24" data-testid="contact-section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Contact Us
            </p>
            <h2 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
              Let’s Build Something Extraordinary
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ready to start your next construction project? Get in touch with our
              team for a consultation.
            </p>

            <div className="mt-8 space-y-4">
              <ContactItem icon={Mail} label="Email" value="contact@constructionconnection.com" />
              <ContactItem icon={Phone} label="Phone" value="+1 (555) 234-5678" />
              <ContactItem icon={MapPin} label="Headquarters" value="350 Fifth Avenue, New York, NY" />
              <ContactItem icon={Clock} label="Hours" value="Mon-Fri, 8AM-6PM EST" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel rounded-2xl p-8">
            <h3 className="text-xl font-bold text-foreground">Get a Free Quote</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill out the form below and we’ll get back to you within 24 hours.
            </p>

            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <Input className="mt-1 bg-background/50" placeholder="John" data-testid="contact-first-name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <Input className="mt-1 bg-background/50" placeholder="Doe" data-testid="contact-last-name" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input className="mt-1 bg-background/50" type="email" placeholder="john@company.com" data-testid="contact-email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input className="mt-1 bg-background/50" type="tel" placeholder="+1 (555) 000-0000" data-testid="contact-phone" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Project Type</label>
                <select className="mt-1 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground" data-testid="contact-project-type">
                  <option value="">Select a project type</option>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Message</label>
                <textarea
                  className="mt-1 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm text-foreground min-h-[100px] resize-none"
                  placeholder="Tell us about your project..."
                  data-testid="contact-message"
                />
              </div>
              <Button type="submit" className="w-full" size="lg" data-testid="contact-submit">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
