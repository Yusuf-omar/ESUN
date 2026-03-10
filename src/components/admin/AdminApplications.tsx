"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TapButton } from "@/components/ui/TapButton";
import type { ServiceType } from "@/lib/types";
import {
  archiveApplication,
  deleteApplication,
  updateApplicationStatus,
} from "@/app/admin/actions";
import { getServiceLabels } from "@/lib/i18n";
import { useI18n } from "@/components/providers/I18nProvider";

interface AppRow {
  id: string;
  user_id: string;
  service_type: ServiceType;
  description: string;
  status: string;
  archived_at: string | null;
  created_at: string;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminApplications({ list }: { list: AppRow[] }) {
  const { copy } = useI18n();
  const serviceLabels = getServiceLabels(copy);
  const [rows, setRows] = useState<AppRow[]>(list);
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(list.map((a) => [a.id, a.status]))
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const activeRows = rows.filter((app) => !app.archived_at);
  const archivedRows = rows.filter((app) => !!app.archived_at);

  const handleStatusChange = async (id: string, status: string) => {
    setError("");
    setBusyId(id);
    try {
      const result = await updateApplicationStatus(id, status);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStatuses((s) => ({ ...s, [id]: status }));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update application status.";
      setError(msg);
    } finally {
      setBusyId(null);
    }
  };

  const handleArchive = async (id: string) => {
    setError("");
    setBusyId(id);
    try {
      const result = await archiveApplication(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const archivedAt = new Date().toISOString();
      setRows((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, archived_at: archivedAt } : app
        )
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to archive request.";
      setError(msg);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setError("");
    setBusyId(id);
    try {
      const result = await deleteApplication(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setRows((prev) => prev.filter((app) => app.id !== id));
      setStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete request.";
      setError(msg);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {error && <p className="text-sm text-red-400">{error}</p>}
      {rows.length === 0 ? (
        <p className="text-white/60">No applications.</p>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white">Active Requests</h2>
            {activeRows.length === 0 ? (
              <p className="text-white/60">No active requests.</p>
            ) : (
              activeRows.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  className="rounded-xl border border-[#8c7656]/40 bg-[#0d0d0d]/85 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9ad84]/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-white">
                      {serviceLabels[app.service_type]}
                    </span>
                    <span className="text-sm text-white/50">
                      {formatDate(app.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">
                    {app.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {(["pending", "in_progress", "resolved"] as const).map(
                      (status) => (
                        <TapButton
                          key={status}
                          variant={statuses[app.id] === status ? "primary" : "outline"}
                          className="py-1.5 px-3 text-sm"
                          disabled={busyId === app.id}
                          onClick={() => handleStatusChange(app.id, status)}
                        >
                          {status.replace("_", " ")}
                        </TapButton>
                      )
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <TapButton
                      type="button"
                      variant="outline"
                      className="py-1.5 px-3 text-sm"
                      disabled={busyId === app.id}
                      onClick={() => handleArchive(app.id)}
                    >
                      Archive
                    </TapButton>
                    <TapButton
                      type="button"
                      variant="ghost"
                      className="py-1.5 px-3 text-sm text-red-400"
                      disabled={busyId === app.id}
                      onClick={() => handleDelete(app.id)}
                    >
                      Delete
                    </TapButton>
                  </div>
                </motion.div>
              ))
            )}
          </section>

          <section className="space-y-4 pt-2">
            <h2 className="text-lg font-bold text-white/85">Archived Requests</h2>
            {archivedRows.length === 0 ? (
              <p className="text-white/50">No archived requests.</p>
            ) : (
              archivedRows.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  className="rounded-xl border border-[#8c7656]/25 bg-[#0d0d0d]/70 p-4 transition-all duration-300 hover:border-[#8c7656]/45"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-white/90">
                      {serviceLabels[app.service_type]}
                    </span>
                    <span className="text-sm text-white/50">
                      {formatDate(app.created_at)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-white/75">
                    {app.description}
                  </p>
                  <p className="mt-2 text-xs text-white/55">
                    Archived: {app.archived_at ? formatDate(app.archived_at) : "-"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <TapButton
                      type="button"
                      variant="ghost"
                      className="py-1.5 px-3 text-sm text-red-400"
                      disabled={busyId === app.id}
                      onClick={() => handleDelete(app.id)}
                    >
                      Delete
                    </TapButton>
                  </div>
                </motion.div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}
