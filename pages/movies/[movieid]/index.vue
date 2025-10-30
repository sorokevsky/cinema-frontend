<template>
  <div class="flex flex-col gap-3 card shadow bg-base-100 p-4">
    <template v-if="loading">
      <div class="mx-auto my-30">
        <span class="loading loading-dots loading-xl" />
      </div>
    </template>
    <template v-else>
      <div class="hero justify-start card bg-base-300">
        <div class="hero-content flex-col lg:flex-row">
          <img
            class="object-cover rounded"
            :src="getFullUrlString(movie?.posterImage!)"
          >
          <div>
            <h1 class="text-3xl font-medium">
              {{ movie?.title }}
            </h1>
            <p class="py-6">
              {{ movie?.description }}
            </p>
            <p class="py-6">
              Год: {{ movie?.year }}<br>
              Продолжительность:
              {{ getTimeFromMinutesString(movie?.lengthMinutes || 0) }}<br>
              Рейтинг: {{ movie?.rating }}<br>
            </p>
          </div>
        </div>
      </div>
      <template
        v-for="(value, index) in sortedSessions"
        :key="index"
      >
        <div class="divider divider-start">
          {{ value.date }}
        </div>
        <table-component
          :data="value.cinemas"
          :columns="columns"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Cinema, Movie, MovieSession } from '~/client'

interface CinemaWithSessions {
  cinema: Cinema
  sessions: Array<{
    id: number
    time: string
  }>
}

const columns = [
  {
    key: 'cinema',
    title: '',
    render: (row: CinemaWithSessions) => h('span', row.cinema.name),
  },
  {
    key: 'sessions',
    title: '',
    render: (row: CinemaWithSessions) => {
      return h(
        'div',
        {
          class: 'flex flex-wrap gap-3 justify-end',
        },
        row.sessions.map(session =>
          h(
            'a',
            {
              href: `/movies/${Number(movie.value?.id)}/bookings/${session.id}`,
              class: 'btn',
              key: session.id,
            },
            session.time,
          ),
        ),
      )
    },
  },
] as unknown as TableColumn[]

const { getAllCinemas } = useCinemaCatalog()
const { getMovieById, getMovieSessionsById } = useMovieCatalog()

const sessions = ref<MovieSession[]>()
const movie = ref<Movie>()
const cinemas = ref<Cinema[]>()
const sortedSessions = ref()
const loading = ref(true)

onMounted(async () => {
  const { movieid } = useRoute().params;
  [cinemas.value, movie.value, sessions.value] = await Promise.all([
    getAllCinemas(),
    getMovieById(Number(movieid)),
    getMovieSessionsById(Number(movieid)),
  ])

  loading.value = false

  sortedSessions.value = getSessionsForMovieGroupedByCinemas(
    Number(movieid),
    sessions.value,
    cinemas.value,
  )
})
</script>
