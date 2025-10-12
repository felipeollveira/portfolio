document.addEventListener('DOMContentLoaded', () => {

  const buttons = document.querySelectorAll(".filters button");
  const portfolioContainer = document.getElementById("portfolio-container");
  const template = document.getElementById('portfolio-item-template');
  let allProjects = [];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.1 });

  function displayProjects(projectsToDisplay) {
    portfolioContainer.innerHTML = ''; 

    if (projectsToDisplay.length === 0 && allProjects.length > 0) {
        portfolioContainer.innerHTML = '<p class="portfolio-empty">Nenhum projeto encontrado.</p>';
        return;
    }

    if (projectsToDisplay.length === 0) {
        portfolioContainer.innerHTML = '<p>Carregando projetos...</p>'; // Ou coloque seus skeletons aqui
    }

    projectsToDisplay.forEach(project => {
      const cardClone = template.content.cloneNode(true);
      
      const img = cardClone.querySelector('.card-image');
      img.src = project.image_url || 'https://picsum.photos/400/200';
      img.alt = `Imagem do projeto ${project.title}`;
      
      // 1. Escuta o evento 'load' da imagem
      img.onload = () => {
        // 2. Quando a imagem carregar, adiciona a classe .loaded
        img.classList.add('loaded');
      };
      // -------------------------

      cardClone.querySelector('.portfolio-item').dataset.category = project.category;
      cardClone.querySelector('p').textContent = project.description;
      cardClone.querySelector('a').href = project.project_url;

      const titleElement = cardClone.querySelector('h3');
      let iconHtml = '';
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => {
          const techMap = {
            'node-js': 'fab fa-node-js', 'html5': 'fab fa-html5', 'figma': 'fab fa-figma',
            'film': 'fas fa-film', 'android': 'fab fa-android', 'python': 'fab fa-python'
          };
          if (techMap[tech]) {
            iconHtml += `<i class="${techMap[tech]}"></i> `;
          }
        });
      }
      titleElement.innerHTML = `${project.title} ${iconHtml}`;

      portfolioContainer.appendChild(cardClone);
    });

    document.querySelectorAll(".portfolio-item.fade").forEach(el => observer.observe(el));
  }

  async function fetchProjects() {
    // Antes de buscar, você pode encher a tela com "templates" vazios para simular os skeletons
    // Isso cria o espaço que os cards vão ocupar
    for (let i = 0; i < 6; i++) {
      portfolioContainer.appendChild(template.content.cloneNode(true));
    }
      
    try {
      const response = await fetch('https://projects-tau-pearl.vercel.app/api/projects');
      if (!response.ok) throw new Error(`Erro na rede! Status: ${response.status}`);
      
      const projects = await response.json();
      allProjects = projects;
      displayProjects(allProjects);

    } catch (error) {
      console.error("Falha ao carregar projetos:", error);
      portfolioContainer.innerHTML = '<p class="portfolio-error">Não foi possível carregar os projetos.</p>';
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filters button.active").classList.remove("active");
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      const filteredProjects = (filter === "all")
        ? allProjects
        : allProjects.filter(project => project.category === filter);
      displayProjects(filteredProjects);
    });
  });

  fetchProjects();
});