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
    togglePlayPause
  } = useContext(StateContext)

  const musicsRef = useRef(null)
  const usersRef = useRef(null)
  const albumsRef = useRef(null)

  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)

  const scroll = (ref, direction) => {
    const scrollAmount = 590
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const updateButtonsVisibility = (ref) => {
    if (ref.current) {
      const scrollLeft = ref.current.scrollLeft
      const scrollWidth = ref.current.scrollWidth
      const clientWidth = ref.current.clientWidth

      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth)
    }
  }

  useEffect(() => {
    if (musicsRef.current) {
      updateButtonsVisibility(musicsRef)
    }

    if (usersRef.current) {
      updateButtonsVisibility(usersRef)
    }

    if (albumsRef.current) {
      updateButtonsVisibility(albumsRef)
    }
  }, [musics.length, users.length, albums.length])

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

  return (
    <div
      id="main-content"
      style={
        Object.entries(currentMusic).length > 0
          ? { maxHeight: 'calc(100vh - 145px)' }
          : null
      }
    >
      {musics.length > 0 && (
        <div className="main-stuff">
          <h1>Músicas</h1>

          <ul ref={musicsRef}>
            {showLeftButton && (
              <button
                id="scroll-left"
                onClick={() => scroll(musicsRef, 'left')}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            )}

            {musics.map((music) => (
              <li
                key={music.id}
                onClick={() => {
                  if (currentMusic.id !== music.id) {
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

            {showRightButton && (
              <button
                id="scroll-right"
                onClick={() => scroll(musicsRef, 'right')}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            )}
          </ul>
        </div>
      )}

      {users.length > 0 && (
        <div className="main-stuff">
          <h1>Perfis</h1>

          <ul ref={usersRef}>
            {showLeftButton && (
              <button id="scroll-left" onClick={() => scroll(usersRef, 'left')}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            )}

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

            {showRightButton && (
              <button
                id="scroll-right"
                onClick={() => scroll(usersRef, 'right')}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            )}
          </ul>
        </div>
      )}

      {albums.length > 0 && (
        <div className="main-stuff">
          <h1>Álbuns</h1>

          <ul ref={albumsRef}>
            {showLeftButton && (
              <button
                id="scroll-left"
                onClick={() => scroll(albumsRef, 'left')}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            )}

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

            {showRightButton && (
              <button
                id="scroll-right"
                onClick={() => scroll(albumsRef, 'right')}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
