import { useEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent, type ReactNode, type RefObject } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowRight, BarChart3, Bell, Bookmark, Check, ChevronDown, ChevronLeft,
  ChevronRight, Clapperboard, Clock3, CloudUpload, Command, Download, Eye, FileArchive, FolderHeart,
  Grid2X2, Heart, Home, Layers3, ListFilter, ListMusic, Menu, MoreHorizontal, Pause, Play, Search,
  Share2, SlidersHorizontal, Sparkles, Star, TrendingUp, Upload, UserRound, Users, Volume2, VolumeX, X,
} from 'lucide-react'
import { EmptyState, Reveal, Skeleton } from './components'
import { categories, editorStats, projects, type Category, type Project } from './data'

type View = 'home' | 'repository' | 'project' | 'profile' | 'dashboard' | 'upload' | 'favorites'
type Toast = { id: number; message: string; tone: 'success' | 'info' }

const tracks = [{ title: 'Ice Tea', artist: 'Not The King.', src: './ice-tea.mp3' }]

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00'
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
}

function App() {
  const [view, setView] = useState<View>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>('Todos')
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0])
  const [favorites, setFavorites] = useState<Set<number>>(new Set([2]))
  const [toasts, setToasts] = useState<Toast[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(.72)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerExpanded, setPlayerExpanded] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragging, setDragging] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850)
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.clearTimeout(timer); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setSearchOpen(true)
      }
      if (event.key === 'Escape') { setSearchOpen(false); setMenuOpen(false); setProfileOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (searchOpen) window.setTimeout(() => searchRef.current?.focus(), 50)
  }, [searchOpen])

  useEffect(() => {
    if (!uploadFile) return
    setUploadProgress(0)
    const timer = window.setInterval(() => setUploadProgress((value) => {
      if (value >= 100) { window.clearInterval(timer); return 100 }
      return Math.min(value + 4, 100)
    }), 90)
    return () => window.clearInterval(timer)
  }, [uploadFile])

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const matchesCategory = category === 'Todos' || project.category === category
    const term = search.toLowerCase().trim()
    const matchesSearch = !term || [project.title, project.author, project.category, ...project.tags].join(' ').toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  }), [category, search])

  const notify = (message: string, tone: Toast['tone'] = 'success') => {
    const id = Date.now()
    setToasts((items) => [...items, { id, message, tone }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 2600)
  }

  const navigate = (nextView: View) => {
    setView(nextView); setMenuOpen(false); setProfileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openProject = (project: Project) => { setSelectedProject(project); navigate('project') }

  const toggleFavorite = (id: number) => {
    setFavorites((current) => {
      const next = new Set(current)
      if (next.has(id)) { next.delete(id); notify('Removido dos favoritos', 'info') }
      else { next.add(id); notify('Projeto salvo nos favoritos') }
      return next
    })
  }

  const togglePlayback = async () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) await audioRef.current.play()
    else audioRef.current.pause()
  }

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (file) setUploadFile(file)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault(); setDragging(false); handleFiles(event.dataTransfer.files)
  }

  const navItems = [
    { label: 'Início', icon: Home, target: 'top' },
    { label: 'Trabalhos', icon: Grid2X2, target: 'work' },
    { label: 'Destaque', icon: Star, target: 'featured-project' },
    { label: 'Sobre', icon: UserRound, target: 'about' },
    { label: 'Contato', icon: ArrowRight, target: 'contact' },
  ]

  const scrollTo = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main className="app-shell">
      <audio ref={audioRef} src={tracks[0].src} preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} />
      <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="grain" />

      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
        <button className="logo" onClick={() => navigate('home')} aria-label="Ir para início"><span><Clapperboard /></span>LORENZO<span>.</span></button>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map((item) => <button key={item.label} onClick={() => { navigate('home'); window.setTimeout(() => scrollTo(item.target), 60) }}>{item.label}</button>)}
        </nav>
        <div className="nav-actions portfolio-actions">
          <button className="availability"><i /> Disponível para projetos</button>
          <button className="button primary nav-contact" onClick={() => scrollTo('contact')}>Contato <ArrowRight /></button>
          <button className="mobile-toggle" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu /></button>
        </div>
      </header>

      {menuOpen && <div className="drawer-wrap"><button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" /><aside className="mobile-drawer"><div className="drawer-head"><div className="logo"><span><Clapperboard /></span>LORENZO<span>.</span></div><button className="icon-button" onClick={() => setMenuOpen(false)}><X /></button></div>{navItems.map((item) => <button key={item.label} onClick={() => { navigate('home'); window.setTimeout(() => scrollTo(item.target), 60) }}><item.icon />{item.label}<ArrowRight /></button>)}<div className="drawer-profile"><span>LO</span><div><strong>Lorenzo</strong><small>Video Editor & AMV Creator</small></div></div></aside></div>}

      {searchOpen && <div className="command-overlay" onMouseDown={() => setSearchOpen(false)}><div className="command-palette" onMouseDown={(event) => event.stopPropagation()}><div className="command-input"><Search /><input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Busque edits, presets, efeitos ou criadores..." /><kbd>ESC</kbd></div><div className="command-results"><span className="command-label">Resultados rápidos</span>{filteredProjects.slice(0, 4).map((project) => <button key={project.id} onClick={() => { openProject(project); setSearchOpen(false) }}><div className={`mini-thumb ${project.accent}`}><Play /></div><div><strong>{project.title}</strong><small>{project.category} · {project.author}</small></div><ArrowRight /></button>)}{filteredProjects.length === 0 && <EmptyState icon={<Search />} title="Nenhum resultado" text="Tente buscar outro título, categoria ou tag." />}</div></div></div>}

      <div id="main-content">
      {view === 'home' && <HomeView loading={loading} openProject={openProject} favorites={favorites} toggleFavorite={toggleFavorite} scrollTo={scrollTo} />}
      {view === 'repository' && <RepositoryView loading={loading} projects={filteredProjects} search={search} setSearch={setSearch} category={category} setCategory={setCategory} openProject={openProject} favorites={favorites} toggleFavorite={toggleFavorite} />}
      {view === 'project' && <ProjectView project={selectedProject} onBack={() => navigate('repository')} openProject={openProject} favorite={favorites.has(selectedProject.id)} toggleFavorite={toggleFavorite} notify={notify} />}
      {view === 'profile' && <ProfileView openProject={openProject} favorites={favorites} toggleFavorite={toggleFavorite} />}
      {view === 'dashboard' && <DashboardView openProject={openProject} />}
      {view === 'upload' && <UploadView file={uploadFile} progress={uploadProgress} dragging={dragging} setDragging={setDragging} onDrop={onDrop} handleFiles={handleFiles} clear={() => setUploadFile(null)} notify={notify} />}
      {view === 'favorites' && <FavoritesView favorites={favorites} openProject={openProject} toggleFavorite={toggleFavorite} />}
      </div>

      {view === 'home' && <MusicPlayer audioRef={audioRef} isPlaying={isPlaying} isMuted={isMuted} volume={volume} currentTime={currentTime} duration={duration} expanded={playerExpanded} setExpanded={setPlayerExpanded} togglePlayback={togglePlayback} setMuted={() => { if (!audioRef.current) return; audioRef.current.muted = !audioRef.current.muted; setIsMuted(audioRef.current.muted) }} setVolume={(value) => { if (!audioRef.current) return; audioRef.current.volume = value; audioRef.current.muted = value === 0; setVolume(value); setIsMuted(value === 0) }} seek={(value) => { if (!audioRef.current) return; audioRef.current.currentTime = value; setCurrentTime(value) }} />}
      <div className="toast-stack" aria-live="polite">{toasts.map((toast) => <div key={toast.id} className={`toast ${toast.tone}`}><Check />{toast.message}</div>)}</div>
    </main>
  )
}

