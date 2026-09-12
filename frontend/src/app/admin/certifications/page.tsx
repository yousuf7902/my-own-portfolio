"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
function authHeaders(): HeadersInit { const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null; const h: Record<string,string> = { "Content-Type": "application/json" }; if (token) h["Authorization"] = `Bearer ${token}`; return h; }
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaPlus, FaPen, FaTrash, FaFloppyDisk, FaXmark } from "react-icons/fa6";

interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  year: string;
  image: string;
  verifyLink: string;
  order: number;
}

const EMPTY: Certification = {
  title: "", issuer: "", year: new Date().getFullYear().toString(),
  image: "", verifyLink: "", order: 0,
};

export default function AdminCertifications() {
  const [items, setItems] = useState<Certification[]>([]);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [isNew, setIsNew] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editing?._id, isNew]);
  const [toast, setToast] = useState<{type:string;message:string}|null>(null);
  const [uploading, setUploading] = useState(false);

  const showToast = (t:string, m:string) => { setToast({type:t,message:m}); setTimeout(()=>setToast(null),3000); };

  const fetchItems = async () => {
    const r = await fetch(`${API_URL}/certifications`);
    const d = await r.json();
    setItems(Array.isArray(d)?d:[]);
  };

  useEffect(()=>{fetchItems();},[]);

  const handleSave = async () => {
    if(!editing||!editing.title.trim()||!editing.issuer.trim()) return;
    if(!editing.image){showToast("error","Please upload a certificate image first.");return;}
    const method = isNew?"POST":"PUT";
    const url = isNew?`${API_URL}/certifications`:`${API_URL}/certifications/${editing._id}`;
    const res = await fetch(url,{method,headers:authHeaders(),body:JSON.stringify(editing)});
    if(res.ok){showToast("success",isNew?"Certification added!":"Certification updated!");setEditing(null);setIsNew(false);fetchItems();}
    else showToast("error","Failed to save.");
  };

  const handleDelete = async (id:string) => {
    if(!confirm("Delete this certification?")) return;
    const res = await fetch(`${API_URL}/certifications/${id}`,{method:"DELETE", headers: authHeaders()});
    if(res.ok){showToast("success","Deleted!");fetchItems();}
  };

  const handleImageUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file||!editing) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file",file);
    fd.append("folder","portfolio/certifications");
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const res = await fetch(`${API_URL}/upload`,{method:"POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body:fd});
    if(res.ok){const r=await res.json();setEditing({...editing,image:r.url});showToast("success","Image uploaded!");}
    else showToast("error","Upload failed.");
    setUploading(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Manage <span className="text-primary">Certifications</span></h1>
        <button onClick={()=>{setEditing({...EMPTY,order:items.length+1});setIsNew(true);}} className="admin-btn flex items-center gap-2"><FaPlus/> Add</button>
      </div>

      {editing&&(
        <div ref={formRef} className="admin-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{isNew?"Add Certification":"Edit Certification"}</h2>
            <button onClick={()=>{setEditing(null);setIsNew(false);}} className="text-gray-400 hover:text-white"><FaXmark size={20}/></button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Title</label><input value={editing.title} onChange={(e)=>setEditing({...editing,title:e.target.value})} className="admin-input" placeholder="e.g., Securing MongoDB Self-Managed"/></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Issuer</label><input value={editing.issuer} onChange={(e)=>setEditing({...editing,issuer:e.target.value})} className="admin-input" placeholder="e.g., MongoDB"/></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Year</label><input value={editing.year} onChange={(e)=>setEditing({...editing,year:e.target.value})} className="admin-input" placeholder="2025"/></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Order</label><input type="number" value={editing.order} onChange={(e)=>setEditing({...editing,order:parseInt(e.target.value)||0})} className="admin-input"/></div>
            </div>

            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Verify Link</label><input value={editing.verifyLink} onChange={(e)=>setEditing({...editing,verifyLink:e.target.value})} className="admin-input" type="url" placeholder="https://..."/></div>

            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2">Certificate Image</label>
              {editing.image&&(
                <div className="mb-3">
                  <Image src={editing.image} alt="" width={200} height={120} className="w-48 h-28 object-cover rounded-lg border-2 border-primary"/>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="cert-upload"/>
              <label htmlFor="cert-upload" className="admin-btn-outline admin-btn cursor-pointer inline-block">{uploading?"Uploading...":editing.image?"Replace Image":"Upload Image"}</label>
            </div>

            <button onClick={handleSave} className="admin-btn flex items-center gap-2"><FaFloppyDisk/> Save Certification</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((c)=>(
          <div key={c._id} className="admin-card p-4 flex items-center gap-4">
            {c.image&&<Image src={c.image} alt="" width={80} height={60} className="w-20 h-14 object-cover rounded"/>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><h3 className="text-white font-bold truncate">{c.title}</h3><span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{c.issuer}</span></div>
              <p className="text-gray-400 text-sm">{c.year} · #{c.order}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>{setEditing(c);setIsNew(false);}} className="text-primary hover:text-white p-2"><FaPen/></button>
              <button onClick={()=>c._id&&handleDelete(c._id)} className="text-red-500 hover:text-red-400 p-2"><FaTrash/></button>
            </div>
          </div>
        ))}
        {items.length===0&&<p className="text-gray-500 text-center py-10">No certifications yet.</p>}
      </div>

      {toast&&<div className={`toast ${toast.type==="success"?"toast-success":"toast-error"}`}>{toast.message}</div>}
    </div>
  );
}
