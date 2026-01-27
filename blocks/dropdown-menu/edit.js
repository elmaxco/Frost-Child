import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button, IconButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
    const { buttonText, menuItems, locations, popularServices, popularServicesTitle } = attributes;
    const blockProps = useBlockProps();

    const updateMenuItem = (index, key, value) => {
        const newMenuItems = [...menuItems];
        newMenuItems[index][key] = value;
        setAttributes({ menuItems: newMenuItems });
    };

    const updateMenuItemTag = (menuIndex, tagIndex, value) => {
        const newMenuItems = [...menuItems];
        newMenuItems[menuIndex].tags[tagIndex] = value;
        setAttributes({ menuItems: newMenuItems });
    };

    const addMenuItem = () => {
        setAttributes({
            menuItems: [...menuItems, {
                title: 'New Item',
                subtitle: '',
                description: '',
                tags: [],
                buttonText: '',
                buttonLink: '#'
            }]
        });
    };

    const removeMenuItem = (index) => {
        const newMenuItems = menuItems.filter((_, i) => i !== index);
        setAttributes({ menuItems: newMenuItems });
    };

    const addTag = (menuIndex) => {
        const newMenuItems = [...menuItems];
        if (!newMenuItems[menuIndex].tags) {
            newMenuItems[menuIndex].tags = [];
        }
        newMenuItems[menuIndex].tags.push('New Tag');
        setAttributes({ menuItems: newMenuItems });
    };

    const removeTag = (menuIndex, tagIndex) => {
        const newMenuItems = [...menuItems];
        newMenuItems[menuIndex].tags = newMenuItems[menuIndex].tags.filter((_, i) => i !== tagIndex);
        setAttributes({ menuItems: newMenuItems });
    };

    const updateLocation = (index, value) => {
        const newLocations = [...locations];
        newLocations[index] = value;
        setAttributes({ locations: newLocations });
    };

    const addLocation = () => {
        setAttributes({ locations: [...locations, 'New Location'] });
    };

    const removeLocation = (index) => {
        setAttributes({ locations: locations.filter((_, i) => i !== index) });
    };

    const updatePopularService = (index, value) => {
        const newServices = [...popularServices];
        newServices[index] = value;
        setAttributes({ popularServices: newServices });
    };

    const addPopularService = () => {
        setAttributes({ popularServices: [...popularServices, 'New Service'] });
    };

    const removePopularService = (index) => {
        setAttributes({ popularServices: popularServices.filter((_, i) => i !== index) });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Menu Settings', 'frost-child')} initialOpen={true}>
                    <TextControl
                        label={__('Button Text', 'frost-child')}
                        value={buttonText}
                        onChange={(value) => setAttributes({ buttonText: value })}
                    />
                    
                    <h3>{__('Menu Items', 'frost-child')}</h3>
                    {menuItems.map((item, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
                            <TextControl
                                label={__('Title', 'frost-child')}
                                value={item.title}
                                onChange={(value) => updateMenuItem(index, 'title', value)}
                            />
                            <TextControl
                                label={__('Subtitle', 'frost-child')}
                                value={item.subtitle}
                                onChange={(value) => updateMenuItem(index, 'subtitle', value)}
                            />
                            <TextControl
                                label={__('Description', 'frost-child')}
                                value={item.description}
                                onChange={(value) => updateMenuItem(index, 'description', value)}
                                help={__('Main description text', 'frost-child')}
                            />
                            
                            <h4>{__('Tags', 'frost-child')}</h4>
                            {item.tags && item.tags.map((tag, tagIndex) => (
                                <div key={tagIndex} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                    <TextControl
                                        value={tag}
                                        onChange={(value) => updateMenuItemTag(index, tagIndex, value)}
                                    />
                                    <Button isDestructive onClick={() => removeTag(index, tagIndex)}>
                                        {__('Remove', 'frost-child')}
                                    </Button>
                                </div>
                            ))}
                            <Button isSecondary onClick={() => addTag(index)}>
                                {__('Add Tag', 'frost-child')}
                            </Button>
                            
                            <TextControl
                                label={__('Button Text', 'frost-child')}
                                value={item.buttonText}
                                onChange={(value) => updateMenuItem(index, 'buttonText', value)}
                            />
                            <TextControl
                                label={__('Button Link', 'frost-child')}
                                value={item.buttonLink}
                                onChange={(value) => updateMenuItem(index, 'buttonLink', value)}
                            />
                            <Button isDestructive onClick={() => removeMenuItem(index)}>
                                {__('Remove Menu Item', 'frost-child')}
                            </Button>
                        </div>
                    ))}
                    <Button isPrimary onClick={addMenuItem}>
                        {__('Add Menu Item', 'frost-child')}
                    </Button>
                </PanelBody>

                <PanelBody title={__('Locations', 'frost-child')} initialOpen={false}>
                    {locations.map((location, index) => (
                        <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                            <TextControl
                                value={location}
                                onChange={(value) => updateLocation(index, value)}
                            />
                            <Button isDestructive onClick={() => removeLocation(index)}>
                                {__('Remove', 'frost-child')}
                            </Button>
                        </div>
                    ))}
                    <Button isSecondary onClick={addLocation}>
                        {__('Add Location', 'frost-child')}
                    </Button>
                </PanelBody>

                <PanelBody title={__('Popular Services', 'frost-child')} initialOpen={false}>
                    <TextControl
                        label={__('Section Title', 'frost-child')}
                        value={popularServicesTitle}
                        onChange={(value) => setAttributes({ popularServicesTitle: value })}
                    />
                    {popularServices.map((service, index) => (
                        <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                            <TextControl
                                value={service}
                                onChange={(value) => updatePopularService(index, value)}
                            />
                            <Button isDestructive onClick={() => removePopularService(index)}>
                                {__('Remove', 'frost-child')}
                            </Button>
                        </div>
                    ))}
                    <Button isSecondary onClick={addPopularService}>
                        {__('Add Service', 'frost-child')}
                    </Button>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="dropdown-menu-wrapper">
                    <button className="dropdown-menu-button">
                        {buttonText} <span className="dropdown-arrow">▼</span>
                    </button>
                    <div className="dropdown-menu-preview">
                        <p style={{ padding: '10px', background: '#f0f0f0', textAlign: 'center' }}>
                            {__('Dropdown Menu (Preview in editor - see sidebar to edit)', 'frost-child')}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
