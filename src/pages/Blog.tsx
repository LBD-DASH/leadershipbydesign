import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Settings, Search, Tag } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogCTA from "@/components/blog/BlogCTA";

const Blog = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(
    new Set(posts?.flatMap((p) => p.tags || []) || [])
  ).sort();

  // Filter posts
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !activeTag || post.tags?.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const featuredPost = filteredPosts?.[0];
  const remainingPosts = filteredPosts?.slice(1);

  return (
    <>
      <SEO
        title="Leadership Blog | Insights from Leadership by Design"
        description="Practical insights on leadership development, team effectiveness, and organizational performance from 11 years of executive coaching experience."
        canonicalUrl="/blog"
        ogImage="https://leadershipbydesign.co/og-blog.jpg"
        keywords="leadership blog, leadership insights, executive coaching blog, team development, Kevin Britz, leadership articles"
      />
      <div className="min-h-screen flex flex-col">
        <Header />

        {/* Hero */}
        <section className="pt-24 sm:pt-32 pb-8 sm:pb-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-3 sm:mb-4">
                The Leadership Lab
              </Badge>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Leadership Insights
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8">
                Frameworks, diagnostics, and hard-won lessons from working with 10,000+ leaders.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tags */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <Button
                    variant={activeTag === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTag(null)}
                    className="text-xs"
                  >
                    All
                  </Button>
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={activeTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      className="text-xs gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </Button>
                  ))}
                </div>
              )}

              {/* Manage button hidden - access via /blog-admin directly */}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && !searchQuery && !activeTag && (
          <section className="pb-12">
            <div className="container mx-auto px-6">
              <Link to={`/blog/${featuredPost.slug}`}>
                <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-0">
                    {featuredPost.featured_image && (
                      <div className="aspect-video md:aspect-auto md:min-h-[360px] overflow-hidden">
                        <img
                          src={featuredPost.featured_image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <Badge variant="secondary" className="w-fit mb-4">Featured</Badge>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {featuredPost.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{featuredPost.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Grid */}
        <section className="py-8 flex-1">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-full animate-pulse">
                    <CardHeader className="pb-4">
                      <div className="h-4 bg-muted rounded w-20 mb-3" />
                      <div className="h-6 bg-muted rounded w-3/4" />
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (remainingPosts ?? filteredPosts) && (remainingPosts ?? filteredPosts)!.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {((searchQuery || activeTag ? filteredPosts : remainingPosts) || []).map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer overflow-hidden">
                      {post.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  {searchQuery || activeTag
                    ? "No articles match your search. Try a different term."
                    : "No blog posts yet. Check back soon!"}
                </p>
                {(searchQuery || activeTag) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTag(null);
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <BlogCTA />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
