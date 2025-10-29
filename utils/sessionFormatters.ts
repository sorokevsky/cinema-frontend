import type { MovieSession, Cinema, Movie } from '~/client'
import { compareAsc, parse } from 'date-fns'

interface FormattedSession {
  id: number
  time: string
}

interface CinemaSessions {
  cinema: Cinema
  sessions: FormattedSession[]
}

interface MovieSessions {
  movie: Movie
  sessions: FormattedSession[]
}

interface DateGroupWithCinemas {
  date: string
  cinemas: CinemaSessions[]
}

interface DateGroupWithMovies {
  date: string
  movies: MovieSessions[]
}

export const getSessionsForMovieGroupedByCinemas = (
  movieId: number,
  allSessions: MovieSession[],
  allCinemas: Cinema[],
): DateGroupWithCinemas[] => {
  const movieSessions = allSessions.filter(session => session.movieId === movieId)
  return groupSessionsByDateAndCinemas(movieSessions, allCinemas)
}

export const getSessionsForCinemaGroupedByMovies = (
  cinemaId: number,
  allSessions: MovieSession[],
  allMovies: Movie[],
): DateGroupWithMovies[] => {
  const cinemaSessions = allSessions.filter(session => session.cinemaId === cinemaId)
  return groupSessionsByDateAndMovies(cinemaSessions, allMovies)
}

const groupSessionsByDateAndCinemas = (
  sessions: MovieSession[],
  cinemas: Cinema[],
): DateGroupWithCinemas[] => {
  const dateMap = new Map<string, { originalDate: Date, cinemaMap: Map<number, FormattedSession[]> }>()

  sessions.forEach((session) => {
    const formatted = safeFormatDate(session.startTime)
    if (!formatted) return

    if (!dateMap.has(formatted.date)) {
      dateMap.set(formatted.date, {
        originalDate: parse(formatted.date, 'dd.MM', new Date()),
        cinemaMap: new Map()
      })
    }

    const dateData = dateMap.get(formatted.date)!
    const cinemaMap = dateData.cinemaMap

    if (!cinemaMap.has(Number(session.cinemaId))) {
      cinemaMap.set(Number(session.cinemaId), [])
    }

    cinemaMap.get(Number(session.cinemaId))!.push({
      id: Number(session.id),
      time: formatted.time,
    })
  })

  return Array.from(dateMap.entries())
    .map(([date, { originalDate, cinemaMap }]) => {
      const cinemasWithSessions: CinemaSessions[] = Array.from(cinemaMap.entries())
        .map(([cinemaId, sessions]) => {
          const cinema = cinemas.find(c => c.id === cinemaId)
          return {
            cinema: cinema || { id: cinemaId, name: 'Неизвестный кинотеатр' } as Cinema,
            sessions: sessions.sort((a, b) => a.time.localeCompare(b.time)),
          }
        })
        .filter(item => item.cinema)
        .sort((a, b) => a.cinema.name!.localeCompare(b.cinema.name!))

      return {
        date,
        cinemas: cinemasWithSessions,
        originalDate
      }
    })
    .sort((a, b) => compareAsc(a.originalDate, b.originalDate))
    .map(({ originalDate, ...item }) => item as DateGroupWithCinemas)
}

const groupSessionsByDateAndMovies = (
  sessions: MovieSession[],
  movies: Movie[],
): DateGroupWithMovies[] => {
  const dateMap = new Map<string, { originalDate: Date, movieMap: Map<number, FormattedSession[]> }>()

  sessions.forEach((session) => {
    const formatted = safeFormatDate(session.startTime)
    if (!formatted) return

    if (!dateMap.has(formatted.date)) {
      dateMap.set(formatted.date, {
        originalDate: parse(formatted.date, 'dd.MM', new Date()),
        movieMap: new Map()
      })
    }

    const dateData = dateMap.get(formatted.date)!
    const movieMap = dateData.movieMap

    if (!movieMap.has(Number(session.movieId))) {
      movieMap.set(Number(session.movieId), [])
    }

    movieMap.get(Number(session.movieId))!.push({
      id: Number(session.id),
      time: formatted.time,
    })
  })

  return Array.from(dateMap.entries())
    .map(([date, { originalDate, movieMap }]) => {
      const moviesWithSessions: MovieSessions[] = Array.from(movieMap.entries())
        .map(([movieId, sessions]) => {
          const movie = movies.find(m => m.id === movieId)
          return {
            movie: movie || { id: movieId, title: 'Неизвестный фильм' } as Movie,
            sessions: sessions.sort((a, b) => a.time.localeCompare(b.time)),
          }
        })
        .filter(item => item.movie)
        .sort((a, b) => a.movie.title!.localeCompare(b.movie.title!))

      return {
        date,
        movies: moviesWithSessions,
        originalDate
      }
    })
    .sort((a, b) => compareAsc(a.originalDate, b.originalDate))
    .map(({ originalDate, ...item }) => item as DateGroupWithMovies)
}

const safeFormatDate = (dateString: string | undefined): { date: string, time: string } | null => {
  if (!dateString) return null

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return null

    return {
      date: getFormattedDateString(date, 'dd.MM'),
      time: getFormattedDateString(date, 'HH:mm'),
    }
  }
  catch {
    return null
  }
}