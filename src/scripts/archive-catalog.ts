import { gsap } from 'gsap';

type IndexItem = {
  id: string;
  archiveNo: string;
  type: string;
  typeLabel: string;
  title: string;
  originalTitle: string;
  creator: string;
  year: string;
  context: string;
  styles: string[];
  variantCount: number;
  defaultVariantId: string;
  accent: string;
};

type Variant = {
  id: string;
  styleId: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  interpretation: string;
  accent: string;
};

type FullItem = IndexItem & {
  background: string;
  variants: Variant[];
};

type Style = {
  id: string;
  label: string;
  englishLabel: string;
  shortDescription: string;
};

type Payload = {
  items: IndexItem[];
  styles: Style[];
  pageSize: number;
  initialItem: FullItem;
};

const dataNode = document.querySelector<HTMLScriptElement>('#archive-index-data');
if (!dataNode) throw new Error('Archive index data is missing.');

const payload = JSON.parse(dataNode.textContent ?? '{}') as Payload;
const { items, styles, pageSize } = payload;
const cache = new Map<string, FullItem>([[payload.initialItem.id, payload.initialItem]]);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pageUrl = new URL(window.location.href);
const decadeOptions = ['all', ...new Set(items.map((item) => String(Math.floor(Number(item.year) / 10) * 10)))];
const valid = (value: string | null, options: string[], fallback = 'all') =>
  value && options.includes(value) ? value : fallback;

const requestedItem = items.find((item) => item.id === pageUrl.searchParams.get('work'));
const state = {
  query: pageUrl.searchParams.get('q')?.trim() ?? '',
  type: valid(pageUrl.searchParams.get('type'), ['all', 'song', 'film', 'book']),
  style: valid(pageUrl.searchParams.get('style'), ['all', ...styles.map((style) => style.id)]),
  decade: valid(pageUrl.searchParams.get('decade'), decadeOptions),
  sort: valid(pageUrl.searchParams.get('sort'), ['archive', 'newest', 'oldest', 'title'], 'archive'),
  page: Math.max(1, Number(pageUrl.searchParams.get('page')) || 1),
  itemId: requestedItem?.id ?? items[0]?.id ?? '',
  variantId: pageUrl.searchParams.get('poster') ?? requestedItem?.defaultVariantId ?? items[0]?.defaultVariantId ?? '',
};

const form = document.querySelector<HTMLFormElement>('[data-catalog-form]')!;
const searchInput = document.querySelector<HTMLInputElement>('[data-search]')!;
const clearSearch = document.querySelector<HTMLButtonElement>('[data-clear-search]')!;
const sortSelect = document.querySelector<HTMLSelectElement>('[data-sort]')!;
const typeButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter-type]')];
const styleButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter-style]')];
const decadeButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter-decade]')];
const indexList = document.querySelector<HTMLOListElement>('[data-work-index]')!;
const emptyNote = document.querySelector<HTMLElement>('[data-empty]')!;
const resetFilters = document.querySelector<HTMLButtonElement>('[data-reset-filters]')!;
const resultCount = document.querySelector<HTMLElement>('[data-result-count]')!;
const currentPage = document.querySelector<HTMLElement>('[data-current-page]')!;
const volumeRange = document.querySelector<HTMLElement>('[data-volume-range]')!;
const pageWindow = document.querySelector<HTMLElement>('[data-page-window]')!;
const previousPage = document.querySelector<HTMLButtonElement>('[data-page-previous]')!;
const nextPage = document.querySelector<HTMLButtonElement>('[data-page-next]')!;
const viewer = document.querySelector<HTMLElement>('[data-viewer]')!;
const viewerFrame = document.querySelector<HTMLElement>('[data-viewer-frame]')!;
const viewerNotes = document.querySelector<HTMLElement>('[data-viewer-notes]')!;
const image = document.querySelector<HTMLImageElement>('[data-viewer-image]')!;
const nextImage = document.querySelector<HTMLImageElement>('[data-viewer-image-next]')!;
const mediaStatus = document.querySelector<HTMLElement>('[data-media-status]')!;
const mediaStatusText = document.querySelector<HTMLElement>('[data-media-status-text]')!;
const retryImage = document.querySelector<HTMLButtonElement>('[data-retry-image]')!;
const variantNav = document.querySelector<HTMLElement>('[data-variant-nav]')!;
let requestId = 0;
let searchTimer = 0;
let failedVariant: Variant | null = null;

