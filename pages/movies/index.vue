<template>
  <div class="flex flex-col gap-3 card shadow bg-base-100 p-4">
    <template v-if="loading">
      <div class="mx-auto my-30">
        <span class="loading loading-dots loading-xl" />
      </div>
    </template>
    <template v-else>
      <table-component
        :data="moviesData"
        :columns="сolumns"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/client'

definePageMeta({
  title: 'Фильмы',
})

const сolumns = [
  {
    key: 'posterImage',
    title: '',
    render: (movie: Movie) =>
      h('img', {
        src: getFullUrlString(movie.posterImage!),
        alt: movie.title,
        class: 'object-cover rounded',
      }),
  },
  {
    key: 'title',
    title: 'Название',
    width: 200,
  },
  {
    key: 'lengthMinutes',
    title: 'Продолжительность',
    render: (movie: Movie) =>
      h('span', getTimeFromMinutesString(movie.lengthMinutes!)),
  },
  {
    key: 'rating',
    title: 'Рейтинг',
  },
  {
    key: 'id',
    float: 'right',
    title: '',
    render: (movie: Movie) => {
      return h(
        'a',
        {
          href: `/movies/${movie.id}`,
          class: 'btn',
        },
        'Посмотреть сеансы',
      )
    },
  },
] as TableColumn[]

const { getAllMovies } = useMovieCatalog()
const moviesData = ref<Movie[]>([])
const loading = ref(true)

onMounted(async () => {
  moviesData.value = await getAllMovies()
  loading.value = false
})
</script>
