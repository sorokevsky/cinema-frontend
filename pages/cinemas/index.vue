<template>
  <div class="flex flex-col gap-3">
    <table-component :data="cinemasData" :columns="сolumns" :float="'right'" />
  </div>
</template>

<script setup lang="ts">
import type { Cinema } from "~/client";

const сolumns = [
  {
    key: "name",
    title: "Кинотеатр",
  },
  {
    key: "address",
    title: "Адрес",
  },
  {
    key: "id",
    float: "right",
    title: "",
    render: (cinema: Cinema) => {
      return h(
        "a",
        {
          href: `/cinemas/${cinema.id}`,
          class: "btn",
        },
        "Посмотреть сеансы"
      );
    },
  },
]

const { getAllCinemas } = useCinemaCatalog();
const cinemasData = ref<Cinema[]>([]);

onMounted(async () => {
  cinemasData.value = await getAllCinemas();
});
</script>
