const ClientsSection = () => {
  const clients = [
    "Sasfin", "HDS Med", "Worley", "MIT Management School", "Aspen Pharmacare",
    "IMM Graduate School", "Tshwane University of Technology", "BCX", "Letsema",
    "Salt IT", "TWF Corporate", "University of Pretoria", "Multotec", "Multiply",
    "Dentons", "CelluGrowth", "Purpleroom", "Discovery", "Regenesys Business School",
    "TymeBank", "KLA", "Samplex Africa", "Aramex", "FNB", "Raintree Business School",
    "SADV", "SBI", "Momentum", "BankservAfrica", "MiWay", "MultiChoice", "Showmax"
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kevin has partnered with some of South Africa's most respected organizations to develop their leadership capabilities and drive sustainable growth.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((client, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-lg p-6 flex items-center justify-center hover:border-primary/40 transition-colors"
            >
              <span className="text-sm font-medium text-muted-foreground text-center">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
