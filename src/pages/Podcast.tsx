import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Headphones, ExternalLink, Clock, User } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { podcastEpisodes, PODCAST_COVER_IMAGE, SPOTIFY_SHOW_URL } from "@/data/podcastEpisodes";

export default function Podcast() {
  return (
    <>
      <SEO
        title="The Lunchtime Series | Leadership Podcast"
        description="Tune into The Lunchtime Series with Kevin Britz for inspiring conversations on leadership, coaching, and organizational transformation."
        canonicalUrl="/podcast"
        keywords="leadership podcast, executive coaching, leadership development, Kevin Britz, leadership conversations"
      />

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            {/* Hero Section */}
            <motion.section 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-center mb-8">
                  <img 
                    src={PODCAST_COVER_IMAGE} 
                    alt="The Lunchtime Series with Kevin Britz"
                    className="w-48 h-48 rounded-2xl shadow-xl"
                  />
                </div>
                
                <div className="inline-flex items-center gap-2 bg-[#1DB954]/10 text-[#1DB954] px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Headphones className="w-4 h-4" />
                  <span>Leadership Podcast</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  The Lunchtime Series
                </h1>
                <p className="text-xl text-muted-foreground mb-2">
                  with Kevin Britz
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  Leadership conversations that drive results. Join Kevin as he explores the insights, 
                  strategies, and stories behind exceptional leadership with thought leaders and practitioners.
                </p>
                
                <a 
                  href={SPOTIFY_SHOW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Follow on Spotify
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </motion.section>

            {/* Episodes Grid */}
            <section>
              <motion.div 
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Headphones className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">All Episodes</h2>
                  <p className="text-muted-foreground">Deep dives into leadership excellence</p>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcastEpisodes.map((episode, index) => (
                  <motion.div
                    key={episode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 h-full group overflow-hidden">
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                        <img 
                          src={PODCAST_COVER_IMAGE}
                          alt={episode.title}
                          className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-background/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                            <Headphones className="w-12 h-12 text-primary" />
                          </div>
                        </div>
                        <div className="absolute top-3 left-3 flex gap-2">
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
                        <CardDescription className="line-clamp-3">
                          {episode.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1 mb-4">
                          {episode.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Link to={`/podcast/${episode.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              Listen & Share
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
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Subscribe CTA */}
            <motion.section 
              className="mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-gradient-to-r from-[#1DB954]/10 to-[#1DB954]/5 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Never Miss an Episode
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                  Subscribe to The Lunchtime Series and get leadership insights delivered to your ears 
                  every week. Join thousands of leaders investing in their growth.
                </p>
                <a 
                  href={SPOTIFY_SHOW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-[#1DB954] hover:bg-[#1ed760] text-white">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Subscribe on Spotify
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </motion.section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
