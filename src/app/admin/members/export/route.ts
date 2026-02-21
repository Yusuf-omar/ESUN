import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function escapeCsv(value: string | null) {
  const text = value ?? "";
  const escaped = text.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const admin = createAdminClient();
  const { data: members, error } = await admin
    .from("profiles")
    .select("full_name, student_number, phone_number, email, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  const header = [
    "Full Name",
    "Student Number",
    "Phone Number",
    "Email",
    "Updated At",
  ];

  const rows =
    members?.map((m) =>
      [
        escapeCsv(m.full_name),
        escapeCsv(m.student_number),
        escapeCsv(m.phone_number),
        escapeCsv(m.email),
        escapeCsv(m.updated_at),
      ].join(",")
    ) ?? [];

  const csv = `\uFEFF${header.join(",")}\n${rows.join("\n")}`;
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="members-${date}.csv"`,
    },
  });
}
