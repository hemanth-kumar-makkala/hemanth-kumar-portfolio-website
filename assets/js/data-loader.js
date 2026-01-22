/**
 * Portfolio Data Loader
 * Loads data from portfolio-data.json and dynamically updates the HTML
 */

(function () {
    'use strict';

    // Load portfolio data
    fetch('./data/portfolio-data.json')
        .then(response => response.json())
        .then(data => {
            updatePortfolio(data);
        })
        .catch(error => {
            console.error('Error loading portfolio data:', error);
        });

    function updatePortfolio(data) {
        // Update page title
        if (data.meta?.pageTitle) {
            document.title = data.meta.pageTitle;
        }

        // Update personal info
        updatePersonalInfo(data.personal);

        // Update contact info
        updateContactInfo(data.contact);

        // Update social links
        updateSocialLinks(data.social);

        // Update about section
        updateAboutSection(data.about, data.services);

        console.log('✅ Portfolio data loaded successfully!');
    }

    function updatePersonalInfo(personal) {
        if (!personal) return;

        // Update name
        const nameElements = document.querySelectorAll('.name');
        nameElements.forEach(el => {
            el.textContent = personal.fullName;
            el.setAttribute('title', personal.fullName);
        });

        // Update roles
        const titleElements = document.querySelectorAll('.info-content .title');
        if (titleElements.length >= personal.roles.length) {
            personal.roles.forEach((role, index) => {
                if (titleElements[index]) {
                    titleElements[index].textContent = role;
                }
            });
        }

        // Update page title
        if (personal.fullName) {
            document.title = `${personal.fullName} - Personal Portfolio`;
        }
    }

    function updateContactInfo(contact) {
        if (!contact) return;

        // Update email
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.href = `mailto:${contact.email}`;
            if (link.classList.contains('contact-link')) {
                link.textContent = contact.email;
            }
        });

        // Update phone
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.href = `tel:${contact.phone}`;
            link.textContent = contact.phoneDisplay;
        });

        // Update location
        const addressElements = document.querySelectorAll('address');
        addressElements.forEach(el => {
            el.textContent = contact.location;
        });
    }

    function updateSocialLinks(social) {
        if (!social) return;

        // GitHub
        if (social.github) {
            const githubLinks = document.querySelectorAll('a[href*="github.com"]');
            githubLinks.forEach(link => {
                link.href = social.github.url;
                if (link.classList.contains('contact-link')) {
                    link.textContent = social.github.display;
                }
            });
        }

        // LinkedIn
        if (social.linkedin) {
            const linkedinLinks = document.querySelectorAll('a[href*="linkedin.com"]');
            linkedinLinks.forEach(link => {
                link.href = social.linkedin.url;
                if (link.classList.contains('contact-link')) {
                    link.textContent = social.linkedin.display;
                }
            });
        }

        // YouTube
        if (social.youtube) {
            const youtubeLinks = document.querySelectorAll('a[href*="youtube.com"]');
            youtubeLinks.forEach(link => {
                link.href = social.youtube.url;
                if (link.classList.contains('contact-link')) {
                    link.textContent = social.youtube.display;
                }
            });
        }

        // Instagram
        if (social.instagram) {
            const instaLinks = document.querySelectorAll('a[href*="instagram.com"]');
            instaLinks.forEach(link => {
                link.href = social.instagram.url;
                if (link.classList.contains('contact-link')) {
                    link.textContent = social.instagram.display;
                }
            });
        }
    }

    function updateAboutSection(about, services) {
        if (!about) return;

        // Update about text paragraphs
        const aboutTextSection = document.querySelector('.about-text');
        if (aboutTextSection && about.intro && about.description) {
            aboutTextSection.innerHTML = `
        <p>${about.intro}</p>
        <p>${about.description}</p>
      `;
        }

        // Update services (optional - can be implemented if needed)
        // This would require more complex HTML generation
    }

})();
