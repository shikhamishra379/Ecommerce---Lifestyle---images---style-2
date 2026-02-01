import React, { useState, useEffect, useRef } from 'react';
import { 
  CATEGORIES, VISUAL_STYLES 
} from './constants.ts';
import { ProductFormData, PromptOutput } from './types.ts';
import { generatePrompts, PRODUCT_INTELLIGENCE } from './services/promptEngine.ts';

const INITIAL_FORM_DATA: ProductFormData = {
  productName: '',
  category: 'Apparel, Shoes & Jewelry',
  productForm: 'Solid',
  containerType: 'Glass jar',
  characteristics: [],
  primaryColor: '#8B5CF6',
  brandPositioning: 'Premium',
  visualStyles: ['Modern', 'Aesthetic'],
  creativeLevel: 5,
  platforms: ['Instagram Feed'],
  mascotEnabled: true,
  mascotStyle: 'Realistic 3D',
  mascotIntegration: 'Beside product',
  liquidEnabled: true,
  dripIntensity: 'Medium',
  powderEnabled: false,
  powderIntensity: 'Subtle mist',
  propsEnabled: true,
  propQuantity: 'Minimal',
  resolution: '8K',
  aspectRatio: '1:1',
  dof: 'Medium',
  lightingStyle: 'Natural Daylight',
  lightTemp: 'Neutral White (4000K-5000K)',
  shadowIntensity: 5,
  cameraAngle: 'Straight-on (0°)',
  focalLength: 'Standard (50mm)',
  composition: 'Rule of thirds',
  colorPalette: ['Pastels'],
  background: 'Natural Outdoor',
  moods: ['Natural & Organic'],
  imageRef: null
};

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'results'>('form');
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [outputs, setOutputs] = useState<PromptOutput[]>([]);
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    const intel = PRODUCT_INTELLIGENCE[formData.category];
    if (intel) {
      setFormData(prev => ({
        ...prev,
        productForm: intel.physicalForm as any,
        creativeLevel: intel.creativeDefault,
        lightingStyle: intel.lightingDefault,
        liquidEnabled: intel.liquidDripAppropriate,
        powderEnabled: intel.powderEffectAppropriate,
      }));
    }
  }, [formData.category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageRef: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, imageRef: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleArrayItem = (name: 'visualStyles', item: string) => {
    setFormData(prev => {
      const current = prev[name] as string[];
      return {
        ...prev,
        [name]: current.includes(item) 
          ? current.filter(i => i !== item) 
          : [...current, item]
      };
    });
  };

  const handleReset = () => {
    // Removed confirm() as it can cause issues in some preview environments
    setFormData(INITIAL_FORM_DATA);
    setOutputs([]);
    setSelectedOutputId(null);
    setActiveTab('form');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = () => {
    if (!formData.productName.trim()) {
      alert('Please enter a product name first.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      try {
        const generated = generatePrompts(formData);
        setOutputs(generated);
        setSelectedOutputId(generated[0]?.id || null);
        setActiveTab('results');
      } catch (err) {
        console.error("Generation failed:", err);
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const selectedOutput = outputs.find(o => o.id === selectedOutputId);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#F8F7FF' }}>
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: formData.primaryColor }}></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: '#E0D7FF' }}></div>

      <header className="h-20 flex items-center justify-between px-10 sticky top-0 z-50">
        <div className="glass px-6 py-2.5 rounded-full flex items-center gap-4 shadow-xl shadow-purple-900/5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: formData.primaryColor }}>N</div>
          <h1 className="font-bold text-slate-800 tracking-tight text-sm">PromptEngine Pro</h1>
        </div>
        
        <div className="flex items-center glass p-1.5 rounded-full shadow-lg shadow-purple-900/5">
          <button 
            onClick={handleReset} 
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-white/50 rounded-full transition-all" 
            title="Reset All"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
          <div className="flex bg-slate-100/50 rounded-full p-1">
            <button onClick={() => setActiveTab('form')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'form' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Configure</button>
            <button onClick={() => outputs.length > 0 && setActiveTab('results')} disabled={outputs.length === 0} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'results' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'} ${outputs.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>Blueprints</button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative z-10 px-10 pb-6">
        {activeTab === 'form' ? (
          <div className="flex w-full gap-8 max-w-7xl mx-auto items-start h-full">
            <div className="w-[450px] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4 max-h-full pb-10">
              <section className="glass rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-purple-900/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">1</div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identify</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-4 mb-1 block uppercase">Product Name</label>
                    <input name="productName" value={formData.productName} onChange={handleInputChange} placeholder="E.g. Lavender Sleep Mist" className="w-full px-6 py-4 bg-white/50 border-2 border-transparent focus:border-purple-200 rounded-3xl text-sm outline-none transition-all placeholder:text-slate-300 shadow-inner" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-4 mb-1 block uppercase">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-6 py-4 bg-white/50 border-2 border-transparent focus:border-purple-200 rounded-3xl text-sm outline-none appearance-none cursor-pointer shadow-inner">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              <section className="glass rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-purple-900/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">2</div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Ref</h3>
                </div>
                <div className="relative aspect-video border-4 border-dashed border-white rounded-[2rem] flex flex-col items-center justify-center hover:bg-white/40 transition-all cursor-pointer group bg-white/20 overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                  {formData.imageRef ? (
                    <div className="absolute inset-0 group">
                       <img src={formData.imageRef} className="w-full h-full object-cover" alt="Ref" />
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={clearImage} className="w-12 h-12 bg-white text-red-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all font-bold">✕</button>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg text-purple-400 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Drop Image Reference</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              </section>

              <section className="glass rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-purple-900/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">3</div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aesthetic</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-4 mb-3 block uppercase">Style Directions</label>
                    <div className="flex flex-wrap gap-2">
                      {VISUAL_STYLES.map(style => (
                        <button key={style} onClick={() => toggleArrayItem('visualStyles', style)} className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border-2 ${formData.visualStyles.includes(style) ? 'border-transparent text-white shadow-lg' : 'bg-white/40 text-slate-600 border-transparent hover:bg-white/80'}`} style={{ backgroundColor: formData.visualStyles.includes(style) ? formData.primaryColor : undefined }}>{style}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-4 mb-3 block uppercase">Accent Color</label>
                    <div className="flex items-center gap-4 bg-white/40 p-3 rounded-3xl shadow-inner">
                      <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleInputChange} className="h-10 w-20 rounded-2xl cursor-pointer bg-transparent border-none" />
                      <span className="text-xs font-mono font-bold text-slate-500">{formData.primaryColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex-1 glass rounded-[3rem] p-16 flex flex-col items-center justify-center shadow-2xl shadow-purple-900/5 h-full relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                 <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400 rounded-full blur-[100px] animate-pulse"></div>
                 <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[100px] animate-pulse delay-1000"></div>
              </div>
              <div className="max-w-md text-center space-y-8 relative z-10">
                 <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-purple-100 to-white mx-auto flex items-center justify-center shadow-inner">
                    <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                 </div>
                 <h2 className="text-4xl font-serif font-bold text-slate-800 italic">Curate Your Suite</h2>
                 <p className="text-sm text-slate-500 leading-relaxed font-medium">Build a deterministic suite of 6 expert-level visual blueprints based on high-end photography standards.</p>
                 <button onClick={handleGenerate} disabled={loading} style={{ backgroundColor: formData.primaryColor }} className="px-12 py-5 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                   {loading ? 'WEAVING CONCEPTS...' : 'GENERATE MASTER SUITE'}
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto flex gap-8 h-full overflow-hidden animate-fade-in">
            <div className="w-[400px] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4 pb-10">
              <div className="px-2">
                <h2 className="text-2xl font-serif font-bold text-slate-800 italic">E-Com Blueprints</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">6 Structured Scenarios</p>
              </div>
              {outputs.map((out) => (
                <div 
                  key={out.id} 
                  onClick={() => setSelectedOutputId(out.id)}
                  className={`glass rounded-[2.5rem] p-6 flex flex-col cursor-pointer transition-all border-2 ${selectedOutputId === out.id ? 'border-purple-300 bg-white shadow-xl' : 'border-transparent hover:bg-white/80'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                     <span className="text-[8px] font-black text-purple-500 bg-purple-50 px-2 py-1 rounded-full uppercase tracking-widest">{out.purpose}</span>
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedOutputId === out.id ? formData.primaryColor : '#cbd5e1' }}></div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{out.title}</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{out.description}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
              <div className="flex-1 glass rounded-[3rem] p-10 flex flex-col shadow-2xl overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                   <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Prompt Blueprint</h4>
                     <h2 className="text-3xl font-serif font-bold text-slate-800 italic">{selectedOutput?.title}</h2>
                     <p className="text-sm text-slate-500 mt-2 font-medium">{selectedOutput?.description}</p>
                   </div>
                   <button 
                    onClick={() => selectedOutput && handleCopy(selectedOutput.id, selectedOutput.fullPrompt)}
                    className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${copyStatus === selectedOutput?.id ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-900 text-white hover:scale-105 active:scale-95 shadow-xl'}`}
                   >
                     {copyStatus === selectedOutput?.id ? '✓ Blueprint Copied' : 'Copy Master Prompt'}
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <section className="bg-white/40 p-6 rounded-3xl space-y-2">
                       <h5 className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Scene & Subject</h5>
                       <p className="text-xs text-slate-600 leading-relaxed">{selectedOutput?.sections.scene}</p>
                    </section>
                    <section className="bg-white/40 p-6 rounded-3xl space-y-2">
                       <h5 className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Lighting Direction</h5>
                       <p className="text-xs text-slate-600 leading-relaxed">{selectedOutput?.sections.lighting}</p>
                    </section>
                    <section className="bg-white/40 p-6 rounded-3xl space-y-2">
                       <h5 className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Camera Settings</h5>
                       <p className="text-xs text-slate-600 leading-relaxed">{selectedOutput?.sections.camera}</p>
                    </section>
                    <section className="bg-white/40 p-6 rounded-3xl space-y-2">
                       <h5 className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Supporting Props</h5>
                       <p className="text-xs text-slate-600 leading-relaxed">{selectedOutput?.sections.supporting}</p>
                    </section>
                  </div>

                  <section className="bg-slate-900 text-slate-300 p-8 rounded-[2rem] space-y-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-4 right-6 text-[8px] font-black text-slate-500 uppercase tracking-widest">Master Blueprint</div>
                    <h5 className="text-[10px] font-black text-white uppercase tracking-widest border-b border-slate-700 pb-3">Raw Consolidated String</h5>
                    <p className="text-xs font-mono leading-relaxed italic opacity-80 select-all">
                      {selectedOutput?.fullPrompt}
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="pb-6 text-center z-20 space-y-2">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Nano Engine // Deterministic Intelligence</p>
        <p className="text-[10px] font-bold text-slate-400">Made with SM</p>
      </footer>
    </div>
  );
};

export default App;