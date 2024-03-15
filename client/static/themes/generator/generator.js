document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('themeForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way
        generateTheme();
    });
});

function generateTheme() {
    const inputs = {
        'themeName': document.getElementById('themeName').value,
        'themeQuestion': document.getElementById('themeQuestion').value,
        'norm-font': document.getElementById('norm-font').value,
        'light-font': document.getElementById('light-font').value,
        'bold-font': document.getElementById('bold-font').value,
        'background-color': document.getElementById('background-color').value,
        'secondary-background-color': document.getElementById('secondary-background-color').value,
        'container-background-color': document.getElementById('container-background-color').value,
        'container-text-color': document.getElementById('container-text-color').value,
        'countdown-text-color': document.getElementById('countdown-text-color').value,
        'gallery-dot-color': document.getElementById('gallery-dot-color').value,
        'button-background-color': document.getElementById('button-background-color').value,
        'button-text-color': document.getElementById('button-text-color').value,
        'button-text-color-alt': document.getElementById('button-text-color-alt').value,
        'button-hover-background': document.getElementById('button-hover-background').value,
        'button-hover-background-alt': document.getElementById('button-hover-background-alt').value,
        'button-hover-text': document.getElementById('button-hover-text').value,
        'button-active-color': document.getElementById('button-active-color').value,
        'soft-color': document.getElementById('soft-color').value,
        'calendar-red': document.getElementById('calendar-red').value,
        'calendar-green': document.getElementById('calendar-green').value,
        'calendar-blue': document.getElementById('calendar-blue').value,
        'calendar-yellow': document.getElementById('calendar-yellow').value,
        'calendar-silver': document.getElementById('calendar-silver').value,
        'calendar-purple': document.getElementById('calendar-purple').value,
        'calendar-gray': document.getElementById('calendar-gray').value,
        'calendar-white': document.getElementById('calendar-white').value,
        'header-background-color': document.getElementById('header-background-color').value,
        'header-text-color': document.getElementById('header-text-color').value,
        'header-icon-color': document.getElementById('header-icon-color').value,
        'navigation-background-color': document.getElementById('navigation-background-color').value,
        'navigation-icon-color': document.getElementById('navigation-icon-color').value,
        'navigation-active-icon-color': document.getElementById('navigation-active-icon-color').value,
        'error-bg': document.getElementById('error-bg').value,
        'active-color': document.getElementById('active-color').value,
        'active-hover-color': document.getElementById('active-hover-color').value,
        'dark-color': document.getElementById('dark-color').value,
        'outline-color': document.getElementById('outline-color').value,
        'anchor-color': document.getElementById('anchor-color').value,
        'anchor-hover': document.getElementById('anchor-hover').value,
        // Add new theme variables here as needed
    };

    // Initialize CSS snippet
    let cssSnippet = ':root {\n';
    Object.keys(inputs).forEach(key => {
        if (key !== 'themeName' && key !== 'themeQuestion') { // Skip non-CSS variables
            cssSnippet += `    --${key}: ${inputs[key]};\n`;
        }
    });
    cssSnippet += '}\n';

    // Handle SVG icon upload
    const iconSvgInput = document.getElementById('icon-svg');
    if (iconSvgInput.files && iconSvgInput.files[0]) {
        readFileAsDataURL(iconSvgInput.files[0], (iconSvgDataURL) => {
            cssSnippet += `    --icon-svg-url: url('${iconSvgDataURL}');\n`;
            processBackgroundImage(cssSnippet);
        });
    } else {
        processBackgroundImage(cssSnippet); // No SVG icon uploaded
    }
}

function processBackgroundImage(cssSnippet) {
    // Handle background image upload
    const backgroundImageInput = document.getElementById('background-image');
    if (backgroundImageInput.files && backgroundImageInput.files[0]) {
        readFileAsDataURL(backgroundImageInput.files[0], (backgroundImageDataURL) => {
            cssSnippet += `    --background-image: url('${backgroundImageDataURL}');\n`;
            finalizeOutput(cssSnippet);
        });
    } else {
        finalizeOutput(cssSnippet); // No background image uploaded
    }
}

function readFileAsDataURL(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

function finalizeOutput(cssSnippet) {
    document.getElementById('cssOutput').value = cssSnippet;
    // Here you can also generate and display JavaScript or other configurations based on the form inputs if needed
}
