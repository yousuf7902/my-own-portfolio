"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaPlus, FaXmark, FaFloppyDisk } from "react-icons/fa6";

interface AboutData {
  greeting: string;
  greetingSuffix: string;
  firstName: string;
  lastName: string;
  roles: string[];
  heroBio: string;
  aboutText: string;
  email: string;
  resumeLink: string;
  profileImage: string;
  socials: {
    facebook: string;
    linkedin: string;
    github: string;
    email: string;
  };
}

export default function AdminAbout() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const [newRole, setNewRole] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => {
        // Ensure all fields have proper defaults even if API returns partial data
        const safeData: AboutData = {
          greeting: d?.greeting || "Hi,",
          greetingSuffix: d?.greetingSuffix || "Myself",
          firstName: d?.firstName || "",
          lastName: d?.lastName || "",
          roles: Array.isArray(d?.roles) ? d.roles : [],
          heroBio: d?.heroBio || "",
          aboutText: d?.aboutText || "",
          email: d?.email || "",
          resumeLink: d?.resumeLink || "",
          profileImage: d?.profileImage || "/images/myself.jpg",
          socials: {
            facebook: d?.socials?.facebook || "",
            linkedin: d?.socials?.linkedin || "",
            github: d?.socials?.github || "",
            email: d?.socials?.email || "",
          },
        };
        setData(safeData);
        setLoading(false);
      })
      .catch(() => {
        // If fetch completely fails, use empty defaults
        setData({
          greeting: "Hi,", greetingSuffix: "Myself",
          firstName: "", lastName: "", roles: [],
          heroBio: "", aboutText: "", email: "", resumeLink: "",
          profileImage: "/images/myself.jpg",
          socials: { facebook: "", linkedin: "", github: "", email: "" },
        });
        setLoading(false);
      });
  }, []);

  const showToast = (type: string, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast("success", "About data saved successfully!");
      } else {
        showToast("error", "Failed to save. Please try again.");
      }
    } catch {
      showToast("error", "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const addRole = () => {
    if (!data || !newRole.trim()) return;
    setData({ ...data, roles: [...data.roles, newRole.trim()] });
    setNewRole("");
  };

  const removeRole = (index: number) => {
    if (!data) return;
    setData({ ...data, roles: data.roles.filter((_, i) => i !== index) });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio/profile");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (res.ok) {
        setData({ ...data, profileImage: result.url });
        showToast("success", "Image uploaded!");
      } else {
        showToast("error", "Upload failed.");
      }
    } catch {
      showToast("error", "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-primary animate-pulse text-xl">Loading...</div>;
  }

  if (!data) return null;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
          Hero & <span className="text-primary">About</span>
        </h1>
        <button onClick={handleSave} disabled={saving} className="admin-btn flex items-center gap-2">
          <FaFloppyDisk /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Profile Image */}
      <div className="admin-card p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Profile Image</h2>
        <div className="flex items-center gap-6">
          <Image
            src={data.profileImage}
            alt="Profile"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-cover border-2 border-primary"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="profile-upload"
            />
            <label htmlFor="profile-upload" className="admin-btn-outline admin-btn cursor-pointer">
              {uploading ? "Uploading..." : "Change Photo"}
            </label>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="admin-card p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Hero Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">Greeting</label>
            <input
              value={data.greeting}
              onChange={(e) => setData({ ...data, greeting: e.target.value })}
              className="admin-input"
              placeholder="Hi,"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">Greeting Suffix</label>
            <input
              value={data.greetingSuffix}
              onChange={(e) => setData({ ...data, greetingSuffix: e.target.value })}
              className="admin-input"
              placeholder="Myself"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">First Name</label>
            <input
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">Last Name</label>
            <input
              value={data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              className="admin-input"
            />
          </div>
        </div>

        {/* Roles */}
        <div className="mt-4">
          <label className="block text-gray-400 text-sm font-semibold mb-2">Typing Animation Roles</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.roles.map((role, i) => (
              <span
                key={i}
                className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2"
              >
                {role}
                <button onClick={() => removeRole(i)} className="hover:text-red-400">
                  <FaXmark size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRole())}
              className="admin-input flex-1"
              placeholder="Add a new role..."
            />
            <button onClick={addRole} className="admin-btn flex items-center gap-1">
              <FaPlus /> Add
            </button>
          </div>
        </div>

        {/* Hero Bio */}
        <div className="mt-4">
          <label className="block text-gray-400 text-sm font-semibold mb-1">Hero Bio</label>
          <textarea
            value={data.heroBio}
            onChange={(e) => setData({ ...data, heroBio: e.target.value })}
            className="admin-input min-h-[100px]"
            rows={3}
          />
        </div>
      </div>

      {/* About Section */}
      <div className="admin-card p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">About Me Section</h2>
        <textarea
          value={data.aboutText}
          onChange={(e) => setData({ ...data, aboutText: e.target.value })}
          className="admin-input min-h-[120px]"
          rows={4}
        />
      </div>

      {/* Contact & Links */}
      <div className="admin-card p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Contact & Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">Email</label>
            <input
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="admin-input"
              type="email"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">Resume Link</label>
            <input
              value={data.resumeLink}
              onChange={(e) => setData({ ...data, resumeLink: e.target.value })}
              className="admin-input"
              type="url"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="admin-card p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Social Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">Facebook</label>
            <input
              value={data.socials.facebook}
              onChange={(e) =>
                setData({
                  ...data,
                  socials: { ...data.socials, facebook: e.target.value },
                })
              }
              className="admin-input"
              type="url"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">LinkedIn</label>
            <input
              value={data.socials.linkedin}
              onChange={(e) =>
                setData({
                  ...data,
                  socials: { ...data.socials, linkedin: e.target.value },
                })
              }
              className="admin-input"
              type="url"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">GitHub</label>
            <input
              value={data.socials.github}
              onChange={(e) =>
                setData({
                  ...data,
                  socials: { ...data.socials, github: e.target.value },
                })
              }
              className="admin-input"
              type="url"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-1">Email</label>
            <input
              value={data.socials.email}
              onChange={(e) =>
                setData({
                  ...data,
                  socials: { ...data.socials, email: e.target.value },
                })
              }
              className="admin-input"
              type="email"
            />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
