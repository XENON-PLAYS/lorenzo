import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Clapperboard, Menu, Pause, Play, X } from 'lucide-react'

const projects = [
  { id: '01', title: 'Horizonte', category: 'Fashion Film', year: '2026', className: 'project-orange' },
  { id: '02', title: 'Entre Ruas', category: 'Documentário', year: '2026', className: 'project-blue' },
  { id: '03', title: 'Pulso', category: 'Music Video', year: '2025', className: 'project-red' },
  { id: '04', title: 'Matéria', category: 'Commercial', year: '2025', className: 'project-silver' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const moveCursor = (event: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      }
    }
    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [])

  const scrollToWork = () => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main>
      <div className="cursor" ref={cursorRef} />
      <nav className="nav">
        <a href="#top" className="brand"><Clapperboard size={19} /> LORENZO<span>.</span></a>
        <div className="nav-links">
          <a href="#work">Trabalhos</a>
          <a href="#about">Sobre</a>
          <a href="#contact">Contato</a>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <a href="#work" onClick={() => setMenuOpen(false)}>Trabalhos</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Sobre</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contato</a>
        </div>
      )}

      <section className="hero" id="top">
        <div className="hero-noise" />
        <p className="eyebrow reveal">Video editor · São Paulo, BR</p>
        <h1>
          <span className="line"><span>IMAGENS QUE</span></span>
          <span className="line outline"><span>FAZEM SENTIR.</span></span>
        </h1>
        <div className="hero-bottom reveal delay">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Transformo ideias em narrativas visuais que permanecem.</p>
          <button className="circle-button" onClick={scrollToWork} aria-label="Ver projetos"><ArrowDown /></button>
        </div>
        <div className="scroll-track"><div className="scroll-fill" /></div>
      </section>

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
                </div>
                <div className="play-button">
                  {activeProject === index ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                </div>
                <span className="project-number">/{project.id}</span>
              </button>
              <div className="project-info">
                <h2>{project.title}</h2>
                <div><span>{project.category}</span><span>{project.year}</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <p className="eyebrow">Sobre o editor</p>
        <div className="about-grid">
          <h2>RITMO, EMOÇÃO<br />E <em>PROPÓSITO.</em></h2>
          <div className="about-copy">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <div className="services"><span>Montagem</span><span>Color grading</span><span>Motion design</span><span>Sound design</span></div>
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
