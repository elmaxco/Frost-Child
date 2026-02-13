(function(wp) {
  const { registerBlockType } = wp.blocks;
  const { InspectorControls, useBlockProps } = wp.blockEditor;
  const { PanelBody, RangeControl, Button, TextControl, TextareaControl, ToggleControl } = wp.components;
  const { createElement: el, Fragment } = wp.element;
  const { __ } = wp.i18n;

  registerBlockType('frost-child/customer-reviews', {
    edit: function(props) {
      const { attributes, setAttributes } = props;
      const { reviews, cardsToShow, autoplay, autoplaySpeed } = attributes;
      const MAX_REVIEW_TEXT_LENGTH = 250;
      const blockProps = useBlockProps({
        className: 'review-carousel-editor'
      });

      const updateReview = (index, field, value) => {
        let nextValue = value;
        if (field === 'reviewText' && typeof value === 'string') {
          nextValue = value.slice(0, MAX_REVIEW_TEXT_LENGTH);
        }

        const newReviews = [...reviews];
        newReviews[index] = { ...newReviews[index], [field]: nextValue };
        setAttributes({ reviews: newReviews });
      };

      const addReview = () => {
        const newReviews = [...reviews, {
          reviewText: 'New review...',
          authorName: 'Name',
          date: new Date().toISOString().split('T')[0],
          rating: 5
        }];
        setAttributes({ reviews: newReviews });
      };

      const removeReview = (index) => {
        const newReviews = reviews.filter((_, i) => i !== index);
        setAttributes({ reviews: newReviews });
      };

      return el(Fragment, {},
        el(InspectorControls, {},
          el(PanelBody, { title: 'Carousel Settings', initialOpen: true },
            el(RangeControl, {
              label: 'Number of cards to show (desktop)',
              value: cardsToShow,
              onChange: (value) => setAttributes({ cardsToShow: value }),
              min: 1,
              max: 4,
              help: 'On mobile, one card is always shown at a time'
            }),
            el(ToggleControl, {
              label: 'Autoplay',
              checked: autoplay,
              onChange: (value) => setAttributes({ autoplay: value })
            }),
            autoplay && el(RangeControl, {
              label: 'Autoplay speed (ms)',
              value: autoplaySpeed,
              onChange: (value) => setAttributes({ autoplaySpeed: value }),
              min: 2000,
              max: 10000,
              step: 500
            })
          ),
          el(PanelBody, { title: 'Reviews', initialOpen: true },
            el(Button, {
              variant: 'secondary',
              onClick: addReview,
              style: { marginBottom: '10px' }
            }, 'Add review')
          )
        ),
        el('div', blockProps,
          el('div', { className: 'review-carousel-wrapper' },
            reviews.map((review, index) =>
              el('div', { key: index, className: 'review-card-editor' },
                el('div', { className: 'review-card-header' },
                  el('strong', {}, `Review ${index + 1}`),
                  el(Button, {
                    isDestructive: true,
                    isSmall: true,
                    onClick: () => removeReview(index)
                  }, 'Remove')
                ),
                el(TextareaControl, {
                  label: 'Review',
                  value: review.reviewText,
                  onChange: (value) => updateReview(index, 'reviewText', value),
                  rows: 3,
                  maxLength: MAX_REVIEW_TEXT_LENGTH,
                  help: `${(review.reviewText || '').length}/${MAX_REVIEW_TEXT_LENGTH} characters`
                }),
                el(TextControl, {
                  label: 'Name',
                  value: review.authorName,
                  onChange: (value) => updateReview(index, 'authorName', value)
                }),
                el(TextControl, {
                  label: 'Date',
                  type: 'date',
                  value: review.date,
                  onChange: (value) => updateReview(index, 'date', value)
                }),
                el(RangeControl, {
                  label: 'Rating',
                  value: review.rating,
                  onChange: (value) => updateReview(index, 'rating', value),
                  min: 1,
                  max: 5
                }),
                el('div', { className: 'rating-preview' },
                  '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
                )
              )
            )
          )
        )
      );
    },

    save: function(props) {
      const { attributes } = props;
      const { reviews, cardsToShow, autoplay, autoplaySpeed } = attributes;
      const blockProps = useBlockProps.save({
        className: 'review-carousel',
        'data-cards-to-show': cardsToShow,
        'data-autoplay': autoplay,
        'data-autoplay-speed': autoplaySpeed
      });

      return el('div', blockProps,
        el('div', { className: 'carousel-container' },
          el('div', { className: 'carousel-viewport' },
            el('div', { className: 'carousel-track' },
              reviews.map((review, index) =>
                el('div', { key: index, className: 'review-card' },
                  el('div', { className: 'review-rating' },
                    el('div', { className: 'stars' },
                      '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
                    )
                  ),
                  el('div', { className: 'review-text' },
                    el('p', {}, review.reviewText)
                  ),
                  el('div', { className: 'review-author' },
                    el('strong', {}, review.authorName),
                    el('span', { className: 'review-date' }, review.date)
                  )
                )
              )
            )
          ),
          el('button', { className: 'carousel-button prev', 'aria-label': 'Föregående' }, '‹'),
          el('button', { className: 'carousel-button next', 'aria-label': 'Nästa' }, '›'),
          el('div', { className: 'carousel-dots' })
        )
      );
    }
  });
})(window.wp);
