import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SEO from "@/components/SEO";
import { ArticleSchema, BreadcrumbSchema } from "@/components/StructuredData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import BlogCTA from "@/components/blog/BlogCTA";
import RelatedPosts from "@/components/blog/RelatedPosts";
import SocialShareButtons from "@/components/shared/SocialShareButtons";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogPost(id);
  const { data: allPosts } = useBlogPosts();
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link to="/blog" className="text-primary hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonicalUrl={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.featured_image || undefined}
        keywords={post.tags?.join(", ")}
        author={post.author}
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
      />
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        image={post.featured_image || undefined}
        authorName={post.author}
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        url={`/blog/${post.slug}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <div className="min-h-screen flex flex-col">
        <Header />

        <article className="pt-32 pb-16 flex-1">
          <div className="container mx-auto px-6">
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="max-w-4xl mx-auto mb-8">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full aspect-video object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Header */}
            <header className="max-w-3xl mx-auto mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{post.author}</p>
                    <p className="text-sm line-clamp-1">{post.author_role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="sm:ml-auto"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </header>

            {/* Content */}
            <div className="max-w-3xl mx-auto">
              <div className="blog-content prose prose-xl dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:pt-10 prose-h2:border-t prose-h2:border-border/40
                  prose-h3:text-xl prose-h3:mt-14 prose-h3:mb-5
                  prose-p:text-muted-foreground prose-p:leading-[2.05] prose-p:mb-9 prose-p:text-[1.06rem]
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80
                  prose-em:text-foreground/85 prose-em:not-italic
                  prose-ul:my-10 prose-ul:pl-6 prose-ul:space-y-4
                  prose-ol:my-10 prose-ol:pl-6 prose-ol:space-y-4
                  prose-li:text-muted-foreground prose-li:leading-relaxed prose-li:pl-1
                  prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:my-12 prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg
                  prose-img:rounded-xl prose-img:my-12 prose-img:shadow-md
                  [&>*:first-child]:mt-0"
              >
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
              {/* Blog CTA */}
              <BlogCTA postTitle={post.title} />

              {/* Share */}
              <div className="my-12">
                <SocialShareButtons
                  title={post.title}
                  description={post.excerpt}
                />
              </div>
            </div>

            {/* Author Bio */}
            <div className="max-w-3xl mx-auto mt-16 pt-8 border-t">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {post.author}
                  </h3>
                  <p className="text-muted-foreground mt-1">{post.author_role}</p>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {allPosts && (
              <div className="max-w-5xl mx-auto">
                <RelatedPosts
                  currentSlug={post.slug}
                  currentTags={post.tags || []}
                  posts={allPosts}
                />
              </div>
            )}
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
