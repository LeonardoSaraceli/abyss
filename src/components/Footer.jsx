import { useContext, useEffect, useCallback, useState, useRef } from 'react'
import { StateContext } from './App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPause,
  faPlay,
  faStepForward,
  faStepBackward,
  faVolumeLow,
  faVolumeXmark,
  faMusic,
} from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  const {
    currentMusic,
    getCreatorNames,
    isPlaying,
    setIsPlaying,
    audioRef,
    togglePlayPause,
    volume,
    handleVolumeChange,
    currentQueueIndex,
    musicQueue,
    setCurrentQueueIndex,
    setCurrentMusic,
    setSelectedMusic,
    setVolume,
    volumeBarRef,
    truncateWord,
  } = useContext(StateContext)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const progressBarRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current

    if (audio && currentMusic) {
      audio.src = currentMusic.audio || currentMusic.music_url
      audio.load()

      const handleMetadata = () => {
        setDuration(audio.duration)
        setCurrentTime(0)
        progressBarRef.current.style.background = `linear-gradient(90deg, #ffffff 0%, #292929 0%)`
      }

      const handleTimeUpdate = () => {
        setCurrentTime(Math.floor(audio.currentTime))
        const ratio = (audio.currentTime / audio.duration) * 100
        progressBarRef.current.style.background = `linear-gradient(90deg, #ffffff ${ratio}%, #292929 ${ratio}%)`
      }

      audio.addEventListener('loadedmetadata', handleMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)

      return () => {
        audio.removeEventListener('loadedmetadata', handleMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [audioRef, currentMusic])

  useEffect(() => {
    const updateVolumeBarStyle = () => {
      const ratio = volume * 100
      if (volumeBarRef.current) {
        volumeBarRef.current.style.background = `linear-gradient(90deg, #ffffff ${ratio}%, #292929 ${ratio}%)`
      }
    }

    updateVolumeBarStyle()
  }, [volume, volumeBarRef])

  const handleSeek = (e) => {
    const audio = audioRef.current

    if (audio) {
      audio.currentTime = e.target.value
      setCurrentTime(Math.floor(audio.currentTime))

      const ratio = (audio.currentTime / audio.duration) * 100

      if (progressBarRef.current) {
        progressBarRef.current.style.background = `linear-gradient(90deg, #ffffff ${ratio}%, #292929 ${ratio}%)`
      }
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const playNext = useCallback(() => {
    const audio = audioRef.current

    if (currentQueueIndex === musicQueue.length - 1) {
      setCurrentQueueIndex(0)
      localStorage.setItem('current-queue-index', 0)
      setCurrentMusic(musicQueue[0])
      localStorage.setItem('current-music', JSON.stringify(musicQueue[0]))
      setSelectedMusic(true)

      if (audio) {
        const handleCanPlay = () => {
          audio.pause()
          setCurrentTime(0)
          audio.removeEventListener('canplay', handleCanPlay)
          setIsPlaying(false)
        }

        audio.addEventListener('canplay', handleCanPlay)
        audio.load()
      }
    } else if (currentQueueIndex < musicQueue.length - 1) {
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
    audioRef,
    currentQueueIndex,
    musicQueue,
    setCurrentMusic,
    setCurrentQueueIndex,
    setIsPlaying,
    setSelectedMusic,
  ])

  const playPrevious = () => {
    const audio = audioRef.current

    if (audio) {
      if (currentTime > 5) {
        audio.currentTime = 0
        setCurrentTime(0)
        const ratio = 0
        if (progressBarRef.current) {
          progressBarRef.current.style.background = `linear-gradient(90deg, #ffffff ${ratio}%, #292929 ${ratio}%)`
        }
      } else if (currentQueueIndex > 0) {
        const previousIndex = currentQueueIndex - 1
        setCurrentQueueIndex(previousIndex)
        localStorage.setItem('current-queue-index', previousIndex)

        setCurrentMusic(musicQueue[previousIndex])
        localStorage.setItem(
          'current-music',
          JSON.stringify(musicQueue[previousIndex])
        )

        setSelectedMusic(true)
      }
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
            {currentMusic.cover || currentMusic.music_cover ? (
              <img
                loading="lazy"
                src={currentMusic.cover || currentMusic.music_cover}
                alt={currentMusic.title || currentMusic.music_title}
              />
            ) : (
              <figure>
                <FontAwesomeIcon icon={faMusic} />
              </figure>
            )}

            <div>
              <h6>
                {truncateWord(
                  currentMusic.title || currentMusic.music_title,
                  20
                )}
              </h6>

              <a>
                {truncateWord(
                  getCreatorNames(currentMusic.id || currentMusic.music_id),
                  20
                )}
              </a>
            </div>
          </div>

          <div id="music-controlls">
            <div id="music-buttons">
              <FontAwesomeIcon
                className={`footer-pass-music ${
                  currentQueueIndex === 0 && currentTime <= 5 ? 'disabled' : ''
                }`}
                icon={faStepBackward}
                onClick={playPrevious}
              />

              <FontAwesomeIcon
                id="footer-play-music"
                icon={isPlaying ? faPause : faPlay}
                onClick={togglePlayPause}
              />

              <FontAwesomeIcon
                className="footer-pass-music"
                icon={faStepForward}
                onClick={playNext}
              />
            </div>

            <div id="progress-container">
              <span>{formatTime(currentTime)}</span>

              <input
                type="range"
                ref={progressBarRef}
                min="0"
                max={duration || 0}
                step="1"
                value={currentTime}
                onChange={handleSeek}
                id="progress-bar"
              />

              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div id="volume-controlls">
            <FontAwesomeIcon
              onClick={() =>
                volume > 0
                  ? setVolume(0)
                  : setVolume(
                      parseFloat(localStorage.getItem('music-volume')) || 0.25
                    )
              }
              icon={volume === 0 ? faVolumeXmark : faVolumeLow}
            />

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              ref={volumeBarRef}
              id="volume-control"
            />
          </div>

          <audio ref={audioRef} style={{ display: 'none' }} />
        </footer>
      )}
    </>
  )
}
