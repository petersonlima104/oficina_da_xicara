const TOTAL_IMAGENS_JPG = 1000;
const TOTAL_IMAGENS_PNG = 197;

const imagens = [];

for (let i = 1; i <= TOTAL_IMAGENS_JPG; i++) {
  imagens.push(`assets/galeriajpg/Arte (${i}).jpg`);
}

for (let i = 1; i <= TOTAL_IMAGENS_PNG; i++) {
  imagens.push(`assets/galeriapng/Arte (${i}).png`);
}

const galleryGrid = document.getElementById("galleryGrid");

const loadMoreBtn = document.getElementById("loadMoreBtn");

let carregadas = 0;

const LOTE = 24;

function carregarImagens() {
  const fim = carregadas + LOTE;

  for (let i = carregadas; i < fim && i < imagens.length; i++) {
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

  carregadas = Math.min(carregadas + LOTE, imagens.length);

  if (carregadas >= imagens.length) {
    loadMoreBtn.style.display = "none";
  }
}

window.addEventListener("scroll", () => {
  if (carregadas >= imagens.length) {
    return;
  }

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    carregarImagens();
  }
});

carregarImagens();
