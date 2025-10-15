document.addEventListener('DOMContentLoaded', () => {

  
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