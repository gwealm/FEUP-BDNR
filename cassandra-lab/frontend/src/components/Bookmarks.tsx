import { createContext, useEffect, useState } from "react";
import { AddBookmark } from "./AddBookmark";
import Bookmark from "./Bookmark";
import "../App.css"
import { useLocation } from "react-router-dom";

export const BookmarksContext = createContext({
    bookmarks: [],
    fetchBookmarks: () => {},
});

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);

    // const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    // const tags = searchParams.getAll('tag')

    const fetchBookmarks = async (tags: string[] = []) => {
        let url = "http://localhost:8000/bookmark";

        const queryParams = new URLSearchParams(window.location.search);


        if (queryParams.getAll("tags").length > 0){
            url += `/tag/?tags=${queryParams.getAll("tags").toString()}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setBookmarks(data);
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    return (
        <BookmarksContext.Provider value={{ bookmarks, fetchBookmarks }}>
            <AddBookmark />
            {bookmarks.length > 0 ? (
                <ul>
                    {bookmarks.map((bookmark) => (
                        <Bookmark url={bookmark[0]} tags={bookmark[1]} />
                    ))}
                </ul>
            ) : (
                <p>No bookmarks to be displayed</p>
            )}
        </BookmarksContext.Provider>
    );
}
