import { useContext, useRef, useState, useEffect } from 'react'
import {
  faAngleLeft,
  faAngleRight,
  faMusic,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StateContext } from './App'

export default function MainContent() {
  const {
    users,
    albums,
    setCurrentVisualizer,
    getCreatorNames,
    currentMusic,
    setCurrentMusic,
    setSelectedMusic,
    togglePlayPause,
    setCurrentAlbum,
    audioRef,
    setCurrentQueueIndex,
    setMusicQueue,
    searchBar,
  } = useContext(StateContext)

  const [singles, setSingles] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/musics/singles`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.musics) {
          setSingles(data.musics)
        }
      })
      .catch((error) => console.error(error))
  }, [])

  const searchBarResults = () => {
    const lowerCaseQuery = searchBar.toLowerCase()

    const filteredMusics = singles.filter((music) =>
      music.title.toLowerCase().includes(lowerCaseQuery)
    )

    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(lowerCaseQuery)
    )

    const filteredAlbums = albums.filter((album) =>
      album.title.toLowerCase().includes(lowerCaseQuery)
    )

    return {
      musics: filteredMusics,
      users: filteredUsers,
      albums: filteredAlbums,
    }
  }

  const {
    musics: filteredMusics,
    users: filteredUsers,
    albums: filteredAlbums,
  } = searchBarResults()

  const musicsRef = useRef(null)
  const usersRef = useRef(null)
  const albumsRef = useRef(null)

  const [showMusicsScroll, setShowMusicsScroll] = useState(false)
  const [showUsersScroll, setShowUsersScroll] = useState(false)
  const [showAlbumsScroll, setShowAlbumsScroll] = useState(false)

  const scroll = (ref, direction) => {
    const scrollAmount = 828

    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleOnClick = (endpoint, id, obj) => {
    fetch(`${import.meta.env.VITE_API_URL}/${endpoint}/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
      })
      .then((data) => {
        if (data) {
          localStorage.setItem('current-visualizer', JSON.stringify(data[obj]))
          setCurrentVisualizer(data[obj])
        }
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    const checkScrollVisibility = (ref, setShowScroll) => {
      if (ref.current) {
        const { scrollWidth, clientWidth } = ref.current
        setShowScroll(scrollWidth > clientWidth)
      }
    }

    checkScrollVisibility(musicsRef, setShowMusicsScroll)
    checkScrollVisibility(usersRef, setShowUsersScroll)
    checkScrollVisibility(albumsRef, setShowAlbumsScroll)

    const handleResize = () => {
      checkScrollVisibility(musicsRef, setShowMusicsScroll)
      checkScrollVisibility(usersRef, setShowUsersScroll)
      checkScrollVisibility(albumsRef, setShowAlbumsScroll)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [filteredMusics, filteredUsers, filteredAlbums])

  const truncateWord = (word) => {
    return word.length > 20 ? word.split('').slice(0, 17).join('').trim() + '...' : word
  }

  return (
    <div
      id="main-content"
      style={
        currentMusic && Object.entries(currentMusic).length > 0
          ? { maxHeight: 'calc(100vh - 145px)' }
          : null
      }
    >
      {filteredMusics.length > 0 && (
        <div className="main-stuff">
          <h1>Singles</h1>

          {showMusicsScroll && (
            <button id="scroll-left" onClick={() => scroll(musicsRef, 'left')}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}

          <ul ref={musicsRef}>
            {filteredMusics.map((music, index) => (
              <li
                key={music.id}
                onClick={() => {
                  const audio = audioRef.current
                  if (audio && !audio.paused) {
                    audio.pause()
                  }

                  if (!currentMusic || currentMusic.id !== music.id) {
                    setCurrentAlbum(null)
                    localStorage.removeItem('current-album')

                    localStorage.setItem(
                      'music-queue',
                      JSON.stringify(filteredMusics)
                    )
                    setMusicQueue(filteredMusics)

                    localStorage.setItem(
                      'current-queue-index',
                      JSON.stringify(index)
                    )
                    setCurrentQueueIndex(index)

                    localStorage.setItem('current-music', JSON.stringify(music))
                    setCurrentMusic(music)
                    setSelectedMusic(true)

                    if (audio) {
                      audio.src = music.audio || music.music_url
                      audio.load()

                      audio.oncanplaythrough = () => {
                        audio.play().catch((error) => {
                          console.error(
                            'Erro ao tentar reproduzir a música:',
                            error
                          )
                        })
                      }
                    }
                  } else {
                    togglePlayPause()
                  }
                }}
              >
                {music.cover ? (
                  <img src={music.cover} alt={music.title} />
                ) : (
                  <div>
                    <FontAwesomeIcon icon={faMusic} />
                  </div>
                )}
                <h4>{truncateWord(music.title)}</h4>

                <span>{getCreatorNames(music.id)}</span>
              </li>
            ))}
          </ul>

          {showMusicsScroll && (
            <button
              id="scroll-right"
              onClick={() => scroll(musicsRef, 'right')}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          )}
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="main-stuff">
          <h1>Perfis</h1>

          {showUsersScroll && (
            <button id="scroll-left" onClick={() => scroll(usersRef, 'left')}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}

          <ul ref={usersRef}>
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => handleOnClick('users', user.id, 'user')}
              >
                {user.picture ? (
                  <img
                    id="main-profile-picture"
                    src={user.picture}
                    alt={user.name}
                  />
                ) : (
                  <h2 id="main-profile-text">{user.name[0].toUpperCase()}</h2>
                )}
                <h4>{user.name}</h4>
              </li>
            ))}
          </ul>

          {showUsersScroll && (
            <button id="scroll-right" onClick={() => scroll(usersRef, 'right')}>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          )}
        </div>
      )}

      {filteredAlbums.length > 0 && (
        <div className="main-stuff">
          <h1>Álbuns</h1>

          {showAlbumsScroll && (
            <button id="scroll-left" onClick={() => scroll(albumsRef, 'left')}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}

          <ul ref={albumsRef}>
            {filteredAlbums.map((album) => (
              <li
                key={album.id}
                onClick={() => handleOnClick('albums', album.id, 'album')}
              >
                <img src={album.cover} alt={album.title} />
                <h4>{album.title}</h4>
                <span>{getCreatorNames(album.id)}</span>
              </li>
            ))}
          </ul>

          {showAlbumsScroll && (
            <button
              id="scroll-right"
              onClick={() => scroll(albumsRef, 'right')}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
