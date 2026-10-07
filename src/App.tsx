import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Clapperboard, Menu, Pause, Play, Volume2, X } from 'lucide-react'

const projects = [
  { id: '01', title: 'Horizonte', category: 'Fashion Film', year: '2026', className: 'project-orange', duration: '01:42', format: '4K · 16:9' },
  { id: '02', title: 'Entre Ruas', category: 'Documentário', year: '2026', className: 'project-blue', duration: '04:18', format: '4K · 2.39:1' },
  { id: '03', title: 'Pulso', category: 'Music Video', year: '2025', className: 'project-red', duration: '03:27', format: '4K · 16:9' },
  { id: '04', title: 'Matéria', category: 'Commercial', year: '2025', className: 'project-silver', duration: '00:45', format: '6K · 16:9' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

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

  const scrollToWork = () => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-dot" ref={cursorDotRef} />
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
          <p className="eyebrow">Video editor · São Paulo, BR</p>
          <p className="edition">Showreel / 2026</p>
        </div>
        <h1>
          <span className="line"><span>IMAGENS QUE</span></span>
          <span className="line outline"><span>FAZEM <em>SENTIR.</em></span></span>
        </h1>
        <div className="hero-bottom reveal delay">
          <p><strong>Histórias em movimento.</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Transformo ideias em narrativas visuais que permanecem.</p>
          <button className="circle-button" onClick={scrollToWork} aria-label="Ver projetos"><ArrowDown /></button>
        </div>
        <div className="hero-index"><span>SCROLL TO EXPLORE</span><b>01</b><span>04</span></div>
        <div className="scroll-track"><div className="scroll-fill" /></div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div><span>EDIÇÃO</span><i>✦</i><span>COLOR</span><i>✦</i><span>MOTION</span><i>✦</i><span>NARRATIVA</span><i>✦</i><span>EDIÇÃO</span><i>✦</i><span>COLOR</span><i>✦</i><span>MOTION</span><i>✦</i><span>NARRATIVA</span><i>✦</i></div>
      </div>

      <section className="work" id="work">
        <div className="section-header">
          <p className="eyebrow">Projetos selecionados</p>
          <span>2025—2026</span>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className={`project ${project.className}`} key={project.id}>
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
        <div className="section-header about-header"><p className="eyebrow">Sobre o editor</p><span>Desde 2021</span></div>
        <div className="about-grid">
          <h2>RITMO, EMOÇÃO<br />E <em>PROPÓSITO.</em></h2>
          <div className="about-copy">
            <span className="about-number">05+</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <div className="services"><span><b>01</b> Montagem</span><span><b>02</b> Color grading</span><span><b>03</b> Motion design</span><span><b>04</b> Sound design</span></div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <p className="eyebrow">Tem um projeto em mente?</p>
        <a href="mailto:contato@exemplo.com" className="footer-cta">VAMOS CRIAR <ArrowUpRight /></a>
        <div className="footer-bottom">
          <span>© 2026 Lorenzo</span>
          <div><a href="#">Instagram</a><a href="#">Vimeo</a><a href="#">YouTube</a></div>
          <a href="#top">Voltar ao topo ↑</a>
        </div>
      </footer>
    </main>
  )
}

export default App
