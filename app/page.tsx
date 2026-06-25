"use client";

import { useMemo, useState } from "react";
import { InputForm, type PlannerFormValues } from "@/components/InputForm";
import { ResultCard, type PlannerResult } from "@/components/ResultCard";

type ApiPlanResponse = {
  result?: PlannerResult;
  content?: string;
  error?: string;
};

const emptyResult: PlannerResult = {
  roleAnalysis: "",
  skillGap: [],
  sixMonthRoadmap: [],
  deliveryAdvice: [],
};

function normalizeResult(data: ApiPlanResponse): PlannerResult {
  if (data.result) {
    return data.result;
  }

  if (data.content) {
    return {
      ...emptyResult,
      roleAnalysis: data.content,
    };
  }

  return emptyResult;
}

export default function HomePage() {
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const hasResult = useMemo(() => {
    if (!result) return false;

    return Boolean(
      result.roleAnalysis ||
        result.skillGap.length ||
        result.sixMonthRoadmap.length ||
        result.deliveryAdvice.length,
    );
  }, [result]);

  async function handleGenerate(values: PlannerFormValues) {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as ApiPlanResponse;

      if (!response.ok) {
        throw new Error(data.error || "生成失败，请稍后再试。");
      }

      setResult(normalizeResult(data));
    } catch (currentError) {
      const message =
        currentError instanceof Error
          ? currentError.message
          : "网络异常，请稍后重试。";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-7">
          <div className="mb-3 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            面向中国大学生的 AI 实习规划
          </div>
          <h1 className="text-3xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
            AI 实习规划助手
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
            输入你的学校、专业、年级和目标岗位，生成一份适合当前阶段的
            6 个月实习提升方案。
          </p>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

          <section className="min-h-[360px] rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 sm:p-5">
            {isLoading ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <div className="mb-5 h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-300" />
                <h2 className="text-lg font-semibold text-white">
                  正在生成你的实习路线
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">
                  AI 正在综合分析岗位要求、技能差距和投递策略。
                </p>
              </div>
            ) : error ? (
              <div className="flex h-full min-h-[320px] flex-col justify-center rounded-md border border-red-400/20 bg-red-500/10 p-5">
                <p className="text-sm font-medium text-red-200">生成失败</p>
                <p className="mt-2 text-sm leading-6 text-red-100/80">
                  {error}
                </p>
              </div>
            ) : hasResult && result ? (
              <ResultCard result={result} />
            ) : (
              <div className="flex h-full min-h-[320px] flex-col justify-between rounded-md border border-dashed border-white/10 bg-zinc-950/40 p-5">
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    你的规划结果会显示在这里
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    MVP 阶段先聚焦核心闭环：背景输入、AI 分析、路线生成、复制保存。
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-zinc-400">
                  <div className="rounded-md bg-white/[0.04] p-3">
                    适合岗位分析
                  </div>
                  <div className="rounded-md bg-white/[0.04] p-3">
                    当前技能缺口
                  </div>
                  <div className="rounded-md bg-white/[0.04] p-3">
                    未来 6 个月提升路线
                  </div>
                  <div className="rounded-md bg-white/[0.04] p-3">
                    实习投递建议
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
