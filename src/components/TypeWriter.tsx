"use client";

import { useState, useEffect, useCallback } from "react";

interface TypeWriterProps {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export default function TypeWriter({
  words,
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
}: TypeWriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[currentWordIndex] || "";

    if (isDeleting) {
      setCurrentText((prev) => prev.slice(0, -1));
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      setCurrentText(currentWord.slice(0, currentText.length + 1));
      if (currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    }
  }, [currentText, currentWordIndex, isDeleting, words, pauseDuration]);

  useEffect(() => {
    if (words.length === 0) return;

    const timeout = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timeout);
  }, [tick, isDeleting, deleteSpeed, typeSpeed, words.length]);

  if (words.length === 0) return null;

  return (
    <span className="text-primary">
      {currentText}
      <span className="typewriter-cursor" />
    </span>
  );
}
