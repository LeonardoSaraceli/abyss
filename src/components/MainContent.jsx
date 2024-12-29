import { useContext, useRef, useState, useEffect } from 'react'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StateContext } from './App'

export default function MainContent() {
  const {
    users,
    musics,
    albums,
    setCurrentVisualizer,
    getCreatorNames,
    currentMusic,
    setCurrentMusic,
    setSelectedMusic,
    togglePlayPause,
    setCurrentAlbum,
  } = useContext(StateContext)

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
  }, [musics, users, albums])

  return (
    <div
      id="main-content"
      style={
        currentMusic && Object.entries(currentMusic).length > 0
          ? { maxHeight: 'calc(100vh - 145px)' }
          : null
      }
    >
      {musics.length > 0 && (
        <div className="main-stuff">
          <h1>Músicas</h1>

          {showMusicsScroll && (
            <button id="scroll-left" onClick={() => scroll(musicsRef, 'left')}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}

          <ul ref={musicsRef}>
            {musics.map((music) => (
              <li
                key={music.id}
                onClick={() => {
                  if (!currentMusic || currentMusic.id !== music.id) {
                    setCurrentAlbum(null)
                    localStorage.removeItem('current-album')
                    localStorage.setItem('current-music', JSON.stringify(music))
                    setCurrentMusic(music)
                    setSelectedMusic(true)
                  } else {
                    togglePlayPause()
                  }
                }}
              >
                <img src={music.cover} alt={music.title} />
                <h4>{music.title}</h4>
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

      {users.length > 0 && (
        <div className="main-stuff">
          <h1>Perfis</h1>

          {showUsersScroll && (
            <button id="scroll-left" onClick={() => scroll(usersRef, 'left')}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}

          <ul ref={usersRef}>
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => handleOnClick('users', user.id, 'user')}
              >
                {user.profile ? (
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

      {albums.length > 0 && (
        <div className="main-stuff">
          <h1>Álbuns</h1>

          {showAlbumsScroll && (
            <button id="scroll-left" onClick={() => scroll(albumsRef, 'left')}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}

          <ul ref={albumsRef}>
            {albums.map((album) => (
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
