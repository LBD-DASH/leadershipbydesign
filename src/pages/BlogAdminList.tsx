import { Link } from "react-router-dom";
import { Plus, Edit, Eye, Calendar } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const BlogAdminList = () => {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <>
      <SEO
        title="Blog Admin | Leadership by Design"
        description="Manage blog posts"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 pt-32 pb-16">
          <div className="container mx-auto px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Blog Admin</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your blog posts
                </p>
              </div>
              <Link to="/blog-admin/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </div>

            {/* Posts Table */}
            {isLoading ? (
              <div className="text-center py-16 text-muted-foreground">
                Loading posts...
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{post.title}</span>
                            <span className="text-sm text-muted-foreground">
                              /{post.slug}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/blog/${post.slug}`} target="_blank">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link to={`/blog-admin/${post.slug}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16 border rounded-lg">
                <p className="text-muted-foreground mb-4">No blog posts yet</p>
                <Link to="/blog-admin/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first post
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogAdminList;
