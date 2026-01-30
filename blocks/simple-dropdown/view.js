document.addEventListener('DOMContentLoaded', function () {
	const blocks = document.querySelectorAll('.frost-child-simple-dropdown');
	if (!blocks.length) return;

	function closeAll(except) {
		blocks.forEach(function (wrap) {
			if (except && wrap === except) return;
			wrap.classList.remove('is-open');
			const btn = wrap.querySelector('.frost-child-simple-dropdown__button');
			if (btn) btn.setAttribute('aria-expanded', 'false');
		});
	}

	blocks.forEach(function (wrap) {
		const button = wrap.querySelector('.frost-child-simple-dropdown__button');
		if (!button) return;

		button.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();

			const isOpen = wrap.classList.contains('is-open');
			closeAll(wrap);
			wrap.classList.toggle('is-open', !isOpen);
			button.setAttribute('aria-expanded', String(!isOpen));
		});
	});

	document.addEventListener('click', function (e) {
		const clickedInside = e.target.closest('.frost-child-simple-dropdown');
		if (clickedInside) return;
		closeAll();
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeAll();
	});
});
