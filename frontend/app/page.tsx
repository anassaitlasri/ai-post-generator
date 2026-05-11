"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LOADING_STEPS = [
  "Analyse du brief et du ton...",
  "Génération de la publication...",
  "Vérification des contraintes (Self-Healing)...",
  "Rédaction de la note d'intention...",
  "Finalisation..."
];

export default function LinkedInGenerator() {
  const [form, setForm] = useState({ desc: "", brief: "", tone: "Professionnel et formel" });
  const [result, setResult] = useState<{ content: string; intent: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // NOUVEAU: Pour empêcher l'erreur d'Hydratation

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfUrl(URL.createObjectURL(file));
    } else {
      alert("Veuillez sélectionner un fichier PDF valide.");
    }
  };

  const generate = async () => {
    setLoading(true);
    setLoadingStepIndex(0);
    try {
      const res = await fetch("https://ai-post-generator-bxpl.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: form.desc, brief: form.brief, tone: form.tone }),
      });
      //
      if (!res.ok) throw new Error("Erreur serveur");
      
      const data = await res.json();
      setResult(data);
    } catch (e) { 
      alert("Erreur lors de la génération. Vérifiez que le backend est en cours d'exécution."); 
    } finally {
      setLoading(false);
    }
  };

  // NOUVEAU: On ne rend rien tant que le composant n'est pas prêt pour éviter les crashs React
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative h-14 w-48">
            <Image src="/Impalia.png" alt="Impalia Logo" fill sizes="192px" className="object-contain object-left" />
          </div>
          <div className="h-8 w-px bg-slate-300"></div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Générateur de Publications
            <div className="relative h-8 w-8">
              <Image src="/LinkedIn_logo.png" alt="LinkedIn" fill sizes="32px" className="object-contain" />
            </div>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-6 text-slate-800">Paramètres de génération</h2>
            
            <div className="space-y-5">
              <div className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <label className="block text-sm font-medium text-slate-700 cursor-pointer text-center">
                  Importer un document de référence (PDF)
                  <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                </label>
                {pdfUrl && <p className="text-xs text-slate-500 text-center mt-2">Document chargé pour visualisation</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Description de l&apos;entreprise ({form.desc.length}/2000)
                </label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 h-40 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none text-sm leading-relaxed"
                  placeholder="Collez ici les informations de l'entreprise..."
                  value={form.desc} onChange={(e) => setForm({...form, desc: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">
                  Sujet de la publication ({form.brief.length}/500)
                </label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 h-24 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none text-sm leading-relaxed"
                  placeholder="Ex: Annonce de recrutement pour un profil technique..."
                  value={form.brief} onChange={(e) => setForm({...form, brief: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Ton éditorial</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                  value={form.tone} onChange={(e) => setForm({...form, tone: e.target.value})}
                >
                  <option>Professionnel et formel</option>
                  <option>Inspirant et visionnaire</option>
                  <option>Décontracté et accessible</option>
                  <option>Humoristique</option>
                </select>
              </div>

              {/* Ajout du suppressHydrationWarning pour éviter l'erreur React */}
              <button 
                suppressHydrationWarning
                onClick={generate} 
                disabled={loading || form.desc.trim() === "" || form.brief.trim() === ""}
                className="w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-medium shadow hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {LOADING_STEPS[loadingStepIndex]}
                  </span>
                ) : (
                  "Générer la publication"
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="lg:col-span-7 flex flex-col gap-6">
          {pdfUrl && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-96 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-slate-800">Document de référence</h2>
                <button onClick={() => setPdfUrl(null)} className="text-xs text-slate-500 hover:text-slate-800 transition-colors">
                  Fermer
                </button>
              </div>
              <iframe src={pdfUrl} className="w-full flex-1 rounded bg-slate-50 border border-slate-200" title="Lecteur PDF"></iframe>
            </div>
          )}

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-6 text-slate-800 border-b border-slate-100 pb-3">
              Résultat généré
            </h2>
            
            {result ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm relative">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                      <Image src="/Impalia.png" alt="Avatar" width={56} height={56} className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-slate-900">Impalia SAS</p>
                      <p className="text-xs text-slate-500">À l&apos;instant • LinkedIn</p>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-slate-800 leading-relaxed text-[15px]">
                    {result.content}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(result.content);
                        alert("Contenu copié dans le presse-papier.");
                      }}
                      className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-md transition-colors"
                    >
                      Copier le texte
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                  <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider">
                    Note d&apos;intention stratégique
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {result.intent}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <p className="text-sm">Remplissez le formulaire pour générer une publication.</p>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}