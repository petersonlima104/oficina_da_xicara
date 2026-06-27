const galleryGrid = document.getElementById("galleryGrid");

let carregadas = 0;
const LOTE = 24;

let imagens = [];

// Carrega as imagens da categoria escolhida
function carregarCategoria(categoria) {
  imagens = [];
  carregadas = 0;
  galleryGrid.innerHTML = "";

  switch (categoria) {
    case "games":
      for (let i = 1; i <= 468; i++) {
        imagens.push(`assets/games/Arte (${i}).jpg`);
      }

      break;

    case "series":
      for (let i = 1; i <= 252; i++) {
        imagens.push(`assets/series/Arte (${i}).jpg`);
      }
      for (let i = 1; i <= 44; i++) {
        imagens.push(`assets/seriespng/Arte (${i}).png`);
      }

      break;

    case "datas":
      for (let i = 1; i <= 213; i++) {
        imagens.push(`assets/datas/Arte (${i}).jpg`);
      }
      for (let i = 1; i <= 124; i++) {
        imagens.push(`assets/dataspng/Arte (${i}).png`);
      }

      break;

    case "animes":
      for (let i = 1; i <= 67; i++) {
        imagens.push(`assets/anime/Arte (${i}).jpg`);
      }
      for (let i = 1; i <= 29; i++) {
        imagens.push(`assets/animepng/Arte (${i}).png`);
      }

      break;

    default:
      // Todos

      for (let i = 1; i <= 252; i++) {
        imagens.push(`assets/series/Arte (${i}).jpg`);
      }
      for (let i = 1; i <= 44; i++) {
        imagens.push(`assets/seriespng/Arte (${i}).png`);
      }

      for (let i = 1; i <= 468; i++) {
        imagens.push(`assets/games/Arte (${i}).jpg`);
      }

      for (let i = 1; i <= 67; i++) {
        imagens.push(`assets/anime/Arte (${i}).jpg`);
      }
      for (let i = 1; i <= 29; i++) {
        imagens.push(`assets/animepng/Arte (${i}).png`);
      }

      for (let i = 1; i <= 213; i++) {
        imagens.push(`assets/datas/Arte (${i}).jpg`);
      }
      for (let i = 1; i <= 124; i++) {
        imagens.push(`assets/dataspng/Arte (${i}).png`);
      }
  }

  carregarImagens();
}

function carregarImagens() {
  const fim = Math.min(carregadas + LOTE, imagens.length);

  for (let i = carregadas; i < fim; i++) {
    const div = document.createElement("div");

    div.className = "gallery-item";

    div.innerHTML = `
            <img
                src="${imagens[i]}"
                alt="Arte ${i + 1}"
                loading="lazy">
        `;

    galleryGrid.appendChild(div);
  }

  carregadas = fim;
}

window.addEventListener("scroll", () => {
  if (carregadas >= imagens.length) {
    return;
  }

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    carregarImagens();
  }
});

// Clique dos botões
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    carregarCategoria(btn.dataset.category);
  });
});

// Carrega a categoria inicial
carregarCategoria("todos");
