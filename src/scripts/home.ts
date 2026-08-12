import { gsap } from 'gsap';

type RandomWork = {
  id: string;
  defaultVariantId: string;
};

const dataNode = document.querySelector<HTMLScriptElement>('#random-work-data');
const randomLink = document.querySelector<HTMLAnchorElement>('[data-random-work]');
const wash = document.querySelector<HTMLElement>('[data-page-wash]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const works = dataNode ? JSON.parse(dataNode.textContent ?? '[]') as RandomWork[] : [];
const lastKey = 'afterimage:last-random-work';

function workHref(work: RandomWork) {
  const url = new URL(`/works/${work.id}/`, window.location.origin);
  url.searchParams.set('poster', work.defaultVariantId);
  url.searchParams.set('return', `/archive/?work=${encodeURIComponent(work.id)}&poster=${encodeURIComponent(work.defaultVariantId)}`);
  return `${url.pathname}${url.search}`;
}

function chooseRandomWork() {
  if (!works.length) return null;
  let lastId = '';
  try { lastId = sessionStorage.getItem(lastKey) ?? ''; } catch { /* storage can be unavailable */ }
  const candidates = works.length > 1 ? works.filter((work) => work.id !== lastId) : works;
  const selected = candidates[Math.floor(Math.random() * candidates.length)] ?? works[0];
  try { sessionStorage.setItem(lastKey, selected.id); } catch { /* storage can be unavailable */ }
  return selected;
}

function navigate(href: string) {
  if (reduceMotion || !wash) {
    window.location.href = href;
    return;
  }
  wash.dataset.active = 'true';
  gsap.fromTo(wash, { scaleY: 0, transformOrigin: 'bottom' }, {
    scaleY: 1,
    duration: 0.38,
    ease: 'power3.inOut',
    onComplete: () => { window.location.href = href; },
  });
}

window.addEventListener('pageshow', () => {
  if (!wash) return;
  wash.dataset.active = 'false';
  gsap.set(wash, { scaleY: 0 });
});

randomLink?.addEventListener('click', (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || randomLink.target === '_blank') return;
  const selected = chooseRandomWork();
  if (!selected) return;
  event.preventDefault();
  navigate(workHref(selected));
});

document.addEventListener('click', (event) => {
  const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!anchor || anchor === randomLink || anchor.origin !== window.location.origin) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank') return;
  if (wash?.dataset.active === 'true') return;
  event.preventDefault();
  navigate(anchor.href);
});

if (!reduceMotion) {
  gsap.from('[data-home-reveal]', {
    autoAlpha: 0,
    y: 16,
    duration: 0.78,
    stagger: 0.09,
    ease: 'power3.out',
    clearProps: 'opacity,visibility,transform',
  });
}
