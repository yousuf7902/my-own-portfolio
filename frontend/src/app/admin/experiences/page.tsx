"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
function authHeaders(): HeadersInit { const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null; const h: Record<string,string> = { "Content-Type": "application/json" }; if (token) h["Authorization"] = `Bearer ${token}`; return h; }
import { useEffect, useMemo, useRef, useState } from "react";
import { FaPlus, FaPen, FaTrash, FaFloppyDisk, FaXmark } from "react-icons/fa6";

interface Experience {
  _id?: string;
  title: string;
  organization: string;
  type: "work"|"education"|"volunteer";
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  icon: string;
  order: number;
}

const TYPE_OPTIONS = [{v:"work",l:"Work"},{v:"education",l:"Education"},{v:"volunteer",l:"Volunteer"}];
const ICON_OPTIONS = ["FaBriefcase","FaGraduationCap","FaHandHoldingHeart","FaCode"];

export default function AdminExperiences() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience|null>(null);
  const [isNew, setIsNew] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editing?._id, isNew]);
  const [toast, setToast] = useState<{type:string;message:string}|null>(null);
  const [techInput, setTechInput] = useState("");

  const showToast = (t:string,m:string) => {setToast({type:t,message:m});setTimeout(()=>setToast(null),3000);};
  const fetchItems = async () => {const r=await fetch(`${API_URL}/experiences`);const d=await r.json();setItems(Array.isArray(d)?d:[]);};
  useEffect(()=>{fetchItems();},[]);

  const groups = useMemo(()=>{
    const map = new Map<string,{key:string;organization:string;items:Experience[]}>();
    items.forEach((exp)=>{
      const key = `${exp.type}|${(exp.organization||"").trim().toLowerCase()}`;
      const found = map.get(key);
      if(found) found.items.push(exp);
      else map.set(key,{key,organization:(exp.organization||"Untitled").trim(),items:[exp]});
    });
    return [...map.values()];
  },[items]);

  const handleSave = async () => {
    if(!editing||!editing.title.trim()) return;
    const method=isNew?"POST":"PUT";
    const url=isNew?`${API_URL}/experiences`:`${API_URL}/experiences/${editing._id}`;
    const res=await fetch(url,{method,headers:authHeaders(),body:JSON.stringify(editing)});
    if(res.ok){showToast("success",isNew?"Added!":"Updated!");setEditing(null);setIsNew(false);fetchItems();}
    else showToast("error","Failed.");
  };

  const handleDelete = async (id:string) => {
    if(!confirm("Delete?")) return;
    const res=await fetch(`${API_URL}/experiences/${id}`,{method:"DELETE", headers: authHeaders()});
    if(res.ok){showToast("success","Deleted!");fetchItems();}
  };

  const addTech = () => {
    if(!editing||!techInput.trim()) return;
    setEditing({...editing,technologies:[...(editing.technologies||[]),techInput.trim()]});
    setTechInput("");
  };

  const removeTech = (i:number) => {
    if(!editing) return;
    setEditing({...editing,technologies:(editing.technologies||[]).filter((_,idx)=>idx!==i)});
  };

  const formatDate = (d:string|null) => {
    if(!d) return "Present";
    return new Date(d).toLocaleDateString("en-US",{month:"short",year:"numeric"});
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Manage <span className="text-primary">Experience</span></h1>
        <button onClick={()=>{setEditing({title:"",organization:"",type:"work",startDate:"",endDate:"",description:"",technologies:[],icon:"FaBriefcase",order:items.length+1});setIsNew(true);}} className="admin-btn flex items-center gap-2"><FaPlus/> Add Entry</button>
      </div>

      {editing&&(
        <div ref={formRef} className="admin-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{isNew?"Add Entry":"Edit Entry"}</h2>
            <button onClick={()=>{setEditing(null);setIsNew(false);}} className="text-gray-400 hover:text-white"><FaXmark size={20}/></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Title</label><input value={editing.title} onChange={(e)=>setEditing({...editing,title:e.target.value})} className="admin-input" placeholder="e.g., Software Engineer"/></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Organization</label><input value={editing.organization} onChange={(e)=>setEditing({...editing,organization:e.target.value})} className="admin-input" placeholder="e.g., Google"/></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Type</label><select value={editing.type} onChange={(e)=>setEditing({...editing,type:e.target.value as Experience["type"]})} className="admin-input">{TYPE_OPTIONS.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Icon</label><select value={editing.icon} onChange={(e)=>setEditing({...editing,icon:e.target.value})} className="admin-input">{ICON_OPTIONS.map(i=><option key={i} value={i}>{i.replace("Fa","")}</option>)}</select></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Start Date</label><input type="date" value={editing.startDate?editing.startDate.slice(0,10):""} onChange={(e)=>setEditing({...editing,startDate:e.target.value})} className="admin-input"/></div>
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-1">End Date</label>
                <input type="date" value={editing.endDate?editing.endDate.slice(0,10):""} onChange={(e)=>setEditing({...editing,endDate:e.target.value})} className="admin-input" disabled={!editing.endDate&&editing.endDate!==""}/>
                <label className="flex items-center gap-2 mt-1 text-gray-400 text-sm"><input type="checkbox" checked={!editing.endDate} onChange={(e)=>setEditing({...editing,endDate:e.target.checked?"":new Date().toISOString()})} className="accent-primary"/>Present / Ongoing</label>
              </div>
            </div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Description</label><textarea value={editing.description} onChange={(e)=>setEditing({...editing,description:e.target.value})} className="admin-input" rows={3}/></div>
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2">Technologies <span className="font-normal text-gray-500">(tags shown on the card)</span></label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editing.technologies||[]).map((t,i)=>(
                  <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    {t}<button onClick={()=>removeTech(i)} className="hover:text-red-400"><FaXmark size={10}/></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={techInput} onChange={(e)=>setTechInput(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"){e.preventDefault();addTech();}}} className="admin-input flex-1" placeholder="e.g., TypeScript"/>
                <button onClick={addTech} className="admin-btn"><FaPlus/></button>
              </div>
            </div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Order</label><input type="number" value={editing.order} onChange={(e)=>setEditing({...editing,order:parseInt(e.target.value)||0})} className="admin-input w-32"/></div>
            <button onClick={handleSave} className="admin-btn flex items-center gap-2"><FaFloppyDisk/> Save</button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group)=>(
          <div key={group.key}>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] font-bold tracking-[0.24em] uppercase text-primary">{group.organization}</span>
              <span className="flex-1 h-px bg-[#2e2e2e]"/>
              <span className="font-mono text-[11px] text-[#6f6f6f]">{group.items.length} {group.items.length===1?"entry":"entries"} • one card</span>
            </div>
            <div className="space-y-3">
              {group.items.map((exp)=>(
                <div key={exp._id} className="admin-card p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><span className="text-white font-bold">{exp.title}</span><span className={`text-xs px-2 py-0.5 rounded-full ${exp.type==="work"?"bg-primary/20 text-primary":exp.type==="education"?"bg-blue-500/20 text-blue-400":"bg-green-500/20 text-green-400"}`}>{exp.type}</span>{!exp.endDate&&<span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">current</span>}</div>
                    <p className="text-gray-400 text-sm">{formatDate(exp.startDate)} — {formatDate(exp.endDate||null)}</p>
                    {(exp.technologies||[]).length>0&&(
                      <p className="text-gray-500 text-xs mt-1 font-mono truncate">{(exp.technologies||[]).join(" · ")}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={()=>{setEditing(exp);setIsNew(false);}} className="text-primary hover:text-white p-2"><FaPen/></button>
                    <button onClick={()=>exp._id&&handleDelete(exp._id)} className="text-red-500 hover:text-red-400 p-2"><FaTrash/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {items.length===0&&<p className="text-gray-500 text-center py-10">No entries yet.</p>}
      </div>

      {toast&&<div className={`toast ${toast.type==="success"?"toast-success":"toast-error"}`}>{toast.message}</div>}
    </div>
  );
}