searchInput.value = state.query;
sortSelect.value = state.sort;

function normalize(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('zh-CN').replace(/\s+/g, ' ').trim();
}

function filteredItems() {
  const query = normalize(state.query);
  const matched = items.filter((item) => {
    const queryMatch = !query || normalize(`${item.title} ${item.originalTitle} ${item.creator}`).includes(query);
    const typeMatch = state.type === 'all' || item.type === state.type;
    const styleMatch = state.style === 'all' || item.styles.includes(state.style);
    const decadeMatch = state.decade === 'all' || Math.floor(Number(item.year) / 10) * 10 === Number(state.decade);
    return queryMatch && typeMatch && styleMatch && decadeMatch;
  });

  return matched.sort((a, b) => {
    if (state.sort === 'newest') return Number(b.year) - Number(a.year) || Number(a.archiveNo) - Number(b.archiveNo);
    if (state.sort === 'oldest') return Number(a.year) - Number(b.year) || Number(a.archiveNo) - Number(b.archiveNo);
    if (state.sort === 'title') return a.title.localeCompare(b.title, 'zh-CN');
    return Number(a.archiveNo) - Number(b.archiveNo);
  });
}

function setParam(url: URL, key: string, value: string, fallback?: string) {
  if (!value || value === fallback) url.searchParams.delete(key);
  else url.searchParams.set(key, value);
}

function homeStateUrl() {
  const url = new URL('/', window.location.origin);
  setParam(url, 'q', state.query);
  setParam(url, 'type', state.type, 'all');
  setParam(url, 'style', state.style, 'all');
  setParam(url, 'decade', state.decade, 'all');
  setParam(url, 'sort', state.sort, 'archive');
  if (state.page > 1) url.searchParams.set('page', String(state.page));
  if (state.itemId) url.searchParams.set('work', state.itemId);
  if (state.variantId) url.searchParams.set('poster', state.variantId);
  url.hash = 'archive';
  return url;
}

function syncUrl() {
  const url = homeStateUrl();
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function detailHref(itemId: string, variantId: string) {
  const back = homeStateUrl();
  back.searchParams.set('work', itemId);
  back.searchParams.set('poster', variantId);
  const url = new URL(`/works/${itemId}/`, window.location.origin);
  url.searchParams.set('poster', variantId);
  url.searchParams.set('return', `${back.pathname}${back.search}${back.hash}`);
  return `${url.pathname}${url.search}`;
}

function makeIndexEntry(item: IndexItem) {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'index-entry';
  button.dataset.selectWork = item.id;
  button.style.setProperty('--entry-accent', item.accent);
  if (item.id === state.itemId) button.setAttribute('aria-current', 'true');

  const parts = [
    ['index-entry__no', item.archiveNo],
    ['index-entry__title', item.title],
    ['index-entry__creator', item.creator],
    ['index-entry__meta', `${item.typeLabel} · ${item.year}`],
    ['index-entry__versions', String(item.variantCount).padStart(2, '0')],
  ];
  parts.forEach(([className, text]) => {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    button.append(span);
  });
  button.addEventListener('click', () => selectWork(item.id));
  li.append(button);
  return li;
}

function paginationTokens(totalPages: number, page: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const tokenSet = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...tokenSet].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
  const tokens: Array<number | 'ellipsis'> = [];
  pages.forEach((value, index) => {
    if (index && value - pages[index - 1] > 1) tokens.push('ellipsis');
    tokens.push(value);
  });
  return tokens;
}

