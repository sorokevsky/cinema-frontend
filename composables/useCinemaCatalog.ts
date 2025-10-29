import { getCinemas, getCinemasByCinemaIdSessions, type Cinema, type MovieSession } from "~/client"

export default function useCinemaCatalog() {
    const cinemas = ref<Cinema[]>()
    const error = ref<string | null | undefined>()

    const getAllCinemas = async (): Promise<Cinema[]> => {
        if (cinemas.value) return cinemas.value

        try {
            cinemas.value = await getCinemas({})
            return cinemas.value
        } catch (err) {
            const errorText = 'Ошибка загрузки кинотеатров.'
            error.value = errorText
            throw err;
        }
    }

    const findCinemaById = (id: number): Cinema | undefined => {
        return cinemas.value?.find(item => item.id === id)
    }

    const getCinemaById = async (id: number): Promise<Cinema | undefined> => {
        const cached = findCinemaById(id)
        if (cached) return cached

        try {
            await getAllCinemas()
            return findCinemaById(id)
        } catch {
            return undefined
        }
    }

    const getCinemaSessionsById = async (id: number): Promise<MovieSession[]> => {
        try {
            return await getCinemasByCinemaIdSessions({ path: { cinemaId: Number(id) } })
        } catch (err) {
            const errorText = 'Ошибка загрузки сеансов кинотеатра.'
            error.value = errorText
            throw err;
        }
    }

    return {
        cinemas,
        error,
        getAllCinemas,
        getCinemaById,
        getCinemaSessionsById
    }
}
