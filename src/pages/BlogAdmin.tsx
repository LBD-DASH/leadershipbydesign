import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Upload, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useBlogPost,
  useUpdateBlogPost,
  useCreateBlogPost,
  useDeleteBlogPost,
  uploadBlogImage,
  BlogPost,
} from "@/hooks/useBlogPosts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import RichTextEditor from "@/components/RichTextEditor";

const BlogAdmin = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = slug === "new";

  const { data: existingPost, isLoading } = useBlogPost(isNew ? undefined : slug);
  const updateMutation = useUpdateBlogPost();
  const createMutation = useCreateBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    author: "Kevin Britz",
    author_role:
      'Organizational Development Strategy | Master NLP & Prosci Certified Change Practitioner | Neuroscience for Business Assessor | Author of "The Future of Work is Human" | Podcast Host',
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    excerpt: "",
    content: "",
    featured_image: null,
    tags: [],
    published: true,
  });

  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // Initialize form with existing data
  useState(() => {
    if (existingPost && !isNew) {
      setFormData(existingPost);
      setTagsInput(existingPost.tags?.join(", ") || "");
    }
  });

  // Update form when existing post loads
  if (existingPost && formData.id !== existingPost.id) {
    setFormData(existingPost);
    setTagsInput(existingPost.tags?.join(", ") || "");
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadBlogImage(file);
      setFormData((prev) => ({ ...prev, featured_image: url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (isNew) {
        await createMutation.mutateAsync({
          ...formData,
          tags,
        } as Omit<BlogPost, "id" | "created_at" | "updated_at">);
        toast.success("Blog post created successfully");
        navigate("/blog-admin");
      } else if (existingPost) {
        await updateMutation.mutateAsync({
          id: existingPost.id,
          updates: { ...formData, tags },
        });
        toast.success("Blog post updated successfully");
      }
    } catch (error) {
      toast.error("Failed to save blog post");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!existingPost) return;

    try {
      await deleteMutation.mutateAsync(existingPost.id);
      toast.success("Blog post deleted");
      navigate("/blog-admin");
    } catch (error) {
      toast.error("Failed to delete blog post");
      console.error(error);
    }
  };

  if (isLoading && !isNew) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${isNew ? "New Blog Post" : "Edit Blog Post"} | Leadership by Design`}
        description="Blog administration"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 pt-32 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/blog-admin"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Posts
              </Link>
              <div className="flex items-center gap-3">
                {!isNew && existingPost && (
                  <>
                    <Link to={`/blog/${existingPost.slug}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the blog post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending || createMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateMutation.isPending || createMutation.isPending
                    ? "Saving..."
                    : "Save"}
                </Button>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-8">
              {isNew ? "Create New Post" : "Edit Post"}
            </h1>

            {/* Form */}
            <div className="space-y-6">
              {/* Featured Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.featured_image && (
                    <div className="mb-4 relative">
                      <img
                        src={formData.featured_image}
                        alt="Featured"
                        className="w-full max-h-64 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            featured_image: null,
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleChange}
                      placeholder="Post title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug || ""}
                      onChange={handleChange}
                      placeholder="url-friendly-slug"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        name="author"
                        value={formData.author || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        value={formData.date || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author_role">Author Role</Label>
                    <Input
                      id="author_role"
                      name="author_role"
                      value={formData.author_role || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Leadership, Identity, Personal Development"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, published: checked }))
                      }
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt || ""}
                      onChange={handleChange}
                      placeholder="Brief summary shown in blog cards"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <RichTextEditor
                      content={formData.content || ""}
                      onChange={(content) =>
                        setFormData((prev) => ({ ...prev, content }))
                      }
                      placeholder="Start writing your blog post..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogAdmin;
