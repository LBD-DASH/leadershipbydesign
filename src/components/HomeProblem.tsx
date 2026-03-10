export default function HomeProblem() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
          Most management layers have the same gap.
        </h2>
        <div className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed space-y-4 text-left sm:text-center">
          <p>
            Your managers were promoted because they were excellent at their job.
            Not because they knew how to develop people.
          </p>
          <p>
            So they manage tasks, solve problems for their teams, avoid difficult
            conversations, and wonder why engagement is low and good people keep
            leaving.
          </p>
          <p className="font-medium text-foreground">
            It's not a performance problem. It's a coaching capability problem.
          </p>
        </div>
      </div>
    </section>
  );
}