function HomeView({ loading, openProject, favorites, toggleFavorite, scrollTo }: { loading: boolean; openProject: (project: Project) => void; favorites: Set<number>; toggleFavorite: (id: number) => void; scrollTo: (target: string) => void }) {
  return <>
    <section className="hero-platform portfolio-hero" id="top">
      <div className="hero-grid" /><div className="hero-orb" />
      <div className="hero-content">
        <div className="hero-badge"><Sparkles /> Video Editor & AMV Creator <span>2026</span></div>
        <h1 className="kinetic-title" aria-label="Crie edits que ninguém esquece.">
          <span className="title-line" aria-hidden="true">{['Crie', 'edits', 'que'].map((word, index) => <span className="title-word" style={{ '--word-index': index } as CSSProperties} key={word}><span>{word}</span></span>)}</span>
          <span className="title-line accent-line" aria-hidden="true">{['ninguém', 'esquece.'].map((word, index) => <span className="title-word" style={{ '--word-index': index + 3 } as CSSProperties} key={word}><span>{word}</span></span>)}</span>
        </h1>
        <div className="hero-intro"><strong>Video Editor & AMV Creator</strong><p>Transformo cenas, música e movimento em edits que contam histórias.</p></div>
        <div className="hero-actions"><button className="button primary" onClick={() => scrollTo('work')}>Ver meus trabalhos <ArrowDown /></button><button className="button secondary" onClick={() => scrollTo('contact')}>Entrar em contato <ArrowRight /></button></div>
        <div className="hero-signature"><span>LO</span><div><strong>Lorenzo</strong><small>Motion · AMV · Video Editing</small></div></div>
      </div>
      <div className="hero-showcase">
        <div className="showcase-window"><div className="window-bar"><i /><i /><i /><span>lorenzo_showreel_2026.aep</span></div><div className="showcase-canvas"><div className="anime-silhouette"><span>SHOWREEL / 01</span><strong>MOTION<br />STORY</strong></div><button className="showcase-play" aria-label="Assistir showreel"><Play fill="currentColor" /></button><div className="timeline"><div className="timeline-head"><span>00:00:18:24</span><span>4K · 60 FPS</span></div>{[84, 62, 73].map((width, index) => <div className="track" key={width}><span>{index === 0 ? 'VIDEO' : index === 1 ? 'EFFECTS' : 'AUDIO'}</span><i style={{ width: `${width}%` }} /></div>)}</div></div></div>
        <div className="floating-chip chip-one"><Play /><span><small>Showreel</small><strong>01:24</strong></span></div><div className="floating-chip chip-two"><Sparkles /><span><small>Experiência</small><strong>5+ anos</strong></span></div>
      </div>
      <button className="scroll-cue" onClick={() => scrollTo('work')}><span>Ver portfólio</span><ArrowDown /></button>
    </section>
    <section className="trust-strip" aria-label="Especialidades">
      <div className="specialties-track">
        {[0, 1].map((group) => <div className="specialties-group" aria-hidden={group === 1} key={group}><span>ESPECIALIDADES</span>{['AMV', 'ANIME EDIT', 'MOTION DESIGN', 'MUSIC VIDEO', 'SHORT EDIT'].map((tool) => <strong key={`${group}-${tool}`}><i />{tool}</strong>)}</div>)}
      </div>
    </section>
    <section className="section portfolio-work" id="work"><Reveal><SectionTitle eyebrow="Portfólio selecionado" title="Meus trabalhos" text="Projetos construídos frame a frame, unindo narrativa, ritmo e direção visual." /></Reveal><div className="project-grid-new portfolio-grid">{projects.map((project, index) => loading ? <ProjectSkeleton key={project.id} /> : <Reveal key={project.id} delay={(index % 3) * 90}><ProjectCard project={project} openProject={openProject} favorite={favorites.has(project.id)} toggleFavorite={toggleFavorite} /></Reveal>)}</div></section>
    <section className="section featured-work" id="featured-project"><Reveal><div className="featured-layout"><div className="featured-visual cyan"><div className="thumb-grid"/><span>DIRECTOR'S CUT / 2026</span><strong>BLUE<br/>LOCK</strong><button onClick={() => openProject(projects[0])}><Play fill="currentColor" /></button></div><div className="featured-copy"><span className="section-kicker">Projeto em destaque</span><h2>Blue Lock — Ego</h2><p>Uma peça autoral de ritmo intenso que combina composição, transições, sound design e color grading para transformar cada cena em impacto.</p><div className="software-tags"><span>After Effects</span><span>Premiere Pro</span><span>Photoshop</span></div><button className="button primary" onClick={() => openProject(projects[0])}>Ver projeto <ArrowRight /></button></div></div></Reveal></section>
    <section className="section about-portfolio" id="about"><Reveal><div className="about-layout"><div><span className="section-kicker">Sobre mim</span><h2>Eu edito para<br/><em>fazer sentir.</em></h2></div><div className="about-text"><p>Sou Lorenzo, editor de vídeo focado em AMVs, anime edits e motion design. Meu trabalho combina precisão técnica com uma direção visual autoral.</p><p>Crio narrativas onde música, timing e imagem trabalham juntos para transformar cenas em experiências memoráveis.</p><div className="about-facts"><span><strong>05+</strong> anos criando</span><span><strong>24</strong> projetos autorais</span><span><strong>4K</strong> workflow</span></div></div></div></Reveal></section>
    <section className="section software-section"><Reveal><SectionTitle eyebrow="Workflow" title="Ferramentas que uso" text="Um processo profissional do primeiro corte ao último frame." /></Reveal><div className="software-grid">{[['Ae','After Effects','Motion & compositing'],['Pr','Premiere Pro','Editing & rhythm'],['Ps','Photoshop','Art direction'],['Da','DaVinci Resolve','Color grading']].map(([icon,name,skill],index)=><Reveal key={name} delay={index*70}><div className="software-card"><span>{icon}</span><div><strong>{name}</strong><small>{skill}</small></div><ArrowRight /></div></Reveal>)}</div></section>
    <section className="section contact-portfolio" id="contact"><Reveal><div className="contact-panel"><span className="section-kicker">Disponível para novos projetos</span><h2>Vamos criar algo<br/><em>incrível.</em></h2><p>Tem uma ideia, música ou história esperando para ganhar movimento?</p><a className="button light" href="mailto:contato@exemplo.com">Entrar em contato <ArrowRight /></a><div className="contact-socials"><a href="#">Instagram</a><a href="#">YouTube</a><a href="#">Vimeo</a></div></div></Reveal></section>
  </>
}

