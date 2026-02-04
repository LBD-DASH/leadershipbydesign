import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, ExternalLink, Headphones } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialShareButtons from "@/components/shared/SocialShareButtons";
import { getEpisodeBySlug, getRelatedEpisodes, PODCAST_COVER_IMAGE } from "@/data/podcastEpisodes";
import NotFound from "./NotFound";

export default function PodcastEpisode() {
  const { slug } = useParams<{ slug: string }>();
  const episode = slug ? getEpisodeBySlug(slug) : undefined;
  const relatedEpisodes = slug ? getRelatedEpisodes(slug, 3) : [];

  if (!episode) {
    return <NotFound />;
  }

  const spotifyEpisodeUrl = `https://open.spotify.com/episode/${episode.spotifyId}`;
  const formattedDate = new Date(episode.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <SEO
        title={`${episode.title} | The Lunchtime Series`}
        description={episode.description}
        canonicalUrl={`/podcast/${episode.id}`}
        keywords={`${episode.tags.join(', ')}, leadership podcast, Kevin Britz`}
      />

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            {/* Back Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Link to="/podcast">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                  All Episodes
                </Button>
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Episode Artwork Header */}
                  <div className="mb-8">
                    <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video bg-gradient-to-br from-primary/20 to-primary/5">
                      <img 
                        src={PODCAST_COVER_IMAGE}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-[#1DB954] text-white border-0 mb-2">
                          <Clock className="w-3 h-3 mr-1" />
                          {episode.duration}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {episode.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                      {episode.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{episode.duration}</span>
                      </div>
                      {episode.guest && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{episode.guest}</span>
                          {episode.guestTitle && (
                            <span className="text-sm">({episode.guestTitle})</span>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-lg text-muted-foreground">
                      {episode.description}
                    </p>
                  </div>

                  {/* Spotify Embed */}
                  <div className="mb-8">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <iframe
                        src={`https://open.spotify.com/embed/episode/${episode.spotifyId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="bg-muted"
                        title={`Listen to ${episode.title}`}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      <a 
                        href={spotifyEpisodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white">
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                          Open in Spotify
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Full Description */}
                  {episode.fullDescription && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-semibold mb-4 text-foreground">
                        Episode Notes
                      </h2>
                      <div className="prose prose-neutral dark:prose-invert max-w-none">
                        {episode.fullDescription.split('\n').map((paragraph, idx) => (
                          <p key={idx} className="text-muted-foreground mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Section */}
                  <div className="border-t border-border pt-8">
                    <h3 className="text-lg font-semibold mb-4 text-center text-foreground">
                      Share This Episode
                    </h3>
                    <SocialShareButtons 
                      title={episode.title}
                      description={episode.description}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="sticky top-28"
                >
                  {/* Podcast Info */}
                  <Card className="mb-6">
                    <CardContent className="p-6 text-center">
                      <img 
                        src={PODCAST_COVER_IMAGE}
                        alt="The Lunchtime Series"
                        className="w-32 h-32 rounded-xl mx-auto mb-4 shadow-lg"
                      />
                      <h3 className="text-lg font-semibold mb-1 text-foreground">
                        The Lunchtime Series
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        with Kevin Britz
                      </p>
                      <a 
                        href="https://open.spotify.com/show/34amsn8UPkBhY0dRZYFf1u"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Headphones className="w-4 h-4 mr-2" />
                          View All Episodes
                        </Button>
                      </a>
                    </CardContent>
                  </Card>

                  {/* Related Episodes */}
                  {relatedEpisodes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-foreground">
                        More Episodes
                      </h3>
                      <div className="space-y-4">
                        {relatedEpisodes.map(related => (
                          <Link key={related.id} to={`/podcast/${related.id}`}>
                            <Card className="hover:shadow-md transition-shadow">
                              <CardHeader className="p-4">
                                <CardTitle className="text-sm line-clamp-2 hover:text-primary transition-colors">
                                  {related.title}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {related.duration}
                                </div>
                              </CardHeader>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
