import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, Download, ExternalLink } from "lucide-react";

export default function Resources() {
  const resourceCategories = [
    {
      title: "Leadership Articles",
      description: "In-depth articles on leadership development and organizational transformation",
      icon: BookOpen,
      items: [
        { title: "The Future of Leadership in 2025", type: "Article", duration: "8 min read" },
        { title: "Building High-Performance Teams", type: "Article", duration: "6 min read" },
        { title: "Emotional Intelligence in Leadership", type: "Article", duration: "10 min read" },
      ]
    },
    {
      title: "Downloadable Guides",
      description: "Practical tools and frameworks you can use immediately",
      icon: Download,
      items: [
        { title: "Leadership Assessment Toolkit", type: "PDF", duration: "12 pages" },
        { title: "Team Development Framework", type: "PDF", duration: "8 pages" },
        { title: "Communication Strategy Template", type: "PDF", duration: "5 pages" },
      ]
    },
    {
      title: "Video Content",
      description: "Watch insights and lessons from leadership experts",
      icon: Video,
      items: [
        { title: "Introduction to Conscious Leadership", type: "Video", duration: "15 min" },
        { title: "Navigating Change Successfully", type: "Video", duration: "20 min" },
        { title: "Building Trust in Teams", type: "Video", duration: "12 min" },
      ]
    },
    {
      title: "Case Studies",
      description: "Real-world examples of leadership transformation",
      icon: FileText,
      items: [
        { title: "Tech Startup Scales Culture", type: "Case Study", duration: "15 min read" },
        { title: "Manufacturing Firm Transformation", type: "Case Study", duration: "12 min read" },
        { title: "Non-Profit Leadership Renewal", type: "Case Study", duration: "10 min read" },
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Resources - Leadership by Design | Articles, Guides & Tools</title>
        <meta 
          name="description" 
          content="Access leadership development resources including articles, downloadable guides, videos, and case studies. Free tools and frameworks for emerging and executive leaders." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <section className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Leadership Resources
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore our curated collection of articles, guides, videos, and case studies designed 
                to support your leadership journey and organizational transformation.
              </p>
            </section>

            {/* Resource Categories */}
            <section className="space-y-12">
              {resourceCategories.map((category, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <category.icon className="w-8 h-8 text-primary" />
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground">{category.title}</h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {category.items.map((item, itemIdx) => (
                      <Card key={itemIdx} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span className="text-primary font-medium">{item.type}</span>
                            <span>•</span>
                            <span>{item.duration}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full group">
                            {category.icon === Download ? "Download" : "View"}
                            <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Newsletter CTA */}
            <section className="mt-20 text-center bg-primary/5 rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Get New Resources Delivered
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Subscribe to receive our latest articles, guides, and insights directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 rounded-md border border-input bg-background"
                />
                <Button size="lg">Subscribe</Button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
