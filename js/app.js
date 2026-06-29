const produtosGrid = document.getElementById("produtos");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarContador() {
  const carrinho = obterCarrinho();

  const total = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

  cartCount.textContent = total;
}

function mostrarToast(mensagem) {
  toast.textContent = mensagem;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function adicionarCarrinho(id) {
  const produto = produtos.find((p) => p.id === id);

  const carrinho = obterCarrinho();

  const existe = carrinho.find((i) => i.id === id);

  if (existe) {
    existe.quantidade++;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
    });
  }

  salvarCarrinho(carrinho);

  atualizarContador();

  mostrarToast("Produto adicionado ao carrinho");
}

function criarMidia(item) {
  if (item.tipo === "video") {
    return `
        <video controls>
            <source
                src="${item.src}"
                type="video/mp4">
        </video>
    `;
  }

  return `
    <img
        src="${item.src}"
        alt="Produto"
        loading="lazy">
`;
}

function renderizarProdutos(lista) {
  const nomesCategorias = {
    serie: "Séries",
    gamescla: "Games Clássicos",
    anime: "Animes",
    games: "Games",
    datas: "Datas Especiais",
    profissao: "Profissões",
    personalizada: "Personalizado",
  };

  produtosGrid.innerHTML = "";

  lista.forEach((produto) => {
    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `

        <div
            class="product-media"
            data-id="${produto.id}">

            ${criarMidia(produto.midias[0])}

            <button
                class="gallery-nav prev-btn">
                ◀
            </button>

            <button
                class="gallery-nav next-btn">
                ▶
            </button>

        </div>

        <div
            class="product-info">

            <div
                class="product-category">

                ${nomesCategorias[produto.categoria] || produto.categoria}

            </div>

            <h3
                class="product-name">

                ${produto.nome}

            </h3>

            <div
                class="product-price">

                R$
                ${produto.preco.toFixed(2).replace(".", ",")}

            </div>

            <button
                class="add-btn"
                onclick="adicionarCarrinho(${produto.id})">

                Adicionar ao Carrinho

            </button>

        </div>
    `;

    produtosGrid.appendChild(card);

    iniciarGaleria(produto);
  });
}

function iniciarGaleria(produto) {
  const container = document.querySelector(`[data-id="${produto.id}"]`);

  if (!container) return;

  let indice = 0;

  const prev = container.querySelector(".prev-btn");

  const next = container.querySelector(".next-btn");

  function atualizar() {
    const midia = produto.midias[indice];

    const botoes = container.querySelectorAll(".gallery-nav");

    container.innerHTML = criarMidia(midia);

    botoes.forEach((btn) => {
      container.appendChild(btn);
    });
  }

  prev.addEventListener("click", () => {
    indice--;

    if (indice < 0) {
      indice = produto.midias.length - 1;
    }

    atualizar();
  });

  next.addEventListener("click", () => {
    indice++;

    if (indice >= produto.midias.length) {
      indice = 0;
    }

    atualizar();
  });
}

function aplicarFiltros() {
  const busca = searchInput.value.toLowerCase();

  const categoria = categoryFilter.value;

  const filtrados = produtos.filter((produto) => {
    const nomeOk = produto.nome.toLowerCase().includes(busca);

    const categoriaOk =
      categoria === "Todos" || produto.categoria === categoria;

    return nomeOk && categoriaOk;
  });

  renderizarProdutos(filtrados);
}

searchInput.addEventListener("input", aplicarFiltros);

categoryFilter.addEventListener("change", aplicarFiltros);

const darkBtn = document.getElementById("darkModeBtn");

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  localStorage.setItem(
    "darkMode",

    document.body.classList.contains("dark-mode"),
  );
});

renderizarProdutos(produtos);

atualizarContador();
