import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, Heart } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(76, 175, 80, 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-2xl bg-gradient-to-br from-card to-muted border-2 border-primary/20 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                Empowering communities through education, leadership development, and sustainable social initiatives
                that create lasting change.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-gradient-to-br from-card to-muted border-2 border-secondary/20 shadow-lg hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Impact Stories</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discover how we're transforming lives and building stronger communities across Bangladesh.
              </p>
              <Link href="/works">
                <Button
                  variant="outline"
                  className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-background rounded-lg mt-2 bg-transparent"
                >
                  View Our Works
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-gradient-to-br from-card to-muted border-2 border-accent/20 shadow-lg hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-background" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Join Us</h3>
              <p className="text-muted-foreground leading-relaxed">
                Be part of the movement. Your support helps us create opportunities for future leaders.
              </p>
              <Link href="/donate">
                <Button
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-background rounded-lg mt-2 bg-transparent"
                >
                  Donate Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
