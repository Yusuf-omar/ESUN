"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LibraryItem } from "@/lib/types";
import { AR } from "@/lib/ar";
import { TapButton } from "@/components/ui/TapButton";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getPostUrl(item: LibraryItem) {
  return item.post_url || item.file_url || null;
}

function getPreviewImageUrl(item: LibraryItem) {
  return item.preview_image_url || item.file_url || null;
}

export function LibrarySection({ items }: { items: LibraryItem[] }) {
  const library = AR.library;

  return (
    <section
      id="library"
      className="scroll-mt-20 border-t border-[#8c7656]/30 bg-transparent py-14 md:py-16"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
          {library.title}
        </h2>

        {items.length === 0 ? (
          <p className="mx-auto mt-10 max-w-2xl text-center text-white/70">
            {library.noPosts}
          </p>
        ) : (
          <motion.div
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {items.map((item, index) => {
              const postUrl = getPostUrl(item);
              const previewImageUrl = getPreviewImageUrl(item);
              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group glass flex h-full flex-col overflow-hidden rounded-2xl border border-[#8c7656]/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9ad84]/60"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-[#8c7656]/50 px-3 py-1 text-xs text-[#8c7656]">
                      {item.category || library.generalCategory}
                    </span>
                    <span className="text-xs text-white/50">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  {previewImageUrl && (
                    <img
                      src={previewImageUrl}
                      alt={item.title}
                      className="mt-3 h-44 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  <p className="mt-3 flex-1 text-sm leading-7 text-white/80">
                    {item.description || library.noDescription}
                  </p>

                  <div className="mt-5">
                    {postUrl ? (
                      <Link href={postUrl} target="_blank" rel="noopener noreferrer">
                        <TapButton className="w-full py-3">{library.viewPost}</TapButton>
                      </Link>
                    ) : (
                      <TapButton className="w-full py-3" disabled>
                        {library.comingSoon}
                      </TapButton>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
