import {
    getMovies,
    getMoviesByMovieIdSessions,
    getMovieSessionsByMovieSessionId,
    postMovieSessionsByMovieSessionIdBookings,
    type Movie,
    type MovieSession,
    type MovieSessionDetails,
    type Seat
} from "~/client"

export default function useMovieCatalog() {
    const movies = ref<Movie[]>()
    const error = ref<string | null | undefined>()

    const getAllMovies = async (): Promise<Movie[]> => {
        if (movies.value) return movies.value

        try {
            movies.value = await getMovies({})
            return movies.value
        } catch (err) {
            const errorText = 'Ошибка загрузки фильмов.'
            error.value = errorText
            throw err;
        }
    }

    const findMovieById = (id: number): Movie | undefined => {
        return movies.value?.find(item => item.id === id)
    }

    const getMovieById = async (id: number): Promise<Movie | undefined> => {
        const cached = findMovieById(id)
        if (cached) return cached

        try {
            await getAllMovies()
            return findMovieById(id)
        } catch {
            return undefined
        }
    }

    const getMovieSessionsById = async (id: number): Promise<MovieSession[]> => {
        try {
            return await getMoviesByMovieIdSessions({ path: { movieId: Number(id) } })
        } catch (err) {
            const errorText = 'Ошибка загрузки сеансов фильма.'
            error.value = errorText
            throw err;
        }
    }

    const getSessionById = async (id: number): Promise<MovieSessionDetails> => {
        try {
            return await getMovieSessionsByMovieSessionId({ path: { movieSessionId: Number(id) } })
        } catch (err) {
            const errorText = 'Ошибка загрузки деталей сеанса.'
            error.value = errorText
            throw err;
        }
    }

    const postSessionBookingById = async (id: number, seats: Seat[]): Promise<unknown> => {
        try {
            return await postMovieSessionsByMovieSessionIdBookings({ path: { movieSessionId: Number(id) }, body: { seats } })
        } catch (err) {
            const errorText = 'Ошибка загрузки деталей сеанса.'
            error.value = errorText
            throw err;
        }
    }

    return {
        movies,
        error,
        getAllMovies,
        getMovieById,
        getMovieSessionsById,
        getSessionById,
        postSessionBookingById,
    }
}
