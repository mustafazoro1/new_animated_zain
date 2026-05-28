import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListMachinery, useToggleMachineryPublish, useUpdateMachinery, useDeleteMachinery, getListMachineryQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Globe, EyeOff, Star } from "lucide-react";
import { useState } from "react";

export default function AdminMachinery() {
  const { data: machinery = [], isLoading } = useListMachinery();
  const togglePublish = useToggleMachineryPublish();
  const updateMachinery = useUpdateMachinery();
  const deleteMachinery = useDeleteMachinery();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleToggle = (id: number, published: boolean) => {
    togglePublish.mutate(
      { id, data: { published } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMachineryQueryKey() }) }
    );
  };

  const handleFeature = (item: typeof machinery[number]) => {
    updateMachinery.mutate(
      { id: item.id, data: { name: item.name, slug: item.slug, featured: !item.featured } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMachineryQueryKey() }) }
    );
  };

  const handleDelete = (id: number) => {
    deleteMachinery.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMachineryQueryKey() });
          setConfirmDelete(null);
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-10 pb-6 border-b border-[hsl(220,15%,18%)]">
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mb-1">Fleet</p>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-tight">Machinery</h1>
        </div>
        <Link
          href="/admin/machinery/new"
          className="inline-flex items-center gap-2 bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors"
        >
          <Plus size={13} />
          Add Equipment
        </Link>
      </div>

      <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(220,12%,40%)] mb-4">
        <Star size={9} className="inline mr-1.5 text-[hsl(38,72%,52%)]" fill="currentColor" />
        Star marks equipment featured on the home page
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,18%)] animate-pulse" />)}
        </div>
      ) : (
        <div className="border border-[hsl(220,15%,18%)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[hsl(220,18%,11%)] border-b border-[hsl(220,15%,18%)]">
                {["Equipment", "Category", "Year", "Condition", "Home", "Visibility", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[9px] tracking-[0.25em] uppercase text-[hsl(220,12%,40%)] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {machinery.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-[hsl(220,15%,16%)] hover:bg-[hsl(220,18%,11%)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-serif font-bold text-sm">{item.name}</p>
                    <p className="text-[10px] text-[hsl(220,12%,40%)] mt-0.5">/{item.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(220,12%,55%)]">{item.category || "—"}</td>
                  <td className="px-4 py-3 text-xs text-[hsl(220,12%,55%)]">{item.year || "—"}</td>
                  <td className="px-4 py-3 text-xs text-[hsl(220,12%,55%)]">{item.condition || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleFeature(item)}
                      disabled={updateMachinery.isPending}
                      title={item.featured ? "Remove from home page" : "Show on home page"}
                      className="transition-colors"
                    >
                      <Star
                        size={14}
                        className={item.featured ? "text-[hsl(38,72%,52%)]" : "text-[hsl(220,12%,30%)] hover:text-[hsl(220,12%,55%)]"}
                        fill={item.featured ? "currentColor" : "none"}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(item.id, !item.published)}
                      className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 tracking-[0.15em] uppercase border transition-all ${
                        item.published
                          ? "border-green-800 text-green-500 hover:bg-green-900/20"
                          : "border-[hsl(220,15%,25%)] text-[hsl(220,12%,45%)] hover:border-[hsl(220,15%,35%)]"
                      }`}
                    >
                      {item.published ? <Globe size={9} /> : <EyeOff size={9} />}
                      {item.published ? "Live" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/admin/machinery/${item.id}/edit`}
                        className="text-[hsl(220,12%,45%)] hover:text-[hsl(38,72%,52%)] transition-colors"
                      >
                        <Pencil size={13} />
                      </Link>
                      {confirmDelete === item.id ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDelete(item.id)} className="text-[9px] text-red-400 uppercase tracking-widest">Confirm</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-[9px] text-[hsl(220,12%,40%)] uppercase tracking-widest">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(item.id)} className="text-[hsl(220,12%,35%)] hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {machinery.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[hsl(220,12%,40%)] text-xs tracking-widest uppercase">
                    No equipment added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
