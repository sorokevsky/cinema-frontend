<template>
  <div class="flex flex-col gap-3">
    <template v-if="loading">
      <div class="mx-auto my-30">
        <span class="loading loading-dots loading-xl" />
      </div>
    </template>
    <template v-else>
      <h1 class="p-3 text-3xl font-medium text-center">
        Выбрать места
      </h1>
      <div class="card bg-base-300 p-3">
        <p>
          Фильм: {{ movie?.title }}<br>
          Кинотеатр: {{ cinema?.name }}<br>
          Время:
          {{ getFormattedDateString(session?.startTime || 0, "dd.MM, HH:mm") }}
          <br>
        </p>
      </div>
      <booking-component
        v-if="session?.seats && session?.bookedSeats"
        :seats="bookingSeats"
        :booked-seats="bookingBookedSeats"
        @selected-seats="handleSelectedSeats"
      />
      <div class="w-xs mx-auto flex flex-col gap-3">
        <button
          class="btn"
          :disabled="bookingLoading || !selectedSeats.length"
          @click="handleBooking"
        >
          <template v-if="bookingLoading">
            <span class="loading loading-spinner loading-xs" />
          </template>
          <template v-else>
            Забронировать
          </template>
        </button>
        <div
          v-if="errorMessage"
          role="alert"
          class="alert alert-error"
        >
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  getMovieSessionsByMovieSessionId,
  type Cinema,
  type Movie,
  type MovieSessionDetails,
  type PostMovieSessionsByMovieSessionIdBookingsError,
  type Seat,
} from '~/client'

const { getCinemaById } = useCinemaCatalog()
const { getMovieById, postSessionBookingById } = useMovieCatalog()

const session = ref<MovieSessionDetails>()
const cinema = ref<Cinema>()
const movie = ref<Movie>()
const loading = ref(true)
const bookingLoading = ref(false)
const selectedSeats = ref<Seat[]>([])
const errorMessage = ref<string>('')

const bookingSeats = computed(() => {
  if (!session.value?.seats) {
    return { rows: 0, seatsPerRow: 0 }
  }
  return {
    rows: session.value.seats.rows || 0,
    seatsPerRow: session.value.seats.seatsPerRow || 0,
  }
})

const bookingBookedSeats = computed(() => {
  return session.value?.bookedSeats || []
})

onMounted(async () => {
  const { bookingid } = useRoute().params
  session.value = await getMovieSessionsByMovieSessionId({
    path: { movieSessionId: Number(bookingid) },
  });
  [cinema.value, movie.value] = await Promise.all([
    getCinemaById(Number(session.value?.cinemaId)),
    getMovieById(Number(session.value?.movieId)),
  ])
  loading.value = false
})

const handleSelectedSeats = (seats: Seat[]) => {
  selectedSeats.value = seats
}

const handleBooking = async () => {
  if (!useCookie('token').value) return navigateTo('/login')

  try {
    bookingLoading.value = true
    await postSessionBookingById(
      Number(session.value?.id),
      selectedSeats.value,
    )

    navigateTo('/my-tickets')
  }
  catch (err: unknown) {
    const error = err as {
      data: PostMovieSessionsByMovieSessionIdBookingsError
    }
    errorMessage.value
      = error.data.message || error.data.error || 'Ошибка бронирования мест'
  }
  finally {
    bookingLoading.value = false
  }
}
</script>
