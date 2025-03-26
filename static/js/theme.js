document.addEventListener('DOMContentLoaded', function () {
    // Set animation delay for service groups
    const serviceGroups = document.querySelectorAll('.service-group');
    serviceGroups.forEach((group, index) => {
        group.style.setProperty('--index', index);

        // Add animation delay proportional to index
        group.style.animationDelay = `${0.1 * index}s`;
    });

    // Add hover effects to service items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        // Add subtle staggered fade-in animation
        item.style.animationDelay = `${0.05 * index}s`;

        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            item.style.transform = 'translateX(5px)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
            item.style.transform = 'translateX(0)';
        });
    });

    // Add dynamic classes to overall status based on actual status
    const overallStatus = document.getElementById('overall-status');
    if (overallStatus) {
        // This will be updated when actual status is loaded
        // Default functionality in case the main script fails to set classes
        const statusText = overallStatus.textContent.toLowerCase();
        if (statusText.includes('operational')) {
            overallStatus.classList.add('overall-operational');
        } else if (statusText.includes('degraded') || statusText.includes('partial')) {
            overallStatus.classList.add('overall-degraded');
        } else if (statusText.includes('outage') || statusText.includes('issue')) {
            overallStatus.classList.add('overall-issue');
        }
    }

    // Enhanced loading animation
    function createEnhancedLoader() {
        if (!document.getElementById('loading-animation')) {
            const loader = document.createElement('div');
            loader.id = 'loading-animation';

            const spinner = document.createElement('div');
            spinner.className = 'spinner';

            const text = document.createElement('p');
            text.textContent = 'Loading status information...';

            loader.appendChild(spinner);
            loader.appendChild(text);
            document.body.appendChild(loader);

            // Auto-hide loader after a reasonable timeout if the main script fails
            setTimeout(() => {
                if (document.getElementById('loading-animation')) {
                    document.getElementById('loading-animation').style.opacity = '0';
                    setTimeout(() => {
                        if (document.getElementById('loading-animation')) {
                            document.getElementById('loading-animation').remove();
                        }
                    }, 500);
                }
            }, 5000);
        }
    }

    // Create the enhanced loader on page load
    createEnhancedLoader();

    // Add subtle hover effects to buttons and interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .service-group h2');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'var(--transition-bounce)';
        });
    });
});