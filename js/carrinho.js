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

function obterQuantidadeTotal() {
  const carrinho = obterCarrinho();

  return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

function calcularSubtotal() {
  const carrinho = obterCarrinho();

  return carrinho.reduce((soma, item) => {
    return soma + item.preco * item.quantidade;
  }, 0);
}

function calcularDesconto() {
  const quantidadeTotal = obterQuantidadeTotal();

  const subtotal = calcularSubtotal();

  if (quantidadeTotal >= 2) {
    return subtotal * 0.25;
  }

  return 0;
}

function calcularTotal() {
  const subtotal = calcularSubtotal();

  const desconto = calcularDesconto();

  return subtotal - desconto;
}

function renderizar() {
  const quantidadeTotal = obterQuantidadeTotal();

  let mensagemDesconto = "";

  if (quantidadeTotal === 1) {
    mensagemDesconto = `
    <div class="discount-progress">
      🛍️ Adicione mais <strong>1 item</strong> e ganhe <strong>25% OFF</strong>!
    </div>
  `;
  }

  if (quantidadeTotal >= 2) {
    mensagemDesconto = `
    <div class="discount-progress active">
      🎉 Você ganhou <strong>25% de desconto!</strong>
    </div>
  `;
  }

  const carrinho = obterCarrinho();

  listaCarrinho.innerHTML = "";
  listaCarrinho.innerHTML = mensagemDesconto;

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

  const subtotal = calcularSubtotal();
  const desconto = calcularDesconto();
  const total = calcularTotal();

  if (desconto > 0) {
    valorTotal.innerHTML = `
    <div class="cart-subtotal">
      Subtotal: ${formatarMoeda(subtotal)}
    </div>

    <div class="cart-discount">
      🎉 Desconto de 25%: -${formatarMoeda(desconto)}
    </div>

    <div class="cart-total-final">
      Total: ${formatarMoeda(total)}
    </div>
  `;
  } else {
    valorTotal.innerHTML = `
    <div class="cart-subtotal">
      Total: ${formatarMoeda(subtotal)}
    </div>
  `;
  }
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

  const quantidadeTotal = obterQuantidadeTotal();
  const subtotal = calcularSubtotal();
  const desconto = calcularDesconto();
  const total = calcularTotal();

  let mensagem = `Olá, gostaria de fazer o seguinte pedido:

`;

  carrinho.forEach((item) => {
    mensagem += `• ${item.nome}
Quantidade: ${item.quantidade}
Valor: ${formatarMoeda(item.preco * item.quantidade)}

`;
  });

  mensagem += `Subtotal:
${formatarMoeda(subtotal)}

`;

  if (desconto > 0) {
    mensagem += `🎉 Desconto de 25%:
-${formatarMoeda(desconto)}

`;
  }

  mensagem += `Total do Pedido:
${formatarMoeda(total)}

`;

  if (quantidadeTotal >= 2) {
    mensagem += `🎁 Desconto aplicado: 25% para 2 ou mais itens.

`;
  }

  mensagem += `Obrigado!`;

  const url = `https://wa.me/5551981598167?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
});

renderizar();
