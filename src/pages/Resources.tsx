import SEO from "@/components/SEO";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Video, Download, ExternalLink, Bot, Headphones, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import partnerLogo1 from "@/assets/partner-logo-1.png";
import valuesLogo from "@/assets/values-logo.png";
import shiftLogo from "@/assets/shift-logo.jpg";
import purposeBlueprintLogo from "@/assets/purpose-blueprint-logo.png";
import bookCover from "@/assets/future-of-work-book.png";
import { getRecentEpisodes, PODCAST_COVER_IMAGE } from "@/data/podcastEpisodes";

export default function Resources() {
  const leadershipArticles = [
    { 
      title: "Year-End Leadership Reflection", 
      type: "Article", 
      duration: "8 min read",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop&crop=faces",
      description: "Reflect on your leadership journey and set intentions for the year ahead.",
      link: "https://valuesblueprint.online/resources"
    },
    { 
      title: "Building High-Performance Teams", 
      type: "Article", 
      duration: "6 min read",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop&crop=faces",
      description: "Learn proven strategies for creating cohesive, motivated teams that consistently deliver results.",
      link: "https://www.gallup.com/workplace/650156/science-of-high-performing-teams.aspx"
    },
    { 
      title: "Emotional Intelligence in Leadership", 
      type: "Article", 
      duration: "10 min read",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop&crop=faces",
      description: "Master the art of understanding and managing emotions to become a more effective leader.",
      link: "https://hbr.org/2004/01/what-makes-a-leader"
    },
  ];

  const downloadableGuides = [
    { 
      title: "Leadership Assessment Toolkit", 
      type: "PDF", 
      duration: "12 pages",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=350&fit=crop",
      description: "Comprehensive self-assessment tools to evaluate and enhance your leadership capabilities.",
      internalLink: "/leadership-diagnostic"
    },
    { 
      title: "Team Development Framework", 
      type: "PDF", 
      duration: "8 pages",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=350&fit=crop",
      description: "A structured approach to building and nurturing high-performing teams.",
      internalLink: "/team-development-framework"
    },
    { 
      title: "Communication Strategy Template", 
      type: "PDF", 
      duration: "5 pages",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=350&fit=crop",
      description: "Ready-to-use templates for crafting clear and impactful communication plans.",
      link: "https://www.process.st/templates/communication-strategy-template/"
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
      title: "How to Preserve Company Culture When Scaling Fast", 
      type: "Case Study", 
      duration: "15 min read",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=350&fit=crop",
      description: "How a fast-growing tech company maintained its culture while scaling from 50 to 500 employees.",
      link: "https://www.in8create.com/blog/how-to-preserve-company-culture-when-scaling-fast"
    },
    { 
      title: "The Secret to Building a High-Performing Team", 
      type: "Case Study", 
      duration: "12 min read",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=350&fit=crop",
      description: "A traditional manufacturing company's journey to modern leadership practices and improved engagement.",
      link: "https://hbr.org/2025/09/the-secret-to-building-a-high-performing-team"
    },
    { 
      title: "Non-Profit Leadership Renewal", 
      type: "Case Study", 
      duration: "10 min read",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=350&fit=crop",
      description: "How a non-profit organization revitalized its leadership team and increased community impact.",
      link: "https://fordfoundation.org/work/learning/research-reports/new-leader-endless-possibility-bringing-a-legacy-organization-into-a-new-era"
    },
  ];

  return (
    <>
      <SEO
        title="Resources"
        description="Access leadership development resources including articles, downloadable guides, videos, and case studies. Free tools and frameworks for emerging and executive leaders."
        canonicalUrl="/resources"
        keywords="leadership resources, leadership articles, leadership guides, leadership videos, case studies, free leadership tools"
      />

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

            {/* Featured Book */}
            <section className="mb-20">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
                  <div className="flex justify-center">
                    <Link to="/book">
                      <img 
                        src={bookCover} 
                        alt="The Future of Work is Human by Kevin Britz"
                        className="max-w-[250px] w-full rounded-lg shadow-xl hover:scale-105 transition-transform cursor-pointer"
                      />
                    </Link>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-primary font-medium mb-2">Featured Book</p>
                    <h2 className="text-3xl font-bold mb-4 text-foreground">
                      The Future of Work is Human
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      By Kevin Britz – Discover the WINGS framework and the essential human skills 
                      that will define successful leadership in the rapidly evolving workplace.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Link to="/book">
                        <Button variant="outline">
                          Learn More
                        </Button>
                      </Link>
                      <a 
                        href="https://www.amazon.com/Future-Work-Human-Kevin-Britz/dp/0796106045" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Buy on Amazon
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
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

            {/* AI & Workplace Integration */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Bot className="w-4 h-4" />
                  <span>New</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  AI & Workplace Integration
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Resources to help leaders navigate AI adoption while strengthening the human skills that matter most.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Link to="/ai-readiness">
                  <Card className="hover:shadow-xl transition-all duration-300 h-full group">
                    <CardContent className="p-6">
                      <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                        <Bot className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        AI Leadership Readiness Diagnostic
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Assess your readiness to lead in an AI-augmented workplace across 5 critical dimensions.
                      </p>
                      <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        Take Assessment
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/shift-methodology">
                  <Card className="hover:shadow-xl transition-all duration-300 h-full group">
                    <CardContent className="p-6">
                      <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        The 5 Human Skills AI Cannot Replace
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Discover how SHIFT skills give leaders their competitive edge in an AI-transformed workplace.
                      </p>
                      <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        Learn More
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Card className="hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-xl bg-muted w-fit mb-4">
                      <Download className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      POPI Act Compliance in AI Adoption
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      SA-specific guidance on data protection requirements when implementing AI solutions.
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
                      Coming Soon
                    </div>
                  </CardContent>
                </Card>
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
                {downloadableGuides.map((guide, idx) => {
                  const hasInternalLink = 'internalLink' in guide && guide.internalLink;
                  const hasExternalLink = 'link' in guide && guide.link;
                  
                  const CardWrapper = hasInternalLink ? Link : hasExternalLink ? 'a' : 'div';
                  const cardProps = hasInternalLink 
                    ? { to: guide.internalLink } 
                    : hasExternalLink 
                      ? { href: (guide as any).link, target: "_blank", rel: "noopener noreferrer" } 
                      : {};
                  
                  const buttonText = hasInternalLink ? 'View Framework' : hasExternalLink ? 'View Template' : 'Download';
                  
                  return (
                    <CardWrapper key={idx} {...cardProps as any}>
                      <Card className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer h-full">
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
                              {buttonText}
                              {hasInternalLink || hasExternalLink ? (
                                <ExternalLink className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                              ) : (
                                <Download className="w-4 h-4 ml-1 group-hover/btn:translate-y-0.5 transition-transform" />
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CardWrapper>
                  );
                })}
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
                        <div className="relative aspect-video overflow-hidden">
                          <img 
                            src={video.image} 
                            alt={video.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
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

            {/* Leadership Podcast Section */}
            <section className="space-y-6 mb-16">
              <div className="flex items-center gap-3 mb-4">
                <Headphones className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Leadership Podcast</h2>
                  <p className="text-muted-foreground">Conversations on developing leadership capability</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {getRecentEpisodes(3).map((episode, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow overflow-hidden group h-full">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                      <img 
                        src={PODCAST_COVER_IMAGE}
                        alt={episode.title}
                        className="w-full h-full object-cover opacity-20"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-background/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                          <Headphones className="w-10 h-10 text-primary" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#1DB954] text-white border-0">
                          <Clock className="w-3 h-3 mr-1" />
                          {episode.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {episode.title}
                      </CardTitle>
                      {episode.guest && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{episode.guest}</span>
                        </div>
                      )}
                      <CardDescription className="line-clamp-2">
                        {episode.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <Link to={`/podcast/${episode.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full group/btn">
                            Listen & Share
                            <ExternalLink className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        <a 
                          href={`https://open.spotify.com/episode/${episode.spotifyId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button 
                            size="sm" 
                            className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Link to="/podcast">
                  <Button variant="outline" className="group">
                    View All Episodes
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </section>

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
                {caseStudies.map((study, idx) => {
                  const CardWrapper = study.link ? 'a' : 'div';
                  const cardProps = study.link ? { href: study.link, target: "_blank", rel: "noopener noreferrer" } : {};
                  
                  return (
                    <CardWrapper key={idx} {...cardProps}>
                      <Card className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer h-full">
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
                    </CardWrapper>
                  );
                })}
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
