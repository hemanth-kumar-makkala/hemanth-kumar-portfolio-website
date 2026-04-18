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

        // Update projects section
        if (data.projects) {
            updateProjectsSection(data.projects);
        }

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
        // (Removed to allow index.html to be the source of truth for the About Me section)
    }

    function updateProjectsSection(projects) {
        // --- DYNAMIC FILTERS ---
        const filterList = document.getElementById('dynamic-filter-list');
        const selectList = document.getElementById('dynamic-select-list');
        
        if (filterList && selectList) {
            filterList.innerHTML = '<li class="filter-item"><button class="active" data-filter-btn>All</button></li>';
            selectList.innerHTML = '<li class="select-item"><button data-select-item>All</button></li>';
            
            const categories = new Set();
            projects.forEach(p => {
                if(p.category) categories.add(p.category.toLowerCase());
            });
            
            categories.forEach(category => {
                const titleCase = category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                
                const btnLi = document.createElement('li');
                btnLi.className = 'filter-item';
                btnLi.innerHTML = `<button data-filter-btn>${titleCase}</button>`;
                filterList.appendChild(btnLi);
                
                const selLi = document.createElement('li');
                selLi.className = 'select-item';
                selLi.innerHTML = `<button data-select-item>${titleCase}</button>`;
                selectList.appendChild(selLi);
            });
            
            // Bind filter logic internally to ensure reliability
            const filterBtns = filterList.querySelectorAll('[data-filter-btn]');
            const selectItems = selectList.querySelectorAll('[data-select-item]');
            const selectValue = document.querySelector('[data-selecct-value]');
            
            const applyFilter = (selectedVal) => {
                const filterItems = document.querySelectorAll("[data-filter-item]");
                filterItems.forEach(item => {
                    item.classList.remove("active");
                    if (selectedVal === "all" || selectedVal === item.dataset.category) {
                        item.classList.add("active");
                    }
                });
            };
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const selectedVal = this.innerText.toLowerCase();
                    if(selectValue) selectValue.innerText = this.innerText;
                    applyFilter(selectedVal);
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            selectItems.forEach(item => {
                item.addEventListener('click', function() {
                    const selectedVal = this.innerText.toLowerCase();
                    if(selectValue) selectValue.innerText = this.innerText;
                    const select = document.querySelector('[data-select]');
                    if(select) select.classList.remove('active'); // collapse dropdown
                    applyFilter(selectedVal);
                    
                    filterBtns.forEach(b => {
                        b.classList.remove('active');
                        if (b.innerText.toLowerCase() === selectedVal) b.classList.add('active');
                    });
                });
            });
        }

        // --- PROJECTS RENDERING ---
        const projectList = document.querySelector('.project-list');
        if (!projectList) return;

        projectList.innerHTML = '';
        projects.forEach(project => {
            const li = document.createElement('li');
            li.className = 'project-item active';
            li.dataset.filterItem = '';
            li.dataset.category = project.category ? project.category.toLowerCase() : 'sys';

            li.innerHTML = `
            <div style="background: var(--eerie-black-2); border: 1px solid var(--jet); border-radius: 16px; padding: 25px; display: flex; flex-wrap: wrap; gap: 30px; align-items: stretch; margin-bottom: 20px; box-shadow: var(--shadow-1);">
                
                <!-- LEFT SIDE: ONLY IMAGE -->
                <a href="#" onclick="openCaseStudyById('${project.id}'); return false;" style="flex: 1; min-width: 250px; flex-basis: 40%; border-radius: 12px; overflow: hidden; display: block;">
                    <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                </a>
                
                <!-- RIGHT SIDE: CONTENT & BUTTON -->
                <div style="flex: 1; flex-basis: 50%; display: flex; flex-direction: column; justify-content: flex-start; padding-top: 10px;">
                    <h3 style="color: var(--white-2); font-size: var(--fs-3); margin-bottom: 12px; font-weight: 600;">${project.title}</h3>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">
                        ${(project.tags||[]).map(tag => `<span style="font-size: var(--fs-7); padding: 4px 10px; background: hsla(45, 100%, 72%, 0.1); color: var(--orange-yellow-crayola); border-radius: 6px;">${tag}</span>`).join('')}
                    </div>
                    
                    <p style="color: var(--light-gray); font-size: var(--fs-5); margin-bottom: 20px; line-height: 1.6;">
                        <strong style="color: var(--white-2);">Impact:</strong> ${project.impact}
                    </p>
                    
                    <button onclick="openCaseStudyById('${project.id}')" style="margin-top: auto; padding: 10px 20px; border: 1px solid var(--orange-yellow-crayola); color: var(--orange-yellow-crayola); background: transparent; border-radius: 8px; font-size: var(--fs-6); display: inline-flex; align-items: center; gap: 8px; width: fit-content; transition: 0.3s; cursor: pointer; font-weight: 500;" onmouseover="this.style.background='var(--orange-yellow-crayola)'; this.style.color='var(--smoky-black)';" onmouseout="this.style.background='transparent'; this.style.color='var(--orange-yellow-crayola)';">
                        View Full Case Study <ion-icon name="arrow-forward-outline"></ion-icon>
                    </button>
                </div>
            </div>
            `;
            projectList.appendChild(li);
        });

        // Direct Case Study Opener
        window.openCaseStudyById = function(projectId) {
            const project = projects.find(p => p.id === projectId);
            if (!project) return;
            window.openCaseStudy(project);
        };
        
        // --- CASE STUDY SPA ROUTING ---
        window.openCaseStudy = function(project) {
            document.getElementById('cs-title').textContent = project.title;
            document.getElementById('cs-impact').innerHTML = (project.impact || "").replace(/\n/g, '<br>');
            document.getElementById('cs-main-image').src = project.image;
            document.getElementById('cs-problem').innerHTML = (project.problem || "Not specified.").replace(/\n/g, '<br>');
            document.getElementById('cs-hypothesis').innerHTML = (project.hypothesis || "Not specified.").replace(/\n/g, '<br>');
            document.getElementById('cs-architecture').innerHTML = (project.architecture || "Not specified.").replace(/\n/g, '<br>');

            const contextHeader = document.getElementById('cs-context-header');
            const contextContainer = document.getElementById('cs-context');
            if (contextHeader && contextContainer) {
                if (project.context) {
                    contextHeader.style.display = 'block';
                    contextContainer.style.display = 'block';
                    contextContainer.innerHTML = project.context.replace(/\n/g, '<br>');
                } else {
                    contextHeader.style.display = 'none';
                    contextContainer.style.display = 'none';
                    contextContainer.innerHTML = '';
                }
            }

            const systemDesignHeader = document.getElementById('cs-system-design-header');
            const systemDesignContainer = document.getElementById('cs-system-design');
            if (systemDesignHeader && systemDesignContainer) {
                if (project.system_design) {
                    systemDesignHeader.style.display = 'block';
                    systemDesignContainer.innerHTML = project.system_design.replace(/\n/g, '<br>');
                } else {
                    systemDesignHeader.style.display = 'none';
                    systemDesignContainer.innerHTML = '';
                }
            }

            const tagsContainer = document.getElementById('cs-tags');
            tagsContainer.innerHTML = '';
            (project.tags || []).forEach(tag => {
                const span = document.createElement('span');
                span.textContent = tag;
                span.style.cssText = "background: hsla(45, 100%, 72%, 0.1); color: var(--orange-yellow-crayola); padding: 6px 14px; border-radius: 6px; font-size: var(--fs-7); font-weight: 500;";
                tagsContainer.appendChild(span);
            });

            const imagesContainer = document.getElementById('cs-additional-images');
            imagesContainer.innerHTML = '';
            if (project.additional_images && project.additional_images.length > 0) {
                imagesContainer.style.marginTop = '20px';
                project.additional_images.forEach(imgUrl => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.style.cssText = "width: 100%; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--jet); box-shadow: var(--shadow-2);";
                    imagesContainer.appendChild(img);
                });
            }

            const populateList = (id, items) => {
                const container = document.getElementById(id);
                container.innerHTML = '';
                if (!items || items.length === 0) {
                    container.innerHTML = '<li style="color: var(--light-gray-70)">Not specified.</li>';
                    return;
                }
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.style.cssText = "color: var(--light-gray); line-height: 1.7; font-size: var(--fs-5); margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;";
                    li.innerHTML = '<ion-icon name="checkmark-circle-outline" style="color: var(--orange-yellow-crayola); margin-top: 4px; flex-shrink: 0; font-size: 18px;"></ion-icon> <span>' + item + '</span>';
                    container.appendChild(li);
                });
            };

            const implHeader = document.getElementById('cs-implementation-header');
            const csDetails = document.getElementById('cs-details');
            const implSummary = document.getElementById('cs-implementation-summary');

            if (project.implementation_summary) {
                if (implHeader) implHeader.textContent = "Implementation Summary";
                if (csDetails) csDetails.style.display = 'none';
                if (implSummary) {
                    implSummary.style.display = 'block';
                    implSummary.innerHTML = project.implementation_summary.replace(/\n/g, '<br>');
                }
            } else {
                if (implHeader) implHeader.textContent = "Implementation Details";
                if (csDetails) csDetails.style.display = 'block';
                if (implSummary) implSummary.style.display = 'none';
                populateList('cs-details', project.details);
            }
            populateList('cs-ai-safety', project.ai_safety);
            populateList('cs-outcome', project.outcome);

            const failureHeader = document.getElementById('cs-failure-header');
            const csFailure = document.getElementById('cs-failure');
            if (project.failure_handling && project.failure_handling.length > 0) {
                if (failureHeader) failureHeader.style.display = 'block';
                if (csFailure) csFailure.style.display = 'block';
                populateList('cs-failure', project.failure_handling);
            } else {
                if (failureHeader) failureHeader.style.display = 'none';
                if (csFailure) csFailure.style.display = 'none';
            }

            const closingLine = document.getElementById('cs-closing-line');
            if (closingLine) {
                closingLine.textContent = project.closing_line || '';
                closingLine.style.display = project.closing_line ? 'block' : 'none';
            }

            // Hide other pages and remove navlink active states naturally
            const pages = document.querySelectorAll("[data-page]");
            const navLinks = document.querySelectorAll("[data-nav-link]");
            
            pages.forEach(p => p.classList.remove('active'));
            navLinks.forEach(n => n.classList.remove('active'));
            
            // Instead of highlighting a specific navlink, we just make the details page active.
            // This way when they click "Projects" in the navbar, script.js handles switching back correctly!
            document.querySelector('[data-page="project-details"]').classList.add('active');
            window.scrollTo(0, 0);
        };
    }

})();
