import SEO from "@/components/SEO";

const stats = [
  { value: "4,000+", label: "Leaders Developed" },
  { value: "30+", label: "Programmes Implemented" },
  { value: "30+", label: "Client Organisations" },
  { value: "11", label: "Years Operating" },
];

const problems = [
  {
    level: "BOARD / CEO",
    text: "The management layer is a black box. You invest in leadership development and cannot measure what changed. Attrition costs are climbing. Culture surveys say the same thing every year. Nobody can tell you why.",
  },
  {
    level: "HR DIRECTOR / CHRO",
    text: "You are accountable for capability development but have no way to prove ROI. Every programme ends and nothing embeds. You are running the same initiative every 18 months with a different name on it.",
  },
  {
    level: "MIDDLE MANAGER",
    text: "You were promoted because you were good at the job. Nobody taught you how to lead people. You are managing by instinct, carrying problems that coaching would resolve, and burning out in the process.",
  },
  {
    level: "INDIVIDUAL CONTRIBUTOR",
    text: "You are being managed, not developed. Your potential is sitting under a manager who does not know how to unlock it. You are looking for a reason to stay.",
  },
];

const milestones = [
  {
    month: "Month 1",
    title: "FOUNDATION",
    text: "The identity shift. Managers stop seeing themselves as the person with the answers and start operating as the person who develops others. This is the hardest shift. We do not skip it.",
  },
  {
    month: "Month 2",
    title: "PRACTICE",
    text: "Coaching conversations in live work contexts. Real team challenges. Real feedback. Supervised practice that builds muscle memory, not theoretical frameworks.",
  },
  {
    month: "Month 3",
    title: "EMBED",
    text: "The systems, habits, and accountability structures that make the shift permanent. We do not exit until behaviour change is measurable. This is where most providers stop. This is where we start.",
  },
];

const differentiators = [
  { bold: "90-day structured delivery", text: "not a workshop, not a course, a managed behaviour change process" },
  { bold: "Cohort-based", text: "managers learn alongside peers in real organisational context" },
  { bold: "Diagnostic-led", text: "our entry assessment shapes the programme, not a generic curriculum" },
  { bold: "Embed phase built in", text: "we do not leave until the shift is measurable" },
  { bold: "African-origin IP", text: "built for SA organisations, not imported and repackaged" },
];

const frameworks = [
  {
    title: "LEADER AS COACH",
    text: "The primary commercial offer. The 90-Day Manager Coaching Accelerator. The shift from command and control to coaching and accountability. This is the front door.",
  },
  {
    title: "SHIFT",
    text: "Self-Management. Human Intelligence. Innovation. Focus. Thinking. Your AI Edge. The six skills of the AI-era leader. The operating system every manager needs to stay relevant in the next decade.",
  },
  {
    title: "CONTAGIOUS IDENTITY",
    text: "Six-session executive coaching programme. The internal architecture of how a leader sees themselves determines how they lead others. Identity change precedes behaviour change.",
  },
];

// Brand palette
const navy = "#0F1F2E";
const teal = "#2A7B88";
const gold = "#C8A864";
const cream = "#F8F6F1";