function RepositoryView({ loading, projects: items, search, setSearch, category, setCategory, openProject, favorites, toggleFavorite }: { loading: boolean; projects: Project[]; search: string; setSearch: (value: string) => void; category: Category; setCategory: (value: Category) => void; openProject: (project: Project) => void; favorites: Set<number>; toggleFavorite: (id: number) => void }) {
  return <section className="page repository-page"><div className="page-heading"><span className="section-kicker">Repositório</span><h1>Recursos para elevar<br />cada <em>frame.</em></h1><p>Explore uma biblioteca viva de projetos e assets criados por editores de todo o mundo.</p></div><div className="repository-toolbar"><label className="repository-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título, criador ou tag..." /><kbd>⌘ K</kbd></label><button className="sort-button"><ListFilter /> Mais relevantes <ChevronDown /></button></div><div className="filter-row" role="tablist">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="results-meta"><span><strong>{items.length}</strong> recursos encontrados</span><button><SlidersHorizontal /> Filtros avançados</button></div>{items.length ? <div className="project-grid-new repository-grid">{(loading ? projects.slice(0, 6) : items).map((project, index) => loading ? <ProjectSkeleton key={project.id} /> : <Reveal key={project.id} delay={(index % 3) * 60}><ProjectCard project={project} openProject={openProject} favorite={favorites.has(project.id)} toggleFavorite={toggleFavorite} /></Reveal>)}</div> : <EmptyState icon={<Search />} title="Nenhum recurso encontrado" text="Ajuste a busca ou selecione outra categoria." />}</section>
}

