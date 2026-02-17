( function () {
	var ROOT_SELECTOR = '.wp-block-frost-child-faq-dropdown';

	function closeItem( item ) {
		if ( ! item ) {
			return;
		}

		var trigger = item.querySelector( '.frost-child-faq-dropdown__trigger' );
		var panel = item.querySelector( '.frost-child-faq-dropdown__panel' );

		item.classList.remove( 'is-open' );
		if ( trigger ) {
			trigger.setAttribute( 'aria-expanded', 'false' );
		}
		if ( panel ) {
			panel.hidden = false;
			panel.setAttribute( 'aria-hidden', 'true' );
		}
	}

	function openItem( item ) {
		if ( ! item ) {
			return;
		}

		var trigger = item.querySelector( '.frost-child-faq-dropdown__trigger' );
		var panel = item.querySelector( '.frost-child-faq-dropdown__panel' );

		item.classList.add( 'is-open' );
		if ( trigger ) {
			trigger.setAttribute( 'aria-expanded', 'true' );
		}
		if ( panel ) {
			panel.hidden = false;
			panel.setAttribute( 'aria-hidden', 'false' );
		}
	}

	function bindAccordion( root ) {
		if ( ! root || root.dataset.faqDropdownBound === '1' ) {
			return;
		}

		root.dataset.faqDropdownBound = '1';

		var items = Array.from( root.querySelectorAll( '.frost-child-faq-dropdown__item' ) );
		items.forEach( function ( item ) {
			closeItem( item );
			var trigger = item.querySelector( '.frost-child-faq-dropdown__trigger' );
			if ( ! trigger ) {
				return;
			}

			trigger.addEventListener( 'click', function () {
				var isOpen = item.classList.contains( 'is-open' );

				items.forEach( function (otherItem) {
					if ( otherItem !== item ) {
						closeItem( otherItem );
					}
				} );

				if ( isOpen ) {
					closeItem( item );
				} else {
					openItem( item );
				}
			} );
		} );
	}

	function init() {
		Array.from( document.querySelectorAll( ROOT_SELECTOR ) ).forEach( bindAccordion );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();