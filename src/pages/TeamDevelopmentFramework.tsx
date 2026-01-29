import { useRef } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TeamDevelopmentFramework() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <SEO
        title="Team Development Framework"
        description="A comprehensive 8-page framework for building and nurturing high-performing teams. Download our structured approach to team development."
        canonicalUrl="/team-development-framework"
      />

      <div className="min-h-screen bg-background print:bg-white">
        {/* Header - hidden when printing */}
        <div className="print:hidden">
          <Header />
        </div>
        
        {/* Action Bar - hidden when printing */}
        <div className="print:hidden pt-24 pb-6 bg-muted/30 border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Link to="/resources" className="text-primary hover:underline text-sm flex items-center gap-1 mb-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Resources
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Team Development Framework</h1>
                <p className="text-muted-foreground">8-page comprehensive guide</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handlePrint} variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handlePrint}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Content */}
        <div ref={contentRef} className="print:p-0">
          {/* Page 1: Cover */}
          <div className="print-page bg-gradient-to-br from-primary to-primary/80 text-white p-12 flex flex-col justify-center items-center min-h-[11in] print:min-h-[10.5in]">
            <div className="text-center max-w-2xl">
              <p className="text-primary-foreground/80 uppercase tracking-widest mb-4">Leadership by Design</p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Team Development Framework</h1>
              <div className="w-24 h-1 bg-white/50 mx-auto mb-6"></div>
              <p className="text-xl text-primary-foreground/90 mb-8">
                A Structured Approach to Building High-Performing Teams
              </p>
              <div className="mt-12 pt-12 border-t border-white/20">
                <p className="text-sm text-primary-foreground/70">
                  © Leadership by Design | leadershipbydesign.co
                </p>
              </div>
            </div>
          </div>

          {/* Page 2: Introduction */}
          <div className="print-page bg-white p-12 min-h-[11in] print:min-h-[10.5in]">
            <h2 className="text-3xl font-bold text-foreground mb-6 border-b-2 border-primary pb-4">
              Introduction: Why Team Development Matters
            </h2>
            
            <div className="prose prose-lg max-w-none text-foreground">
              <p className="text-lg leading-relaxed mb-6">
                High-performing teams don't happen by accident. They are intentionally built through 
                consistent effort, clear frameworks, and a commitment to continuous improvement. 
                Research shows that organisations with engaged, aligned teams achieve:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                  <p className="text-4xl font-bold text-primary mb-2">21%</p>
                  <p className="text-muted-foreground">Higher profitability</p>
                </div>
                <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                  <p className="text-4xl font-bold text-primary mb-2">17%</p>
                  <p className="text-muted-foreground">Higher productivity</p>
                </div>
                <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                  <p className="text-4xl font-bold text-primary mb-2">41%</p>
                  <p className="text-muted-foreground">Lower absenteeism</p>
                </div>
                <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                  <p className="text-4xl font-bold text-primary mb-2">59%</p>
                  <p className="text-muted-foreground">Less turnover</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4">How to Use This Framework</h3>
              <p className="mb-4">
                This framework provides a structured approach to assess, develop, and optimise your team's 
                performance. Work through each section sequentially, or jump to the areas where your team 
                needs the most development.
              </p>

              <div className="bg-muted/50 p-6 rounded-lg mt-6">
                <h4 className="font-semibold mb-3">What's Inside:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Team Assessment Overview</li>
                  <li>• The Five Dysfunctions Model</li>
                  <li>• Team Development Stages</li>
                  <li>• Building Psychological Safety</li>
                  <li>• Communication & Conflict Resolution</li>
                  <li>• Goal Alignment & Accountability</li>
                  <li>• Action Planning Template</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Page 3: Team Assessment */}
          <div className="print-page bg-white p-12 min-h-[11in] print:min-h-[10.5in]">
            <h2 className="text-3xl font-bold text-foreground mb-6 border-b-2 border-primary pb-4">
              Team Assessment Overview
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Before developing your team, understand where you currently stand. Rate each dimension 
              on a scale of 1-10, then identify your top priorities for improvement.
            </p>

            <div className="space-y-6">
              {[
                { dimension: "Trust & Psychological Safety", description: "Team members feel safe to take risks and be vulnerable" },
                { dimension: "Communication Quality", description: "Information flows freely and transparently across the team" },
                { dimension: "Conflict Management", description: "Disagreements are addressed constructively and promptly" },
                { dimension: "Commitment to Decisions", description: "Team members buy in to decisions, even when they disagree" },
                { dimension: "Accountability", description: "Team members hold each other accountable to high standards" },
                { dimension: "Results Focus", description: "Team prioritises collective results over individual success" },
                { dimension: "Role Clarity", description: "Everyone understands their responsibilities and boundaries" },
                { dimension: "Goal Alignment", description: "Team goals are clear, shared, and connected to strategy" },
              ].map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{item.dimension}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <div className="w-16 h-8 border-2 border-dashed border-muted-foreground/30 rounded"></div>
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-primary/5 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Priority Areas (Top 3 lowest scores):</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</span>
                  <div className="flex-1 h-8 border-b-2 border-dashed border-muted-foreground/30"></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</span>
                  <div className="flex-1 h-8 border-b-2 border-dashed border-muted-foreground/30"></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">3</span>
                  <div className="flex-1 h-8 border-b-2 border-dashed border-muted-foreground/30"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 4: Five Dysfunctions */}
          <div className="print-page bg-white p-12 min-h-[11in] print:min-h-[10.5in]">
            <h2 className="text-3xl font-bold text-foreground mb-6 border-b-2 border-primary pb-4">
              The Five Dysfunctions of a Team
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Based on Patrick Lencioni's model, these five dysfunctions build upon each other. 
              Address them from the bottom up for maximum impact.
            </p>

            <div className="relative">
              {/* Pyramid representation */}
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg ml-32">
                  <h4 className="font-bold text-red-700">5. Inattention to Results</h4>
                  <p className="text-sm text-red-600 mt-1">Team members put individual needs above collective goals</p>
                  <p className="text-sm mt-2"><strong>Solution:</strong> Make results visible, celebrate team wins, align incentives</p>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg ml-24">
                  <h4 className="font-bold text-orange-700">4. Avoidance of Accountability</h4>
                  <p className="text-sm text-orange-600 mt-1">Team members don't call out poor performance or behaviours</p>
                  <p className="text-sm mt-2"><strong>Solution:</strong> Establish clear standards, peer accountability, regular reviews</p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg ml-16">
                  <h4 className="font-bold text-yellow-700">3. Lack of Commitment</h4>
                  <p className="text-sm text-yellow-600 mt-1">Ambiguity and lack of buy-in create hesitation</p>
                  <p className="text-sm mt-2"><strong>Solution:</strong> Clarify decisions, ensure all voices are heard, set deadlines</p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg ml-8">
                  <h4 className="font-bold text-blue-700">2. Fear of Conflict</h4>
                  <p className="text-sm text-blue-600 mt-1">Teams avoid productive debate and difficult conversations</p>
                  <p className="text-sm mt-2"><strong>Solution:</strong> Model healthy conflict, mine for differing opinions, reward candour</p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-green-700">1. Absence of Trust (Foundation)</h4>
                  <p className="text-sm text-green-600 mt-1">Team members are unwilling to be vulnerable</p>
                  <p className="text-sm mt-2"><strong>Solution:</strong> Personal histories exercise, behavioural profiling, leader vulnerability</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-muted/50 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Key Insight</h4>
              <p className="text-muted-foreground">
                You cannot build accountability without commitment. You cannot have commitment without 
                healthy conflict. And none of this is possible without a foundation of trust.
              </p>
            </div>
          </div>

          {/* Page 5: Team Development Stages */}
          <div className="print-page bg-white p-12 min-h-[11in] print:min-h-[10.5in]">
            <h2 className="text-3xl font-bold text-foreground mb-6 border-b-2 border-primary pb-4">
              Team Development Stages
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Understanding where your team is in its development journey helps you provide the 
              right leadership and support. Based on Tuckman's model.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-6 bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold text-lg shrink-0">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-700">Forming</h4>
                    <p className="text-slate-600 mt-2">Team members are polite, cautious, and dependent on the leader. Roles are unclear.</p>
                    <div className="mt-3 bg-white p-4 rounded border">
                      <p className="font-medium text-sm">Leader Actions:</p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Provide clear direction and structure</li>
                        <li>• Establish team purpose and goals</li>
                        <li>• Define roles and responsibilities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-red-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg shrink-0">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-red-700">Storming</h4>
                    <p className="text-red-600 mt-2">Conflict emerges as team members push boundaries and challenge each other.</p>
                    <div className="mt-3 bg-white p-4 rounded border">
                      <p className="font-medium text-sm">Leader Actions:</p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Facilitate conflict resolution</li>
                        <li>• Coach team members through differences</li>
                        <li>• Maintain focus on shared goals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-yellow-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-lg shrink-0">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-yellow-700">Norming</h4>
                    <p className="text-yellow-600 mt-2">Team develops shared understanding, trust builds, and collaboration improves.</p>
                    <div className="mt-3 bg-white p-4 rounded border">
                      <p className="font-medium text-sm">Leader Actions:</p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Step back and delegate more</li>
                        <li>• Reinforce positive behaviours</li>
                        <li>• Celebrate early wins together</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-green-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shrink-0">4</div>
                  <div>
                    <h4 className="text-xl font-bold text-green-700">Performing</h4>
                    <p className="text-green-600 mt-2">High-performing team that is autonomous, aligned, and consistently delivers results.</p>
                    <div className="mt-3 bg-white p-4 rounded border">
                      <p className="font-medium text-sm">Leader Actions:</p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Empower team to self-manage</li>
                        <li>• Focus on continuous improvement</li>
                        <li>• Develop future leaders</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 6: Psychological Safety */}
          <div className="print-page bg-white p-12 min-h-[11in] print:min-h-[10.5in]">
            <h2 className="text-3xl font-bold text-foreground mb-6 border-b-2 border-primary pb-4">
              Building Psychological Safety
            </h2>

            <p className="text-lg text-muted-foreground mb-6">
              Google's Project Aristotle found psychological safety to be the #1 predictor of team 
              effectiveness. It's the belief that you won't be punished for making mistakes.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-bold text-green-700 mb-4">Signs of High Psychological Safety</h4>
                <ul className="space-y-2 text-sm text-green-600">
                  <li>✓ Team members ask questions freely</li>
                  <li>✓ Mistakes are discussed openly</li>
                  <li>✓ People admit when they don't know something</li>
                  <li>✓ Diverse opinions are welcomed</li>
                  <li>✓ Risk-taking is encouraged</li>
                  <li>✓ Feedback flows in all directions</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-bold text-red-700 mb-4">Signs of Low Psychological Safety</h4>
                <ul className="space-y-2 text-sm text-red-600">
                  <li>✗ People stay silent in meetings</li>
                  <li>✗ Blame culture dominates</li>
                  <li>✗ Information is hoarded</li>
                  <li>✗ Fear of looking incompetent</li>
                  <li>✗ Resistance to change</li>
                  <li>✗ Only leaders speak up</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Practical Actions to Build Safety</h3>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">1. Model Vulnerability</h4>
                <p className="text-sm text-muted-foreground mt-1">Leaders go first—share your mistakes, uncertainties, and learning moments.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">2. Respond Positively to Bad News</h4>
                <p className="text-sm text-muted-foreground mt-1">Thank people for raising problems early. Focus on solutions, not blame.</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">3. Ask More, Tell Less</h4>
                <p className="text-sm text-muted-foreground mt-1">Use questions like "What do you think?" and "Help me understand..."</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">4. Create Structured Opportunities</h4>
                <p className="text-sm text-muted-foreground mt-1">Round-robin input, anonymous feedback, retrospectives, and "pre-mortems".</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">5. Address Violations Quickly</h4>
                <p className="text-sm text-muted-foreground mt-1">When someone ridicules or dismisses others, address it immediately.</p>
              </div>
            </div>
          </div>

          {/* Page 7: Communication & Conflict */}
          <div className="print-page bg-white p-12 min-h-[11in] print:min-h-[10.5in]">
            <h2 className="text-3xl font-bold text-foreground mb-6 border-b-2 border-primary pb-4">
              Communication & Conflict Resolution
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Team Communication Charter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete this with your team to establish clear norms:
                </p>
                
                <div className="space-y-4">
                  <div className="border rounded p-4">
                    <p className="font-medium text-sm mb-2">Preferred communication channels:</p>
                    <div className="h-12 border-b-2 border-dashed border-muted-foreground/30"></div>
                  </div>
                  <div className="border rounded p-4">
                    <p className="font-medium text-sm mb-2">Response time expectations:</p>
                    <div className="h-12 border-b-2 border-dashed border-muted-foreground/30"></div>
                  </div>
                  <div className="border rounded p-4">
                    <p className="font-medium text-sm mb-2">Meeting norms (cameras, participation):</p>
                    <div className="h-12 border-b-2 border-dashed border-muted-foreground/30"></div>
                  </div>
                  <div className="border rounded p-4">
                    <p className="font-medium text-sm mb-2">How we give feedback:</p>
                    <div className="h-12 border-b-2 border-dashed border-muted-foreground/30"></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Healthy Conflict Framework</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow this process when conflicts arise:
                </p>

                <div className="space-y-3">
                  <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold">Step 1: Assume Positive Intent</p>
                    <p className="text-sm text-muted-foreground">Believe the other person has good intentions</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold">Step 2: Seek to Understand</p>
                    <p className="text-sm text-muted-foreground">Ask questions before making judgements</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold">Step 3: Share Your Perspective</p>
                    <p className="text-sm text-muted-foreground">Use "I" statements to express your view</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold">Step 4: Find Common Ground</p>
                    <p className="text-sm text-muted-foreground">Identify shared goals and values</p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold">Step 5: Agree on Next Steps</p>
                    <p className="text-sm text-muted-foreground">Document and commit to specific actions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-muted/50 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Remember</h4>
              <p className="text-muted-foreground">
                The goal is not to eliminate conflict, but to make it productive. 
                Healthy debate leads to better decisions and stronger commitment.
              </p>
            </div>
          </div>

          {/* Page 8: Action Planning */}
          <div className="print-page bg-white p-12 min-h-[11in] print:min-h-[10.5in]">
            <h2 className="text-3xl font-bold text-foreground mb-6 border-b-2 border-primary pb-4">
              Action Planning Template
            </h2>

            <p className="text-lg text-muted-foreground mb-6">
              Use this template to create your team development action plan. 
              Focus on 2-3 priorities at a time for maximum impact.
            </p>

            <div className="space-y-6">
              {[1, 2, 3].map((num) => (
                <div key={num} className="border-2 rounded-lg p-6">
                  <h4 className="font-bold text-lg mb-4">Priority #{num}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm mb-2">Area of Focus:</p>
                      <div className="h-8 border-b-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">Owner:</p>
                      <div className="h-8 border-b-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-medium text-sm mb-2">Specific Actions:</p>
                      <div className="h-20 border-2 border-dashed border-muted-foreground/30 rounded"></div>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">Success Measure:</p>
                      <div className="h-8 border-b-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-2">Target Date:</p>
                      <div className="h-8 border-b-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
              <h4 className="font-semibold mb-2">Next Step</h4>
              <p className="text-muted-foreground mb-4">
                Want expert guidance on implementing this framework with your team?
              </p>
              <p className="text-sm">
                <strong>Take our Team Diagnostic:</strong> leadershipbydesign.co/team-diagnostic
              </p>
              <p className="text-sm mt-2">
                <strong>Contact us:</strong> leadershipbydesign.co/contact
              </p>
            </div>

            <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
              <p>© Leadership by Design | leadershipbydesign.co</p>
              <p className="mt-1">This framework is intended for personal and organisational development use.</p>
            </div>
          </div>
        </div>

        {/* Interactive CTA Section - hidden when printing */}
        <div className="print:hidden bg-gradient-to-br from-primary to-primary/80 text-white py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Assess Your Team?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Take our free Team Diagnostic to get personalised insights into your team's 
              strengths and development areas. Get instant recommendations based on this framework.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg"
            >
              <Link to="/team-diagnostic">
                Take the Team Diagnostic
              </Link>
            </Button>
            <p className="mt-4 text-sm text-primary-foreground/70">
              Free • 5 minutes • Instant results
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: letter;
            margin: 0.5in;
          }
          
          .print-page {
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          .print-page:last-child {
            page-break-after: auto;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
