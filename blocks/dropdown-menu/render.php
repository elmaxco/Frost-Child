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
$popular_services_title = isset($attributes['popularServicesTitle']) ? esc_html($attributes['popularServicesTitle']) : 'Populära tjänster i Stockholm:';

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'dropdown-menu-wrapper']);
?>

<div <?php echo $wrapper_attributes; ?>>
    <button class="dropdown-menu-button" type="button" aria-expanded="false" aria-haspopup="true">
        <?php echo $button_text; ?> <span class="dropdown-arrow">▼</span>
    </button>
    
    <div class="dropdown-menu-content" role="menu">
        <?php if (!empty($menu_items)) : ?>
            <div class="menu-items-grid">
                <?php foreach ($menu_items as $index => $item) : ?>
                    <div class="menu-item-card <?php echo empty($item['description']) ? 'no-background' : ''; ?>">
                        <?php if (!empty($item['title'])) : ?>
                            <h3 class="menu-item-title"><?php echo esc_html($item['title']); ?></h3>
                        <?php endif; ?>
                        
                        <?php if (!empty($item['subtitle'])) : ?>
                            <p class="menu-item-subtitle"><?php echo esc_html($item['subtitle']); ?></p>
                        <?php endif; ?>
                        
                        <?php if (!empty($item['tags']) && is_array($item['tags'])) : ?>
                            <div class="menu-item-tags">
                                <?php foreach ($item['tags'] as $tag) : ?>
                                    <span class="menu-item-tag"><?php echo esc_html($tag); ?></span>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if (!empty($item['description'])) : ?>
                            <p class="menu-item-description"><?php echo esc_html($item['description']); ?></p>
                        <?php endif; ?>
                        
                        <?php if (!empty($item['buttonText'])) : ?>
                            <a href="<?php echo esc_url($item['buttonLink']); ?>" class="menu-item-button">
                                <?php echo esc_html($item['buttonText']); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
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
        
        <?php if (!empty($popular_services)) : ?>
            <div class="popular-services-section">
                <h4 class="popular-services-title"><?php echo $popular_services_title; ?></h4>
                <div class="popular-services-list">
                    <?php foreach ($popular_services as $service) : ?>
                        <a href="#" class="popular-service-button">
                            <?php echo esc_html($service); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>
