import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlogPost } from "@/hooks/useBlogPosts";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogPost(id);

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
        title={`${post.title} | Leadership by Design`}
        description={post.excerpt}
        canonicalUrl={`/blog/${post.slug}`}
        keywords={post.tags?.join(", ")}
        author={post.author}
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
              <div 
                className="blog-content prose prose-lg dark:prose-invert max-w-none 
                  prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-8 prose-headings:mb-4
                  prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-6
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:mb-6
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-a:text-primary prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-primary/80
                  prose-em:text-foreground/90
                  prose-ul:my-6 prose-ul:pl-6 prose-li:my-2
                  prose-ol:my-6 prose-ol:pl-6
                  prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8
                  prose-img:rounded-lg prose-img:my-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <style>{`
                .blog-content {
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                }
                .blog-content p {
                  margin-bottom: 1.5em;
                  line-height: 1.8;
                }
                .blog-content p:empty {
                  display: block;
                  min-height: 1em;
                }
                .blog-content h2 {
                  margin-top: 2.5em;
                  margin-bottom: 1em;
                }
                .blog-content h3 {
                  margin-top: 2em;
                  margin-bottom: 0.75em;
                }
                .blog-content ul, .blog-content ol {
                  margin: 1.5em 0;
                  padding-left: 1.5em;
                }
                .blog-content li {
                  margin: 0.5em 0;
                }
                .blog-content blockquote {
                  margin: 2em 0;
                  padding: 1em 1.5em;
                  background: hsl(var(--muted) / 0.3);
                  border-radius: 0.5rem;
                }
              `}</style>
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
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
