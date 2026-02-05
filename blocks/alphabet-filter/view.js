(() => {
	const WRAP = '.frost-child-alphabet-filter';
	const SEARCH = '.frost-child-alphabet-filter__search';
	const LETTERS = '.frost-child-alphabet-filter__letter';
	const STATUS = '.frost-child-alphabet-filter__status';
	const RESULTS = '.frost-child-alphabet-filter__results';

	function getRestRoot() {
		// WordPress usually prints: <link rel="https://api.w.org/" href="https://example.com/wp-json/" />
		const link = document.querySelector('link[rel="https://api.w.org/"]');
		if (link && link.getAttribute('href')) return link.getAttribute('href');
		// Fallback: assume /wp-json/ at site root.
		return `${window.location.origin}/wp-json/`;
	}

	function buildEndpoint() {
		let root = getRestRoot();
		if (!root.endsWith('/')) root += '/';
		return `${root}frost-child/v1/alphabet-filter`;
	}

	function setActiveLetter(wrap, letter) {
		wrap.querySelectorAll(LETTERS).forEach((btn) => {
			const isActive = (btn.dataset.letter || '') === letter;
			btn.classList.toggle('is-active', isActive);
			btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});
	}

	function setStatus(wrap, text) {
		const el = wrap.querySelector(STATUS);
		if (!el) return;
		el.textContent = text || '';
	}

	function escapeHtml(s) {
		return String(s)
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#039;');
	}

	function renderResults(wrap, items) {
		const list = wrap.querySelector(RESULTS);
		if (!list) return;
		list.innerHTML = '';
		(items || []).forEach((item) => {
			const li = document.createElement('li');
			li.className = 'frost-child-alphabet-filter__result';
			li.innerHTML = `<a class="frost-child-alphabet-filter__resultLink" href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>`;
			list.appendChild(li);
		});
	}

	function debounce(fn, wait) {
		let t;
		return (...args) => {
			clearTimeout(t);
			t = setTimeout(() => fn(...args), wait);
		};
	}

	async function fetchItems({ postType, s, letter, perPage, signal }) {
		const endpoint = buildEndpoint();
		const url = new URL(endpoint, window.location.origin);
		url.searchParams.set('postType', postType);
		url.searchParams.set('perPage', String(perPage));
		if (s) url.searchParams.set('s', s);
		if (letter) url.searchParams.set('letter', letter);

		const res = await fetch(url.toString(), {
			method: 'GET',
			headers: { 'Accept': 'application/json' },
			signal,
		});

		if (!res.ok) {
			throw new Error(`Request failed: ${res.status}`);
		}
		return await res.json();
	}

	function bind(wrap) {
		if (!wrap || wrap.dataset.alphabetFilterBound === '1') return;
		wrap.dataset.alphabetFilterBound = '1';

		const postType = wrap.dataset.postType || 'post';
		const perPage = Math.max(1, Math.min(200, Number(wrap.dataset.perPage || 100) || 100));
		const allLabel = (wrap.dataset.allLabel || 'ALLA').toUpperCase();

		const searchEl = wrap.querySelector(SEARCH);
		const letters = Array.from(wrap.querySelectorAll(LETTERS));

		let state = {
			s: '',
			letter: 'ALLA',
		};

		let activeController = null;

		async function runFetch() {
			if (activeController) activeController.abort();
			activeController = new AbortController();

			const s = (state.s || '').trim();
			const letter = (state.letter || '').trim();
			const sendLetter = letter && letter !== allLabel ? letter : '';

			setStatus(wrap, '');
			wrap.classList.add('is-loading');

			try {
				const data = await fetchItems({
					postType,
					s,
					letter: sendLetter,
					perPage,
					signal: activeController.signal,
				});
				renderResults(wrap, data.items || []);
				const total = typeof data.total === 'number' ? data.total : (data.items || []).length;
				setStatus(wrap, `${total} resultat`);
			} catch (e) {
				if (e && e.name === 'AbortError') return;
				setStatus(wrap, 'Kunde inte hämta resultat.');
			} finally {
				wrap.classList.remove('is-loading');
			}
		}

		const runFetchDebounced = debounce(runFetch, 250);

		if (searchEl) {
			searchEl.addEventListener('input', () => {
				state.s = searchEl.value || '';
				runFetchDebounced();
			});
		}

		letters.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				const letter = (btn.dataset.letter || '').trim();
				if (!letter) return;
				state.letter = letter;
				setActiveLetter(wrap, letter);
				runFetch();
			});
		});

		// Initial state
		setActiveLetter(wrap, 'ALLA');
		runFetch();
	}

	function init() {
		document.querySelectorAll(WRAP).forEach(bind);
		if (!window.__alphabetFilterObserver) {
			window.__alphabetFilterObserver = new MutationObserver(() => {
				document.querySelectorAll(WRAP).forEach(bind);
			});
			window.__alphabetFilterObserver.observe(document.body, { childList: true, subtree: true });
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
