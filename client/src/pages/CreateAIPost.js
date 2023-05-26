import React, { useState } from "react";
import Editor from "../Editor";
import "./CreateAIPost.css";
import {Link, Navigate} from "react-router-dom";
import AIImages from "../AIImages";

export default function CreateAIPost() {
  const [hasTitle, setHasTitle] = useState(false);
  const [images, setImages] = useState([]);
  const [extraImageSearch, setExtraImageSearch] = useState("");
  const [reqInfo, setReqInfo] = useState({
    hasImage: false,
    imgLoad: false,
    loading: false,
    summaryLoad: false,
  });
  
  const [files, setFiles] = useState('');
  const [aiPost, setAIPost] = useState({
    title: "",
    summary: "",
    content: "",
  });

  const Image_Access_KEY = "GFeTlyA4Y87rBSJivGFOqXFk5qnAE4IsR32Pe6ak2vk";

  // ============= Image Seacher
  const generateBlogImage = async (searchFor) => {
    setReqInfo((prev) => ({ ...prev, imgLoad: true, hasImage: false }));
    const base_image_url = `https://api.unsplash.com/search/photos?page=1&query=${searchFor}&client_id=${Image_Access_KEY}`;
    const response = await fetch(base_image_url);
    const imgData = await response.json();
    setImages(imgData.results);
    if (imgData.results.length === 0) {
      setReqInfo((prev) => ({ ...prev, hasImage: false }));
    }
    setReqInfo((prev) => ({ ...prev, hasImage: true, imgLoad: false }));
  };

  // ============= Text Generator
  const generateBlogText = async (inputText) => {
    console.log(inputText);
    if (typeof inputText !== "undefined" && inputText.trim() != "") {
      console.log("ai-text");
      setReqInfo((prev) => ({ ...prev, loading: true }));
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: `Generate blog content for: ${inputText}`,
          // query: ""
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await fetch("http://localhost:4000/ai", options);
        if (response.status !== 200) {
          console.log(response.statusText);
        }
        const result = await response.json();
        console.log(result);
        setAIPost((prev) => ({
          ...prev,
          content: result.choices[0].message.content,
        }));
        setReqInfo((prev) => ({ ...prev, loading: false }));
      } catch (err) {
        console.log(err);
      }

      console.log(aiPost);

      // for generating summary
      setReqInfo((prev) => ({ ...prev, summaryLoad: true }));
      const summaryOptions = {
        method: "POST",
        body: JSON.stringify({
          message: `Give a short(max 100 words) summary for: ${aiPost.content}`,
          // query: ""
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response = await fetch(
          "http://localhost:4000/ai",
          summaryOptions
        );
        if (response.status !== 200) {
          console.log(response.statusText);
        }
        const summary = await response.json();
        console.log("Summary");
        console.log(summary);
        setAIPost((prev) => ({
          ...prev,
          summary: summary.choices[0].message.content,
        }));
        setReqInfo((prev) => ({ ...prev, summaryLoad: false }));
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Title is Required");
      setReqInfo((prev) => ({
        ...prev,
        hasImage: false,
        loading: false,
        summaryLoad: false,
        imgLoad: false,
      }));
    }
  };

  const titleHanlder = (e) => {
    const titleVal = e.target.value;
    // console.log(aiPost);
    if (titleVal.trim !== "") {
      setHasTitle(true);
      setAIPost({
        title: titleVal,
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // console.log();
  };

  
  const [redirect, setRedirect] = useState(false);
  const formSubmission = async (e) => {
    const data = new FormData();
    data.set("title", aiPost.title);
    data.set("summary", aiPost.summary);
    data.set("content", aiPost.content);
    data.set("file", files[0]);

    e.preventDefault();

    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    }
  };
  
  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form className="aiForm" onSubmit={submitHandler}>
      <div className="searchBar">
        <input
          type="title"
          placeholder={"Title"}
          value={aiPost.title}
          onChange={titleHanlder}
          required
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            generateBlogText(aiPost.title);
            generateBlogImage(aiPost.title);
          }}
        >
          Create
        </button>
      </div>

      <div className="generated">
        <div className="content">
          <div className="summary">
            <input
              type="file"
              onChange={(ev) => setFiles(ev.target.files)}
              required
            />
            <div
              style={{
                border: "1px solid gray",
                borderRadius: 5,
                padding: 6,
                margin: "4px 0 12px 0",
              }}
            >
              <p style={{ fontWeight: "bold" }}>Summary</p>
              {reqInfo.summaryLoad && (
                <h5>
                  <i>Summary Loading...</i>
                </h5>
              )}
              {!reqInfo.summaryLoad && aiPost.summary && (
                <textarea
                  type="summary"
                  placeholder={"Summary"}
                  style={{
                    width: "100%",
                    padding: "8px",
                    overflow: "hidden",
                    resize: "none",
                    outline: "none",
                  }}
                  value={aiPost.summary}
                  rows="5"
                  onChange={(e) =>
                    setAIPost((prev) => ({ ...prev, summary: e.target.value }))
                  }
                ></textarea>
              )}
            </div>

            <div
              style={{ border: "1px solid gray", borderRadius: 5, padding: 6 }}
            >
              <p style={{ fontWeight: "bold" }}>Content</p>
              {reqInfo.loading && (
                <h5>
                  <i>Content Loading...</i>
                </h5>
              )}
              {!reqInfo.loading && !aiPost.content && (
                <h4>
                  <i>No Data Available</i>
                </h4>
              )}
              {!reqInfo.loading && aiPost.content && (
                <Editor value={aiPost.content} />
              )}
            </div>
          </div>
        </div>

        <div className="image">
          <p>Related Image</p>
          <div className="aiImage">
            {/* {!reqInfo.loading && !reqInfo.hasImage && <h4>No Data Available</h4>} */}
            {reqInfo.hasImage && (
              <div>
                <input
                  value={extraImageSearch}
                  placeholder="Search Other Images"
                  onChange={(e) => setExtraImageSearch(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => generateBlogImage(extraImageSearch)}
                >
                  Search
                </button>
              </div>
            )}
            <ul>
              {reqInfo.imgLoad && (
                <h5>
                  <i>Images Loading...</i>
                </h5>
              )}
              {!reqInfo.imgLoad &&
                images.length > 0 &&
                images.map((image) => {
                  return (
                    <AIImages
                      key={image.id}
                      link={image.links.download}
                      image_alt={image.alt_description}
                    />
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
      <div className="ai-submitBtn">
        <button type="submit" onClick={formSubmission}>
          Create Post
        </button>
      </div>
    </form>
  );
}
