import { deleteMember } from "@/app/admin/actions";

interface MemberRow {
  id: string;
  full_name: string | null;
  student_number: string | null;
  phone_number: string | null;
  email: string | null;
  updated_at: string | null;
}

function formatDate(s: string | null) {
  if (!s) return "-";
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminMembers({ list }: { list: MemberRow[] }) {
  return (
    <div className="mt-6 space-y-4">
      {list.length === 0 ? (
        <p className="text-white/60">No registered members yet.</p>
      ) : (
        list.map((member) => (
          <article
            key={member.id}
            className="rounded-xl border border-[#8c7656]/40 bg-[#0d0d0d] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a81123]/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-white">{member.full_name || "Unnamed member"}</h3>
              <p className="text-xs text-white/50">{formatDate(member.updated_at)}</p>
            </div>
            <dl className="mt-3 space-y-1 text-sm text-white/80">
              <div>
                <span className="text-white/60">Student ID: </span>
                <span dir="ltr">{member.student_number || "-"}</span>
              </div>
              <div>
                <span className="text-white/60">Phone: </span>
                <span dir="ltr">{member.phone_number || "-"}</span>
              </div>
              <div>
                <span className="text-white/60">Email: </span>
                <span dir="ltr">{member.email || "-"}</span>
              </div>
            </dl>
            <div className="mt-4">
              <form action={deleteMember.bind(null, member.id)}>
                <button
                  type="submit"
                  className="rounded-md border border-red-500/40 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
                >
                  Remove Member
                </button>
              </form>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