function renderPagination(totalPages: number) {
  pageWindow.replaceChildren();
  paginationTokens(totalPages, state.page).forEach((token) => {
    if (token === 'ellipsis') {
      const span = document.createElement('span');
      span.className = 'catalog-pagination__ellipsis';
      span.textContent = '···';
      pageWindow.append(span);
      return;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(token).padStart(2, '0');
    button.setAttribute('aria-label', `第 ${token} 册`);
    if (token === state.page) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => setPage(token));
    pageWindow.append(button);
  });
  previousPage.disabled = state.page <= 1;
  nextPage.disabled = state.page >= totalPages;
}

function renderControlState() {
  typeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filterType === state.type)));
  styleButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filterStyle === state.style)));
  decadeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filterDecade === state.decade)));
  clearSearch.hidden = !state.query;
  sortSelect.value = state.sort;
}

function renderCatalog({ animate = true, select = true } = {}) {
  const filtered = filteredItems();
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  state.page = Math.min(Math.max(1, state.page), totalPages);
  const start = (state.page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  if (select && !pageItems.some((item) => item.id === state.itemId)) {
    state.itemId = pageItems[0]?.id ?? '';
    state.variantId = pageItems[0]?.defaultVariantId ?? '';
  }
  if (!pageItems.length) {
    requestId += 1;
    viewer.setAttribute('aria-busy', 'false');
    setMediaStatus('idle');
  }

  indexList.replaceChildren(...pageItems.map(makeIndexEntry));
  emptyNote.hidden = filtered.length > 0;
  viewer.hidden = filtered.length === 0;
  resultCount.textContent = String(filtered.length).padStart(3, '0');
  currentPage.textContent = String(state.page).padStart(2, '0');
  volumeRange.textContent = filtered.length
    ? `${String(start + 1).padStart(3, '0')}—${String(start + pageItems.length).padStart(3, '0')}`
    : '000—000';
  renderPagination(totalPages);
  renderControlState();
  syncUrl();

  if (animate && !reduceMotion && pageItems.length) {
    gsap.from(indexList.children, {
      autoAlpha: 0,
      y: 14,
      duration: 0.42,
      stagger: 0.035,
      ease: 'power3.out',
      clearProps: 'opacity,visibility,transform',
    });
  }
  if (select && state.itemId) void loadViewer(state.itemId, state.variantId);
}

function setPage(page: number) {
  if (page === state.page) return;
  state.page = page;
  renderCatalog();
  document.querySelector('.catalog-volume')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

async function fetchItem(itemId: string) {
  if (cache.has(itemId)) return cache.get(itemId)!;
  const response = await fetch(`/data/works/${itemId}.json`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Archive request failed: ${response.status}`);
  const item = await response.json() as FullItem;
  cache.set(item.id, item);
  return item;
}

function setMediaStatus(mode: 'loading' | 'error' | 'idle') {
  viewerFrame.dataset.mediaState = mode;
  mediaStatus.hidden = mode === 'idle';
  retryImage.hidden = mode !== 'error';
  mediaStatusText.textContent = mode === 'error' ? '图像暂未显影' : '正在显影';
}

async function decodeImage(target: HTMLImageElement, variant: Variant) {
  target.src = variant.image;
  target.alt = variant.alt;
  target.width = variant.width;
  target.height = variant.height;
  if (target.complete && target.naturalWidth > 0) return;
  await target.decode();
}

async function transitionImage(variant: Variant, token: number) {
  failedVariant = null;
  setMediaStatus('loading');
  nextImage.style.opacity = '0';
  try {
    await decodeImage(nextImage, variant);
    if (token !== requestId) return;
    if (reduceMotion) {
      image.src = variant.image;
      image.alt = variant.alt;
      image.width = variant.width;
      image.height = variant.height;
      nextImage.style.opacity = '0';
    } else {
      await new Promise<void>((resolve) => {
        gsap.to(nextImage, { opacity: 1, duration: 0.48, ease: 'power2.inOut', onComplete: resolve });
      });
      if (token !== requestId) return;
      image.src = variant.image;
      image.alt = variant.alt;
      image.width = variant.width;
      image.height = variant.height;
      nextImage.style.opacity = '0';
    }
    setMediaStatus('idle');
  } catch {
    if (token !== requestId) return;
    failedVariant = variant;
    nextImage.removeAttribute('src');
    setMediaStatus('error');
  }
}

function renderVariantNav(item: FullItem, variant: Variant) {
  variantNav.replaceChildren();
  const available = state.style === 'all'
    ? item.variants
    : item.variants.filter((candidate) => candidate.styleId === state.style);
  available.forEach((candidate, index) => {
    const style = styles.find((entry) => entry.id === candidate.styleId)!;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.selectVariant = candidate.id;
    button.textContent = `${String(index + 1).padStart(2, '0')} ${style.label}`;
    button.setAttribute('aria-pressed', String(candidate.id === variant.id));
    button.addEventListener('click', () => {
      if (candidate.id === state.variantId) return;
      state.variantId = candidate.id;
      void renderViewer(item, candidate, true);
    });
    variantNav.append(button);
  });
  variantNav.hidden = available.length <= 1;
}

async function renderViewer(item: FullItem, variant: Variant, animate = false) {
  const style = styles.find((entry) => entry.id === variant.styleId)!;
  const token = ++requestId;
  state.itemId = item.id;
  state.variantId = variant.id;
  viewer.style.setProperty('--accent', variant.accent);
  viewer.setAttribute('aria-busy', 'true');
  renderVariantNav(item, variant);

  const noteTargets = [
    viewerNotes.querySelector('[data-viewer-title]'),
    viewerNotes.querySelector('[data-viewer-creator]'),
    viewerNotes.querySelector('.viewer__reading'),
  ].filter(Boolean);
  if (animate && !reduceMotion) gsap.to(noteTargets, { autoAlpha: 0, y: 8, duration: 0.16, overwrite: true });

  viewer.querySelector<HTMLElement>('[data-viewer-folio]')!.textContent = item.archiveNo;
  viewer.querySelector<HTMLElement>('[data-viewer-type]')!.textContent = item.typeLabel;
  viewer.querySelector<HTMLElement>('[data-viewer-year]')!.textContent = item.year;
  viewer.querySelector<HTMLElement>('[data-viewer-context]')!.textContent = item.context;
  viewer.querySelector<HTMLElement>('[data-viewer-title]')!.textContent = item.title;
  viewer.querySelector<HTMLElement>('[data-viewer-creator]')!.textContent = item.creator;
  viewer.querySelector<HTMLElement>('[data-viewer-interpretation]')!.textContent = variant.interpretation;
  viewer.querySelector<HTMLElement>('[data-viewer-style-note]')!.textContent = style.shortDescription;
  viewer.querySelector<HTMLAnchorElement>('[data-viewer-open]')!.href = detailHref(item.id, variant.id);
  const original = viewer.querySelector<HTMLElement>('[data-viewer-original]')!;
  original.textContent = item.originalTitle ?? '';
  original.hidden = !item.originalTitle;

  document.querySelectorAll<HTMLButtonElement>('[data-select-work]').forEach((button) => {
    if (button.dataset.selectWork === item.id) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
  syncUrl();

  if (animate && !reduceMotion) {
    gsap.fromTo(noteTargets, { autoAlpha: 0, y: 8 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.44,
      stagger: 0.045,
      ease: 'power3.out',
      overwrite: true,
      clearProps: 'opacity,visibility,transform',
    });
  }
  await transitionImage(variant, token);
  if (token === requestId) viewer.setAttribute('aria-busy', 'false');
}

async function loadViewer(itemId: string, requestedVariantId?: string) {
  const token = ++requestId;
  failedVariant = null;
  viewer.setAttribute('aria-busy', 'true');
  viewer.classList.add('is-data-loading');
  setMediaStatus('loading');
  try {
    const item = await fetchItem(itemId);
    if (token !== requestId) return;
    const available = state.style === 'all'
      ? item.variants
      : item.variants.filter((variant) => variant.styleId === state.style);
    const variant = available.find((candidate) => candidate.id === requestedVariantId)
      ?? available[0]
      ?? item.variants[0];
    viewer.classList.remove('is-data-loading');
    await renderViewer(item, variant, true);
  } catch {
    if (token !== requestId) return;
    viewer.classList.remove('is-data-loading');
    viewer.setAttribute('aria-busy', 'false');
    setMediaStatus('error');
  }
}

function selectWork(itemId: string) {
  const item = items.find((candidate) => candidate.id === itemId);
  if (!item || item.id === state.itemId) return;
  state.itemId = item.id;
  state.variantId = state.style === 'all' ? item.defaultVariantId : '';
  void loadViewer(item.id, state.variantId);
  if (window.matchMedia('(max-width: 820px)').matches) {
    viewer.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
}

function applyFilter(key: 'type' | 'style' | 'decade', value: string) {
  state[key] = value;
  state.page = 1;
  renderCatalog();
}

function resetAll() {
  state.query = '';
  state.type = 'all';
  state.style = 'all';
  state.decade = 'all';
  state.sort = 'archive';
  state.page = 1;
  searchInput.value = '';
  renderCatalog();
  searchInput.focus();
}

typeButtons.forEach((button) => button.addEventListener('click', () => applyFilter('type', button.dataset.filterType!)));
styleButtons.forEach((button) => button.addEventListener('click', () => applyFilter('style', button.dataset.filterStyle!)));
decadeButtons.forEach((button) => button.addEventListener('click', () => applyFilter('decade', button.dataset.filterDecade!)));
previousPage.addEventListener('click', () => setPage(state.page - 1));
nextPage.addEventListener('click', () => setPage(state.page + 1));
resetFilters.addEventListener('click', resetAll);
clearSearch.addEventListener('click', () => {
  state.query = '';
  searchInput.value = '';
  state.page = 1;
  renderCatalog();
  searchInput.focus();
});
searchInput.addEventListener('input', () => {
  window.clearTimeout(searchTimer);
  clearSearch.hidden = !searchInput.value;
  searchTimer = window.setTimeout(() => {
    state.query = searchInput.value.trim();
    state.page = 1;
    renderCatalog();
  }, 180);
});
sortSelect.addEventListener('change', () => {
  state.sort = sortSelect.value;
  state.page = 1;
  renderCatalog();
});
form.addEventListener('submit', (event) => event.preventDefault());
retryImage.addEventListener('click', async () => {
  if (failedVariant) {
    const token = ++requestId;
    viewer.setAttribute('aria-busy', 'true');
    await transitionImage(failedVariant, token);
    if (token === requestId) viewer.setAttribute('aria-busy', 'false');
  } else if (state.itemId) {
    void loadViewer(state.itemId, state.variantId);
  }
});

function setupRouteTransitions() {
  if (reduceMotion) return;
  const wash = document.querySelector<HTMLElement>('[data-page-wash]');
  window.addEventListener('pageshow', () => {
    if (!wash) return;
    wash.dataset.active = 'false';
    gsap.set(wash, { scaleY: 0 });
  });
  document.addEventListener('click', (event) => {
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.origin !== window.location.origin || anchor.hash === '#archive') return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank') return;
    if (!wash || wash.dataset.active === 'true') return;
    event.preventDefault();
    wash.dataset.active = 'true';
    gsap.fromTo(wash, { scaleY: 0, transformOrigin: 'bottom' }, {
      scaleY: 1,
      duration: 0.38,
      ease: 'power3.inOut',
      onComplete: () => { window.location.href = anchor.href; },
    });
  });
}

function entrance() {
  if (reduceMotion) return;
  gsap.from('[data-masthead-reveal]', {
    autoAlpha: 0,
    y: 18,
    duration: 0.78,
    stagger: 0.09,
    ease: 'power3.out',
    clearProps: 'opacity,visibility,transform',
  });
  gsap.from('[data-archive-section]', {
    autoAlpha: 0,
    y: 22,
    duration: 0.7,
    delay: 0.18,
    ease: 'power3.out',
    clearProps: 'opacity,visibility,transform',
  });
}

const initialFiltered = filteredItems();
if (requestedItem && !pageUrl.searchParams.has('page')) {
  const requestedIndex = initialFiltered.findIndex((item) => item.id === requestedItem.id);
  if (requestedIndex >= 0) state.page = Math.floor(requestedIndex / pageSize) + 1;
}
renderCatalog({ animate: false });
entrance();
setupRouteTransitions();
