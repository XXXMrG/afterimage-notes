type RandomWork = {
  id: string;
  defaultVariantId: string;
};

const dataNode = document.querySelector<HTMLScriptElement>('#random-work-data');
const randomLink = document.querySelector<HTMLAnchorElement>('[data-random-work]');
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

randomLink?.addEventListener('click', (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || randomLink.target === '_blank') return;
  const selected = chooseRandomWork();
  if (!selected) return;
  event.preventDefault();
  window.location.href = workHref(selected);
});
