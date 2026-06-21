import { useSelector } from "react-redux";
import { FaGraduationCap } from "react-icons/fa";
function EducationCard() {

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

      <div className="flex items-center gap-4 mb-4">
        <FaGraduationCap
          className="text-blue-400 text-xl"
        />
        <h2 className="text-xl
      font-semibold
      text-white">Education</h2>
      </div>

      <p className="text-slate-300">
        {
          user?.education ||
          "No education details added yet."
        }
      </p>
    </div>
  );
}

export default EducationCard;