import { getAllPinnedMembers, type OfficialMember } from "@/lib/api"
import { HeroesCarousel } from "@/components/heroes-carousel"

export async function HeroesSection() {
  const data = await getAllPinnedMembers(1, 24)
  const heroes: OfficialMember[] = data.members || []

  if (!heroes.length) return null

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-4xl font-bold text-foreground">See Our Heroes</h2>
          <p className="text-muted-foreground text-lg">Pinned members leading by example</p>
        </div>
        <HeroesCarousel heroes={heroes} />
      </div>
    </section>
  )
}
