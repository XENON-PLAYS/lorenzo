export type Category = 'Todos' | 'AMV' | 'Anime Edit' | 'Velocity' | 'Presets' | 'Effects' | 'Overlays' | 'Transitions' | 'CC' | 'Templates' | 'Projects'

export type Project = {
  id: number
  title: string
  category: Exclude<Category, 'Todos'>
  author: string
  handle: string
  avatar: string
  tags: string[]
  views: string
  downloads: string
  date: string
  duration: string
  accent: string
  description: string
}

export const categories: Category[] = ['Todos', 'AMV', 'Anime Edit', 'Velocity', 'Presets', 'Effects', 'Overlays', 'Transitions', 'CC', 'Templates', 'Projects']

export const projects: Project[] = [
  { id: 1, title: 'Blue Lock — Ego', category: 'AMV', author: 'Lorenzo', handle: '@lorenzo.edits', avatar: 'LO', tags: ['After Effects', '4K', 'AMV'], views: '48.2K', downloads: '8.4K', date: 'Hoje', duration: '00:42', accent: 'cyan', description: 'Um edit cinemático criado para explorar ritmo, impacto e a energia visual de Blue Lock.' },
  { id: 2, title: 'Velocity Flow Pack', category: 'Presets', author: 'Mika', handle: '@mikaflow', avatar: 'MK', tags: ['Velocity', 'Premiere', 'Pack'], views: '31.7K', downloads: '12.1K', date: '2 dias', duration: '01:18', accent: 'violet', description: 'Presets de velocity suaves, responsivos e prontos para acelerar seu fluxo criativo.' },
  { id: 3, title: 'Jujutsu — Hollow Blue', category: 'Anime Edit', author: 'Akira', handle: '@akira.mov', avatar: 'AK', tags: ['Anime', 'Glow', 'Shake'], views: '72.9K', downloads: '6.8K', date: '4 dias', duration: '00:31', accent: 'blue', description: 'Energia amaldiçoada, composição precisa e transições construídas frame a frame.' },
  { id: 4, title: 'Chromatic Overlays', category: 'Overlays', author: 'Noir', handle: '@noir.vfx', avatar: 'NR', tags: ['Overlay', 'RGB', 'VFX'], views: '19.4K', downloads: '9.2K', date: '1 semana', duration: '00:58', accent: 'rose', description: 'Coleção de overlays cromáticos para adicionar profundidade e energia sem perder definição.' },
  { id: 5, title: 'Chainsaw Impact', category: 'Effects', author: 'Lorenzo', handle: '@lorenzo.edits', avatar: 'LO', tags: ['Impact', 'SFX', 'Motion'], views: '55.8K', downloads: '11.6K', date: '1 semana', duration: '00:27', accent: 'orange', description: 'Impact frames, distorção e sound design sincronizados para edits de alta intensidade.' },
  { id: 6, title: 'Midnight CC', category: 'CC', author: 'Yumi', handle: '@yumi.colors', avatar: 'YU', tags: ['Color', 'Night', 'Preset'], views: '26.3K', downloads: '7.9K', date: '2 semanas', duration: '00:36', accent: 'indigo', description: 'Color correction fria com contraste cinematográfico para cenas noturnas e dramáticas.' },
]

export const editorStats = [
  { label: 'Visualizações', value: '284K', delta: '+18.4%' },
  { label: 'Downloads', value: '46.2K', delta: '+12.1%' },
  { label: 'Projetos', value: '24', delta: '+3' },
  { label: 'Favoritos', value: '18.7K', delta: '+24.8%' },
]
