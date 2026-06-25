function RecruitmentFilters({
  search,
  setSearch,
  status,
  setStatus,
  skill,
  setSkill,
  sort,
  setSort,
  availableSkills
}) {
  return (
    <div
      className="
      bg-slate-900/40
      border
      border-blue-500/10
      rounded-xl
      p-4
      flex
      flex-wrap
      gap-3
      "
    >
      <input
        type="text"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search recruitments..."
        className="
        flex-1
        min-w-[250px]
        bg-slate-900
        border
        border-slate-700
        rounded-lg
        px-4
        py-2
        text-white
        outline-none
        "
      />

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
        className="
        bg-slate-900
        border
        border-slate-700
        rounded-lg
        px-4
        py-2
        text-white
        "
      >
        <option value="">
          All Status
        </option>

        <option value="OPEN">
          Open
        </option>

        <option value="CLOSED">
          Closed
        </option>
      </select>
      <select
        value={skill}
        onChange={(e) =>
          setSkill(
            e.target.value
          )
        }
        className="
    bg-slate-900
    border
    border-slate-700
    rounded-lg
    px-4
    py-2
    text-white
"
      >
        <option value="">
          All Skills
        </option>

        {
          availableSkills?.map(
            skill => (
              <option
                key={skill}
                value={skill}
              >
                {skill}
              </option>
            )
          )
        }
      </select>
      <select
        value={sort}
        onChange={(e) =>
          setSort(
            e.target.value
          )
        }
        className="
    bg-slate-900
    border
    border-slate-700
    rounded-lg
    px-4
    py-2
    text-white
"
      >
        <option value="latest">
          Latest First
        </option>

        <option value="oldest">
          Oldest First
        </option>
      </select>
    </div>
  );
}

export default RecruitmentFilters;