import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  return (
    <>
      <SEO
        title="Blog | Leadership by Design"
        description="Insights on leadership development, organizational change, and personal growth from Kevin Britz and the Leadership by Design team."
        canonicalUrl="/blog"
        keywords="leadership blog, executive coaching insights, organizational development, personal growth, Kevin Britz"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Leadership Insights
              </h1>
              <p className="text-xl text-muted-foreground">
                Thoughts, frameworks, and stories from over a decade of working with leaders and organisations.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 flex-1">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
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

            {blogPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
