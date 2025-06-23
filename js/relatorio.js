document.addEventListener("DOMContentLoaded", () => {
  const cliente = JSON.parse(localStorage.getItem("clienteRelatorio"));

  if (!cliente) {
    alert("Nenhum cliente selecionado para exibir o relatório.");
    window.location.href = "listagem.html"; // CORRETO
    return;
  }

  const container = document.getElementById("detalhesCliente");

  container.innerHTML = `
    <p><strong>Nome:</strong> ${cliente.nome} ${cliente.sobrenome}</p>
    <p><strong>Email:</strong> ${cliente.email}</p>
    <p><strong>Telefone:</strong> ${cliente.telefone}</p>
    <p><strong>Gênero:</strong> ${cliente.genero}</p>
    <p><strong>Interesses:</strong> ${cliente.interesses || "Nenhum"}</p>
    <p><strong>Sentimentos:</strong> ${cliente.sentimentos || "Nenhum"}</p>
    <p><strong>Valores:</strong> ${cliente.valores || "Nenhum"}</p>
  `;
});

function imprimirRelatorio() {
  window.print();
}

function voltar() {
  window.location.href = "listagem.html"; // CORRETO
}
