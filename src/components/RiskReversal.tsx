import { Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface RiskReversalProps {
  variant?: "banner" | "compact";
  className?: string;
}

export default function RiskReversal({ variant = "banner", className = "" }: RiskReversalProps) {
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-xl p-4 ${className}`}
      >
        <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-bold text-green-800 dark:text-green-200 text-sm">
            90-Day Results Guarantee
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            If you don't see measurable results, we work for free until you do.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`py-12 px-6 lg:px-8 ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-2 border-green-200 dark:border-green-800 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-green-800 dark:text-green-100 mb-4">
              Our 90-Day Results Guarantee
            </h3>
            
            <p className="text-xl md:text-2xl font-semibold text-green-700 dark:text-green-200 mb-6 max-w-2xl mx-auto">
              If you don't see measurable results in 90 days, we work for free until you do.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-green-700 dark:text-green-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>40% average productivity gains</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>50% reduction in team conflict</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>35% faster decision-making</span>
              </div>
            </div>
            
            <p className="text-xs text-green-600 dark:text-green-400 mt-6 max-w-xl mx-auto">
              *Results measured through pre/post leadership assessments, 360° feedback, and agreed KPIs. 
              Based on outcomes from 200+ client engagements.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
