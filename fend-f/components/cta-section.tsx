import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-gradient" />

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-2xl animate-float" />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-2xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-primary text-sm font-semibold">Make an Impact Today</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">Ready to make a difference?</h2>
        <p className="text-xl text-muted-foreground">
          Your contribution helps us empower future leaders and transform communities across Bangladesh.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/donate">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-background rounded-xl px-12 h-16 text-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-primary/50"
            >
              Donate Today
            </Button>
          </Link>
          <Link href="/members/apply">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/10 rounded-xl px-12 h-16 text-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 bg-transparent"
            >
              Join Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
