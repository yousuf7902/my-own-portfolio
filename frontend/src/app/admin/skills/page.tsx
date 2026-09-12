"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaPlus, FaPen, FaTrash, FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { fetchSkills as apiFetchSkills, createSkill, updateSkill, deleteSkill } from "@/lib/api";

interface Skill {
  _id?: string;
  name: string;
  icon: string;
  percentage: number;
  category: string;
  order: number;
}

const ICON_OPTIONS = [
  "FaHtml5", "FaCss3Alt", "FaJs", "FaReact", "FaNodeJs",
  "FaPython", "FaJava", "FaDatabase", "FaCode", "FaGitAlt",
  "FaDocker", "FaAws",
];

const CATEGORY_OPTIONS = ["Languages", "Frontend", "Backend", "Databases", "Tools"];
const DEFAULT_CATEGORY = "Tools";

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [isNew, setIsNew] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editing?._id, isNew]);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

  const showToast = (type: string, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadSkills = async () => {
    const data = await apiFetchSkills();
    setSkills(Array.isArray(data) ? data : []);
  };

  useEffect(() => { loadSkills(); }, []);

  const groups = useMemo(() => {
    const buckets: Record<string, Skill[]> = {};
    skills.forEach((skill) => {
      const key = CATEGORY_OPTIONS.includes(skill.category) ? skill.category : DEFAULT_CATEGORY;
      (buckets[key] ||= []).push(skill);
    });
    return CATEGORY_OPTIONS.filter((name) => buckets[name]?.length).map((name) => ({
      name,
      items: [...buckets[name]].sort((a, b) => a.order - b.order),
    }));
  }, [skills]);

  const handleSave = async () => {
    if (!editing || !editing.name.trim()) return;
    try {
      if (isNew) {
        await createSkill(editing);
        showToast("success", "Skill added!");
      } else {
        await updateSkill(editing._id!, editing);
        showToast("success", "Skill updated!");
      }
      setEditing(null);
      setIsNew(false);
      loadSkills();
    } catch {
      showToast("error", "Failed to save.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      showToast("success", "Deleted!");
      loadSkills();
    } catch {
      showToast("error", "Failed to delete.");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Manage <span className="text-primary">Skills</span></h1>
        <button onClick={() => { setEditing({ name: "", icon: "FaCode", percentage: 50, category: DEFAULT_CATEGORY, order: skills.length + 1 }); setIsNew(true); }} className="admin-btn flex items-center gap-2"><FaPlus /> Add Skill</button>
      </div>

      {editing && (
        <div ref={formRef} className="admin-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{isNew ? "Add New Skill" : "Edit Skill"}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-gray-400 hover:text-white"><FaXmark size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Name</label><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="admin-input" placeholder="e.g., React" /></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Category</label><select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="admin-input">{CATEGORY_OPTIONS.map((c) => (<option key={c} value={c}>{c}</option>))}</select></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Icon</label><select value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="admin-input">{ICON_OPTIONS.map((i) => (<option key={i} value={i}>{i.replace("Fa", "")}</option>))}</select></div>
            <div><label className="block text-gray-400 text-sm font-semibold mb-1">Order</label><input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })} className="admin-input" /></div>
            <div className="md:col-span-2"><label className="block text-gray-400 text-sm font-semibold mb-1">Percentage: {editing.percentage}%<span className="text-gray-600 font-normal"> — stored, not shown on the site</span></label><input type="range" min="0" max="100" value={editing.percentage} onChange={(e) => setEditing({ ...editing, percentage: parseInt(e.target.value) })} className="w-full accent-primary" /></div>
          </div>
          <button onClick={handleSave} className="admin-btn flex items-center gap-2 mt-4"><FaFloppyDisk /> Save</button>
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.name}>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] font-bold tracking-[0.24em] uppercase text-primary">{group.name}</span>
              <span className="flex-1 h-px bg-[#2e2e2e]" />
              <span className="font-mono text-[11px] text-gray-500">{group.items.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <div key={skill._id} className="admin-card flex items-center gap-3 pl-4 pr-2 py-2">
                  <span className="text-white font-semibold">{skill.name}</span>
                  <span className="font-mono text-[11px] text-gray-500">#{skill.order}</span>
                  <span className="flex gap-1">
                    <button onClick={() => { setEditing({ ...skill, category: skill.category || DEFAULT_CATEGORY }); setIsNew(false); }} className="text-primary hover:text-white p-2" aria-label={`Edit ${skill.name}`}><FaPen size={13} /></button>
                    <button onClick={() => skill._id && handleDelete(skill._id)} className="text-red-500 hover:text-red-400 p-2" aria-label={`Delete ${skill.name}`}><FaTrash size={13} /></button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 && <p className="text-gray-500 text-center py-10">No skills yet. Click &quot;Add Skill&quot; to get started.</p>}
      </div>

      {toast && <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>{toast.message}</div>}
    </div>
  );
}
