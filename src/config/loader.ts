import * as core from "@actions/core";
import { MainConfig, PostConfig } from "./types";

const INPUT_DEFAULTS = {
  proc_trace_min_duration: -1,
  proc_trace_chart_max_count: 10,
  metric_frequency: 5,
} as const;

/**
 * Parses a numeric input, falling back to its documented default (and
 * warning) when the value is missing or not a valid integer.
 */
function parseIntInput(name: keyof typeof INPUT_DEFAULTS): number {
  const raw = core.getInput(name);
  const value = parseInt(raw, 10);
  if (Number.isNaN(value)) {
    const fallback = INPUT_DEFAULTS[name];
    core.warning(
      `Input '${name}' has invalid value '${raw}', falling back to default '${fallback}'`
    );
    return fallback;
  }
  return value;
}

function loadProcessTracerConfig() {
  return {
    minDuration: parseIntInput("proc_trace_min_duration"),
    chartShow: core.getInput("proc_trace_chart_show") === "true",
    chartMaxCount: parseIntInput("proc_trace_chart_max_count"),
    tableShow: core.getInput("proc_trace_table_show") === "true",
  };
}

/**
 * Load configuration for main entry point
 */
export function loadMainConfig(): MainConfig {
  return {
    processTracer: loadProcessTracerConfig(),
    statsCollector: {
      metricFrequency: parseIntInput("metric_frequency") * 1000,
    },
  };
}

/**
 * Load configuration for post entry point
 */
export function loadPostConfig(): PostConfig {
  return {
    github: {
      token: core.getInput("github_token"),
    },
    report: {
      jobSummary: core.getInput("job_summary") === "true",
      commentOnPR: core.getInput("comment_on_pr") === "true",
    },
    processTracer: loadProcessTracerConfig(),
    statsCollector: {
      metricFrequency: parseIntInput("metric_frequency") * 1000,
    },
  };
}
