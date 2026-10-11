import { useMemo, useState } from "react";
import { View } from "react-native";
import type { FileDiffMetadata } from "@pierre/diffs";
import type { PullRequestReviewGuideExcerpt } from "@t3tools/contracts";
import { excerptRows, fileDiffRows, rowsToPatch } from "@t3tools/client-runtime/review-guide-tour";
import { AppText as Text } from "../../../components/AppText";
import { SymbolView } from "../../../components/AppSymbol";
import { resolveNativeReviewDiffView } from "../../diffs/nativeReviewDiffSurface";
import { buildNativeReviewDiffData } from "../../review/nativeReviewDiffAdapter";
import { buildReviewParsedDiff } from "../../review/reviewModel";
import { useNativeReviewDiffBridge } from "../../review/useNativeReviewDiffBridge";
import { useAppearanceCodeSurface } from "../../settings/appearance/useAppearanceCodeSurface";
import { useAppearancePreferences } from "../../settings/appearance/AppearancePreferencesProvider";
import { PullRequestMarkdown } from "../PullRequestMarkdown";

const EMPTY_IDS: readonly string[] = [];

export function ReviewGuideExcerpt({
  excerpt,
  file,
  loading,
}: {
  readonly excerpt: PullRequestReviewGuideExcerpt;
  readonly file: FileDiffMetadata | undefined;
  readonly loading: boolean;
}) {
  const { nativeReviewDiffStyle } = useAppearanceCodeSurface();
  const { themeAppearance } = useAppearancePreferences();
  const slice = useMemo(() => {
    try {
      if (!file) return "";
      return rowsToPatch(
        excerpt.path,
        file.prevName ?? excerpt.path,
        excerptRows(fileDiffRows(file), excerpt),
      );
    } catch {
      return "";
    }
  }, [file, excerpt]);
  const data = useMemo(() => {
    const parsed = buildNativeReviewDiffData(
      buildReviewParsedDiff(slice, `guide:${excerpt.path}:${excerpt.start}`),
    );
    // Excerpts are read-only: the full-file header exposes view/collapse actions.
    return { ...parsed, rows: parsed.rows.filter((row) => row.kind !== "file") };
  }, [slice, excerpt.path, excerpt.start]);
  const bridge = useNativeReviewDiffBridge({
    threadKey: null,
    sectionId: `guide:${excerpt.path}:${excerpt.start}`,
    diff: slice,
    data,
    collapsedFileIds: EMPTY_IDS,
    viewedFileIds: EMPTY_IDS,
    selectedRowIds: EMPTY_IDS,
    canHighlight: true,
  });
  const [NativeDiff] = useState(() => resolveNativeReviewDiffView());
  return (
    <View className="gap-3">
      {excerpt.caption.trim() ? <PullRequestMarkdown markdown={excerpt.caption} /> : null}
      <View className="overflow-hidden rounded-xl border border-border-subtle bg-grouped-card">
        <View className="gap-1 border-b border-border-subtle px-3 py-3">
          <View className="flex-row items-center gap-2">
            <SymbolView name="doc.text" size={15} tintColorClassName="accent-icon-muted" />
            <Text className="min-w-0 flex-1 text-xs font-t3-medium" numberOfLines={1}>
              {excerpt.path.split("/").at(-1)}
            </Text>
            <Text className="text-2xs text-foreground-muted">
              {excerpt.start}–{excerpt.end}
            </Text>
          </View>
          {excerpt.path.includes("/") ? (
            <Text
              className="text-2xs text-foreground-muted"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {excerpt.path.slice(0, excerpt.path.lastIndexOf("/"))}
            </Text>
          ) : null}
        </View>
        {NativeDiff && data.rows.length ? (
          <View
            style={{ height: Math.min(360, data.rows.length * nativeReviewDiffStyle.rowHeight) }}
          >
            <NativeDiff
              appearanceScheme={themeAppearance}
              rowHeight={nativeReviewDiffStyle.rowHeight}
              contentWidth={2800}
              style={{ flex: 1 }}
              rowsJson={bridge.rowsJson}
              themeJson={bridge.themeJson}
              styleJson={bridge.styleJson}
              tokensPatchJson={bridge.tokensPatchJson}
              tokensResetKey={bridge.tokensResetKey}
              onDebug={bridge.onDebug}
            />
          </View>
        ) : (
          <Text className="p-3 text-xs text-foreground-muted">
            {loading
              ? `Loading ${excerpt.path}…`
              : `${excerpt.path}:${excerpt.start}–${excerpt.end} is not in the loaded diff.`}
          </Text>
        )}
      </View>
    </View>
  );
}
