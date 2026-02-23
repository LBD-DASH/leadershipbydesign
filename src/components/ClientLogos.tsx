import { motion } from "framer-motion";

const clients = [
  "Sasfin", "HDS Med", "Worley", "MIT Management School", "Aspen Pharmacare", 
  "IMM Graduate School", "Tshwane University of Technology", "BCX", "Letsema", 
  "Salt IT", "TWF Corporate", "University of Pretoria", "Multotec", "Multiply",
  "Dentons", "CelluGrowth", "Purpleroom", "Discovery", "Regenesys Business School", 
  "TymeBank", "KLA", "Samplex Africa", "Aramex", "FNB", "Raintree Business School", 
  "SADV", "SBI", "Momentum", "BankservAfrica", "MiWay", "MultiChoice", "Showmax"
];

export default function ClientLogos() {
  // Duplicate the clients array for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="py-24 px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Trusted by Leading Organizations
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Kevin has partnered with some of South Africa's most respected organizations to develop 
            their leadership capabilities and drive sustainable growth.
          </p>
        </motion.div>

        {/* Scrolling Container */}
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          
          {/* First Row - Scrolling Left */}
          <div className="mb-8 overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -50 * clients.length],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 60,
                  ease: "linear",
                },
              }}
            >
              {duplicatedClients.map((client, index) => (
                <div
                  key={`row1-${index}`}
                  className="flex-shrink-0 w-48 h-24 bg-card rounded-xl shadow-md border border-border flex items-center justify-center px-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <span className="font-semibold text-foreground text-center text-sm">
                    {client}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Second Row - Scrolling Right */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [-50 * clients.length, 0],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 60,
                  ease: "linear",
                },
              }}
            >
              {duplicatedClients.map((client, index) => (
                <div
                  key={`row2-${index}`}
                  className="flex-shrink-0 w-48 h-24 bg-card rounded-xl shadow-md border border-border flex items-center justify-center px-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <span className="font-semibold text-foreground text-center text-sm">
                    {client}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
