function MembersList({ members, hostUsername, currentUser, onKick }) {
  return (
    <div className="panel members-list">
      <h2 className="heading-sm">People ({members.length})</h2>
      <ul className="members-list__list">
        {members.map((member) => (
          <li key={member} className="member-row">
            <div className="member-row__left">
              <span className="member-row__avatar" aria-hidden>
                {member.charAt(0).toUpperCase()}
              </span>
              <span className="member-row__name">
                {member}
                {member === currentUser && (
                  <span className="text-muted"> (you)</span>
                )}
              </span>
              {member === hostUsername && (
                <span className="badge badge--host">Host</span>
              )}
            </div>
            {currentUser === hostUsername && member !== hostUsername && (
              <button
                type="button"
                className="btn btn--sm btn--danger"
                onClick={() => onKick(member)}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MembersList;
