"use client";

import { useState, type FormEvent } from "react";
import type { PlannerFormValues } from "@/lib/prompt";

export type { PlannerFormValues };

type InputFormProps = {
  isLoading: boolean;
  onSubmit: (values: PlannerFormValues) => void | Promise<void>;
};

const gradeOptions = [
  "大一",
  "大二",
  "大三",
  "大四",
  "研一",
  "研二",
  "研三",
];

const roleSuggestions = [
  "产品经理实习生",
  "前端开发实习生",
  "后端开发实习生",
  "算法工程师实习生",
  "数据分析实习生",
  "运营实习生",
];

const inputClassName =
  "mt-2 w-full rounded-md border border-white/10 bg-zinc-950/70 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/70 focus:ring-2 focus:ring-emerald-300/15";

export function InputForm({ isLoading, onSubmit }: InputFormProps) {
  const [values, setValues] = useState<PlannerFormValues>({
    school: "",
    major: "",
    grade: "大三",
    targetRole: "",
  });
  const [formError, setFormError] = useState("");

  function updateValue<Key extends keyof PlannerFormValues>(
    key: Key,
    value: PlannerFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setFormError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedValues = {
      school: values.school.trim(),
      major: values.major.trim(),
      grade: values.grade,
      targetRole: values.targetRole.trim(),
    };

    if (
      !trimmedValues.school ||
      !trimmedValues.major ||
      !trimmedValues.grade ||
      !trimmedValues.targetRole
    ) {
      setFormError("请完整填写学校、专业、年级和目标岗位。");
      return;
    }

    void onSubmit(trimmedValues);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 sm:p-5"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">填写你的背景</h2>
        <p className="mt-1 text-sm leading-6 text-zinc-400">
          信息越具体，生成的路线越贴近你的求职阶段。
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-zinc-200">学校</span>
          <input
            className={inputClassName}
            placeholder="例如：武汉大学"
            value={values.school}
            onChange={(event) => updateValue("school", event.target.value)}
            disabled={isLoading}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-200">专业</span>
          <input
            className={inputClassName}
            placeholder="例如：计算机科学与技术"
            value={values.major}
            onChange={(event) => updateValue("major", event.target.value)}
            disabled={isLoading}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-200">年级</span>
          <select
            className={inputClassName}
            value={values.grade}
            onChange={(event) => updateValue("grade", event.target.value)}
            disabled={isLoading}
          >
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade} className="bg-zinc-950">
                {grade}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-200">目标岗位</span>
          <input
            className={inputClassName}
            placeholder="例如：AI 产品经理实习生"
            value={values.targetRole}
            onChange={(event) => updateValue("targetRole", event.target.value)}
            disabled={isLoading}
            list="role-suggestions"
          />
          <datalist id="role-suggestions">
            {roleSuggestions.map((role) => (
              <option key={role} value={role} />
            ))}
          </datalist>
        </label>
      </div>

      {formError ? (
        <p className="mt-4 rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 flex w-full items-center justify-center rounded-md bg-emerald-300 px-4 py-3 text-base font-semibold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
      >
        {isLoading ? "正在生成..." : "生成实习规划"}
      </button>

      <p className="mt-3 text-center text-xs leading-5 text-zinc-500">
        无需登录，不保存数据，仅用于本次生成。
      </p>
    </form>
  );
}
