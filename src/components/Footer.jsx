import { useContext, useEffect, useCallback } from 'react'
import { StateContext } from './App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPause,
  faPlay,
  faStepForward,
  faStepBackward,
} from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  const {
    currentMusic,
    getCreatorNames,
    isPlaying,
    audioRef,
    togglePlayPause,
    volume,
    handleVolumeChange,
    currentQueueIndex,
    musicQueue,
    setCurrentQueueIndex,
    setCurrentMusic,
    setSelectedMusic,
    currentAlbum,
  } = useContext(StateContext)

  const playNext = useCallback(() => {
    if (currentQueueIndex < musicQueue.length - 1) {
      const nextIndex = currentQueueIndex + 1
      setCurrentQueueIndex(nextIndex)
      localStorage.setItem('current-queue-index', nextIndex)

      setCurrentMusic(musicQueue[nextIndex])
      localStorage.setItem(
        'current-music',
        JSON.stringify(musicQueue[nextIndex])
      )

      setSelectedMusic(true)
    }
  }, [
    currentQueueIndex,
    musicQueue,
    setCurrentMusic,
    setCurrentQueueIndex,
    setSelectedMusic,
  ])

  const playPrevious = () => {
    if (currentQueueIndex > 0) {
      const previousIndex = currentQueueIndex - 1
      setCurrentQueueIndex(previousIndex)
      localStorage.setItem(
        'current-music',
        JSON.stringify('current-queue-index', previousIndex)
      )

      setCurrentMusic(musicQueue[previousIndex])
      localStorage.setItem(
        'current-music',
        JSON.stringify(musicQueue[previousIndex])
      )

      setSelectedMusic(true)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = playNext
    }
  }, [audioRef, playNext])

  return (
    <>
      {currentMusic && Object.entries(currentMusic).length > 0 && (
        <footer>
          <div id="music-title">
            <img
              src={currentMusic.cover || currentMusic.music_cover}
              alt={currentMusic.title || currentMusic.music_title}
            />

            <div>
              <h6>{currentMusic.title || currentMusic.music_title}</h6>

              <a>{getCreatorNames(currentMusic.id || currentMusic.music_id)}</a>
            </div>
          </div>

          <div id="music-controlls">
            <FontAwesomeIcon
              className={`footer-pass-music ${!currentAlbum ? 'disabled' : ''}`}
              icon={faStepBackward}
              onClick={playPrevious}
            />

            <FontAwesomeIcon
              id="footer-play-music"
              icon={isPlaying ? faPause : faPlay}
              onClick={togglePlayPause}
            />

            <FontAwesomeIcon
              className={`footer-pass-music ${!currentAlbum ? 'disabled' : ''}`}
              icon={faStepForward}
              onClick={playNext}
            />
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            title="Volume"
            id="volume-control"
          />

          <audio ref={audioRef} style={{ display: 'none' }} />
        </footer>
      )}
    </>
  )
}
