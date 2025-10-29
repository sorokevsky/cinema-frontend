<template>
  <div>
    <template v-if="data.length">
      <table class="table">
        <thead>
          <tr>
            <th v-for="column in props.columns" :key="column.key">
              {{ column.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in props.data" :key="getItemId(item)">
            <td
              v-for="column in props.columns"
              :key="column.key"
              :class="{
                'text-left': column.float === 'left',
                'text-right': column.float === 'right',
              }"
              :style="{width: column.width + 'px'}"
            >
              <template v-if="column.render">
                <component :is="column.render(item)" />
              </template>
              <template v-else>
                {{ getValue(item, column.key) }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p class="text-center content-center h-25">
        {{ emptyMessage || "Нет данных" }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
type TableData = Record<string, unknown> & { id?: string | number };
type Float = "right" | "left";

interface TableColumn<T = TableData> {
  key: string;
  title: string;
  float?: Float;
  width?: number;
  render?: (item: T) => VNode;
}

interface TableProps<T = TableData> {
  data: T[];
  columns: TableColumn<T>[];
  emptyMessage?: string;
}

const props = defineProps<TableProps<TableData>>();

const getItemId = (item: TableData): string | number => {
  return item.id ?? Math.random();
};

const getValue = (obj: TableData, path: string): unknown => {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as TableData)[part];
    }
    return undefined;
  }, obj);
};
</script>
