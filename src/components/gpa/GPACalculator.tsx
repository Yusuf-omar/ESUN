"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TapButton } from "@/components/ui/TapButton";
import { useI18n } from "@/components/providers/I18nProvider";

interface CourseRow {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

function getPoints(
  gradeValue: string,
  grades: ReadonlyArray<{ value: string; points: number }>
): number {
  const g = grades.find((x) => x.value === gradeValue);
  return g?.points ?? 0;
}

export function GPACalculator() {
  const { copy } = useI18n();
  const grades = copy.grades;
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: "1", name: "", credits: 3, grade: "A" },
  ]);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: "",
        credits: 3,
        grade: "A",
      },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseRow, value: string | number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const weightedSum = courses.reduce(
    (sum, c) => sum + (c.credits || 0) * getPoints(c.grade, grades),
    0
  );
  const gpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

  return (
    <motion.div
      className="mt-8 rounded-2xl border border-[#8c7656]/40 bg-[#0d0d0d] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-wrap items-end gap-3 rounded-lg border border-[#8c7656]/20 bg-[#010101] p-3"
          >
            <div className="min-w-[120px] flex-1">
              <label className="block text-xs text-white/60">
                {copy.gpa.courseName}
              </label>
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                placeholder={copy.gpa.placeholderCourse}
                dir="auto"
                className="mt-1 w-full rounded border border-[#8c7656]/40 bg-[#0d0d0d] px-3 py-2 text-white placeholder:text-white/40"
              />
            </div>
            <div className="w-20">
              <label className="block text-xs text-white/60">
                {copy.gpa.credits}
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={course.credits}
                onChange={(e) =>
                  updateCourse(course.id, "credits", parseInt(e.target.value, 10) || 0)
                }
                dir="ltr"
                className="mt-1 w-full rounded border border-[#8c7656]/40 bg-[#0d0d0d] px-3 py-2 text-white"
              />
            </div>
            <div className="w-24">
              <label className="block text-xs text-white/60">
                {copy.gpa.grade}
              </label>
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                className="mt-1 w-full rounded border border-[#8c7656]/40 bg-[#0d0d0d] px-3 py-2 text-white"
              >
                {grades.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <TapButton
              type="button"
              variant="ghost"
              className="py-2 text-red-400"
              onClick={() => removeCourse(course.id)}
            >
              {copy.gpa.remove}
            </TapButton>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between gap-4">
        <TapButton variant="outline" onClick={addCourse} className="py-2">
          {copy.gpa.addCourse}
        </TapButton>
      </div>
      <div className="mt-8 flex flex-wrap gap-6 rounded-xl border border-[#8c7656]/40 bg-[#010101] p-6">
        <div>
          <p className="text-sm text-white/60">{copy.gpa.totalCredits}</p>
          <p className="text-2xl font-bold text-white">{totalCredits}</p>
        </div>
        <div>
          <p className="text-sm text-white/60">{copy.gpa.totalGPA}</p>
          <p className="text-2xl font-bold text-[#a81123]">
            {gpa.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
