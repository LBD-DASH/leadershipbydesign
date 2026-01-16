import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, BookOpen, Users, Lightbulb, Target, Brain } from "lucide-react";
import bookCover from "@/assets/future-of-work-book.png";

export default function Book() {
  const keyThemes = [
    {
      icon: Users,
      title: "Human-Centered Leadership",
      description: "Why the future of work demands leaders who prioritise people over processes."
    },
    {
      icon: Brain,
      title: "The WINGS Framework",
      description: "Work-Industry-Neutral Growth Skills that leaders need to thrive in any environment."
    },
    {
      icon: Lightbulb,
      title: "Adaptive Innovation",
      description: "How to lead teams through constant change while maintaining focus and clarity."
    },
    {
      icon: Target,
      title: "Purpose-Driven Performance",
      description: "Aligning individual purpose with organisational goals for sustainable success."
    }
  ];

  return (
    <>
      <SEO
        title="The Future of Work is Human - Book by Kevin Britz"
        description="Discover 'The Future of Work is Human' by Kevin Britz. A practical guide to developing the leadership skills needed for the rapidly evolving workplace."
        canonicalUrl="/book"
        keywords="future of work, leadership book, Kevin Britz, WINGS framework, human-centered leadership, leadership development"
        author="Kevin Britz"
      />

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <img 
                    src={bookCover} 
                    alt="The Future of Work is Human by Kevin Britz"
                    className="max-w-sm w-full rounded-lg shadow-2xl"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-primary font-medium mb-2">By Kevin Britz</p>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                    The Future of Work is Human
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    A practical guide to developing the leadership skills needed for the rapidly evolving workplace.
                  </p>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In a world increasingly driven by technology, the most valuable asset any organisation 
                  can have is its people. This book explores the essential human skills that will define 
                  successful leadership in the years ahead and provides a framework for developing them.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://www.amazon.com/Future-Work-Human-Kevin-Britz/dp/0796106045" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="w-full sm:w-auto">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Buy on Amazon
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            </section>

            {/* Key Themes */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-foreground">Key Themes</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore the core concepts that make this book essential reading for modern leaders.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {keyThemes.map((theme, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <theme.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">{theme.title}</h3>
                      <p className="text-muted-foreground text-sm">{theme.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* The WINGS Framework */}
            <section className="mb-20 bg-muted/30 rounded-2xl p-8 md:p-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-foreground text-center">
                  The WINGS Framework
                </h2>
                <p className="text-lg text-muted-foreground mb-8 text-center">
                  At the heart of "The Future of Work is Human" is the WINGS methodology – 
                  Work-Industry-Neutral Growth Skills that every leader needs to develop.
                </p>
                
                <div className="space-y-4">
                  {[
                    { letter: "W", title: "Willingness to Adapt", description: "Embracing change and developing resilience in uncertain environments." },
                    { letter: "I", title: "Interpersonal Intelligence", description: "Building meaningful connections and leading through influence." },
                    { letter: "N", title: "Navigating Complexity", description: "Making strategic decisions amidst ambiguity and competing priorities." },
                    { letter: "G", title: "Growth Mindset", description: "Continuously learning and developing yourself and others." },
                    { letter: "S", title: "Self-Mastery", description: "Managing emotions, energy, and focus for peak performance." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 bg-background rounded-lg p-4">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-xl shrink-0">
                        {item.letter}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* About the Author */}
            <section className="mb-20">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-foreground">About the Author</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Kevin Britz is a leadership development expert, executive coach, and the founder of 
                  Leadership by Design. With decades of experience working with executives and teams 
                  across industries, Kevin has developed practical frameworks that help leaders thrive 
                  in rapidly changing environments.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The WINGS framework introduced in this book has been refined through years of 
                  real-world application and forms the foundation of the SHIFT methodology used 
                  in Leadership by Design's coaching and development programmes.
                </p>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center bg-primary/5 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Ready to Transform Your Leadership?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get your copy today and discover the skills that will define successful leadership 
                in the future of work.
              </p>
              <a 
                href="https://www.amazon.com/Future-Work-Human-Kevin-Britz/dp/0796106045" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Buy on Amazon
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
