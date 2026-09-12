"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
function authHeaders(): HeadersInit { const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null; const h: Record<string,string> = { "Content-Type": "application/json" }; if (token) h["Authorization"] = `Bearer ${token}`; return h; }
import { useEffect, useRef, useState } from "react";
import { FaPlus, FaPen, FaTrash, FaFloppyDisk, FaXmark } from "react-icons/fa6";

interface Achievement {
  _id?: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
}

const ICON_OPTIONS = ["FaCode","FaTrophy","FaDiagramProject","FaGithub","FaStar","FaUsers","FaLaptopCode","FaCertificate","FaBullseye","FaChartLine","FaAward","FaGraduationCap"];

export default function AdminAchievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [editing, setEditing] = useState<Achievement|null>(null);
  const [isNew, setIsNew] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editing?._id, isNew]);
  const [toast, setToast] = useState<{type:string;message:string}|null>(null);

  const showToast = (t:string,m:string) => {setToast({type:t,message:m});setTimeout(()=>setToast(null),3000);};
  const fetchItems = async () => {const r=await fetch(`${API_URL}/achievements`);const d=await r.json();setItems(Array.isArray(d)?d:[]);};
  useEffect(()=>{fetchItems();},[]);

  const heroIds = [...items].sort((a,b)=>a.order-b.order).slice(0,3).map((a)=>a._id||"");

  const handleSave = async () => {
    if(!editing||!editing.label.trim()) return;
    const method=isNew?"POST":"PUT";
    const url=isNew?`${API_URL}/achievements`:`${API_URL}/achievements/${editing._id}`;
    const res=await fetch(url,{method,headers:authHeaders(),body:JSON.stringify(editing)});
    if(res.ok){showToast("success",isNew?"Added!":"Updated!");setEditing(null);setIsNew(false);fetchItems();}
    else showToast("error","Failed.");
  };

  const handleDelete = async (id:string) => {
    if(!confirm("Delete?")) return;
    const res=await fetch(`${API_URL}/achievements/${id}`,{method:"DELETE", headers: authHeaders()});
    if(res.ok){showToast("success","Deleted!");fetchItems();}
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage <span className="text-primary">Achievements</span></h1>
          <p className="text-gray-500 text-sm mt-1">The three lowest <span className="text-gray-300">order</span> values also appear as the stat strip under the hero photo.</p>
        </div>
        <button onClick={()=>{setEditing({label:"",value:0,suffix:"+",icon:"FaCode",order:items.length+1});setIsNew(true);}} className="admin-btn flex items-center gap-2"><FaPlus/> Add</button>
      </div>

      {editing&&(
        <div ref={formRef} className="admin-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{isNew?"Add Achievement":"Edit Achievement"}</h2>
            <button onClick={()=>{setEditing(null);setIsNew(false);}} className="text-gray-400 hover:text-white"><FaXmark size={20}/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Label</label><input value={editing.label} onChange={(e)=>setEditing({...editing,label:e.target.value})} className="admin-input" placeholder="e.g., Problems Solved"/></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Value</label><input type="number" value={editing.value} onChange={(e)=>setEditing({...editing,value:parseInt(e.target.value)||0})} className="admin-input"/></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Suffix</label><input value={editing.suffix} onChange={(e)=>setEditing({...editing,suffix:e.target.value})} className="admin-input" placeholder="+"/></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Icon</label><select value={editing.icon} onChange={(e)=>setEditing({...editing,icon:e.target.value})} className="admin-input">{ICON_OPTIONS.map(i=><option key={i} value={i}>{i.replace("Fa","")}</option>)}</select></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Order</label><input type="number" value={editing.order} onChange={(e)=>setEditing({...editing,order:parseInt(e.target.value)||0})} className="admin-input"/></div>
          </div>
          <button onClick={handleSave} className="admin-btn flex items-center gap-2 mt-4"><FaFloppyDisk/> Save</button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((a)=>(
          <div key={a._id} className="admin-card p-4 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="text-white font-bold text-lg">{a.label}</span><span className="text-primary font-bold">{a.value}{a.suffix}</span><span className="text-gray-500 text-sm">#{a.order}</span>{heroIds.includes(a._id||"")&&<span className="text-[10px] font-mono uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-primary/20 text-primary">In hero</span>}</div>
            <div className="flex gap-2">
              <button onClick={()=>{setEditing(a);setIsNew(false);}} className="text-primary hover:text-white p-2"><FaPen/></button>
              <button onClick={()=>a._id&&handleDelete(a._id)} className="text-red-500 hover:text-red-400 p-2"><FaTrash/></button>
            </div>
          </div>
        ))}
        {items.length===0&&<p className="text-gray-500 text-center py-10">No achievements yet.</p>}
      </div>

      {toast&&<div className={`toast ${toast.type==="success"?"toast-success":"toast-error"}`}>{toast.message}</div>}
    </div>
  );
}
