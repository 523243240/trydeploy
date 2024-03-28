
export default function PageButtons({ totalItems, maxPerPage, page, setPage }) {
    return (
        <>
            { totalItems > maxPerPage &&
            <div>
                <button onClick={ () => { setPage(page - 1) }} className="PageButton" disabled={ page === 0 }> Prev </button>
                <button onClick={ () => { setPage((page + 1) % (Math.ceil(totalItems / maxPerPage))); }} className="PageButton"> Next </button>
                <span className="PageDescription"> {`Page ${page + 1} of ${Math.ceil(totalItems / maxPerPage)}`} </span>
            </div> }
        </>
    );
}