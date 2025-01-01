/* eslint-disable react-refresh/only-export-components */
import { Route, Routes } from 'react-router-dom'
import RegisterWrapper from './RegisterWrapper'
import Login from './Login'
import MainWrapper from './MainWrapper'
import { createContext, useEffect, useRef, useState } from 'react'

export const StateContext = createContext()

export default function App() {
  const [user, setUser] = useState({})
  const [users, setUsers] = useState([])
  const [usersMusics, setUsersMusics] = useState([])
  const [usersAlbums, setUsersAlbums] = useState([])
  const [musics, setMusics] = useState([])
  const [albums, setAlbums] = useState([])
  const [currentVisualizer, setCurrentVisualizer] = useState(
    JSON.parse(localStorage.getItem('current-visualizer')) || {}
  )
  const [currentMusic, setCurrentMusic] = useState(
    JSON.parse(localStorage.getItem('current-music')) || {}
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(() => {
    return parseFloat(localStorage.getItem('music-volume')) || 0.25
  })
  const [selectedMusic, setSelectedMusic] = useState(false)
  const [musicQueue, setMusicQueue] = useState(
    JSON.parse(localStorage.getItem('music-queue')) || []
  )
  const [currentQueueIndex, setCurrentQueueIndex] = useState(
    JSON.parse(localStorage.getItem('current-queue-index')) || 0
  )
  const [currentAlbum, setCurrentAlbum] = useState(
    JSON.parse(localStorage.getItem('current-album')) || null
  )
  const [searchBar, setSearchBar] = useState('')

  const audioRef = useRef(null)

  const fetchAPI = async (endpoint, setter) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      setter(data[endpoint])
    } catch (error) {
      console.error(error)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
        setIsPlaying(true)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const volumeBarRef = useRef(null)

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    localStorage.setItem('music-volume', newVolume)

    const ratio = newVolume * 100

    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }

    if (volumeBarRef.current) {
      volumeBarRef.current.style.background = `linear-gradient(90deg, #ffffff ${ratio}%, #292929 ${ratio}%)`
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''

      if (currentMusic && (currentMusic.url || currentMusic.music_url)) {
        audioRef.current.src = currentMusic.url || currentMusic.music_url
        audioRef.current.load()
        setIsPlaying(false)
      }
    }
  }, [currentMusic])

  useEffect(() => {
    if (!isPlaying && selectedMusic) {
      setSelectedMusic(false)
      togglePlayPause()
    }
  }, [isPlaying, selectedMusic])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users/info`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
      })
      .then((data) => {
        if (data) {
          setUser(data.user)
        }
      })
      .catch((error) => console.error(error))

    fetchAPI('users', setUsers)
    fetchAPI('usersMusics', setUsersMusics)
    fetchAPI('usersAlbums', setUsersAlbums)
    fetchAPI('musics', setMusics)
    fetchAPI('albums', setAlbums)
  }, [])

  const getCreatorNames = (id) => {
    const relatedUsers = [...usersMusics, ...usersAlbums]
      .filter((relation) => relation.musicid === id || relation.albumid === id)
      .map((relation) => relation.userid)

    return users
      .filter((user) => relatedUsers.includes(user.id))
      .map((user) => user.name)
      .join(', ')
  }

  useEffect(() => {
    localStorage.setItem('music-queue', JSON.stringify(musicQueue))
  }, [musicQueue])

  useEffect(() => {
    if (audioRef.current && isPlaying && audioRef.current.volume !== volume) {
      audioRef.current.volume = volume
    }
  }, [volume, isPlaying])

  useEffect(() => {
    localStorage.setItem(
      'current-queue-index',
      JSON.stringify(currentQueueIndex)
    )
  }, [currentQueueIndex])

  useEffect(() => {
    const storedQueue = JSON.parse(localStorage.getItem('music-queue'))
    const storedIndex = JSON.parse(localStorage.getItem('current-queue-index'))

    if (storedQueue && storedIndex !== null) {
      setMusicQueue(storedQueue)
      setCurrentQueueIndex(storedIndex)

      if (!currentMusic) {
        setCurrentMusic(storedQueue[storedIndex])
      }
    }
  }, [currentMusic])

  return (
    <StateContext.Provider
      value={{
        user,
        users,
        musics,
        albums,
        currentVisualizer,
        setCurrentVisualizer,
        getCreatorNames,
        currentMusic,
        setCurrentMusic,
        isPlaying,
        setIsPlaying,
        audioRef,
        togglePlayPause,
        handleVolumeChange,
        volume,
        setSelectedMusic,
        musicQueue,
        setMusicQueue,
        currentQueueIndex,
        setCurrentQueueIndex,
        currentAlbum,
        setCurrentAlbum,
        setVolume,
        volumeBarRef,
        searchBar,
        setSearchBar,
      }}
    >
      <Routes>
        <Route path="/" element={<MainWrapper />}></Route>

        <Route path="/register" element={<RegisterWrapper />}></Route>

        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </StateContext.Provider>
  )
}
