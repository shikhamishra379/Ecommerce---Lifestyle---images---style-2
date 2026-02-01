
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  CATEGORIES, VISUAL_STYLES 
} from './constants';
import { ProductFormData, PromptOutput } from './types';
import { generatePrompts, PRODUCT_INTELLIGENCE } from './services/promptEngine';

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
  aspectRatio: '4:5',
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
  const [imageGenerating, setImageGenerating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'results'>('form');
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [outputs, setOutputs] = useState<PromptOutput[]>([]);
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

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
    setIsDirty(true);
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleArrayItem = (name: 'visualStyles', item: string) => {
    setIsDirty(true);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsDirty(true);
        setFormData(prev => ({ ...prev, imageRef: reader.result as string }));
        setPreviewImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDirty(true);
    setFormData(prev => ({ ...prev, imageRef: null }));
    setPreviewImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (confirm('Start a new project? This will clear all current settings.')) {
      setFormData(INITIAL_FORM_DATA);
      setOutputs([]);
      setSelectedOutputId(null);
      setPreviewImage(null);
      setError(null);
      setIsDirty(false);
      setActiveTab('form');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const generateAIPreview = async (output: PromptOutput) => {
    setSelectedOutputId(output.id);
    setImageGenerating(true);
    setPreviewImage(null);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = output.fullPrompt;
      const visualDescription = prompt.split('DIRECTION:')[0].trim() || prompt;
      
      const parts: any[] = [{ 
        text: `Commercial photography of ${formData.productName}. Style: ${formData.visualStyles.join(', ')}. Scene: ${visualDescription}. High-end commercial quality, 8K, photorealistic. Ambient lighting accents in hex color ${formData.primaryColor}. Product remains consistent with @img1.` 
      }];
      
      if (formData.imageRef) {
        const base64Data = formData.imageRef.split(',')[1];
        parts.push({
          inlineData: { data: base64Data, mimeType: 'image/png' }
        });
      }

      let modelAspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1";
      if (formData.aspectRatio === "9:16") modelAspectRatio = "9:16";
      else if (formData.aspectRatio === "16:9") modelAspectRatio = "16:9";
      else if (formData.aspectRatio === "3:4" || formData.aspectRatio === "4:5") modelAspectRatio = "3:4";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { imageConfig: { aspectRatio: modelAspectRatio } }
      });

      let found = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setPreviewImage(`data:image/png;base64,${part.inlineData.data}`);
            found = true;
            break;
          }
        }
      }
      
      if (!found) setError("Visualization failed. Please try a different style.");
    } catch (err: any) {
      setError(`Generation error: ${err.message}`);
    } finally {
      setImageGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (!formData.productName) {
      alert('Please enter a product name first.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const generated = generatePrompts(formData);
      setOutputs(generated);
      setActiveTab('results');
      setLoading(false);
      setIsDirty(false);
      if (generated.length > 0) {
        generateAIPreview(generated[0]);
      }
    }, 800);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const selectedOutput = outputs.find(o => o.id === selectedOutputId);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: '#F8F7FF' }}>
      {/* Background soft blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20" style={{ background: formData.primaryColor }}></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20" style={{ background: '#E0D7FF' }}></div>

      <header className="h-20 flex items-center justify-between px-10 sticky top-0 z-50">
        <div className="glass px-6 py-2.5 rounded-full flex items-center gap-4 shadow-xl shadow-purple-900/5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: formData.primaryColor }}>V</div>
          <h1 className="font-bold text-slate-800 tracking-tight text-sm">Lifestyle Lens</h1>
        </div>
        
        {/* Simplified Header: Just 2 buttons as requested */}
        <div className="flex items-center glass p-1.5 rounded-full shadow-lg shadow-purple-900/5 min-w-[140px] justify-between">
          <button 
            onClick={handleReset}
            title="New Project"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-white/50 rounded-full transition-all flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
          
          <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
          
          <button 
            onClick={() => setActiveTab(activeTab === 'form' ? (outputs.length > 0 ? 'results' : 'form') : 'form')}
            className={`px-6 py-2 text-xs font-bold rounded-full transition-all bg-white text-slate-900 shadow-md hover:bg-slate-50 min-w-[90px] ${outputs.length === 0 && activeTab === 'form' ? 'opacity-50 cursor-default' : ''}`}
          >
            {activeTab === 'form' ? (outputs.length > 0 ? 'Gallery' : 'Studio') : 'Studio'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative z-10 px-6 pb-2">
        {activeTab === 'form' ? (
          <div className="flex w-full gap-6">
            <div className="w-[420px] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
              <section className="glass rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-purple-900/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">1</div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identify</h3>
                </div>
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[10px] font-bold text-slate-400 ml-4 mb-1 block">PRODUCT NAME</label>
                    <input name="productName" value={formData.productName} onChange={handleInputChange} placeholder="E.g. Lavender Sleep Mist" className="w-full px-6 py-4 bg-white/50 border-2 border-transparent focus:border-purple-200 rounded-3xl text-sm outline-none transition-all placeholder:text-slate-300" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-4 mb-1 block">CATEGORY</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-6 py-4 bg-white/50 border-2 border-transparent focus:border-purple-200 rounded-3xl text-sm outline-none appearance-none">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              <section className="glass rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-purple-900/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">2</div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Vibes</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-4 mb-3 block">STYLE DIRECTION</label>
                    <div className="flex flex-wrap gap-2">
                      {VISUAL_STYLES.map(style => (
                        <button
                          key={style}
                          onClick={() => toggleArrayItem('visualStyles', style)}
                          className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border-2 ${formData.visualStyles.includes(style) ? 'border-transparent text-white shadow-lg' : 'bg-white/40 text-slate-600 border-transparent hover:bg-white/80'}`}
                          style={{ backgroundColor: formData.visualStyles.includes(style) ? formData.primaryColor : undefined }}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 ml-4 mb-3 block">PRIMARY ACCENT</label>
                    <div className="flex items-center gap-4 bg-white/40 p-3 rounded-3xl">
                      <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleInputChange} className="h-10 w-20 rounded-2xl cursor-pointer bg-transparent border-none" />
                      <span className="text-xs font-mono font-bold text-slate-500">{formData.primaryColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass rounded-[2.5rem] p-8 space-y-6 shadow-xl shadow-purple-900/5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">3</div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Asset</h3>
                </div>
                <div 
                   className="relative aspect-square border-4 border-dashed border-white rounded-[2rem] flex flex-col items-center justify-center hover:bg-white/40 transition-all cursor-pointer group bg-white/20" 
                   onClick={() => fileInputRef.current?.click()}
                >
                  {formData.imageRef ? (
                    <div className="absolute inset-2">
                       <img src={formData.imageRef} className="w-full h-full object-cover rounded-[1.5rem] shadow-xl" alt="Product" />
                       <button onClick={clearImage} className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-xl border border-red-500/10 hover:scale-110 transition-all z-10">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-purple-500 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Add Product</p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageUpload} />
                </div>
              </section>
            </div>

            <div className="flex-1 glass rounded-[3rem] p-12 flex flex-col items-center justify-center shadow-2xl shadow-purple-900/5">
              <div className="max-w-md text-center space-y-8">
                 <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-purple-100 to-white mx-auto flex items-center justify-center shadow-inner">
                    <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                 </div>
                 <h2 className="text-4xl font-serif font-bold text-slate-800 italic">Vision Studio</h2>
                 <p className="text-sm text-slate-500 leading-relaxed font-medium">Configure your brand assets and let the engine weave high-end commercial concepts tailored to your aesthetic.</p>
                 <button onClick={handleGenerate} disabled={loading} style={{ backgroundColor: formData.primaryColor }} className="px-12 py-5 text-white rounded-full font-black text-sm shadow-2xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all">
                   {loading ? 'PREPARING...' : outputs.length > 0 ? 'UPDATE' : 'GENERATE'}
                 </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full gap-6 h-full overflow-hidden">
            {/* Sidebar Styles List */}
            <div className="w-[380px] flex flex-col overflow-y-auto custom-scrollbar gap-6 pr-2">
              <div className="flex justify-between items-center px-4">
                 <h2 className="text-xl font-serif font-bold text-slate-800 italic">Curated Gallery</h2>
              </div>
              <div className="space-y-4">
                {outputs.map(out => (
                  <button 
                    key={out.id} 
                    onClick={() => generateAIPreview(out)}
                    className={`w-full text-left glass p-6 rounded-[2.5rem] transition-all group relative border-2 ${selectedOutputId === out.id ? 'border-purple-300 bg-white shadow-lg' : 'border-transparent hover:bg-white/90'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[8px] font-black text-purple-400 uppercase tracking-tighter">{out.purpose}</span>
                       <div className={`w-2 h-2 rounded-full ${selectedOutputId === out.id ? 'animate-pulse' : ''}`} style={{ backgroundColor: formData.primaryColor }}></div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{out.title}</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{out.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Visual & Prompt Area */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              {/* Top: Image Preview */}
              <div className="flex-1 glass rounded-[3.5rem] p-6 relative overflow-hidden shadow-2xl flex items-center justify-center">
                 {imageGenerating ? (
                   <div className="text-center space-y-6">
                      <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Rendering Vibe</p>
                   </div>
                 ) : error ? (
                   <div className="text-center space-y-4 glass p-10 rounded-[2.5rem]">
                      <p className="text-red-500 font-bold text-xs">{error}</p>
                      <button onClick={() => selectedOutput && generateAIPreview(selectedOutput)} className="px-8 py-3 bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Retry Render</button>
                   </div>
                 ) : previewImage ? (
                   <div className="w-full h-full flex flex-col items-center justify-center relative">
                      <img src={previewImage} className="max-w-full max-h-full rounded-[2.5rem] shadow-2xl object-contain" alt="Preview" />
                      <div className="absolute bottom-6 left-6 glass px-6 py-4 rounded-[2rem] border-white/60 hidden md:block">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Brand Signature</p>
                         <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.primaryColor }}></div>
                            <span className="text-xs font-mono font-bold text-slate-700">{formData.primaryColor}</span>
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center text-slate-300 space-y-4">
                      <div className="w-20 h-20 bg-white/40 rounded-[2rem] mx-auto flex items-center justify-center">
                         <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Select a Style to Preview</p>
                   </div>
                 )}
              </div>

              {/* Bottom: Prompt Details */}
              {selectedOutput && (
                <div className="h-[280px] glass rounded-[3rem] p-8 flex flex-col shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Prompt Blueprint</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Technical specifications for image generation.</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(selectedOutput.fullPrompt)}
                      className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${copyFeedback ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:scale-105 active:scale-95'}`}
                    >
                      {copyFeedback ? '✓ Copied' : 'Copy Full Prompt'}
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-purple-400 uppercase">Scene Context</p>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-medium">{selectedOutput.sections.scene}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-purple-400 uppercase">Lighting & Color</p>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-medium">{selectedOutput.sections.lighting} {selectedOutput.sections.color}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-purple-400 uppercase">Technical Specs</p>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-medium">{selectedOutput.sections.camera} {selectedOutput.sections.tech}</p>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Raw Prompt String</p>
                      <p className="text-[10px] font-mono text-slate-500 whitespace-pre-wrap">{selectedOutput.fullPrompt}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="pb-4 pt-2 text-center relative z-20">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          MADE WITH <span className="text-red-500 scale-110">❤️</span> BY SM
        </p>
      </footer>
    </div>
  );
};

export default App;
