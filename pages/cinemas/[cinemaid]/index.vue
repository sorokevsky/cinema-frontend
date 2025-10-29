<template>
  <div class="flex flex-col gap-3">
    <template v-if="loading">
      <div class="mx-auto my-30">
        <span class="loading loading-dots loading-xl" />
      </div>
    </template>
    <template v-else>
      <h1 class="p-3 text-3xl font-medium text-center">
        {{ cinema?.name }}
      </h1>
      <template
        v-for="(value, index) in sortedSessions"
        :key="index"
      >
        <div class="divider divider-start">
          {{ value.date }}
        </div>
        <table-component
          :data="value.movies"
          :columns="columns"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Cinema, Movie, MovieSession } from '~/client'

interface MovieWithSessions {
  movie: Movie
  sessions: Array<{
    id: number
    time: string
  }>
}

const columns = [
  {
    key: 'posterImage',
    title: '',
    render: (row: MovieWithSessions) =>
      h('img', {
        src: getFullUrlString(row.movie.posterImage!),
        alt: row.movie.title,
        class: 'object-cover rounded',
      }),
  },
  {
    key: 'movie',
    title: '',
    render: (row: MovieWithSessions) => h('span', row.movie.title),
  },
  {
    key: 'sessions',
    title: '',
    render: (row: MovieWithSessions) => {
      return h(
        'div',
        {
          class: 'flex flex-wrap gap-3 justify-end',
        },
        row.sessions.map(session =>
          h(
            'a',
            {
              href: `/movies/${Number(row.movie.id)}/bookings/${session.id}`,
              class: 'btn',
              key: session.id,
            },
            session.time,
          ),
        ),
      )
    },
  },
]

const { getCinemaSessionsById, getCinemaById } = useCinemaCatalog()
const { getAllMovies } = useMovieCatalog()

const sessions = ref<MovieSession[]>()
const movies = ref<Movie[]>()
const cinema = ref<Cinema>()
const sortedSessions = ref()
const loading = ref(true)

onMounted(async () => {
  const { cinemaid } = useRoute().params;
  [cinema.value, movies.value, sessions.value] = await Promise.all([
    getCinemaById(Number(cinemaid)),
    getAllMovies(),
    getCinemaSessionsById(Number(cinemaid)),
  ])
  loading.value = false

  sortedSessions.value = getSessionsForCinemaGroupedByMovies(
    Number(cinemaid),
    sessions.value,
    movies.value,
  )

  console.log(cinema.value, movies.value, sessions.value, sortedSessions.value)
})
</script>
