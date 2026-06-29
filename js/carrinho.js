const listaCarrinho = document.getElementById("listaCarrinho");

const valorTotal = document.getElementById("valorTotal");

const btnWhatsapp = document.getElementById("btnWhatsapp");

const btnLimpar = document.getElementById("btnLimpar");

function obterCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function aumentar(id) {
  const carrinho = obterCarrinho();

  const item = carrinho.find((p) => p.id === id);

  if (item) {
    item.quantidade++;

    salvarCarrinho(carrinho);

    renderizar();
  }
}

function diminuir(id) {
  let carrinho = obterCarrinho();

  const item = carrinho.find((p) => p.id === id);

  if (item) {
    item.quantidade--;

    if (item.quantidade <= 0) {
      carrinho = carrinho.filter((p) => p.id !== id);
    }

    salvarCarrinho(carrinho);

    renderizar();
  }
}

function calcularTotal() {
  const carrinho = obterCarrinho();

  return carrinho.reduce(
    (soma, item) => {
      return soma + item.preco * item.quantidade;
    },

    0,
  );
}

function renderizar() {
  const carrinho = obterCarrinho();

  listaCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = `

        <div
        class="feature-card">

            <h3>
                Seu carrinho está vazio
            </h3>

            <br>

            <a
            href="index.html"
            class="hero-btn">

                Ver Produtos

            </a>

        </div>

    `;

    valorTotal.textContent = "R$ 0,00";

    return;
  }

  carrinho.forEach((item) => {
    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `

        <div
        class="cart-info">

            <h3>
                ${item.nome}
            </h3>

            <p>
                ${formatarMoeda(item.preco)}
            </p>

        </div>

        <div
        class="qty-controls">

            <button
            class="qty-btn"
            onclick="
            diminuir(${item.id})
            ">
                -
            </button>

            <span
            class="qty-number">

                ${item.quantidade}

            </span>

            <button
            class="qty-btn"
            onclick="
            aumentar(${item.id})
            ">
                +
            </button>

        </div>

        <div>

            <strong>

                ${formatarMoeda(item.preco * item.quantidade)}

            </strong>

        </div>

    `;

    listaCarrinho.appendChild(div);
  });

  valorTotal.textContent = formatarMoeda(calcularTotal());
}

btnLimpar.addEventListener("click", () => {
  const confirmar = confirm("Deseja limpar o carrinho?");

  if (!confirmar) return;

  localStorage.removeItem("carrinho");

  renderizar();
});

btnWhatsapp.addEventListener("click", () => {
  const carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");

    return;
  }

  let mensagem = `Olá, gostaria de fazer o seguinte pedido:

`;

  carrinho.forEach((item) => {
    mensagem += `• ${item.nome}
Quantidade: ${item.quantidade}

`;
  });

  mensagem += `Total do Pedido:
${formatarMoeda(calcularTotal())}

Obrigado!`;

  const url = `https://wa.me/5551981598167?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
});

renderizar();
