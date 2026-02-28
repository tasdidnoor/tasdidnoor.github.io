// Loading screen logic
let loadingScreenShown = false;
window.addEventListener('load', function() {
    if (loadingScreenShown) return;
    loadingScreenShown = true;
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
            }, 800);
        }, 1500);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const menuLinks = document.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('.section');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const currentActiveSection = document.querySelector('.section.active');
            
            if (currentActiveSection === targetSection) return;
            
            menuLinks.forEach(l => {
                if (l.getAttribute('href') === targetId) {
                    l.classList.add('active');
                } else {
                    l.classList.remove('active');
                }
            });
            
            // Handle iframes in the section we are leaving
            if (currentActiveSection) {
                const iframes = currentActiveSection.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    // Store the current src and clear it to stop playback definitively
                    const src = iframe.getAttribute('src');
                    if (src && src !== 'about:blank') {
                        iframe.setAttribute('data-src', src);
                        iframe.setAttribute('src', 'about:blank');
                    }
                });
                currentActiveSection.classList.remove('active');
            }
            
            // Show target section and restore its videos
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Restore iframes for the section we are entering
                const iframes = targetSection.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    const storedSrc = iframe.getAttribute('data-src');
                    if (storedSrc) {
                        iframe.setAttribute('src', storedSrc);
                    }
                });
                
                if (targetId === '#home') {
                    document.body.style.overflow = 'hidden';
                    document.documentElement.style.overflow = 'hidden';
                    window.scrollTo(0, 0);
                } else {
                    document.body.style.overflow = 'auto';
                    document.documentElement.style.overflow = 'auto';
                }
                
                targetSection.scrollTo(0, 0);
                window.scrollTo(0, 0);
            }
        });
    });
    
    // Set initial overflow for home
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    
    // ===== WORK CATEGORIES INTERACTION =====
    const workCategories = document.querySelectorAll('.work-category');
    const displayContents = document.querySelectorAll('.display-content');

    // Initialize first category as active
    if (workCategories.length > 0) {
        const firstCategory = workCategories[0].getAttribute('data-category');
        const firstContent = document.getElementById(`${firstCategory}-content`);
        if (firstContent) {
            workCategories[0].classList.add('active-category');
            firstContent.classList.add('active');
        }
    }

    workCategories.forEach(category => {
        // Hover effect
        category.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active-category')) {
                this.style.transform = 'translateX(5px)';
            }
        });
        
        category.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active-category')) {
                this.style.transform = 'translateX(0)';
            }
        });
        
        // Click: Content switching
        category.addEventListener('click', function(e) {
            e.preventDefault();
            
            const categoryType = this.getAttribute('data-category');
            const targetContent = document.getElementById(`${categoryType}-content`);
            const currentActiveContent = document.querySelector('.display-content.active');
            
            if (currentActiveContent === targetContent) return;
            
            // Remove active class from all categories
            workCategories.forEach(c => {
                c.classList.remove('active-category');
                c.style.transform = 'translateX(0)';
            });
            
            // Add active to clicked
            this.classList.add('active-category');
            this.style.transform = 'translateX(5px)';
            
            // Handle iframes in the content we are leaving
            if (currentActiveContent) {
                const iframes = currentActiveContent.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    const src = iframe.getAttribute('src');
                    if (src && src !== 'about:blank') {
                        iframe.setAttribute('data-src', src);
                        iframe.setAttribute('src', 'about:blank');
                    }
                });
                currentActiveContent.classList.remove('active');
            }
            
            // Show target content and restore its videos
            if (targetContent) {
                targetContent.classList.add('active');
                
                const iframes = targetContent.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    const storedSrc = iframe.getAttribute('data-src');
                    if (storedSrc) {
                        iframe.setAttribute('src', storedSrc);
                    }
                });
                
                // Scroll to top of content and the main work container
                targetContent.scrollTo(0, 0);
                const workDisplay = document.querySelector('.work-display');
                if (workDisplay) workDisplay.scrollTo(0, 0);
                window.scrollTo(0, 0);
            }
        });
    });

    // ===== STOCK CHARTS =====
    const stockChartContainer = document.querySelector('.stocks-content');
    if (stockChartContainer) {
        const stockData = [
            { label: 'TECH', value: 35, color: '#ff0000' },
            { label: 'HEALTH', value: 20, color: '#cc0000' },
            { label: 'FINANCE', value: 15, color: '#990000' },
            { label: 'ENERGY', value: 12, color: '#660000' },
            { label: 'CONSUMER', value: 10, color: '#ff3333' },
            { label: 'OTHER', value: 8, color: '#ff6666' }
        ];
        
        // Create charts when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        createPieChart('pieChart', stockData);
                        createBarChart('barChart', stockData);
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(stockChartContainer);
    }

    function createPieChart(svgId, data) {
        const svg = document.getElementById(svgId);
        if (!svg) return;
        
        svg.innerHTML = '';
        
        const centerX = 200;
        const centerY = 200;
        const radius = 150;
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        let cumulativeAngle = -Math.PI / 2;
        
        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            const endAngle = cumulativeAngle + sliceAngle;
            
            const x1 = centerX + radius * Math.cos(cumulativeAngle);
            const y1 = centerY + radius * Math.sin(cumulativeAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);
            
            const largeArc = sliceAngle > Math.PI ? 1 : 0;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            path.setAttribute('d', pathData);
            path.setAttribute('fill', item.color);
            path.setAttribute('class', 'pie-slice');
            path.setAttribute('data-value', item.value);
            path.setAttribute('data-label', item.label);
            path.style.transformOrigin = `${centerX}px ${centerY}px`;
            
            // Hover interaction
            path.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.filter = 'brightness(1.3)';
                
                // Show label at the top
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', centerX);
                label.setAttribute('y', 30);
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('fill', '#ffd700');
                label.setAttribute('font-size', '16');
                label.setAttribute('font-weight', 'bold');
                label.textContent = `${item.label}: ${item.value}%`;
                label.id = 'hover-label';
                svg.appendChild(label);
            });
            
            path.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.filter = 'brightness(1)';
                
                const label = document.getElementById('hover-label');
                if (label) label.remove();
            });
            
            svg.appendChild(path);
            cumulativeAngle = endAngle;
        });
        
        // Add center text
        const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        centerText.setAttribute('x', centerX);
        centerText.setAttribute('y', centerY + 175);
        centerText.setAttribute('text-anchor', 'middle');
        centerText.setAttribute('fill', '#ffd700');
        centerText.setAttribute('font-size', '16');
        centerText.setAttribute('font-weight', 'bold');
        centerText.textContent = 'PORTFOLIO';
        svg.appendChild(centerText);
    }

    function createBarChart(svgId, data) {
        const svg = document.getElementById(svgId);
        if (!svg) return;
        
        svg.innerHTML = '';
        
        const maxValue = Math.max(...data.map(d => d.value));
        const barWidth = 50;
        const spacing = 25;
        const chartHeight = 200;
        const chartY = 30;
        const chartBottom = chartY + chartHeight;
        
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = index * (barWidth + spacing) + 30;
            const y = chartY + chartHeight - barHeight;
            
            // Create bar
            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', x);
            bar.setAttribute('y', y);
            bar.setAttribute('width', barWidth);
            bar.setAttribute('height', barHeight);
            bar.setAttribute('fill', item.color);
            bar.setAttribute('class', 'bar');
            bar.setAttribute('data-value', item.value);
            bar.setAttribute('data-index', index);
            
            // Hover interaction
            bar.addEventListener('mouseenter', function() {
                this.style.opacity = '0.9';
                this.style.transform = 'translateY(-5px)';
                this.style.filter = 'brightness(1.2)';
                
                // Create and show percentage label on top
                const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                valueLabel.setAttribute('x', x + barWidth / 2);
                valueLabel.setAttribute('y', y - 17);
                valueLabel.setAttribute('text-anchor', 'middle');
                valueLabel.setAttribute('fill', '#ffd700');
                valueLabel.setAttribute('font-size', '12');
                valueLabel.setAttribute('font-weight', 'bold');
                valueLabel.setAttribute('class', 'hover-percentage');
                valueLabel.setAttribute('data-index', index);
                valueLabel.textContent = `${item.value}%`;
                svg.appendChild(valueLabel);
                
                // Create and show category label below
                const categoryLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                categoryLabel.setAttribute('x', x + barWidth / 2);
                categoryLabel.setAttribute('y', chartBottom + 20);
                categoryLabel.setAttribute('text-anchor', 'middle');
                categoryLabel.setAttribute('fill', '#fff');
                categoryLabel.setAttribute('font-size', '12');
                categoryLabel.setAttribute('class', 'hover-category');
                categoryLabel.setAttribute('data-index', index);
                categoryLabel.textContent = item.label;
                svg.appendChild(categoryLabel);
            });
            
            bar.addEventListener('mouseleave', function() {
                this.style.opacity = '1';
                this.style.transform = 'translateY(0)';
                this.style.filter = 'brightness(1)';
                
                // Remove hover labels
                const hoverPercentage = svg.querySelector(`.hover-percentage[data-index="${index}"]`);
                const hoverCategory = svg.querySelector(`.hover-category[data-index="${index}"]`);
                
                if (hoverPercentage) hoverPercentage.remove();
                if (hoverCategory) hoverCategory.remove();
            });
            
            svg.appendChild(bar);
        });
    }
    
    // ===== IMAGE SIZE CONTROL =====
    // You can call this function to adjust image sizes
    window.adjustImageSize = function(selector, height) {
        const images = document.querySelectorAll(selector);
        images.forEach(img => {
            img.style.maxHeight = height + 'px';
            img.style.width = 'auto';
        });
    };
    
    // Example: Uncomment to adjust image sizes
    // adjustImageSize('.art-img', 350); // Make art images 350px tall
    // adjustImageSize('.grid-img', 250); // Make grid images 250px tall
    
    // ===== SET CURRENT YEAR =====
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('#current-year');
    if (yearElements.length > 0) {
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
    
    // ===== PARALLAX EFFECT FOR DESKTOP =====
    const heroTop = document.querySelector('.hero-top');
    if (heroTop && window.innerWidth >= 768) {
        window.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            heroTop.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.02)`;
        });
    }
    
    // ===== TIMELINE INTERACTION =====
    const timelineItems = document.querySelectorAll('.timeline-item-simple');
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            timelineItems.forEach(i => i.classList.remove('focused'));
            this.classList.add('focused');
            
            // Pulse animation on click
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 0.3s ease';
            }, 10);
        });
    });
    
    // Add pulse animation for timeline
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .timeline-item-simple.focused {
            z-index: 10;
        }
        
        .timeline-item-simple.focused .timeline-content {
            box-shadow: 
                0 30px 60px rgba(0, 0, 0, 0.7),
                0 0 120px rgba(255, 0, 0, 0.2),
                inset 0 0 20px rgba(255, 0, 0, 0.1);
            border-color: rgba(255, 0, 0, 0.4);
        }
    `;
    document.head.appendChild(style);
});

