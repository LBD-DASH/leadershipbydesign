import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, Brain, Users, Shield, Sparkles, ArrowRight, Phone, CheckCircle, Lightbulb } from "lucide-react";
import { AIReadinessResult, categoryDetails, getReadinessLevelInfo, getScoreInterpretation, getAIReadinessInsights } from "@/lib/aiReadinessScoring";
import { AIReadinessCategory, aiReadinessCategories } from "@/data/aiReadinessQuestions";
import SocialShareButtons from "@/components/shared/SocialShareButtons";
import InterestModal from "@/components/shared/InterestModal";
import { cn } from "@/lib/utils";

interface AIReadinessResultsProps {
  result: AIReadinessResult;
  submissionId: string;
  onExpertContact: () => void;
}

const categoryIcons: Record<AIReadinessCategory, typeof Bot> = {
  awareness: Bot,
  collaboration: Users,
  change: Sparkles,
  ethics: Shield,
  human_skills: Brain,
};

export function AIReadinessResults({ result, submissionId, onExpertContact }: AIReadinessResultsProps) {
  const [showInterestModal, setShowInterestModal] = useState(false);
  
  const levelInfo = getReadinessLevelInfo(result.readinessLevel);
  const insights = getAIReadinessInsights(result);
  
  const categoryScores = [
    { key: 'awareness' as AIReadinessCategory, score: result.scores.awareness },
    { key: 'collaboration' as AIReadinessCategory, score: result.scores.collaboration },
    { key: 'change' as AIReadinessCategory, score: result.scores.change },
    { key: 'ethics' as AIReadinessCategory, score: result.scores.ethics },
    { key: 'human_skills' as AIReadinessCategory, score: result.scores.human_skills },
  ];

  return (
    <div className="space-y-8">
      {/* Overall Score Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your AI Leadership Readiness</p>
              <CardTitle className={cn("text-3xl", levelInfo.color)}>
                {levelInfo.title}
              </CardTitle>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{result.overallScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{levelInfo.description}</p>
          <Progress value={result.overallScore} className="mt-4 h-3" />
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Category Breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryScores.map(({ key, score }) => {
            const category = aiReadinessCategories.find(c => c.key === key)!;
            const Icon = categoryIcons[key];
            const interpretation = getScoreInterpretation(score);
            const isWeakest = key === result.weakestCategory;
            const isStrongest = key === result.strongestCategory;
            
            return (
              <Card 
                key={key} 
                className={cn(
                  "transition-all",
                  isWeakest && "border-amber-500/50 bg-amber-50/30 dark:bg-amber-950/10",
                  isStrongest && "border-green-500/50 bg-green-50/30 dark:bg-green-950/10"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isWeakest ? "bg-amber-100 dark:bg-amber-900/30" : 
                      isStrongest ? "bg-green-100 dark:bg-green-900/30" : 
                      "bg-primary/10"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        isWeakest ? "text-amber-600" : 
                        isStrongest ? "text-green-600" : 
                        "text-primary"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-foreground text-sm">{category.title}</h4>
                        <span className="text-lg font-bold text-primary">{score}/20</span>
                      </div>
                      <p className={cn("text-xs font-medium", interpretation.color)}>
                        {interpretation.label}
                      </p>
                      {isWeakest && (
                        <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full">
                          Priority Development
                        </span>
                      )}
                      {isStrongest && (
                        <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                          Your Strength
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Key Insights
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight, index) => (
            <Card key={index} className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-medium text-foreground mb-2">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Recommended Development Path
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-background rounded-xl border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2">Primary Recommendation</h4>
            <p className="text-primary font-medium text-lg">{result.primaryRecommendation}</p>
            <p className="text-sm text-muted-foreground mt-2">
              This comprehensive programme will develop your AI leadership capabilities across all five areas.
            </p>
          </div>
          
          {result.secondaryRecommendation && (
            <div className="p-4 bg-muted/50 rounded-xl border border-border">
              <h4 className="font-semibold text-foreground mb-2">Secondary Recommendation</h4>
              <p className="text-foreground">{result.secondaryRecommendation}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Build your human skills foundation—the capabilities AI cannot replicate.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SHIFT Connection */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Your Edge in an AI World: SHIFT Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            AI readiness is built on human skills. The SHIFT Methodology develops the five capabilities that give you an edge in an AI-augmented workplace.
          </p>
          <div className="grid sm:grid-cols-5 gap-3">
            {['Self-Management', 'Human Intelligence', 'Innovation', 'Focus', 'Thinking'].map((skill, i) => (
              <div key={skill} className="text-center p-3 bg-background rounded-lg border border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold text-sm">{skill[0]}</span>
                </div>
                <p className="text-xs font-medium text-foreground">{skill}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" asChild className="w-full mt-4">
            <Link to="/shift-methodology">
              Learn about SHIFT Methodology
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Button 
          size="lg" 
          className="w-full"
          onClick={() => setShowInterestModal(true)}
        >
          I'm Interested in AI Leadership Development
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={onExpertContact}
        >
          <Phone className="w-4 h-4 mr-2" />
          Speak with an Expert
        </Button>
      </div>

      {/* Share */}
      <div className="flex flex-col items-center gap-4 pt-4 border-t border-border">
        <SocialShareButtons 
          url={window.location.href}
          title="AI Leadership Readiness Diagnostic"
          description="I just completed the AI Leadership Readiness Diagnostic and discovered my readiness score!"
        />
      </div>

      {/* Interest Modal */}
      <InterestModal
        open={showInterestModal}
        onOpenChange={setShowInterestModal}
        context="AI Readiness Diagnostic Results - Leading in the AI Era"
      />
    </div>
  );
}
