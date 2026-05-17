/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PromptState, PresetType } from './types';
import { generatePrompt } from './utils/promptGenerator';
import { useHistory } from './hooks/useHistory';
import { Copy, Save, CheckCircle2, Circle, Download, RefreshCw, Layers, Sparkles, Settings, History } from 'lucide-react';

const INITIAL_STATE: PromptState = {
  preset: 'thai_rodor',
  gender: 'male',
  ageImpression: '18 years old',
  uniformType: 'ชุด ร.ด. นักศึกษาวิชาทหาร',
  backgroundType: 'clean blue studio background',
  framingType: 'head and shoulders',
  cropRatio: '3:4',
  expression: 'neutral closed mouth',
  skinCorrectionLevel: 'natural skin texture, no extreme smoothing',
  hairStylePreset: 'rodor_standard',
  hairNeatnessLevel: 'high',
  hairlineCleanup: true,
  preserveHairDirection: false,
  strictThaiMilitaryHaircut: true,
  hairCleanupNote: '',
  operatorNote: '',
  strictIdentity: true,
  preserveInsignia: true,
  showUpperBody: true,
};

const CHECKLIST_ITEMS = [
  'Identity preserved',
  'Uniform neat',
  'Uniform not wrinkled',
  'Shoulders level',
  'Half body visible',
  'Suitable for later crop',
  'Insignia complete',
  'No badge/logo change',
  'Face not oily',
  'Face not red',
  'Sharp enough',
  'Commercial-ready',
  'Hair is regulation-appropriate',
  'Hair is neat',
  'Ears visible',
  'Neckline clean',
  'Hair not too long',
  'Hairline clean'
];

