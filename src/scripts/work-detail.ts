import { gsap } from 'gsap';

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

type Item = {
  id: string;
  variants: Variant[];
};

type Style = {
  id: string;
  englishLabel: string;
  shortDescription: string;
};

type Payload = {
  item: Item;
  styles: Style[];
};

const dataNode = document.querySelector<HTMLScriptElement>('#work-data');
if (!dataNode) throw new Error('Work data is missing.');
const payload = JSON.parse(dataNode.textContent ?? '{}') as Payload;
const { item, styles } = payload;
const stage = document.querySelector<HTMLElement>('[data-detail-stage]')!;
const image = document.querySelector<HTMLImageElement>('[data-detail-image]')!;
const nextImage = document.querySelector<HTMLImageElement>('[data-detail-image-next]')!;
const mediaStatus = document.querySelector<HTMLElement>('[data-detail-media-status]')!;
const mediaStatusText = document.querySelector<HTMLElement>('[data-detail-media-status-text]')!;
const retryImage = document.querySelector<HTMLButtonElement>('[data-detail-retry-image]')!;
const variantButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-variant-id]')];
const backLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-detail-back], [data-detail-index]')];
const adjacentLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-adjacent-work]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const url = new URL(window.location.href);
const requested = item.variants.find((variant) => variant.id === url.searchParams.get('poster'));
let activeId = requested?.id ?? item.variants[0].id;
let requestId = 0;
let failedVariant: Variant | null = null;

function safeReturnPath() {
  const candidate = url.searchParams.get('return');
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) return null;
  try {
    const parsed = new URL(candidate, window.location.origin);
    return parsed.origin === window.location.origin ? `${parsed.pathname}${parsed.search}${parsed.hash}` : null;
  } catch {
    return null;
  }
}

const originalReturn = safeReturnPath();

function returnHref(variant: Variant) {
  const target = new URL(originalReturn ?? '/archive/', window.location.origin);
  const filteredStyle = target.searchParams.get('style');
  if (filteredStyle && filteredStyle !== 'all' && filteredStyle !== variant.styleId) {
    target.searchParams.set('style', variant.styleId);
  }
  target.searchParams.set('work', item.id);
  target.searchParams.set('poster', variant.id);
  target.hash = '';
  return `${target.pathname}${target.search}`;
}

function updateAdjacentLinks() {
  adjacentLinks.forEach((link) => {
    if (!originalReturn) return;
    const target = new URL(link.href);
    target.searchParams.set('return', originalReturn);
    link.href = `${target.pathname}${target.search}`;
  });
}

function setMediaStatus(mode: 'loading' | 'error' | 'idle') {
  stage.dataset.mediaState = mode;
  mediaStatus.hidden = mode === 'idle';
  retryImage.hidden = mode !== 'error';
  mediaStatusText.textContent = mode === 'error' ? '图像暂未显影' : '正在显影';
}

async function decode(target: HTMLImageElement, variant: Variant) {
  target.src = variant.image;
  target.alt = variant.alt;
  target.width = variant.width;
  target.height = variant.height;
  if (target.complete && target.naturalWidth > 0) return;
  await target.decode();
}

async function transitionImage(variant: Variant, token: number, initial = false) {
  failedVariant = null;
  setMediaStatus('loading');
  gsap.killTweensOf(nextImage);
  try {
    if (initial && image.src.endsWith(variant.image)) {
      if (!(image.complete && image.naturalWidth > 0)) await image.decode();
    } else {
      nextImage.style.opacity = '0';
      await decode(nextImage, variant);
      if (token !== requestId) return;
      if (!reduceMotion) {
        await new Promise<void>((resolve) => {
          gsap.to(nextImage, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: resolve,
            onInterrupt: resolve,
          });
        });
      }
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
    gsap.killTweensOf(nextImage);
    failedVariant = variant;
    nextImage.removeAttribute('src');
    setMediaStatus('error');
  }
}

async function renderVariant(initial = false) {
  const variant = item.variants.find((candidate) => candidate.id === activeId) ?? item.variants[0];
  const style = styles.find((candidate) => candidate.id === variant.styleId)!;
  const variantIndex = item.variants.indexOf(variant);
  const token = ++requestId;
  activeId = variant.id;
  stage.style.setProperty('--accent', variant.accent);
  stage.setAttribute('aria-busy', 'true');


  document.querySelector<HTMLElement>('[data-detail-style]')!.textContent = style.englishLabel;
  document.querySelector<HTMLElement>('[data-detail-count]')!.textContent = `${String(variantIndex + 1).padStart(2, '0')} / ${String(item.variants.length).padStart(2, '0')}`;
  document.querySelector<HTMLElement>('[data-detail-interpretation]')!.textContent = variant.interpretation;
  document.querySelector<HTMLElement>('[data-detail-style-note]')!.textContent = style.shortDescription;
  variantButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.variantId === variant.id)));
  const homeHref = returnHref(variant);
  backLinks.forEach((link) => { link.href = homeHref; });

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set('poster', variant.id);
  history.replaceState(null, '', `${nextUrl.pathname}${nextUrl.search}`);

  await transitionImage(variant, token, initial);
  if (token === requestId) stage.setAttribute('aria-busy', 'false');
}

variantButtons.forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.variantId === activeId) return;
  activeId = button.dataset.variantId!;
  void renderVariant();
}));
retryImage.addEventListener('click', () => {
  if (!failedVariant) return;
  activeId = failedVariant.id;
  void renderVariant();
});

updateAdjacentLinks();
void renderVariant(true);
