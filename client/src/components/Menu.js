

/**
 * Component representing the menu on the left hand side.
 * @param {object} props Component props.
 * @param {Function} props.toHomePage Function to go to the home page (Used when questions menu item is clicked).
 * @param {Function} props.toTagsPage Function to go to the tags page (Used when tags menu item is clicked).
 */
export default function Menu({toHomePage=()=>{}, toTagsPage=()=>{}, selectedMenu=-1}) {
    let homeSelected = selectedMenu === 0;
    let tagsSelected = selectedMenu === 1;

    return (
        <div className="Menu">
            <button onClick={() => {toHomePage()}} className={(homeSelected) ? "MenuSelected" : ""}>Questions</button>
            <button onClick={() => {toTagsPage()}} className={(tagsSelected) ? "MenuSelected" : ""}>Tags</button>
        </div>
    );
}