

export default function UserProfileMenu({ toProfile, toQuestionsAnswered, toTagsCreated, selectedMenu }) {
    let profileSelected = selectedMenu === 0;
    let answerSelected = selectedMenu === 1;
    let tagsSelected = selectedMenu === 2;

    return (
        <div className="UserMenu">
            <button className={`UserMenuButton ${(profileSelected) ? "MenuSelected" : ""}`}  onClick={() => { toProfile() }}> Profile </button>
            <button className={`UserMenuButton ${(answerSelected) ? "MenuSelected" : ""}`} onClick={() => { toQuestionsAnswered() }}> Questions Answered </button>
            <button className={`UserMenuButton ${(tagsSelected) ? "MenuSelected" : ""}`} onClick={() => { toTagsCreated() }}> Tags Created </button>
        </div>
    )
}