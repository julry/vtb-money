const cache = new Map();

const loaders = {
  1: () => import('./w1.jsx'),
  2: () => import('./w2.js'),
  3: () => import('./w3.js'),
  4: () => import('./w4.js'),
};

const getWeekFromId = (id) => {
  const m = String(id).match(/^w(\d+)/i);
  if (m) return Number(m[1]);
  const s = String(id).match(/^start-(\d+)/i);
  if (s) return Number(s[1]);
  return 1;
};

export async function getCellContent(id) {
  if (cache.has(id)) return cache.get(id);

  const week = getWeekFromId(id);
  const loader = loaders[week];
  if (!loader) return null;

  const mod = await loader();
  const map = mod.CELL_CONTENT || mod.default || {};
  Object.entries(map).forEach(([key, value]) => cache.set(key, value));

  return cache.get(id) ?? null;
}

export function preloadCellContent(id) {
  return getCellContent(id);
}

export function preloadWeekContent(week) {
  const loader = loaders[week];
  if (!loader) return Promise.resolve();
  return loader().then((mod) => {
    const map = mod.CELL_CONTENT || mod.default || {};
    Object.entries(map).forEach(([key, value]) => cache.set(key, value));
  });
}
