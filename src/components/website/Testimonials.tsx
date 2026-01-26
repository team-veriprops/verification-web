import { testimonials } from "@data/mockData";
import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Trusted by Nigerians
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Buyers Are Saying
          </h2>
          <p className="text-lg text-muted-foreground">
            Real stories from people who verified before they paid.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl border border-border p-6 shadow-soft hover:shadow-elevated transition-shadow duration-300 opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary/20 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                {'"' + testimonial.content + '"'}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 pt-16 border-t border-border">
          {[
            { value: "2,847+", label: "Properties Verified" },
            { value: "₦2.1B+", label: "In Scams Prevented" },
            { value: "156", label: "Disputes Flagged" },
            { value: "98%", label: "Customer Satisfaction" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center opacity-0 animate-fade-up"
              style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: "forwards" }}
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;