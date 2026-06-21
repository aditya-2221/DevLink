function OwnerCard({ owner }) {
  return (
    <div className="flex items-center gap-4 mt-8 p-4 bg-slate-900 rounded-xl border border-slate-800">
      <img
        src={owner.avatar}
        alt={owner.fullName}
        className="w-16 h-16 rounded-full object-cover"
      />

      <div>
        <h3 className="text-white text-xl font-semibold">
          {owner.fullName}
        </h3>

        <p className="text-gray-400">
          @{owner.username}
        </p>
      </div>
    </div>
  );
}

export default OwnerCard;