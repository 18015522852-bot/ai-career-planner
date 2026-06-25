import { NextRequest, NextResponse } from "next/server";
import {
  buildPlannerUserPrompt,
  plannerSystemPrompt,
  type PlannerFormValues,
  type PlannerResult,
} from "@/lib/prompt";

type DeepSeekMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
};

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateFormValues(body: unknown): PlannerFormValues | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const current = body as Record<string, unknown>;

  if (
    !isNonEmptyString(current.school) ||
    !isNonEmptyString(current.major) ||
    !isNonEmptyString(current.grade) ||
    !isNonEmptyString(current.targetRole)
  ) {
    return null;
  }

  return {
    school: current.school.trim(),
    major: current.major.trim(),
    grade: current.grade.trim(),
    targetRole: current.targetRole.trim(),
  };
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePlannerResult(content: string): PlannerResult {
  const parsed = JSON.parse(content) as Record<string, unknown>;

  return {
    roleAnalysis:
      typeof parsed.roleAnalysis === "string" ? parsed.roleAnalysis.trim() : "",
    skillGap: normalizeStringList(parsed.skillGap),
    sixMonthRoadmap: normalizeStringList(parsed.sixMonthRoadmap),
    deliveryAdvice: normalizeStringList(parsed.deliveryAdvice),
  };
}

function createErrorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return createErrorResponse(
      "服务端缺少 DEEPSEEK_API_KEY，请先配置环境变量。",
      500,
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return createErrorResponse("请求格式错误，请提交 JSON 数据。", 400);
  }

  const values = validateFormValues(body);

  if (!values) {
    return createErrorResponse("请完整填写学校、专业、年级和目标岗位。", 400);
  }

  const messages: DeepSeekMessage[] = [
    {
      role: "system",
      content: plannerSystemPrompt,
    },
    {
      role: "user",
      content: buildPlannerUserPrompt(values),
    },
  ];

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || DEFAULT_MODEL,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 1800,
        stream: false,
      }),
    });

    const data = (await response.json()) as DeepSeekResponse;

    if (!response.ok) {
      return createErrorResponse(
        data.error?.message || "DeepSeek API 请求失败，请稍后重试。",
        response.status,
      );
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return createErrorResponse("AI 未返回有效内容，请重新生成。", 502);
    }

    const result = parsePlannerResult(content);

    if (
      !result.roleAnalysis &&
      !result.skillGap.length &&
      !result.sixMonthRoadmap.length &&
      !result.deliveryAdvice.length
    ) {
      return createErrorResponse("AI 返回内容为空，请重新生成。", 502);
    }

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return createErrorResponse("AI 返回格式异常，请重新生成。", 502);
    }

    console.error("Failed to generate internship plan:", error);
    return createErrorResponse("服务器暂时无法生成规划，请稍后再试。", 500);
  }
}
