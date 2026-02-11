<?php
/**
 * Dropdown Menu Block Template
 *
 * @param array    $attributes Block attributes
 * @param string   $content    Block content
 * @param WP_Block $block      Block instance
 */

$button_text = isset($attributes['buttonText']) ? esc_html($attributes['buttonText']) : 'Tjänster';
$menu_items = isset($attributes['menuItems']) ? $attributes['menuItems'] : [];
$locations = isset($attributes['locations']) ? $attributes['locations'] : [];
$popular_services = isset($attributes['popularServices']) ? $attributes['popularServices'] : [];
$popular_services_by_city = ( isset( $attributes['popularServicesByCity'] ) && is_array( $attributes['popularServicesByCity'] ) )
    ? $attributes['popularServicesByCity']
    : [];
$popular_services_title = isset($attributes['popularServicesTitle']) ? esc_html($attributes['popularServicesTitle']) : 'Populära tjänster i Stockholm:';

$initial_city = ( ! empty( $locations ) && is_array( $locations ) ) ? (string) $locations[0] : 'Stockholm';
$initial_city_key = trim( $initial_city );
$initial_services = [];
if ( $initial_city_key !== '' && isset( $popular_services_by_city[ $initial_city_key ] ) && is_array( $popular_services_by_city[ $initial_city_key ] ) ) {
    $initial_services = $popular_services_by_city[ $initial_city_key ];
} else {
    $initial_services = $popular_services;
}

$services_by_city_json = wp_json_encode( $popular_services_by_city );
$default_services_json = wp_json_encode( $popular_services );

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'dropdown-menu-wrapper']);
?>

<div <?php echo $wrapper_attributes; ?>>
    <button class="dropdown-menu-button" type="button" aria-expanded="false" aria-haspopup="true">
        <?php echo $button_text; ?> <span class="dropdown-arrow">⌵</span>
    </button>
    
    <div class="dropdown-menu-content" role="menu">
        <?php if (!empty($menu_items)) : ?>
            <div class="menu-items-grid" role="presentation">
                <div class="menu-sidebar" role="menu">
                    <?php foreach ($menu_items as $index => $item) : ?>
                        <?php
                        $item_title_raw = isset($item['title']) ? (string) $item['title'] : '';
                        $item_tags = (!empty($item['tags']) && is_array($item['tags'])) ? $item['tags'] : [];
                        $item_description = isset($item['description']) ? (string) $item['description'] : '';
                        $item_button_text = isset($item['buttonText']) ? (string) $item['buttonText'] : '';
                        $item_button_link = isset($item['buttonLink']) ? (string) $item['buttonLink'] : '';

                        // Fallback tags to match the intended design for this specific entry.
                        if (empty($item_tags) && stripos($item_title_raw, 'Mindre jobb') !== false) {
                            $item_tags = ['Elektriker', 'Rörmokare', 'Plattsättare', 'Målare', 'Snickare'];
                        }

                        // Fallback description to match the intended design for this specific entry.
                        if ($item_description === '' && stripos($item_title_raw, 'Mindre jobb') !== false) {
                            $item_description = 'Vi gör småfix och mindre jobb i hemmet enkelt, snabbt och utan krångel! Behöver du hjälp med att byta blandare, måla om ett par rum eller fixa ett elproblem? Då är vi rätt val!';
                        }

                        // Fallback button to match the intended design for this specific entry.
                        if ($item_button_text === '' && stripos($item_title_raw, 'Mindre jobb') !== false) {
                            $item_button_text = 'Läs mer';
                            if ($item_button_link === '') {
                                $item_button_link = '#';
                            }
                        }
                        ?>
                        <button
                            class="menu-sidebar-item"
                            type="button"
                            data-item-index="<?php echo esc_attr($index); ?>"
                            role="menuitem"
                        >
                            <?php if (!empty($item['title'])) : ?>
                                <span class="menu-sidebar-title"><?php echo esc_html($item['title']); ?></span>
                            <?php endif; ?>
                            <?php if (!empty($item['subtitle'])) : ?>
                                <span class="menu-sidebar-subtitle"><?php echo esc_html($item['subtitle']); ?></span>
                            <?php endif; ?>
                        </button>

                        <template class="menu-item-template" data-item-index="<?php echo esc_attr($index); ?>">
                            <?php if (!empty($item['title'])) : ?>
                                <h3 class="menu-item-title"><?php echo esc_html($item['title']); ?></h3>
                            <?php endif; ?>

                            <?php if (!empty($item_tags)) : ?>
                                <div class="menu-item-tags">
                                    <?php foreach ($item_tags as $tag) : ?>
                                        <span class="menu-item-tag"><?php echo esc_html($tag); ?></span>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>

                            <?php if ($item_description !== '') : ?>
                                <p class="menu-item-description"><?php echo esc_html($item_description); ?></p>
                            <?php endif; ?>

                            <?php if ($item_button_text !== '') : ?>
                                <a href="<?php echo esc_url($item_button_link); ?>" class="menu-item-button">
                                    <?php echo esc_html($item_button_text); ?>
                                </a>
                            <?php endif; ?>
                        </template>
                    <?php endforeach; ?>
                </div>

                <div class="menu-content" role="presentation">
                    <div class="menu-content-main" aria-live="polite"></div>

                    <div class="menu-content-divider" aria-hidden="true"></div>

                    <?php if (!empty($locations)) : ?>
                        <div class="locations-section">
                            <div class="locations-buttons">
                                <?php foreach ($locations as $index => $location) : ?>
                                    <button class="location-button <?php echo $index === 0 ? 'active' : ''; ?>" type="button">
                                        <?php echo esc_html($location); ?>
                                    </button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>

                    <?php if ( ! empty( $popular_services ) || ! empty( $popular_services_by_city ) ) : ?>
                        <div
                            class="popular-services-section"
                            data-services-by-city="<?php echo esc_attr( $services_by_city_json ); ?>"
                            data-default-services="<?php echo esc_attr( $default_services_json ); ?>"
                            data-initial-city="<?php echo esc_attr( $initial_city ); ?>"
                        >
                            <h4 class="popular-services-title">
                                <span class="popular-services-prefix">Populära tjänster i </span><span class="popular-services-city"><?php echo esc_html( $initial_city ); ?></span>:
                            </h4>
                            <div class="popular-services-list">
                                <?php foreach ((array) $initial_services as $service) : ?>
                                    <a href="#" class="popular-service-button">
                                        <?php echo esc_html($service); ?>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>
