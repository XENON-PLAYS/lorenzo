export type Category = 'Todos' | 'AMV' | 'Anime Edit' | 'Velocity' | 'Motion Design' | 'Music Video' | 'Short Edit'

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

export const categories: Category[] = ['Todos', 'AMV', 'Anime Edit', 'Velocity', 'Motion Design', 'Music Video', 'Short Edit']

export const projects: Project[] = [
  { id: 1, title: 'Blue Lock — Ego', category: 'AMV', author: 'Lorenzo', handle: '@lorenzo.edits', avatar: 'LO', tags: ['After Effects', '4K', 'AMV'], views: '48.2K', downloads: '8.4K', date: '2026', duration: '00:42', accent: 'cyan', description: 'Um edit cinemático criado para explorar ritmo, impacto e a energia visual de Blue Lock.' },
  { id: 2, title: 'Velocity — Flow State', category: 'Velocity', author: 'Lorenzo', handle: '@lorenzo.edits', avatar: 'LO', tags: ['Velocity', 'Premiere', 'Rhythm'], views: '31.7K', downloads: '12.1K', date: '2026', duration: '01:18', accent: 'violet', description: 'Um estudo de velocidade e transições suaves guiado pela batida e pelo movimento.' },
  { id: 3, title: 'Jujutsu — Hollow Blue', category: 'Anime Edit', author: 'Lorenzo', handle: '@lorenzo.edits', avatar: 'LO', tags: ['Anime', 'Glow', 'Shake'], views: '72.9K', downloads: '6.8K', date: '2026', duration: '00:31', accent: 'blue', description: 'Energia amaldiçoada, composição precisa e transições construídas frame a frame.' },
  { id: 4, title: 'Neon Memories', category: 'Music Video', author: 'Lorenzo', handle: '@lorenzo.edits', avatar: 'LO', tags: ['Music', 'RGB', 'Narrative'], views: '19.4K', downloads: '9.2K', date: '2025', duration: '00:58', accent: 'rose', description: 'Narrativa musical com atmosfera noturna, textura analógica e composição cromática.' },
  { id: 5, title: 'Chainsaw — Impact', category: 'Motion Design', author: 'Lorenzo', handle: '@lorenzo.edits', avatar: 'LO', tags: ['Impact', 'SFX', 'Motion'], views: '55.8K', downloads: '11.6K', date: '2025', duration: '00:27', accent: 'orange', description: 'Impact frames, distorção e sound design sincronizados para um edit de alta intensidade.' },
  { id: 6, title: 'Midnight Sequence', category: 'Short Edit', author: 'Lorenzo', handle: '@lorenzo.edits', avatar: 'LO', tags: ['Color', 'Night', 'Short'], views: '26.3K', downloads: '7.9K', date: '2025', duration: '00:36', accent: 'indigo', description: 'Um short edit frio e cinematográfico com foco em atmosfera, textura e precisão.' },
]

export const editorStats = [
  { label: 'Visualizações', value: '284K', delta: '+18.4%' },
  { label: 'Downloads', value: '46.2K', delta: '+12.1%' },
  { label: 'Projetos', value: '24', delta: '+3' },
  { label: 'Favoritos', value: '18.7K', delta: '+24.8%' },
]
