import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Clapperboard, ListMusic, Menu, Pause, Play, Volume2, VolumeX, X } from 'lucide-react'

const projects = [
  { id: '01', title: 'Shinkai', category: 'Anime Edit · AMV', year: '2026', className: 'project-cyan', duration: '01:42', format: '4K · 16:9' },
  { id: '02', title: 'Akuma', category: 'Dark Anime Edit', year: '2026', className: 'project-indigo', duration: '04:18', format: '4K · 2.39:1' },
  { id: '03', title: 'Kokoro', category: 'Emotional AMV', year: '2025', className: 'project-electric', duration: '03:27', format: '4K · 16:9' },
  { id: '04', title: 'Mirai', category: 'Motion Manga', year: '2025', className: 'project-ice', duration: '00:45', format: '6K · 16:9' },
]

const tracks = [
  { title: 'Ice Tea', artist: 'Not The King.', src: './ice-tea.mp3' },
]

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [playerExpanded, setPlayerExpanded] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    let frame = 0
    const moveCursor = (event: MouseEvent) => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      }
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
        }
      })
    }
    window.addEventListener('mousemove', moveCursor)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let frame = 0
    const updateScrollProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const progressValue = scrollable > 0 ? window.scrollY / scrollable : 0
        document.documentElement.style.setProperty('--scroll-progress', progressValue.toString())
      })
    }
    updateScrollProgress()
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateScrollProgress)
    }
  }, [])

  const scrollToWork = () => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      await audio.play()
    } else {
      audio.pause()
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  const changeVolume = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = value
    audio.muted = value === 0
    setVolume(value)
    setIsMuted(value === 0)
  }

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  const changeTrack = (direction: number) => {
    const nextTrack = (currentTrack + direction + tracks.length) % tracks.length
    setCurrentTrack(nextTrack)
    setCurrentTime(0)
    requestAnimationFrame(() => {
      if (audioRef.current && isPlaying) void audioRef.current.play()
    })
  }

  const track = tracks[currentTrack]
  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <main>
      <div className="page-progress" aria-hidden="true" />
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-dot" ref={cursorDotRef} />
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => changeTrack(1)}
      />
      <aside className={`music-player ${playerExpanded ? 'expanded' : ''}`} aria-label="Player de música">
        <button className="player-cover" onClick={() => setPlayerExpanded(!playerExpanded)} aria-label={playerExpanded ? 'Recolher player' : 'Expandir player'}>
          <div className={`vinyl ${isPlaying ? 'spinning' : ''}`}><span /></div>
        </button>
        <div className="music-main">
          <div className="music-topline">
            <span className="now-playing"><i /> Now playing</span>
            <button className="queue-button" onClick={() => setPlayerExpanded(!playerExpanded)} aria-label="Ver fila"><ListMusic size={15} /></button>
          </div>
          <div className="track-row">
            <div className="track-data"><strong>{track.title}</strong><span>{track.artist}</span></div>
            <div className="equalizer" aria-hidden="true">{[1, 2, 3, 4, 5].map((bar) => <i key={bar} />)}</div>
          </div>
          <div className="music-progress">
            <span>{formatTime(currentTime)}</span>
            <input type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={(event) => seek(Number(event.target.value))} aria-label="Progresso da música" style={{ '--progress': `${progress}%` } as CSSProperties} />
            <span>{formatTime(duration)}</span>
          </div>
          <div className="music-controls">
            <button onClick={() => changeTrack(-1)} aria-label="Música anterior" disabled={tracks.length === 1}><ChevronLeft /></button>
            <button className="main-play" onClick={togglePlayback} aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}>{isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
            <button onClick={() => changeTrack(1)} aria-label="Próxima música" disabled={tracks.length === 1}><ChevronRight /></button>
            <div className="volume-control">
              <button onClick={toggleMute} aria-label={isMuted ? 'Ativar som' : 'Mutar música'}>{isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}</button>
              <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={(event) => changeVolume(Number(event.target.value))} aria-label="Volume" style={{ '--volume': `${(isMuted ? 0 : volume) * 100}%` } as CSSProperties} />
            </div>
          </div>
          <div className="track-queue"><span>01</span><div><strong>{track.title}</strong><small>{track.artist} · faixa única</small></div><b>Ativa</b></div>
        </div>
      </aside>
      <nav className="nav">
        <a href="#top" className="brand"><Clapperboard size={19} /> LORENZO<span>.</span></a>
        <div className="nav-status"><i /> Disponível para projetos</div>
        <div className="nav-links">
          <a href="#work"><span>01</span> Trabalhos</a>
          <a href="#about"><span>02</span> Sobre</a>
          <a href="#contact"><span>03</span> Contato</a>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <span className="menu-kicker">Menu / 2026</span>
          <a href="#work" onClick={() => setMenuOpen(false)}><small>01</small> Trabalhos</a>
          <a href="#about" onClick={() => setMenuOpen(false)}><small>02</small> Sobre</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}><small>03</small> Contato</a>
        </div>
      )}

      <section className="hero" id="top">
        <div className="hero-noise" />
        <div className="hero-orbit"><span>PLAY</span></div>
        <div className="hero-meta reveal">
          <p className="eyebrow">Anime editor · São Paulo, BR</p>
          <p className="edition">AMV Showreel / 2026</p>
        </div>
        <h1>
          <span className="line"><span>ANIME EM</span></span>
          <span className="line outline"><span><em>MOVIMENTO.</em></span></span>
        </h1>
        <div className="hero-bottom reveal delay">
          <p><strong>Emoção frame a frame.</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Transformo cenas de anime em experiências visuais intensas.</p>
          <button className="circle-button" onClick={scrollToWork} aria-label="Ver projetos"><ArrowDown /></button>
        </div>
        <div className="hero-index"><span>SCROLL TO EXPLORE</span><b>01</b><span>04</span></div>
        <div className="scroll-track"><div className="scroll-fill" /></div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div><span>AMV</span><i>青</i><span>ANIME EDIT</span><i>✦</i><span>MOTION</span><i>夢</i><span>IMPACT</span><i>✦</i><span>AMV</span><i>青</i><span>ANIME EDIT</span><i>✦</i><span>MOTION</span><i>夢</i><span>IMPACT</span><i>✦</i></div>
      </div>

      <section className="work" id="work">
        <div className="section-header" data-reveal="fade">
          <p className="eyebrow">Edits selecionados</p>
          <span>2025—2026</span>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className={`project ${project.className}`} key={project.id} data-reveal={index % 2 === 0 ? 'left' : 'right'} style={{ '--reveal-delay': `${(index % 2) * 100}ms` } as CSSProperties}>
              <button className="project-visual" onClick={() => setActiveProject(activeProject === index ? null : index)} aria-label={`Reproduzir ${project.title}`}>
                <div className="project-art">
                  <span className="art-word">{project.title}</span>
                  <div className="frame-lines" />
                  <div className="timecode">00:{project.id}:24:08</div>
                  <div className="rec"><i /> REC</div>
                </div>
                <div className="play-button">
                  {activeProject === index ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                </div>
                <span className="project-number">/{project.id}</span>
                <span className="project-format">{project.format}</span>
                {activeProject === index && <div className="player-bar"><Pause size={12} fill="currentColor" /><div><i /></div><span>{project.duration}</span><Volume2 size={13} /></div>}
              </button>
              <div className="project-info">
                <h2>{project.title}</h2>
                <div><span>{project.category}</span><span>{project.year} · {project.duration}</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <div className="section-header about-header" data-reveal="fade"><p className="eyebrow">Sobre o editor</p><span>Desde 2021</span></div>
        <div className="about-grid">
          <h2 data-reveal="left">RITMO, IMPACTO<br />E <em>EMOÇÃO.</em></h2>
          <div className="about-copy" data-reveal="right">
            <span className="about-number">05+</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <div className="services"><span><b>01</b> Montagem</span><span><b>02</b> Color grading</span><span><b>03</b> Motion design</span><span><b>04</b> Sound design</span></div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <p className="eyebrow" data-reveal="fade">Tem um edit em mente?</p>
        <a href="mailto:contato@exemplo.com" className="footer-cta" data-reveal="up">VAMOS CRIAR <ArrowUpRight /></a>
        <div className="footer-bottom" data-reveal="fade">
          <span>© 2026 Lorenzo</span>
          <div><a href="#">Instagram</a><a href="#">Vimeo</a><a href="#">YouTube</a></div>
          <a href="#top">Voltar ao topo ↑</a>
        </div>
      </footer>
    </main>
  )
}

export default App
