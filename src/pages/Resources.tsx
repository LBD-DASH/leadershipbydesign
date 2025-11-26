import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, Download, ExternalLink } from "lucide-react";
import partnerLogo1 from "@/assets/partner-logo-1.png";
import valuesLogo from "@/assets/values-logo.png";
import shiftLogo from "@/assets/shift-logo.jpg";

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

            {/* Featured Partner Resources */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  Featured Partner Resources
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore these carefully selected partner organizations and tools that complement our leadership development approach.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <a 
                  href="https://sixhumanneeds.lovable.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-8 flex flex-col items-center justify-center min-h-[320px]">
                      <div className="w-full h-40 flex items-center justify-center mb-6">
                        <img 
                          src={partnerLogo1} 
                          alt="6 Human Needs" 
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">6 Human Needs</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Collaborative tools and resources for community building
                      </p>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        Visit Platform
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </a>

                <a 
                  href="https://valuesblueprint.online" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-8 flex flex-col items-center justify-center min-h-[320px]">
                      <div className="w-full h-40 flex items-center justify-center mb-6">
                        <img 
                          src={valuesLogo} 
                          alt="Values Identity Engineering" 
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Values</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Identity Engineering - Building strong organizational values and culture
                      </p>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        Visit Platform
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </a>

                <div className="group">
                  <Card className="hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-8 flex flex-col items-center justify-center min-h-[320px]">
                      <div className="w-full h-40 flex items-center justify-center mb-6">
                        <img 
                          src={shiftLogo} 
                          alt="Shift Daily Companion" 
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Shift Daily Companion</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Your daily companion for mindset shifts and personal transformation
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        Coming Soon
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
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
