"use client";
import { useEffect, useRef, useState } from "react";

/** Joins non-empty parts into a sentence with a single trailing period. */
const build = (...parts: (string | undefined)[]) => {
  const cleaned = parts
    .filter((p): p is string => Boolean(p && p.trim()))
    .map((p) => p.trim().replace(/\.+$/, ""));
  if (!cleaned.length) return "";
  return `${cleaned.join(". ")}.`;
};

export default function CitationGenerator() {
  const [style, setStyle] = useState("APA");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  const generate = () => {
    const a = author.trim();
    const t = title.trim();
    const y = year.trim();
    const p = publisher.trim();

    if (!a || !t) {
      setResult("براہ کرم Author اور Title لکھیں");
      return;
    }

    let citation = "";
    if (style === "APA") {
      citation = build(y ? `${a} (${y})` : a, t, p);
    } else if (style === "MLA") {
      citation = build(a, t, [p, y].filter(Boolean).join(", "));
    } else {
      citation = build(a, y, t, p);
    }
    setResult(citation);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-zinc-50">
          Citation Generator Tool
        </h1>

        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full border p-2 rounded mb-4 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 dark:border-zinc-700"
        >
          <option>APA</option>
          <option>MLA</option>
          <option>Chicago</option>
        </select>

        <input placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full border p-2 rounded mb-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 dark:border-zinc-700" />
        <input placeholder="Book Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded mb-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 dark:border-zinc-700" />
        <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="w-full border p-2 rounded mb-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 dark:border-zinc-700" />
        <input placeholder="Publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} className="w-full border p-2 rounded mb-4 bg-white dark:bg-zinc-900 text-black dark:text-zinc-100 dark:border-zinc-700" />

        <button onClick={generate} className="w-full bg-black text-white dark:bg-white dark:text-black p-3 rounded-lg font-semibold">
          Generate Citation
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-2">Result:</p>
            <p className="font-medium text-black dark:text-zinc-100">{result}</p>
            <button
              onClick={copy}
              className="mt-3 text-sm bg-white border px-3 py-1 rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
