export default function Bookmark({ url, tags }: { url: string, tags: string[] }) {
    return (
        <article className="bookmark">
            <a href={url}> {url} </a>
            <ul className="tag-list">
                {tags.map((tag, index) => (
                    <li key={index}><a href={`./?tags=${tag}`}>{tag}</a></li>
                ))}
            </ul>
        </article>
    );
}
