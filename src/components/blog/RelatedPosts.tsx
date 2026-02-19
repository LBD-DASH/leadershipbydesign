import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/hooks/useBlogPosts";

interface RelatedPostsProps {
  currentSlug: string;
  currentTags: string[];
  posts: BlogPost[];
}

export default function RelatedPosts({ currentSlug, currentTags, posts }: RelatedPostsProps) {
  // Find related posts by matching tags, excluding current
  const related = posts
    .filter((p) => p.slug !== currentSlug && p.published)
    .map((p) => ({
      ...p,
      relevance: p.tags?.filter((t) => currentTags.includes(t)).length || 0,
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="my-16 pt-12 border-t border-border">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Keep Reading
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all duration-300"
          >
            {post.featured_image && (
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {post.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {post.excerpt}
            </p>
            <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
              Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