export default function Brand() {
  return (
    <>
      <SEO
        title="Brand Book | Leadership by Design"
        description="The brand strategy, positioning, and identity of Leadership by Design."
      />

      <div style={{ fontFamily: "'Source Sans 3', 'Inter', sans-serif", color: navy, background: cream }}>
        {/* 01 BRAND PURPOSE */}
        <section style={{ background: navy, color: cream }} className="py-20 px-6 md:px-16 lg:px-24">
          <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: gold }}>01 — Brand Purpose</p>
          <blockquote className="font-serif text-3xl md:text-5xl italic mb-10" style={{ color: gold }}>
            "Built by design. Not by default."
          </blockquote>
          <p className="font-serif text-2xl md:text-3xl mb-8" style={{ color: cream }}>
            Most CEOs inherit a management layer that was never properly built.
          </p>
          <p className="text-lg leading-relaxed mb-6 max-w-3xl" style={{ color: `${cream}cc` }}>
            They have people in leadership positions who are technically capable, institutionally loyal, and completely unprepared for the human side of the job. The result shows up everywhere — in attrition numbers, in performance reviews that say nothing, in escalations that should never reach the executive floor, in a culture that talks about people development and delivers compliance.
          </p>
          <p className="text-lg leading-relaxed max-w-3xl" style={{ color: `${cream}cc` }}>
            Leadership by Design exists to fix that. Not with training. With architecture.
          </p>
        </section>

        {/* 02 WHAT WE BUILD */}
        <section className="py-20 px-6 md:px-16 lg:px-24" style={{ background: cream }}>
          <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: teal }}>02 — What We Build</p>
          <blockquote className="font-serif text-2xl md:text-4xl italic mb-8" style={{ color: navy }}>
            "We build the management layer your organisation should have had from the start."
          </blockquote>
          <p className="text-lg leading-relaxed mb-10 max-w-3xl">
            We install the operating system that turns your management layer into a growth engine. One where managers coach instead of control. Where performance conversations happen before problems escalate. Where your best people stay because they are being developed, not just deployed.
          </p>
          <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: gold }}>The Three Outcomes We Deliver</p>
          <ul className="space-y-4 max-w-3xl">
            <li className="text-lg"><span className="font-bold">Retention</span> — your high performers stop leaving because they are being led, not just managed</li>
            <li className="text-lg"><span className="font-bold">Performance</span> — your management layer solves problems before they escalate to the executive floor</li>
            <li className="text-lg"><span className="font-bold">Culture</span> — coaching becomes how your organisation operates, not a once-off intervention</li>
          </ul>
        </section>

        {/* 03 WHO BUILT THIS */}
        <section style={{ background: navy, color: cream }} className="py-20 px-6 md:px-16 lg:px-24">
          <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: gold }}>03 — Who Built This</p>
          <blockquote className="font-serif text-xl md:text-3xl italic mb-8" style={{ color: gold }}>
            "Built by leaders who spent 11 years inside South African organisations watching the same gap destroy the same potential."
          </blockquote>
          <p className="text-lg leading-relaxed mb-12 max-w-3xl" style={{ color: `${cream}cc` }}>
            Leadership by Design is not a training company that rebranded. We have never been in the content business. From day one we have been in the behaviour change business — working inside Financial Services, Insurance, Banking, and Professional Services firms to install leadership capability that actually holds.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-serif text-4xl md:text-5xl font-bold" style={{ color: gold }}>{s.value}</p>
                <p className="text-sm mt-2" style={{ color: `${cream}99` }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 04 THE PROBLEM AT EVERY LEVEL */}
        <section className="py-20 px-6 md:px-16 lg:px-24" style={{ background: cream }}>
          <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: teal }}>04 — The Problem at Every Level</p>
          <p className="text-lg mb-10 max-w-3xl">
            The coaching gap creates a different problem depending on where you sit. We solve all of them.
          </p>
          <div className="space-y-6 max-w-3xl">
            {problems.map((p, i) => (
              <div key={i} className="pl-6 py-4" style={{ borderLeft: `4px solid ${teal}` }}>
                <p className="font-serif text-lg font-bold mb-2" style={{ color: navy }}>{p.level}</p>
                <p className="text-base leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 05 THE SOLUTION */}
        <section style={{ background: navy, color: cream }} className="py-20 px-6 md:px-16 lg:px-24">
          <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: gold }}>05 — The Solution</p>
          <blockquote className="font-serif text-2xl md:text-4xl italic mb-8" style={{ color: gold }}>
            "No two-day workshop has ever closed this gap permanently."
          </blockquote>
          <p className="text-lg leading-relaxed mb-12 max-w-3xl" style={{ color: `${cream}cc` }}>
            Leadership by Design installs a coaching operating system inside your management layer through the Leader as Coach 90-Day Manager Coaching Accelerator. This is not a programme your managers attend. It is a capability your organisation keeps.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {milestones.map((m, i) => (
              <div key={i} className="p-6 rounded-lg" style={{ background: `${gold}15`, border: `1px solid ${gold}33` }}>
                <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: gold }}>{m.month}</p>
                <p className="font-serif text-xl font-bold mb-3" style={{ color: cream }}>{m.title}</p>
                <p className="text-base leading-relaxed" style={{ color: `${cream}bb` }}>{m.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 06 STRATEGIC POSITION */}
        <section className="py-20 px-6 md:px-16 lg:px-24" style={{ background: cream }}>
          <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: teal }}>06 — Strategic Position</p>
          <blockquote className="font-serif text-2xl md:text-4xl italic mb-8" style={{ color: navy }}>
            "We are not a training company. We are a leadership infrastructure company."
          </blockquote>
          <p className="text-lg leading-relaxed mb-10 max-w-3xl">
            The market is full of content. Courses, facilitators, e-learning modules, keynote speakers. All of it treats leadership development as an event. We treat it as an operating system.
          </p>
          <ul className="space-y-4 max-w-3xl">
            {differentiators.map((d, i) => (
              <li key={i} className="text-lg">
                <span className="font-bold">{d.bold}</span> — {d.text}
              </li>
            ))}
          </ul>
        </section>

        {/* 07 OUR FRAMEWORKS */}
        <section style={{ background: navy, color: cream }} className="py-20 px-6 md:px-16 lg:px-24">
          <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: gold }}>07 — Our Frameworks</p>
          <p className="text-lg mb-10" style={{ color: `${cream}cc` }}>
            Three proprietary frameworks. One complete leadership operating system.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {frameworks.map((f, i) => (
              <div key={i} className="p-6 rounded-lg" style={{ borderTop: `4px solid ${gold}`, background: `${cream}08` }}>
                <p className="font-serif text-xl font-bold mb-3" style={{ color: gold }}>{f.title}</p>
                <p className="text-base leading-relaxed" style={{ color: `${cream}bb` }}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 08 LONG-TERM VISION */}
        <section className="py-20 px-6 md:px-16 lg:px-24" style={{ background: cream }}>
          <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: teal }}>08 — Long-Term Vision</p>
          <blockquote className="font-serif text-2xl md:text-4xl italic mb-8" style={{ color: navy }}>
            "An African-origin leadership operating system. Globally exportable. Scaled to millions."
          </blockquote>
          <p className="text-lg leading-relaxed mb-6 max-w-3xl">
            The 11-year ambition is not to be the best leadership training company in South Africa. It is to build a globally defensible leadership infrastructure brand — a body of proprietary frameworks, diagnostic tools, and delivery infrastructure that organisations license as a permanent internal capability.
          </p>
          <p className="text-lg leading-relaxed font-bold max-w-3xl">
            We are building enterprise value, not billable hours.
          </p>
        </section>

        {/* 09 CONTACT */}
        <section style={{ background: navy, color: cream }} className="py-20 px-6 md:px-16 lg:px-24">
          <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: gold }}>09 — Contact</p>
          <p className="font-serif text-4xl md:text-5xl font-bold mb-2">Kevin Britz</p>
          <p className="text-lg mb-6" style={{ color: teal }}>Founder, Leadership by Design</p>
          <p className="text-lg mb-1">
            <a href="mailto:kevin@kevinbritz.com" className="underline hover:no-underline" style={{ color: cream }}>kevin@kevinbritz.com</a>
          </p>
          <p className="text-lg mb-10">
            <a href="https://leadershipbydesign.co" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline" style={{ color: cream }}>leadershipbydesign.co</a>
          </p>
          <p className="font-serif text-xl italic" style={{ color: gold }}>
            Built by design. Not by default.
          </p>
        </section>
      </div>
    </>
  );
}
