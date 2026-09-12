"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaPen, FaTrash, FaFloppyDisk, FaXmark } from "react-icons/fa6";

interface Skill {
  _id?: string;
  name: string;
  icon: string;
  percentage: number;
  order: number;
}

const ICON_OPTIONS = [
  "FaHtml5", "FaCss3Alt", "FaJs", "FaReact", "FaNodeJs",
  "FaPython", "FaJava", "FaDatabase", "FaCode", "FaGitAlt",
  "FaDocker", "FaAws",
];

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

  const showToast = (type: string, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSave = async () => {
    if (!editing || !editing.name.trim()) return;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/skills", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      showToast("success", isNew ? "Skill added!" : "Skill updated!");
      setEditing(null);
      setIsNew(false);
      fetchSkills();
    } else {
      showToast("error", "Failed to save.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
    if (res.ok) { showToast("success", "Deleted!"); fetchSkills(); }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Manage <span className="text-primary">Skills</span></h1>
        <button onClick={() => { setEditing({ name: "", icon: "FaCode", percentage: 50, order: skills.length + 1 }); setIsNew(true); }} className="admin-btn flex items-center gap-2"><FaPlus /> Add Skill</button>
      </div>

      {editing && (
        <div className="admin-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{isNew ? "Add New Skill" : "Edit Skill"}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-gray-400 hover:text-white"><FaXmark size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Name</label><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="admin-input" placeholder="e.g., React" /></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Icon</label><select value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="admin-input">{ICON_OPTIONS.map((i) => (<option key={i} value={i}>{i.replace("Fa", "")}</option>))}</select></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Percentage: {editing.percentage}%</label><input type="range" min="0" max="100" value={editing.percentage} onChange={(e) => setEditing({ ...editing, percentage: parseInt(e.target.value) })} className="w-full accent-primary" /></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Order</label><input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })} className="admin-input" /></div>
          </div>
          <button onClick={handleSave} className="admin-btn flex items-center gap-2 mt-4"><FaFloppyDisk /> Save</button>
        </div>
      )}

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill._id} className="admin-card p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2"><span className="text-white font-bold text-lg">{skill.name}</span><span className="text-gray-500 text-sm">#{skill.order}</span></div>
              <div className="w-full bg-gray-800 rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: `${skill.percentage}%` }} /></div>
              <span className="text-gray-400 text-sm">{skill.percentage}%</span>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => { setEditing(skill); setIsNew(false); }} className="text-primary hover:text-white p-2"><FaPen /></button>
              <button onClick={() => skill._id && handleDelete(skill._id)} className="text-red-500 hover:text-red-400 p-2"><FaTrash /></button>
            </div>
          </div>
        ))}
        {skills.length === 0 && <p className="text-gray-500 text-center py-10">No skills yet. Click &quot;Add Skill&quot; to get started.</p>}
      </div>

      {toast && <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>{toast.message}</div>}
    </div>
  );
}
