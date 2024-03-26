"use client";
import React, { useEffect, useState } from "react";

const SettingPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const onSubmit = async (event: any) => {
    if (!file) return;
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  };

  useEffect(() => {
    fetch("https://shadow-exercise.s3.ap-southeast-1.amazonaws.com/ap.jpeg", {
      method: "GET",
    });
  }, []);

  return (
    <section className="container mx-auto px-20 py-10">
      <form onSubmit={onSubmit}>
        <input
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          type="file"
          accept="image/*"
          name="temp"
          id="tmp"
        />
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          type="text"
          placeholder="Caption"
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default SettingPage;
