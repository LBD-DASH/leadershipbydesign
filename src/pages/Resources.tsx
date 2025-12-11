import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, Download, ExternalLink } from "lucide-react";
import partnerLogo1 from "@/assets/partner-logo-1.png";
import valuesLogo from "@/assets/values-logo.png";
import shiftLogo from "@/assets/shift-logo.jpg";
import purposeBlueprintLogo from "@/assets/purpose-blueprint-logo.png";

export default function Resources() {
  const leadershipArticles = [
    { 
      title: "Year-End Leadership Reflection", 
      type: "Article", 
      duration: "8 min read",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=350&fit=crop",
      description: "Reflect on your leadership journey and set intentions for the year ahead.",
      link: "https://valuesblueprint.online/resources"
    },
    { 
      title: "Building High-Performance Teams", 
      type: "Article", 
      duration: "6 min read",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop&crop=faces",
      description: "Learn proven strategies for creating cohesive, motivated teams that consistently deliver results."
    },
    { 
      title: "Emotional Intelligence in Leadership", 
      type: "Article", 
      duration: "10 min read",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop&crop=faces",
      description: "Master the art of understanding and managing emotions to become a more effective leader."
    },
  ];

  const downloadableGuides = [
    { 
      title: "Leadership Assessment Toolkit", 
      type: "PDF", 
      duration: "12 pages",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=350&fit=crop",
      description: "Comprehensive self-assessment tools to evaluate and enhance your leadership capabilities."
    },
    { 
      title: "Team Development Framework", 
      type: "PDF", 
      duration: "8 pages",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=350&fit=crop",
      description: "A structured approach to building and nurturing high-performing teams."
    },
    { 
      title: "Communication Strategy Template", 
      type: "PDF", 
      duration: "5 pages",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=350&fit=crop",
      description: "Ready-to-use templates for crafting clear and impactful communication plans."
    },
  ];

  const videoContent = [
    { 
      title: "Introduction to Conscious Leadership", 
      type: "Video", 
      duration: "15 min",
      image: "https://img.youtube.com/vi/1PHFe9xCH4U/maxresdefault.jpg",
      description: "Discover the principles of conscious leadership and how to lead with greater awareness.",
      link: "https://www.youtube.com/watch?v=1PHFe9xCH4U"
    },
    { 
      title: "Navigating Change Successfully", 
      type: "Video", 
      duration: "20 min",
      image: "https://img.youtube.com/vi/pUmTQ-86-YI/maxresdefault.jpg",
      description: "Learn strategies for leading teams through organizational change and uncertainty.",
      link: "https://www.youtube.com/watch?v=pUmTQ-86-YI"
    },
    { 
      title: "Building Trust in Teams", 
      type: "Video", 
      duration: "12 min",
      image: "https://img.youtube.com/vi/S7AkI6HHPMA/maxresdefault.jpg",
      description: "Essential techniques for building and maintaining trust within your team.",
      link: "https://www.youtube.com/watch?v=S7AkI6HHPMA"
    },
  ];

  const resourceCategories = [];

  const caseStudies = [
    { 
      title: "Tech Startup Scales Culture", 
      type: "Case Study", 
      duration: "15 min read",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=350&fit=crop",
      description: "How a fast-growing tech company maintained its culture while scaling from 50 to 500 employees."
    },
    { 
      title: "Manufacturing Firm Transformation", 
      type: "Case Study", 
      duration: "12 min read",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=350&fit=crop",
      description: "A traditional manufacturing company's journey to modern leadership practices and improved engagement."
    },
    { 
      title: "Non-Profit Leadership Renewal", 
      type: "Case Study", 
      duration: "10 min read",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=350&fit=crop",
      description: "How a non-profit organization revitalized its leadership team and increased community impact."
    },
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
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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

                <a 
                  href="https://findmypurpose.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-8 flex flex-col items-center justify-center min-h-[320px]">
                      <div className="w-full h-40 flex items-center justify-center mb-6">
                        <img 
                          src={purposeBlueprintLogo} 
                          alt="Purpose Blueprint" 
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Purpose Blueprint</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        Discover and design your life's purpose with clarity and intention
                      </p>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        Visit Platform
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </div>
            </section>

            {/* Leadership Articles with Images */}
            <section className="space-y-6 mb-16">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Leadership Articles</h2>
                  <p className="text-muted-foreground">In-depth articles on leadership development and organizational transformation</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {leadershipArticles.map((article, idx) => {
                  const CardWrapper = article.link ? 'a' : 'div';
                  const cardProps = article.link ? { href: article.link, target: "_blank", rel: "noopener noreferrer" } : {};
                  
                  return (
                    <CardWrapper key={idx} {...cardProps}>
                      <Card className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer h-full">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                              {article.type}
                            </span>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{article.title}</CardTitle>
                          <CardDescription>{article.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{article.duration}</span>
                            <Button variant="ghost" size="sm" className="group/btn">
                              Read More
                              <ExternalLink className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CardWrapper>
                  );
                })}
              </div>
            </section>

            {/* Downloadable Guides with Images */}
            <section className="space-y-6 mb-16">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Downloadable Guides</h2>
                  <p className="text-muted-foreground">Practical tools and frameworks you can use immediately</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {downloadableGuides.map((guide, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={guide.image} 
                        alt={guide.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                          {guide.type}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{guide.duration}</span>
                        <Button variant="ghost" size="sm" className="group/btn">
                          Download
                          <Download className="w-4 h-4 ml-1 group-hover/btn:translate-y-0.5 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Video Content with Images */}
            <section className="space-y-6 mb-16">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Video Content</h2>
                  <p className="text-muted-foreground">
                    Watch insights and lessons from leadership experts{" "}
                    <a 
                      href="https://www.youtube.com/@TheLunchtimeSeries" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      (more on our podcast)
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {videoContent.map((video, idx) => {
                  const CardWrapper = video.link ? 'a' : 'div';
                  const cardProps = video.link ? { href: video.link, target: "_blank", rel: "noopener noreferrer" } : {};
                  
                  return (
                    <CardWrapper key={idx} {...cardProps}>
                      <Card className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer h-full">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={video.image} 
                            alt={video.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                              {video.type}
                            </span>
                          </div>
                          {video.link && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-12 rounded-xl bg-[#FF0000] flex items-center justify-center group-hover:bg-[#CC0000] group-hover:scale-110 transition-all shadow-lg">
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                              </div>
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{video.title}</CardTitle>
                          <CardDescription>{video.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{video.duration}</span>
                            <Button variant="ghost" size="sm" className="group/btn">
                              {video.link ? "Watch Now" : "Coming Soon"}
                              <ExternalLink className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CardWrapper>
                  );
                })}
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

            {/* Case Studies with Images */}
            <section className="space-y-6 mb-16">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Case Studies</h2>
                  <p className="text-muted-foreground">Real-world examples of leadership transformation</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {caseStudies.map((study, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={study.image} 
                        alt={study.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                          {study.type}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{study.title}</CardTitle>
                      <CardDescription>{study.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{study.duration}</span>
                        <Button variant="ghost" size="sm" className="group/btn">
                          Read Case Study
                          <ExternalLink className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
