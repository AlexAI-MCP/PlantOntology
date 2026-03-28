export type Lang = 'ko' | 'en' | 'ja'

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'ko', label: '한' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日' },
]

export const T = {
  ko: {
    nav_species: '수종 탐색',
    nav_carbon: '탄소 계산기',
    nav_stats: '통계',
    nav_community: '커뮤니티',
    hero_tagline: '10,000+ 수종 지식 그래프 — 올바른 장소에 올바른 식물을',
    stat_results: '검색 결과',
    stat_datasets: '데이터셋',
    stat_climates: '기후존',
    loading: '데이터 로딩 중... 최초 요청 시 잠시 걸릴 수 있습니다.',
    empty_title: '검색 결과 없음',
    empty_body: '다른 검색어나 필터를 시도해보세요.',
    search_placeholder: '수종명, 학명, 특성 검색...',
  },
  en: {
    nav_species: 'Species',
    nav_carbon: 'Carbon Calc',
    nav_stats: 'Statistics',
    nav_community: 'Community',
    hero_tagline: '10,000+ species knowledge graph — right plant, right place',
    stat_results: 'Results',
    stat_datasets: 'Datasets',
    stat_climates: 'Climate Zones',
    loading: 'Loading data... may take a moment on first request.',
    empty_title: 'No results found',
    empty_body: 'Try a different search term or filter.',
    search_placeholder: 'Search by name, scientific name, traits...',
  },
  ja: {
    nav_species: '植物検索',
    nav_carbon: '炭素計算',
    nav_stats: '統計',
    nav_community: 'コミュニティ',
    hero_tagline: '10,000以上の植物ナレッジグラフ — 正しい場所に正しい植物を',
    stat_results: '検索結果',
    stat_datasets: 'データセット',
    stat_climates: '気候帯',
    loading: 'データ読込中... 初回は少しお待ちください。',
    empty_title: '結果が見つかりません',
    empty_body: '別のキーワードやフィルターをお試しください。',
    search_placeholder: '名前・学名・特性で検索...',
  },
} as const satisfies Record<Lang, Record<string, string>>
