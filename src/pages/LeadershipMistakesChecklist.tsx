import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LeadershipMistakesChecklist() {
  return (
    <>
      <Helmet>
        <title>The 5 Leadership Mistakes Checklist | Leadership by Design</title>
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href="https://leadershipbydesign.co/leadership-mistakes-checklist"
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <article className="mx-auto max-w-3xl">
            <header className="text-center pb-8 border-b">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                The 5 Leadership Mistakes{" "}
                <span className="text-primary">Costing You Your Best Employees</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                A practical checklist for leaders who want to retain top talent
              </p>
            </header>

            <section className="mt-8 rounded-xl border bg-card p-6">
              <p className="text-foreground">
                Most leaders unknowingly make at least 2–3 of these mistakes regularly.
                The good news? Once you’re aware of them, they’re surprisingly simple to
                fix. Use this checklist to identify your blind spots and take immediate
                action.
              </p>
            </section>

            <section className="mt-10 space-y-8">
              <ChecklistItem
                number={1}
                title="Delegating Tasks, Not Outcomes"
                why="You’re busy and it’s faster to give specific instructions. But when you assign tasks without explaining the “why,” you turn capable professionals into order-takers."
                fix='Share the outcome you need and the constraints, then let them figure out the how. “I need the client presentation ready by Thursday that addresses their concerns about timeline” beats “Make 15 slides about our process.”'
                reflect="When was the last time you delegated an outcome rather than a to‑do list?"
              />

              <ChecklistItem
                number={2}
                title="Waiting for Annual Reviews to Give Feedback"
                why="Formal review cycles feel like the “right” time for feedback. But your best employees want to grow now, not once a year. Delayed recognition feels hollow."
                fix="Make feedback a weekly habit, not an annual event. A 30‑second acknowledgment in the moment is worth more than a paragraph in a performance review three months later."
                reflect="Who on your team did something noteworthy this week that you haven’t acknowledged yet?"
              />

              <ChecklistItem
                number={3}
                title="Solving Problems Your Team Should Own"
                why="You know the answer, so why waste time? But every problem you solve is a development opportunity stolen from your team — and it creates dependency."
                fix='When someone brings you a problem, respond with “What do you think we should do?” Even if you need to course‑correct, you’re building their capability, not their reliance on you.'
                reflect="How many problems did you solve this week that someone on your team could have handled?"
              />

              <ChecklistItem
                number={4}
                title='Having an “Open Door” But a Closed Mind'
                why='You genuinely believe you’re approachable. But if people rarely bring you bad news or challenge your ideas, your “openness” might be performative, not real.'
                fix='Actively seek dissent. Ask “What am I missing?” and “What would you do differently?” Then — crucially — listen without defending. Your reaction to pushback determines whether people will ever push back again.'
                reflect="When was the last time someone on your team disagreed with you openly?"
              />

              <ChecklistItem
                number={5}
                title="Focusing on What’s Wrong, Not What’s Strong"
                why="Problems demand attention. Weaknesses feel urgent to fix. But your best people want to grow their strengths, not just patch their gaps."
                fix='Spend more time amplifying what people do brilliantly than correcting what they struggle with. Ask “How can we give you more opportunities to use this strength?” rather than “How do we fix this weakness?”'
                reflect="Can you name each team member’s top strength? When did you last create an opportunity for them to use it?"
              />
            </section>

            <section className="mt-10 rounded-xl border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground">Your action checklist</h2>
              <ul className="mt-4 space-y-3 text-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none rounded border" />
                  This week, I’ll delegate an outcome instead of a task list
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none rounded border" />
                  I’ll give one piece of in‑the‑moment feedback within 24 hours
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none rounded border" />
                  When someone brings me a problem, I’ll ask “What do you think?” first
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none rounded border" />
                  I’ll actively ask for one dissenting opinion in my next meeting
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none rounded border" />
                  I’ll identify one team member’s strength and find a way to amplify it
                </li>
              </ul>
            </section>

            <section className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">
                Ready to take your leadership to the next level?
              </p>
              <Button asChild size="lg">
                <Link to="/programmes">
                  Explore All Programmes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}

function ChecklistItem(props: {
  number: number;
  title: string;
  why: string;
  fix: string;
  reflect: string;
}) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
          {props.number}
        </div>
        <h2 className="text-xl font-bold text-foreground">{props.title}</h2>
      </div>

      <div className="mt-4 space-y-4">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            WHY IT HAPPENS
          </p>
          <p className="mt-1 text-foreground">{props.why}</p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            THE FIX
          </p>
          <p className="mt-1 text-foreground">{props.fix}</p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            REFLECTION
          </p>
          <p className="mt-1 italic text-foreground">{props.reflect}</p>
        </div>
      </div>
    </section>
  );
}
