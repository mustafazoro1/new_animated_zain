import { useListMachinery } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Settings2 } from "lucide-react";

const fallbackImage = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800";

export default function Machinery() {
  const { data: machinery = [], isLoading } = useListMachinery({ published: true });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(machinery.map(m => m.category).filter(Boolean) as string[]));
  const filtered = selectedCategory ? machinery.filter(m => m.category === selectedCategory) : machinery;

  return (
    <PageTransition>
      <div className="min-h-screen text-foreground">
        {/* Header */}
        <section className="pt-40 pb-16 px-6 border-b border-[hsl(220,15%,18%)]">
          <div className="max-w-screen-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)] mb-4"
            >
              Equipment & Fleet
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold tracking-tight uppercase mb-6"
            >
              Machinery
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base text-[hsl(220,12%,60%)] max-w-2xl"
            >
              Our fleet of specialised construction equipment supports projects across the region, from excavation and piling to concrete works and heavy lifting.
            </motion.p>
          </div>
        </section>

        {/* Category Filter */}
        {categories.length > 0 && (
          <section className="px-6 py-6 border-b border-[hsl(220,15%,18%)] sticky top-[65px] bg-background z-20">
            <div className="max-w-screen-2xl mx-auto flex flex-wrap gap-6 items-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`text-xs tracking-[0.2em] uppercase transition-all ${
                  selectedCategory === null
                    ? "text-[hsl(38,72%,52%)] font-medium"
                    : "text-[hsl(220,12%,50%)] hover:text-foreground"
                }`}
              >
                All Equipment
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs tracking-[0.2em] uppercase transition-all ${
                    selectedCategory === cat
                      ? "text-[hsl(38,72%,52%)] font-medium"
                      : "text-[hsl(220,12%,50%)] hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Grid */}
        <section className="py-16 px-6">
          <div className="max-w-screen-2xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,18%)] animate-pulse">
                    <div className="aspect-[16/10] bg-[hsl(220,15%,18%)]" />
                    <div className="p-5 space-y-2">
                      <div className="h-4 bg-[hsl(220,15%,20%)] w-3/4" />
                      <div className="h-3 bg-[hsl(220,15%,18%)] w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-32 text-center">
                <Settings2 size={40} className="mx-auto text-[hsl(220,12%,30%)] mb-4" />
                <p className="text-[hsl(220,12%,50%)] text-sm tracking-widest uppercase">No machinery listed yet</p>
                <p className="text-[hsl(220,12%,40%)] text-xs mt-2">Add equipment from the admin panel</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,18%)] hover:border-[hsl(38,72%,52%)/40%] transition-all duration-300 group"
                    data-testid={`card-machinery-${item.id}`}
                  >
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden bg-[hsl(220,15%,16%)] relative">
                      <motion.img
                        src={item.imageUrl || fallbackImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.6 }}
                        onError={e => { (e.target as HTMLImageElement).src = fallbackImage; }}
                      />
                      {item.category && (
                        <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase bg-[hsl(220,18%,9%)/80%] text-[hsl(38,72%,52%)] px-2.5 py-1 backdrop-blur-sm">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-serif font-bold text-lg uppercase tracking-tight mb-1 group-hover:text-[hsl(38,72%,52%)] transition-colors">
                        {item.name}
                      </h3>

                      {/* Spec row */}
                      <div className="flex gap-4 text-xs text-[hsl(220,12%,50%)] mt-1 mb-3">
                        {item.year && <span>{item.year}</span>}
                        {item.condition && (
                          <>
                            <span className="text-[hsl(220,15%,25%)]">·</span>
                            <span className={`${item.condition === "Excellent" ? "text-green-500" : item.condition === "Good" ? "text-blue-400" : "text-[hsl(220,12%,50%)]"}`}>
                              {item.condition}
                            </span>
                          </>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-sm text-[hsl(220,12%,55%)] leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
