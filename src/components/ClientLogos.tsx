import { motion } from "framer-motion";

const clients = [
  "Sasfin", "HDS Med", "Worley", "MIT Management School", "Aspen Pharmacare",
  "IMM Graduate School", "Tshwane University of Technology", "BCX", "Letsema",
  "Salt IT", "TWF Corporate", "University of Pretoria", "Multotec", "Multiply",
  "Dentons", "CelluGrowth", "Purpleroom", "Discovery", "Regenesys Business School",
  "TymeBank", "KLA", "Samplex Africa", "Aramex", "FNB", "Raintree Business School",
  "SADV", "SBI", "Momentum", "BankservAfrica", "MiWay", "MultiChoice", "Showmax"
];

const duplicatedClients = [...clients, ...clients];

export default function ClientLogos() {
  return (
    <section className="py-16 px-6 lg:px-8 bg-card overflow-hidden border-y border-border">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest mb-10">
          Trusted by leading organisations across South Africa and globally
        </p>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-card to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-card to-transparent z-10" />

          {/* Row 1 */}
          <div className="mb-6 overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -50 * clients.length] }}
              transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 60, ease: "linear" } }}
            >
              {duplicatedClients.map((client, i) => (
                <div key={`r1-${i}`} className="flex-shrink-0 w-44 h-20 bg-background rounded border border-border flex items-center justify-center px-4">
                  <span className="font-semibold text-foreground text-center text-xs">{client}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2 */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: [-50 * clients.length, 0] }}
              transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 60, ease: "linear" } }}
            >
              {duplicatedClients.map((client, i) => (
                <div key={`r2-${i}`} className="flex-shrink-0 w-44 h-20 bg-background rounded border border-border flex items-center justify-center px-4">
                  <span className="font-semibold text-foreground text-center text-xs">{client}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
