"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FaPlus,
  FaPen,
  FaTrash,
  FaFloppyDisk,
  FaXmark,
  FaEye,
} from "react-icons/fa6";
import {
  fetchWritings,
  createWriting,
  updateWriting,
  deleteWriting,
  uploadImage,
} from "@/lib/api";
import WritingBody from "@/components/WritingBody";

interface WritingForm {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string[];
  coverImage: string;
  readTime?: number;
  publishedAt: string;
  draft: boolean;
}

const EMPTY: WritingForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  tags: [],
  coverImage: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  draft: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminWritings() {
  const [items, setItems] = useState<WritingForm[]>([]);
  const [editing, setEditing] = useState<WritingForm | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(
    null
  );
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing)
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editing?._id, isNew]);

  const showToast = (type: string, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try {
      const data = await fetchWritings();
      setItems(
        (Array.isArray(data) ? data : []).map((item: WritingForm) => ({
          ...item,
          publishedAt: (item.publishedAt ?? "").slice(0, 10),
          tags: item.tags ?? [],
        }))
      );
    } catch {
      showToast("error", "Could not load writings.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.excerpt.trim() || !editing.body.trim()) {
      showToast("error", "Title, excerpt and body are all required.");
      return;
    }

    const payload = {
      ...editing,
      slug: slugify(editing.slug || editing.title),
      tags: editing.tags.filter(Boolean),
    };

    try {
      if (isNew) await createWriting(payload);
      else await updateWriting(editing._id!, payload);
      showToast("success", isNew ? "Writing added!" : "Writing updated!");
      setEditing(null);
      setIsNew(false);
      setPreview(false);
      load();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to save.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this writing?")) return;
    try {
      await deleteWriting(id);
      showToast("success", "Deleted!");
      load();
    } catch {
      showToast("error", "Failed to delete.");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file, "portfolio/writings");
      setEditing({ ...editing, coverImage: url });
      showToast("success", "Featured image uploaded!");
    } catch {
      showToast("error", "Upload failed.");
    }
    setUploading(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
          Manage <span className="text-primary">Writing</span>
        </h1>
        <button
          onClick={() => {
            setEditing({ ...EMPTY });
            setIsNew(true);
            setPreview(false);
          }}
          className="admin-btn flex items-center gap-2"
        >
          <FaPlus /> Add
        </button>
      </div>

      {editing && (
        <div ref={formRef} className="admin-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {isNew ? "Add Writing" : "Edit Writing"}
            </h2>
            <button
              onClick={() => {
                setEditing(null);
                setIsNew(false);
                setPreview(false);
              }}
              className="text-gray-400 hover:text-white"
            >
              <FaXmark size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-1">
                Title
              </label>
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    title: e.target.value,

                    slug:
                      isNew && editing.slug === slugify(editing.title)
                        ? slugify(e.target.value)
                        : editing.slug,
                  })
                }
                className="admin-input"
                placeholder="e.g., Binary search on the answer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-1">
                  Slug <span className="font-normal">— the URL</span>
                </label>
                <input
                  value={editing.slug}
                  onChange={(e) =>
                    setEditing({ ...editing, slug: e.target.value })
                  }
                  className="admin-input"
                  placeholder="binary-search-on-the-answer"
                />
                <p className="text-gray-500 text-xs mt-1">
                  /writing/{slugify(editing.slug || editing.title) || "…"}
                </p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-1">
                  Published
                </label>
                <input
                  type="date"
                  value={editing.publishedAt}
                  onChange={(e) =>
                    setEditing({ ...editing, publishedAt: e.target.value })
                  }
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-1">
                Excerpt <span className="font-normal">— the deck under the title</span>
              </label>
              <textarea
                value={editing.excerpt}
                onChange={(e) =>
                  setEditing({ ...editing, excerpt: e.target.value })
                }
                rows={2}
                className="admin-input"
                placeholder="One or two sentences. Shown on the index and under the title."
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-1">
                Tags <span className="font-normal">— comma separated</span>
              </label>
              <input
                value={editing.tags.join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    tags: e.target.value.split(",").map((t) => t.trim()),
                  })
                }
                className="admin-input"
                placeholder="Algorithms, C++"
              />
              <p className="text-gray-500 text-xs mt-1">
                The first tag is the one shown above the title.
              </p>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2">
                Featured image{" "}
                <span className="font-normal">— optional, shown above the title</span>
              </label>
              {editing.coverImage && (
                <div className="mb-3 flex items-center gap-3">
                  <Image
                    src={editing.coverImage}
                    alt=""
                    width={200}
                    height={112}
                    className="w-48 h-28 object-cover rounded-lg border-2 border-primary"
                  />
                  <button
                    onClick={() => setEditing({ ...editing, coverImage: "" })}
                    className="text-red-500 hover:text-red-400 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
                id="writing-cover"
              />
              <label
                htmlFor="writing-cover"
                className="admin-btn-outline admin-btn cursor-pointer inline-block"
              >
                {uploading
                  ? "Uploading..."
                  : editing.coverImage
                    ? "Replace Image"
                    : "Upload Image"}
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-gray-400 text-sm font-semibold">
                  Body <span className="font-normal">— Markdown</span>
                </label>
                <button
                  onClick={() => setPreview(!preview)}
                  className="flex items-center gap-2 text-primary hover:text-white text-sm font-semibold"
                >
                  <FaEye /> {preview ? "Write" : "Preview"}
                </button>
              </div>

              {preview ? (
                <div className="paper rounded-lg p-6">
                  <WritingBody body={editing.body} />
                </div>
              ) : (
                <textarea
                  value={editing.body}
                  onChange={(e) =>
                    setEditing({ ...editing, body: e.target.value })
                  }
                  rows={20}
                  className="admin-input font-mono text-sm leading-relaxed"
                  placeholder={"## A heading\n\nA paragraph.\n\n```cpp\nint main() {}\n```\n\n> A pull quote."}
                />
              )}
              <p className="text-gray-500 text-xs mt-1">
                Read time is worked out from this on save.
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.draft}
                onChange={(e) =>
                  setEditing({ ...editing, draft: e.target.checked })
                }
                className="w-4 h-4 accent-primary"
              />
              <span className="text-gray-400 text-sm font-semibold">
                Draft — hidden from the site until this is unticked
              </span>
            </label>

            <button
              onClick={handleSave}
              className="admin-btn flex items-center gap-2"
            >
              <FaFloppyDisk /> Save Writing
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="admin-card p-4 flex items-center gap-4">
            {item.coverImage && (
              <Image
                src={item.coverImage}
                alt=""
                width={80}
                height={60}
                className="w-20 h-14 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold truncate">{item.title}</h3>
                {item.draft && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full shrink-0">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm truncate">
                {item.publishedAt} · {item.readTime ?? 1} min ·{" "}
                {item.tags.join(", ") || "no tags"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(item);
                  setIsNew(false);
                  setPreview(false);
                }}
                className="text-primary hover:text-white p-2"
              >
                <FaPen />
              </button>
              <button
                onClick={() => item._id && handleDelete(item._id)}
                className="text-red-500 hover:text-red-400 p-2"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-500 text-center py-10">Nothing written yet.</p>
        )}
      </div>

      {toast && (
        <div
          className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
