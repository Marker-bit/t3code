import { Pressable, View } from "react-native";
import { AppText as Text } from "../../components/AppText";
import { SymbolView } from "../../components/AppSymbol";
import { ListFilterMenu } from "../workspace/ListFilterMenu";
import type { ActivityFilter } from "./pullRequestActivityFilter";

export function PullRequestActivityFilters({
  value,
  onChange,
  hiddenCount,
}: {
  readonly value: ActivityFilter;
  readonly onChange: (value: ActivityFilter) => void;
  readonly hiddenCount: number;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between gap-2">
      <ListFilterMenu
        label={hiddenCount ? `${hiddenCount} hidden` : "Filter"}
        accessibilityLabel="Filter activity"
        icon
        actions={[
          {
            id: "kind",
            title: "Activity",
            subactions: [
              { id: "all", title: "All activity", state: value.kind === "all" ? "on" : "off" },
              {
                id: "comments",
                title: "Comments only",
                state: value.kind === "comments" ? "on" : "off",
              },
              {
                id: "commits",
                title: "Commits only",
                state: value.kind === "commits" ? "on" : "off",
              },
            ],
          },
          { id: "bots", title: "Bot comments", state: value.bots ? "on" : "off" },
          { id: "resolved", title: "Resolved or dismissed", state: value.resolved ? "on" : "off" },
        ]}
        onSelect={(id) => {
          if (id === "all" || id === "comments" || id === "commits")
            onChange({ ...value, kind: id });
          else if (id === "bots" || id === "resolved") onChange({ ...value, [id]: !value[id] });
        }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value.newestFirst ? "Newest first" : "Oldest first"}
        onPress={() => onChange({ ...value, newestFirst: !value.newestFirst })}
        className="min-h-11 flex-row items-center gap-1.5 active:opacity-70"
      >
        <SymbolView
          name={value.newestFirst ? "arrow.down" : "arrow.up"}
          size={12}
          tintColorClassName="accent-icon-muted"
        />
        <Text className="text-xs text-foreground-muted">
          {value.newestFirst ? "Newest first" : "Oldest first"}
        </Text>
      </Pressable>
    </View>
  );
}
