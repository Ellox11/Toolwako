document.addEventListener('DOMContentLoaded', function() {

    // Intersection Observer for animations on scroll
    const observerOptions = {
        root: null, // observes intersections relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve the element after it has become visible
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Observe all elements with the class 'tool-card' and 'feature-item'
    const elementsToAnimate = document.querySelectorAll('.tool-card, .feature-item, .seo-content');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

});
