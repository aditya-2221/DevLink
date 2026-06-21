import { useSelector } from "react-redux";

function SkillsCard() {

  const { user } = useSelector(
    state => state.auth
  );

  return (
    <div
      className="
      bg-slate-900/50
      border
      border-blue-500/10
      rounded-2xl
      p-6
      "
    >
      <h2
        className="
        text-xl
        font-semibold
        text-white
        mb-4
        "
      >
        Skills
      </h2>

      <div className="flex flex-wrap gap-2">

        {user?.skills?.length > 0 ? (
          user.skills.map((skill) => (
            <span
              key={skill}
              className="
              px-3
              py-1
              rounded-full
              bg-blue-500/10
              text-blue-400
              "
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-slate-400">
            No skills added yet.
          </p>
        )}

      </div>
    </div>
  );
}

export default SkillsCard;