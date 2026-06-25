"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { PlannerResult } from "@/lib/prompt";

export type { PlannerResult };

type ResultCardProps = {
  result: PlannerResult;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md border border-white/10 bg-zinc-950/45 p-4">
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      <div className="mt-3 text-sm leading-6 text-zinc-300">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  if (!items.length) {
    return <p className="text-zinc-500">暂无内容。</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ResultCard({ result }: ResultCardProps) {
  const [copyLabel, setCopyLabel] = useState("复制结果");

  const plainText = useMemo(() => {
    return [
      "适合岗位分析",
      result.roleAnalysis,
      "",
      "当前技能缺口",
      ...result.skillGap.map((item) => `- ${item}`),
      "",
      "未来6个月提升路线",
      ...result.sixMonthRoadmap.map((item) => `- ${item}`),
      "",
      "实习投递建议",
      ...result.deliveryAdvice.map((item) => `- ${item}`),
    ].join("\n");
  }, [result]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopyLabel("已复制");
      window.setTimeout(() => setCopyLabel("复制结果"), 1600);
    } catch {
      setCopyLabel("复制失败");
      window.setTimeout(() => setCopyLabel("复制结果"), 1600);
    }
  }

  return (
    <article className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-emerald-200">AI 规划结果</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            你的 6 个月实习行动方案
          </h2>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-emerald-300/40 hover:text-white"
        >
          {copyLabel}
        </button>
      </div>

      <Section title="适合岗位分析">
        {result.roleAnalysis ? (
          <p>{result.roleAnalysis}</p>
        ) : (
          <p className="text-zinc-500">暂无内容。</p>
        )}
      </Section>

      <Section title="当前技能缺口">
        <List items={result.skillGap} />
      </Section>

      <Section title="未来 6 个月提升路线">
        <List items={result.sixMonthRoadmap} />
      </Section>

      <Section title="实习投递建议">
        <List items={result.deliveryAdvice} />
      </Section>
    </article>
  );
}
