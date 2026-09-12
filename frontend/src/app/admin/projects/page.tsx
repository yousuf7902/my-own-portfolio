"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
function authHeaders(): HeadersInit { const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null; const h: Record<string,string> = { "Content-Type": "application/json" }; if (token) h["Authorization"] = `Bearer ${token}`; return h; }
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaPlus, FaPen, FaTrash, FaFloppyDisk, FaXmark } from "react-icons/fa6";

interface Project {
  _id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  thumbnailIndex: number;
  liveLink: string;
  githubLink: string;
  technologies: string[];
  highlights: string[];
  category: string;
  startDate: string;
  endDate: string;
  featured: boolean;
  order: number;
}

const EMPTY: Project = {
  title: "", shortDescription: "", fullDescription: "", images: [],
  thumbnailIndex: 0, liveLink: "", githubLink: "", technologies: [], highlights: [],
  category: "Full Stack", startDate: "", endDate: "", featured: false, order: 0,
};

const CATEGORIES = ["Full Stack", "Frontend", "Backend", "Mobile", "API", "Other"];

export default function AdminProjects() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editing?._id, isNew]);
  const [toast, setToast] = useState<{type:string;message:string}|null>(null);
  const [techInput, setTechInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const showToast = (t:string, m:string) => { setToast({type:t,message:m}); setTimeout(()=>setToast(null),3000); };

  const fetchItems = async () => {
    const r = await fetch(`${API_URL}/projects`);
    const d = await r.json();
    setItems(Array.isArray(d)?d:[]);
  };

  useEffect(()=>{fetchItems();},[]);

  const handleSave = async () => {
    if(!editing||!editing.title.trim()) return;
    const method = isNew?"POST":"PUT";
    const url = isNew?`${API_URL}/projects`:`${API_URL}/projects/${editing._id}`;
    const res = await fetch(url,{method,headers:authHeaders(),body:JSON.stringify(editing)});
    if(res.ok){showToast("success",isNew?"Project added!":"Project updated!");setEditing(null);setIsNew(false);fetchItems();}
    else showToast("error","Failed to save.");
  };

  const handleDelete = async (id:string) => {
    if(!confirm("Delete this project?")) return;
    const res = await fetch(`${API_URL}/projects/${id}`,{method:"DELETE",headers:authHeaders()});
    if(res.ok){showToast("success","Deleted!");fetchItems();}
    else showToast("error","Failed to delete.");
  };

  const addTech = () => {
    if(!editing||!techInput.trim()) return;
    setEditing({...editing,technologies:[...editing.technologies,techInput.trim()]});
    setTechInput("");
  };

  const removeTech = (i:number) => {
    if(!editing) return;
    setEditing({...editing,technologies:editing.technologies.filter((_,idx)=>idx!==i)});
  };

  const addHighlight = () => {
    if(!editing||!highlightInput.trim()) return;
    setEditing({...editing,highlights:[...(editing.highlights||[]),highlightInput.trim()]});
    setHighlightInput("");
  };

  const removeHighlight = (i:number) => {
    if(!editing) return;
    setEditing({...editing,highlights:(editing.highlights||[]).filter((_,idx)=>idx!==i)});
  };

  const handleImageUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if(!files||!editing) return;
    setUploading(true);
    const urls:string[] = [];
    for(let i=0;i<files.length;i++){
      const fd = new FormData();
      fd.append("file",files[i]);
      fd.append("folder","portfolio/projects");
      const res = await fetch(`${API_URL}/upload`,{method:"POST",body:fd});
      if(res.ok){const r=await res.json();urls.push(r.url);}
    }
    setEditing({...editing,images:[...editing.images,...urls]});
    setUploading(false);
    if(urls.length) showToast("success",`${urls.length} image(s) uploaded!`);
  };

  const removeImage = (i:number) => {
    if(!editing) return;
    const newImages = editing.images.filter((_,idx)=>idx!==i);
    const newThumb = editing.thumbnailIndex >= newImages.length ? 0 : editing.thumbnailIndex;
    setEditing({...editing,images:newImages,thumbnailIndex:newThumb});
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Manage <span className="text-primary">Projects</span></h1>
        <button onClick={()=>{setEditing({...EMPTY,order:items.length+1});setIsNew(true);}} className="admin-btn flex items-center gap-2"><FaPlus /> Add Project</button>
      </div>

      {editing && (
        <div ref={formRef} className="admin-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{isNew?"Add Project":"Edit Project"}</h2>
            <button onClick={()=>{setEditing(null);setIsNew(false);}} className="text-gray-400 hover:text-white"><FaXmark size={20}/></button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Title</label><input value={editing.title} onChange={(e)=>setEditing({...editing,title:e.target.value})} className="admin-input"/></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Category</label><select value={editing.category} onChange={(e)=>setEditing({...editing,category:e.target.value})} className="admin-input">{CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            </div>

            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Short Description</label><textarea value={editing.shortDescription} onChange={(e)=>setEditing({...editing,shortDescription:e.target.value})} className="admin-input" rows={2}/></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Full Description</label><textarea value={editing.fullDescription} onChange={(e)=>setEditing({...editing,fullDescription:e.target.value})} className="admin-input" rows={4}/></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Live Demo Link</label><input value={editing.liveLink} onChange={(e)=>setEditing({...editing,liveLink:e.target.value})} className="admin-input" type="url"/></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">GitHub Link</label><input value={editing.githubLink} onChange={(e)=>setEditing({...editing,githubLink:e.target.value})} className="admin-input" type="url"/></div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2">Technologies</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editing.technologies.map((t,i)=>(
                  <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    {t}<button onClick={()=>removeTech(i)} className="hover:text-red-400"><FaXmark size={10}/></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={techInput} onChange={(e)=>setTechInput(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"){e.preventDefault();addTech();}}} className="admin-input flex-1" placeholder="Add technology..."/>
                <button onClick={addTech} className="admin-btn"><FaPlus/></button>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2">Outcomes <span className="font-normal text-gray-500">(short result lines — the first two show on the card)</span></label>
              <div className="flex flex-col gap-2 mb-2">
                {(editing.highlights||[]).map((h,i)=>(
                  <span key={i} className="flex items-start gap-2 bg-surface_alt border border-hairline text-gray-200 px-3 py-2 rounded-lg text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"/>
                    <span className="flex-1">{h}</span>
                    <button onClick={()=>removeHighlight(i)} className="text-gray-500 hover:text-red-400 mt-0.5"><FaXmark size={12}/></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={highlightInput} onChange={(e)=>setHighlightInput(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter"){e.preventDefault();addHighlight();}}} className="admin-input flex-1" placeholder="e.g., Cut page load from 4.2s to 0.9s"/>
                <button onClick={addHighlight} className="admin-btn"><FaPlus/></button>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2">Images</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {editing.images.map((img,i)=>(
                  <div key={i} className={`relative border-2 rounded-lg overflow-hidden cursor-pointer ${i===editing.thumbnailIndex?"border-primary":"border-gray-700"}`} onClick={()=>setEditing({...editing,thumbnailIndex:i})}>
                    <Image src={img} alt="" width={120} height={80} className="w-28 h-20 object-cover"/>
                    <button onClick={(e)=>{e.stopPropagation();removeImage(i);}} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"><FaXmark/></button>
                    {i===editing.thumbnailIndex&&<span className="absolute bottom-0 left-0 right-0 bg-primary text-white text-center text-xs py-0.5">Thumbnail</span>}
                  </div>
                ))}
              </div>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="proj-upload"/>
              <label htmlFor="proj-upload" className="admin-btn-outline admin-btn cursor-pointer inline-block">{uploading?"Uploading...":"Upload Images"}</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Start Date</label><input type="date" value={editing.startDate?editing.startDate.slice(0,10):""} onChange={(e)=>setEditing({...editing,startDate:e.target.value})} className="admin-input"/></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">End Date</label><input type="date" value={editing.endDate?editing.endDate.slice(0,10):""} onChange={(e)=>setEditing({...editing,endDate:e.target.value})} className="admin-input" disabled={!editing.endDate&&editing.startDate!==""}/><label className="flex items-center gap-2 mt-1 text-gray-400 text-sm"><input type="checkbox" checked={!editing.endDate} onChange={(e)=>setEditing({...editing,endDate:e.target.checked?"":new Date().toISOString()})} className="accent-primary"/>Ongoing</label></div>
              <div><label className="block text-gray-400 text-sm font-semibold mb-1">Order</label><input type="number" value={editing.order} onChange={(e)=>setEditing({...editing,order:parseInt(e.target.value)||0})} className="admin-input"/></div>
            </div>

            <label className="flex items-center gap-2 text-white font-semibold"><input type="checkbox" checked={editing.featured} onChange={(e)=>setEditing({...editing,featured:e.target.checked})} className="accent-primary w-5 h-5"/>Featured Project</label>

            <button onClick={handleSave} className="admin-btn flex items-center gap-2"><FaFloppyDisk/> Save Project</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.map((p)=>(
          <div key={p._id} className={`admin-card p-4 flex items-center gap-4 ${p.featured?"border-primary border-2":""}`}>
            {p.images.length>0&&<Image src={p.images[p.thumbnailIndex]||p.images[0]} alt="" width={80} height={60} className="w-20 h-14 object-cover rounded"/>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><h3 className="text-white font-bold truncate">{p.title}</h3><span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{p.category}</span></div>
              <p className="text-gray-400 text-sm truncate">{p.shortDescription}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>{setEditing(p);setIsNew(false);}} className="text-primary hover:text-white p-2"><FaPen/></button>
              <button onClick={()=>p._id&&handleDelete(p._id)} className="text-red-500 hover:text-red-400 p-2"><FaTrash/></button>
            </div>
          </div>
        ))}
        {items.length===0&&<p className="text-gray-500 text-center py-10">No projects yet.</p>}
      </div>

      {toast&&<div className={`toast ${toast.type==="success"?"toast-success":"toast-error"}`}>{toast.message}</div>}
    </div>
  );
}
