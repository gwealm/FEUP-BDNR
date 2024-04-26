import React, { Context, useContext, useState } from "react";
import { BookmarksContext } from "./Bookmarks.tsx"; // Assuming BookmarksContext is exported from Bookmarks.tsx
import { useLocation } from "react-router-dom"

type ctx = React.Context<{
    bookmarks: any[];
    fetchBookmarks: () => void;
}>;

export function AddBookmark() {
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState("");

    
    const { bookmarks, fetchBookmarks } = React.useContext(BookmarksContext);

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
        
    };

    const handleTagsChange = (event) => {
        setTags(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const bookmarkData = {
            url: url,
            tags: tags
        };

        console.log("Bookmark data:", bookmarkData);
        

        try {
            const response = await fetch("http://localhost:8000/bookmark/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookmarkData),
            });
            
            console.log("UIUI-1");
            console.log(reportError)

            if (!response.ok) {
                throw new Error("Failed to add bookmark");
                console.log("UIUI0");
            } else {
                console.log("UIU1");

            }

            console.log("UIUI");
            

            fetchBookmarks();

            console.log("UIUI2");
            setUrl(""); 
            setTags("");
        } catch (error) {
            console.error("Error adding bookmark:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div id="_url">
                <label htmlFor="url">URL:</label>
                <input
                    type="text"
                    name="url"
                    id="url"
                    placeholder="URL to bookmark"
                    value={url}
                    onChange={handleUrlChange}
                />
            </div>

            <div id="_tags">
                <label htmlFor="tags">Tags (List):</label>
                <input
                    type="text"
                    name="tags"
                    id="tags"
                    placeholder="Space-separated tags in lowercase"
                    value={tags}
                    onChange={handleTagsChange}
                />
            </div>

            <div id="_button">
                <button type="submit">Add (or update) bookmark</button>
            </div>
        </form>
    );
}
