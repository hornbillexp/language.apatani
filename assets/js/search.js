// assets/js/search.js
// simple client-side search UI using pre-built JSON index

async function loadIndex() {
  try {
    const res = await fetch('/assets/search/index.json');
    if (!res.ok) throw new Error('Index not found');
    return await res.json();
  } catch (e) {
    console.error('Failed to load search index', e);
    return [];
  }
}

function renderResults(results, container) {
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<p>No results</p>';
    return;
  }
  const ul = document.createElement('ul');
  results.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${r.url}">${r.title}</a> ${r.ipa?'<small>'+r.ipa+'</small>':''}<p>${r.body.substring(0,200)}...</p>`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

window.initDictionarySearch = async function(inputSelector, resultsSelector) {
  const input = document.querySelector(inputSelector);
  const results = document.querySelector(resultsSelector);
  const index = await loadIndex();
  if (!input || !results) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }
    const found = index.filter(d => (d.title && d.title.toLowerCase().includes(q)) || (d.body && d.body.toLowerCase().includes(q)) || (d.ipa && d.ipa.toLowerCase().includes(q)));
    renderResults(found.slice(0, 50), results);
  });
};
