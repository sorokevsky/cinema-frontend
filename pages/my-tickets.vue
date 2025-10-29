<template>
  <div class="flex flex-col gap-3">
    <template v-if="loading">
      <div class="mx-auto my-30">
        <span class="loading loading-dots loading-xl" />
      </div>
    </template>
    <template v-else>
      <h1 class="p-3 text-3xl font-medium text-center">
        Мои билеты
      </h1>

      <div class="divider divider-start">
        Не оплаченные
      </div>
      <table-component
        :data="unpaidTickets"
        :columns="unpaidTicketsColumns"
      />

      <div class="divider divider-start">
        Будущие
      </div>
      <table-component
        :data="futureTickets"
        :columns="defaultColumns"
      />

      <div class="divider divider-start">
        Прошедшие
      </div>
      <table-component
        :data="pastTickets"
        :columns="defaultColumns"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { isBefore, isAfter } from 'date-fns'

import {
  getMeBookings,
  postBookingsByBookingIdPayments,
  type Booking,
  type Cinema,
  type Movie,
  type MovieSessionDetails,
} from '~/client'

definePageMeta({
  middleware: ['auth'],
})

const unpaidTicketsColumns = [
  {
    key: 'movieSessionId',
    title: '',
    width: 250,
    render: (booking: EnrichedBooking) => {
      return h(
        'div',
        {
          class: 'flex flex-col gap-1',
        },
        [
          h('span', booking.movie?.title),
          h('span', booking.cinema?.name),
          h(
            'span',
            getFormattedDateString(
              booking.session?.startTime || 0,
              'dd.MM, HH:mm',
            ),
          ),
        ],
      )
    },
  },
  {
    key: 'seats',
    title: '',
    render: (booking: EnrichedBooking) => {
      return h(
        'div',
        {
          class: 'flex flex-col gap-1',
        },
        booking.seats?.map(seat =>
          h('span', `Ряд ${seat.rowNumber} место ${seat.seatNumber}`),
        ),
      )
    },
  },
  {
    key: 'id',
    title: '',
    render: (booking: EnrichedBooking) => {
      return h(
        'button',
        {
          onClick: () => paymentBooking(booking),
          class: 'btn',
        },
        'Оплатить',
      )
    },
  },
  {
    key: 'bookedAt',
    title: '',
    render: (booking: EnrichedBooking) => {
      return h(
        'span',
        getFormattedDateString(booking.bookedAt || 0, 'HH:mm'),
      )
    },
  },
]

const defaultColumns = [
  {
    key: 'movieSessionId',
    title: '',
    width: 250,
    render: (booking: EnrichedBooking) => {
      return h(
        'div',
        {
          class: 'flex flex-col gap-1',
        },
        [
          h('span', booking.movie?.title),
          h('span', booking.cinema?.name),
          h(
            'span',
            getFormattedDateString(
              booking.session?.startTime || 0,
              'dd.MM, HH:mm',
            ),
          ),
        ],
      )
    },
  },
  {
    key: 'seats',
    title: '',
    render: (booking: EnrichedBooking) => {
      return h(
        'span',
        {
          class: 'flex flex-col gap-1',
        },
        booking.seats?.map(seat =>
          h('span', `Ряд ${seat.rowNumber} место ${seat.seatNumber}`),
        ),
      )
    },
  },
]

const { settings } = useSettingsStore()
const { getCinemaById } = useCinemaCatalog()
const { getSessionById, getMovieById } = useMovieCatalog()

interface EnrichedBooking extends Booking {
  movie?: Movie
  cinema?: Cinema
  session?: MovieSessionDetails
}

const enrichedBookings = ref<EnrichedBooking[]>([])
const loading = ref<boolean>(true)

const unpaidTickets = computed(() => {
  if (!enrichedBookings.value?.length) {
    return []
  }
  return enrichedBookings.value.filter((booking: EnrichedBooking) => !booking.isPaid)
})

const futureTickets = computed(() => {
  if (!enrichedBookings.value?.length) {
    return []
  }
  return enrichedBookings.value.filter((booking: EnrichedBooking) => booking.isPaid && isAfter(new Date(booking.session!.startTime!), new Date()))
})
const pastTickets = computed(() => {
  if (!enrichedBookings.value?.length) {
    return []
  }
  return enrichedBookings.value.filter((booking: EnrichedBooking) => booking.isPaid && isBefore(new Date(booking.session!.startTime!), new Date()))
})

onMounted(async () => {
  console.log(settings)
  try {
    const bookings = await getMeBookings({})
    bookings.map(async (booking: Booking) => {
      const session = await getSessionById(Number(booking.movieSessionId))
      const [movie, cinema] = await Promise.all([
        getMovieById(Number(session.movieId)),
        getCinemaById(Number(session.cinemaId)),
      ])
      enrichedBookings.value.push({
        ...booking,
        movie,
        cinema,
        session,
      })
    })
  }
  catch {
    navigateTo('/login')
  }
  finally {
    loading.value = false
  }
})

const paymentBooking = async (booking: Booking) => {
  try {
    await postBookingsByBookingIdPayments({
      path: { bookingId: String(booking.id) },
    })
    booking.isPaid = true
  }
  catch (err) {
    alert(err)
  }
}
</script>