(function() {
    // Detect Instagram's in-app browser
    const isInstagram = /Instagram/i.test(navigator.userAgent);
    
    if (isInstagram) {
        // Create a full-screen overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            text-align: center;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;
        
        overlay.innerHTML = `
            <h2 style="font-size: 24px; margin-bottom: 20px; color: #E1306C;">Instagram Browser Detected</h2>
            <p style="font-size: 16px; margin-bottom: 30px; max-width: 300px; line-height: 1.5;">
                For the best experience, please open this link in Safari, Chrome, or your default browser.
            </p>
            <div style="display: flex; gap: 15px; margin-top: 20px;">
                <button id="openExternal" style="background: #E1306C; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer;">
                    Open in Browser
                </button>
                <button id="continueAnyway" style="background: #333; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer;">
                    Continue Anyway
                </button>
            </div>
            <p style="font-size: 12px; margin-top: 30px; opacity: 0.7;">
                Tap the menu (•••) in the top right → "Open in Browser"
            </p>
        `;
        
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        
        // Open in external browser
        document.getElementById('openExternal').addEventListener('click', function() {
            window.open(window.location.href, '_blank');
        });
        
        // Continue in Instagram browser
        document.getElementById('continueAnyway').addEventListener('click', function() {
            document.body.removeChild(overlay);
            document.body.style.overflow = 'auto';
        });
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
                document.body.style.overflow = 'auto';
            }
        }, 10000);
    }
})();

