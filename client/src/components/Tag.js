
export default function Tag({ tagName, onTagClick }) {
    return <button className="QTag" onClick={()=>{ onTagClick(tagName) }}>{tagName}</button>;   
}