function ProjectCard({ project, openProject, favorite, toggleFavorite }: { project: Project; openProject: (project: Project) => void; favorite: boolean; toggleFavorite: (id: number) => void }) {
  return <article className="project-card portfolio-card"><button className={`project-thumb ${project.accent}`} onClick={() => openProject(project)}><div className="thumb-grid" /><span className="thumb-index">0{project.id}</span><strong>{project.title.split('—')[0]}</strong><div className="preview-overlay"><span><Play fill="currentColor" /> Assistir</span></div><span className="duration">{project.duration}</span></button><div className="card-body"><div className="card-title-row"><button onClick={() => openProject(project)}><h3>{project.title}</h3></button><button className={`favorite-button ${favorite ? 'active' : ''}`} onClick={() => toggleFavorite(project.id)} aria-label="Favoritar projeto"><Heart fill={favorite ? 'currentColor' : 'none'} /></button></div><div className="portfolio-meta"><span>{project.category}</span><span>{project.date}</span></div><p className="card-description">{project.description}</p><div className="tag-row">{project.tags.slice(0,2).map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>
}

function ProjectView({ project, onBack, openProject, favorite, toggleFavorite, notify }: { project: Project; onBack: () => void; openProject: (project: Project) => void; favorite: boolean; toggleFavorite: (id: number) => void; notify: (message: string, tone?: Toast['tone']) => void }) {
  return <section className="page project-page"><button className="back-button" onClick={onBack}><ArrowLeft /> Voltar ao repositório</button><Reveal><div className={`project-stage ${project.accent}`}><div className="stage-grid" /><span className="stage-tag">FEATURED PROJECT / 0{project.id}</span><h2>{project.title}</h2><button className="stage-play"><Play fill="currentColor" /></button><div className="stage-controls"><span>00:00</span><i><b /></i><span>{project.duration}</span><Volume2 /></div></div></Reveal><div className="project-detail-grid"><Reveal><div className="project-copy"><div className="detail-author"><span>{project.avatar}</span><div><strong>{project.author}</strong><small>{project.handle}</small></div><button>Seguir</button></div><h1>{project.title}</h1><p>{project.description}</p><div className="tag-row large">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-actions"><button className="button primary" onClick={() => notify('Download iniciado')}><Download /> Baixar projeto</button><button className={`button secondary ${favorite ? 'selected' : ''}`} onClick={() => toggleFavorite(project.id)}><Heart fill={favorite ? 'currentColor' : 'none'} /> {favorite ? 'Salvo' : 'Favoritar'}</button><button className="icon-button" onClick={() => notify('Link copiado')}><Share2 /></button></div></div></Reveal><Reveal delay={100}><aside className="project-info-panel"><h3>Informações</h3><InfoRow label="Categoria" value={project.category} /><InfoRow label="Software" value="After Effects 2026" /><InfoRow label="Resolução" value="3840 × 2160" /><InfoRow label="FPS" value="60" /><InfoRow label="Tamanho" value="184 MB" /><InfoRow label="Licença" value="Uso pessoal" /><div className="detail-stats"><span><Eye />{project.views}<small>visualizações</small></span><span><Download />{project.downloads}<small>downloads</small></span></div></aside></Reveal></div><section className="related-section"><SectionTitle eyebrow="Continue explorando" title="Projetos relacionados" /><div className="project-grid-new">{projects.filter((item) => item.id !== project.id).slice(0, 3).map((item) => <ProjectCard key={item.id} project={item} openProject={openProject} favorite={false} toggleFavorite={() => undefined} />)}</div></section></section>
}

function ProfileView({ openProject, favorites, toggleFavorite }: { openProject: (project: Project) => void; favorites: Set<number>; toggleFavorite: (id: number) => void }) {
  const [tab, setTab] = useState<'Projetos' | 'Favoritos' | 'Coleções'>('Projetos')
  const items = tab === 'Favoritos' ? projects.filter((project) => favorites.has(project.id)) : projects.filter((project) => project.author === 'Lorenzo')
  return <section className="page profile-page"><div className="profile-cover"><div className="profile-grid" /></div><div className="profile-header"><div className="profile-avatar">LO<i /></div><div className="profile-identity"><span className="verified">Editor verificado</span><h1>Lorenzo <Check /></h1><p>@lorenzo.edits · Criando histórias através de ritmo, movimento e impacto.</p><div><span><strong>24</strong> projetos</span><span><strong>18.7K</strong> seguidores</span><span><strong>46K</strong> downloads</span></div></div><button className="button primary">Editar perfil</button><button className="icon-button"><MoreHorizontal /></button></div><div className="profile-tabs">{(['Projetos', 'Favoritos', 'Coleções'] as const).map((item) => <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>{items.length ? <div className="project-grid-new profile-projects">{items.map((project) => <ProjectCard key={project.id} project={project} openProject={openProject} favorite={favorites.has(project.id)} toggleFavorite={toggleFavorite} />)}</div> : <EmptyState icon={<FolderHeart />} title="Nada por aqui ainda" text="Os itens salvos aparecerão nesta aba." />}</section>
}

function DashboardView({ openProject }: { openProject: (project: Project) => void }) {
  return <section className="page dashboard-page"><div className="dashboard-heading"><div><span className="section-kicker">Creator studio</span><h1>Bom trabalho, Lorenzo.</h1><p>Aqui está o desempenho do seu portfólio nos últimos 30 dias.</p></div><button className="button primary"><Upload /> Novo projeto</button></div><div className="stats-grid">{editorStats.map((stat, index) => <Reveal key={stat.label} delay={index * 60}><div className="stat-card"><span>{stat.label}<TrendingUp /></span><strong>{stat.value}</strong><small>{stat.delta} este mês</small><div className="sparkline">{[34, 52, 43, 70, 61, 88, 78, 100].map((height, point) => <i key={point} style={{ height: `${height}%` }} />)}</div></div></Reveal>)}</div><div className="dashboard-grid"><div className="chart-panel"><div className="panel-head"><div><h2>Crescimento</h2><span>Visualizações e downloads</span></div><button>Últimos 30 dias <ChevronDown /></button></div><div className="line-chart"><div className="chart-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 800 220" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b82f6" stopOpacity=".35"/><stop offset="1" stopColor="#3b82f6" stopOpacity="0"/></linearGradient></defs><path d="M0 180 C90 165 120 90 220 120 S360 185 450 95 S610 70 800 30 L800 220 L0 220Z" fill="url(#chartFill)"/><path d="M0 180 C90 165 120 90 220 120 S360 185 450 95 S610 70 800 30" fill="none" stroke="#60a5fa" strokeWidth="4"/></svg></div></div><div className="activity-panel"><div className="panel-head"><div><h2>Atividade</h2><span>Atualizações recentes</span></div></div>{['Seu projeto atingiu 10K views','Novo favorito em Blue Lock','Velocity Flow foi baixado','Você ganhou 42 seguidores'].map((item, index) => <div className="activity-item" key={item}><span><Check /></span><div><strong>{item}</strong><small>{index + 1}h atrás</small></div></div>)}</div></div><section className="recent-projects"><SectionTitle eyebrow="Conteúdo" title="Seus projetos recentes" /><div className="recent-list">{projects.filter((project) => project.author === 'Lorenzo').map((project) => <button key={project.id} onClick={() => openProject(project)}><div className={`mini-thumb ${project.accent}`}><Play /></div><div><strong>{project.title}</strong><small>{project.category} · Publicado</small></div><span><Eye /> {project.views}</span><span><Download /> {project.downloads}</span><MoreHorizontal /></button>)}</div></section></section>
}

function UploadView({ file, progress, dragging, setDragging, onDrop, handleFiles, clear, notify }: { file: File | null; progress: number; dragging: boolean; setDragging: (value: boolean) => void; onDrop: (event: DragEvent<HTMLDivElement>) => void; handleFiles: (files: FileList | null) => void; clear: () => void; notify: (message: string) => void }) {
  return <section className="page upload-page"><div className="page-heading compact"><span className="section-kicker">Creator upload</span><h1>Compartilhe sua criação.</h1><p>Publique projetos, presets e recursos para milhares de editores.</p></div><div className="upload-layout"><div className="upload-card"><div className={`drop-zone ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>{!file ? <><div className="upload-icon"><CloudUpload /></div><h2>Arraste seu arquivo para cá</h2><p>ou clique para selecionar do seu computador</p><label className="button primary">Selecionar arquivo<input type="file" onChange={(event) => handleFiles(event.target.files)} /></label><small>ZIP, RAR, AEP, PRPROJ, MP4 · Máximo 2 GB</small></> : <div className="upload-file"><div className="file-icon">{progress === 100 ? <Check /> : <FileArchive />}</div><div className="file-main"><div><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(1)} MB</span></div><div className="upload-bar"><i style={{ width: `${progress}%` }} /></div><small>{progress === 100 ? 'Upload concluído' : `Enviando... ${progress}%`}</small></div><button className="icon-button" onClick={clear}><X /></button></div>}</div>{file && progress === 100 && <div className="upload-form"><label>Título<input defaultValue={file.name.replace(/\.[^/.]+$/, '')} /></label><label>Categoria<select defaultValue="Projects">{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label className="full">Descrição<textarea placeholder="Conte o que torna este recurso especial..." /></label><label className="full">Tags<input placeholder="After Effects, AMV, Velocity..." /></label><button className="button primary full-button" onClick={() => notify('Projeto publicado com sucesso')}>Publicar projeto <ArrowRight /></button></div>}</div><aside className="upload-tips"><span className="section-kicker">Checklist</span><h3>Prepare seu projeto</h3>{['Use uma thumbnail em alta resolução','Inclua uma descrição objetiva','Organize arquivos e dependências','Informe software e versão','Respeite direitos autorais'].map((tip) => <p key={tip}><Check />{tip}</p>)}<div className="tip-card"><Sparkles /><div><strong>Dica profissional</strong><span>Projetos com preview recebem até 3× mais downloads.</span></div></div></aside></div></section>
}

function FavoritesView({ favorites, openProject, toggleFavorite }: { favorites: Set<number>; openProject: (project: Project) => void; toggleFavorite: (id: number) => void }) {
  const items = projects.filter((project) => favorites.has(project.id))
  return <section className="page favorites-page"><div className="page-heading compact"><span className="section-kicker">Sua biblioteca</span><h1>Favoritos.</h1><p>Todos os recursos que você salvou para usar mais tarde.</p></div>{items.length ? <div className="project-grid-new">{items.map((project) => <ProjectCard key={project.id} project={project} openProject={openProject} favorite toggleFavorite={toggleFavorite} />)}</div> : <EmptyState icon={<Heart />} title="Nenhum favorito ainda" text="Explore o repositório e salve os recursos que mais gostar." />}</section>
}

function MusicPlayer({ audioRef, isPlaying, isMuted, volume, currentTime, duration, expanded, setExpanded, togglePlayback, setMuted, setVolume, seek }: { audioRef: RefObject<HTMLAudioElement | null>; isPlaying: boolean; isMuted: boolean; volume: number; currentTime: number; duration: number; expanded: boolean; setExpanded: (value: boolean) => void; togglePlayback: () => void; setMuted: () => void; setVolume: (value: number) => void; seek: (value: number) => void }) {
  void audioRef
  const progress = duration ? currentTime / duration * 100 : 0
  return <aside className={`music-dock ${expanded ? 'expanded' : ''}`}><button className={`album-art ${isPlaying ? 'playing' : ''}`} onClick={() => setExpanded(!expanded)}><span /></button><div className="music-copy"><small><i /> NOW PLAYING</small><strong>Ice Tea</strong><span>Not The King.</span>{expanded && <div className="dock-progress"><em>{formatTime(currentTime)}</em><input type="range" min="0" max={duration || 0} step=".1" value={currentTime} onChange={(event) => seek(Number(event.target.value))} style={{ '--progress': `${progress}%` } as CSSProperties}/><em>{formatTime(duration)}</em></div>}</div><button className="dock-play" onClick={togglePlayback}>{isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>{expanded && <><button className="dock-control" disabled><ChevronLeft /></button><button className="dock-control" disabled><ChevronRight /></button><div className="dock-volume"><button onClick={setMuted}>{isMuted ? <VolumeX /> : <Volume2 />}</button><input type="range" min="0" max="1" step=".01" value={isMuted ? 0 : volume} onChange={(event) => setVolume(Number(event.target.value))} /></div></>}<button className="dock-expand" onClick={() => setExpanded(!expanded)}><ListMusic /></button></aside>
}

function SectionTitle({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: ReactNode }) { return <div className="section-title"><div><span className="section-kicker">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>{action}</div> }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="info-row"><span>{label}</span><strong>{value}</strong></div> }
function ProjectSkeleton() { return <div className="project-card skeleton-card"><Skeleton className="skeleton-thumb"/><div className="card-body"><Skeleton className="line wide"/><Skeleton className="line medium"/><Skeleton className="line small"/></div></div> }

export default App
