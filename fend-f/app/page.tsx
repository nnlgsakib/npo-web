import { HeroSection } from "@/components/hero-section"
import { PostsCarousel } from "@/components/posts-carousel"
import { HeroesSection } from "@/components/heroes-section"
import { AboutSection } from "@/components/about-section"
import { CTASection } from "@/components/cta-section"
import { getAllPosts } from "@/lib/api"

export default async function HomePage() {
  const posts = await getAllPosts()

  return (
    <div className="pt-20">
      <HeroSection />
      <PostsCarousel posts={posts} />
      <HeroesSection />
      <AboutSection />
      <CTASection />
    </div>
  )
}