export default function App() {
  const [state, setState] = useState<PromptState>(INITIAL_STATE);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const { history, addHistory, clearHistory } = useHistory();
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const { mainPrompt, negativePrompt } = generatePrompt(state);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleSaveToHistory = () => {
    addHistory({
      preset: state.preset,
      prompt: mainPrompt,
      negativePrompt: negativePrompt
    });
    setCopyFeedback('Saved to History');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleExportText = () => {
    const content = `Main Prompt:\n${mainPrompt}\n\nNegative Prompt:\n${negativePrompt}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCheck = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="h-full w-full flex flex-col p-4 md:p-6 gap-4 font-sans">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-xl text-white">MX</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase text-sky-400">MIX-IMAGE ID <span className="text-slate-100">AutoPrompt</span></h1>
            <p className="text-xs text-slate-500">Thai ID Photo Portrait Workflow System v1.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-400">STATUS: <span className="text-emerald-400">READY</span></div>
          <div className="text-slate-500 hidden sm:block">LOCAL STORAGE</div>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-12 grid-rows-none xl:grid-rows-6 gap-4 flex-grow h-[calc(100vh-100px)] overflow-y-auto xl:overflow-hidden">
        
        {/* LEFT COLUMN: Form Builder (Bento Card 1) */}
        <section className="md:col-span-12 xl:col-span-4 xl:row-span-6 bento-card flex flex-col gap-3 h-full">
          <h2 className="text-sm font-bold text-slate-100 uppercase border-b border-slate-800 pb-2 mb-1 flex items-center gap-2">
             <Settings className="w-4 h-4 text-sky-400" /> การตั้งค่าข้อมูล (Configuration)
          </h2>
          
          <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar pr-2 pb-4">
            
            <div className="space-y-3">
              <div>
                <label className="label-th">รูปแบบภาพ (Preset)</label>
                <select 
                  className="input-field"
                  value={state.preset}
                  onChange={e => setState({...state, preset: e.target.value as PresetType})}
                >
                  <option value="thai_rodor">Thai "ชุด ร.ด." Portrait (ล็อกชุด ร.ด.)</option>
                  <option value="thai_student">Thai Student Portrait (ชุดนักเรียน)</option>
                  <option value="thai_uniform">Thai School Uniform Portrait</option>
                  <option value="job_app">Job Application Portrait</option>
                  <option value="passport">Passport / ID Style Portrait</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-th">เพศ (Gender)</label>
                  <select 
                    className="input-field"
                    value={state.gender}
                    onChange={e => setState({...state, gender: e.target.value as any})}
                  >
                    <option value="male">ชาย (Male)</option>
                    <option value="female">หญิง (Female)</option>
                    <option value="neutral">ไม่ระบุ (Neutral)</option>
                  </select>
                </div>
                <div>
                  <label className="label-th">อายุ (Age)</label>
                  <input 
                    type="text"
                    className="input-field"
                    value={state.ageImpression}
                    onChange={e => setState({...state, ageImpression: e.target.value})}
                    placeholder="e.g. 18 years old"
                  />
                </div>
              </div>
            </div>

            {/* Hair Selector */}
            <div className="space-y-3 mt-4 pt-4 border-t border-slate-800/50">
              <h3 className="text-xs font-bold text-slate-300 uppercase">ระบบทําผม (Hair Customization)</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="label-th">ทรงผม (Hair Preset)</label>
                  <select 
                    className="input-field"
                    value={state.hairStylePreset}
                    onChange={e => setState({...state, hairStylePreset: e.target.value})}
                  >
                    <option value="rodor_standard">ร.ด. เกรียนมาตรฐาน</option>
                    <option value="very_short_buzz">เกรียนสั้นมาก</option>
                    <option value="short_undercut">รองทรงสั้น</option>
                    <option value="open_ears_neckline">เปิดหูเปิดต้นคอ</option>
                    <option value="preserve_and_clean">เก็บทรงเดิมให้เรียบร้อย</option>
                    <option value="custom">กำหนดเอง (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="label-th">ระดับความเป๊ะ (Neatness Level)</label>
                  <select 
                    className="input-field"
                    value={state.hairNeatnessLevel}
                    onChange={e => setState({...state, hairNeatnessLevel: e.target.value})}
                  >
                    <option value="high">High (เก็บขอบเนี๊ยบ)</option>
                    <option value="medium">Medium (เป็นธรรมชาติ)</option>
                    <option value="low">Low (ดรอปความคม)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition">Hairline Cleanup (เก็บไรผม)</span>
                  <input type="checkbox" checked={state.hairlineCleanup} onChange={e => setState({...state, hairlineCleanup: e.target.checked})} className="accent-sky-500 cursor-pointer" />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition">Preserve Hair Direction</span>
                  <input type="checkbox" checked={state.preserveHairDirection} onChange={e => setState({...state, preserveHairDirection: e.target.checked})} className="accent-sky-500 cursor-pointer" />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition">Strict Thai Military Haircut</span>
                  <input type="checkbox" checked={state.strictThaiMilitaryHaircut} onChange={e => setState({...state, strictThaiMilitaryHaircut: e.target.checked})} className="accent-sky-500 cursor-pointer" />
                </label>
              </div>

              {state.hairStylePreset === 'custom' && (
                <div className="pt-2">
                  <label className="label-th">Custom Hair Note</label>
                  <input 
                    type="text"
                    className="input-field"
                    value={state.hairCleanupNote}
                    onChange={e => setState({...state, hairCleanupNote: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
               <h3 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-sky-400" /> กฎพิทักษ์ (Safety Rules)</h3>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition pl-1">ล็อคใบหน้า (Strict Identity)</span>
                <input type="checkbox" checked={state.strictIdentity} onChange={e => setState({...state, strictIdentity: e.target.checked})} className="accent-sky-500 hover:scale-110 transition cursor-pointer" />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition pl-1">ล็อคเครื่องหมาย (Preserve Insignia)</span>
                <input type="checkbox" checked={state.preserveInsignia} onChange={e => setState({...state, preserveInsignia: e.target.checked})} className="accent-sky-500 hover:scale-110 transition cursor-pointer" />
              </label>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800">
               <label className="label-th">Operator Notes (หมายเหตุ)</label>
               <textarea 
                  className="input-field text-[13px] h-20 resize-none"
                  value={state.operatorNote}
                  onChange={e => setState({...state, operatorNote: e.target.value})}
                  placeholder="Additional instructions..."
               ></textarea>
            </div>

          </div>
        </section>

        {/* MIDDLE COLUMN: Prompt Output (Bento Card 2) */}
        <section className="md:col-span-12 xl:col-span-5 xl:row-span-6 bento-card flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2 gap-2">
            <h2 className="text-sm font-bold text-sky-400 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Generated Result
              {copyFeedback && <span className="text-xs font-mono text-emerald-400 ml-2 animate-pulse">{copyFeedback} Copied!</span>}
            </h2>
            <div className="flex gap-2">
              <button onClick={handleExportText} className="btn-secondary px-3 py-1">Export TXT</button>
              <button onClick={handleSaveToHistory} className="btn-secondary px-3 py-1 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50">Save</button>
            </div>
          </div>
          
          <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Main Prompt (English)</span>
                 <button onClick={() => handleCopy(mainPrompt, 'Main Prompt')} className="text-sky-400 hover:text-sky-300 text-[10px] font-bold p-1">COPY CONTENT</button>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs leading-relaxed text-slate-300 font-mono whitespace-pre-wrap">
                {mainPrompt}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Negative Prompt</span>
                 <button onClick={() => handleCopy(negativePrompt, 'Negative')} className="text-sky-400 hover:text-sky-300 text-[10px] font-bold p-1">COPY CONTENT</button>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs leading-relaxed text-pink-400/90 font-mono whitespace-pre-wrap">
                {negativePrompt}
              </div>
            </div>
          </div>
          
          <button onClick={() => handleCopy(mainPrompt + '\n\nNEGATIVE PROMPT:\n' + negativePrompt, 'Full Package')} className="btn-primary py-4 text-base tracking-wide flex-shrink-0 mt-auto shadow-lg shadow-sky-900/20 border border-sky-400/20">
            <Layers className="w-5 h-5 opacity-80" /> COPY FULL PROMPT PACKAGE
          </button>
        </section>

        {/* RIGHT COLUMN: Checklist & History */}
        
        {/* CHECKLIST: Col 3, Row 3 */}
        <section className="md:col-span-12 xl:col-span-3 xl:row-span-3 bento-card flex flex-col h-full">
            <div className="flex justify-between border-b border-slate-800 pb-2 mb-3">
              <h2 className="text-sm font-bold text-slate-100 uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Checklist
              </h2>
              <button onClick={() => setCheckedItems(new Set())} className="text-[10px] text-sky-400 font-normal hover:text-sky-300 flex items-center"><RefreshCw className="w-3 h-3 mr-1" /> Reset</button>
            </div>
            
            <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1 flex-grow">
               {CHECKLIST_ITEMS.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => toggleCheck(idx)}
                    className="flex items-center gap-2.5 text-[11px] text-slate-300 cursor-pointer group py-0.5"
                  >
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${checkedItems.has(idx) ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 group-hover:border-slate-500 text-transparent'}`}>
                      {checkedItems.has(idx) && <span className="text-[10px] font-bold">✓</span>}
                    </div>
                    <span className={`transition-colors ${checkedItems.has(idx) ? 'text-slate-500 line-through' : 'group-hover:text-slate-100'}`}>
                      {item}
                    </span>
                  </div>
               ))}
            </div>
        </section>

        {/* HISTORY: Col 3, Row 3 */}
        <section className="md:col-span-12 xl:col-span-3 xl:row-span-3 bento-card bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col h-full">
            <div className="flex justify-between border-b border-slate-800 pb-2 mb-3">
              <h2 className="text-sm font-bold text-slate-100 uppercase flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" /> History
              </h2>
              <button onClick={clearHistory} className="text-[10px] text-red-500 font-normal hover:text-red-400">Clear All</button>
            </div>
            
            <div className="space-y-0.5 overflow-y-auto custom-scrollbar pr-1 flex-grow">
               {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-40">
                     <History className="w-6 h-6 mb-2" />
                     <p className="text-[10px]">No saved prompts</p>
                  </div>
               ) : (
                  history.map(item => (
                    <div key={item.id} className="text-[10px] py-1.5 border-b border-slate-800/50 flex justify-between items-center text-slate-400 hover:bg-slate-800/30 px-1 rounded transition-colors group">
                       <span className="truncate mr-2 pointer-events-none">{new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {item.preset}</span>
                       <button onClick={() => handleCopy(item.prompt, 'Saved Prompt')} className="text-sky-500 hover:text-sky-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Copy</button>
                    </div>
                  ))
               )}
            </div>
        </section>

      </main>
    </div>
  );
}
