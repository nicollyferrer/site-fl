let indiceSelecionado = null;

function carregarCadastros() {
    const cadastros = JSON.parse(localStorage.getItem("listaClientes")) || [];
    renderizarTabela(cadastros);
}

function filtrarCadastros(termo) {
    const todosCadastros = JSON.parse(localStorage.getItem("listaClientes")) || [];
    const termoMin = termo.toLowerCase();

    const filtrados = todosCadastros.filter(cadastro => {
        const nomeCompleto = `${cadastro.nome} ${cadastro.sobrenome}`.toLowerCase();
        const email = cadastro.email.toLowerCase();
        const telefone = cadastro.telefone.toLowerCase();
        return (
            nomeCompleto.includes(termoMin) ||
            email.includes(termoMin) ||
            telefone.includes(termoMin)
        );
    });

    renderizarTabela(filtrados);
}

function renderizarTabela(lista) {
    const corpoTabela = document.getElementById("lista-cadastros");
    if (!corpoTabela) return;

    corpoTabela.innerHTML = "";

    if (lista.length === 0) {
        corpoTabela.innerHTML = `
            <tr><td colspan="7" style="text-align: center;">Nenhum cadastro encontrado.</td></tr>
        `;
        return;
    }

    const mapeamentoGeneros = {
        "male": "Masculino",
        "female": "Feminino",
        "others": "Outro",
        "none": "Prefiro não dizer",
        
    };

    lista.forEach((cadastro, index) => {
        const linha = document.createElement("tr");

        linha.dataset.index = index;

        const generoPortugues = mapeamentoGeneros[cadastro.genero.toLowerCase()] || cadastro.genero;

        linha.innerHTML = `
            <td>${cadastro.nome} ${cadastro.sobrenome}</td>
            <td>${cadastro.email}</td>
            <td>${cadastro.telefone}</td>
            <td>${generoPortugues}</td>
            <td>${cadastro.interesses || "Nenhum"}</td>
            <td>${cadastro.sentimentos || "Nenhum"}</td>
            <td>${cadastro.valores || "Nenhum"}</td>
        `;

        linha.addEventListener("click", () => selecionarLinha(linha));
        linha.addEventListener("dblclick", () => abrirRelatorioModal(cadastro));

        corpoTabela.appendChild(linha);
    });
}

function ordenarMaisNovos() {
    const cadastros = JSON.parse(localStorage.getItem("listaClientes")) || [];
    const ordenados = [...cadastros].sort((a, b) => {
        const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
        const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
        return dataB - dataA;
    });
    renderizarTabela(ordenados);
}

function ordenarMaisAntigos() {
    const cadastros = JSON.parse(localStorage.getItem("listaClientes")) || [];
    const ordenados = [...cadastros].sort((a, b) => {
        const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
        const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
        return dataA - dataB;
    });
    renderizarTabela(ordenados);
}

function mostrarPopup(mensagem, callbackConfirmar, callbackCancelar) {
    const overlay = document.getElementById("popupConfirmacao");
    const mensagemEl = document.getElementById("popupMensagem");
    const botaoOk = document.getElementById("popupOk");
    const botaoCancelar = document.getElementById("popupCancelar");

    mensagemEl.textContent = mensagem;
    overlay.style.display = "flex";

    botaoOk.onclick = null;
    if (botaoCancelar) {
        botaoCancelar.onclick = null;
    }

    botaoOk.onclick = () => {
        overlay.style.display = "none";
        if (callbackConfirmar) {
            callbackConfirmar();
        }
    };

    if (callbackCancelar && typeof callbackCancelar === 'function') {
        if (botaoCancelar) {
            botaoCancelar.style.display = "inline-block";
            botaoCancelar.onclick = () => {
                overlay.style.display = "none";
                callbackCancelar();
            };
        }
    } else {
        if (botaoCancelar) {
            botaoCancelar.style.display = "none";
        }
    }
}

function selecionarLinha(linha) {
    const todosAsLinhas = document.querySelectorAll("#lista-cadastros tr");
    const indexClicado = parseInt(linha.dataset.index);

    todosAsLinhas.forEach(tr => tr.classList.remove("selecionado"));

    if (indiceSelecionado === indexClicado) {
        indiceSelecionado = null;
    } else {
        linha.classList.add("selecionado");
        indiceSelecionado = indexClicado;
    }
}

function editarCadastroSelecionado() {
    if (indiceSelecionado === null) {
        mostrarPopup("Selecione um cadastro para editar.");
        return;
    }
    localStorage.setItem("indiceEdicao", indiceSelecionado);
    window.location.href = "cadastrar.html";
}

function excluirCadastroSelecionado() {
    if (indiceSelecionado === null) {
        mostrarPopup("Selecione um cadastro para excluir.");
        return;
    }

    mostrarPopup(
        "Tem certeza que deseja excluir este cadastro?",
        () => {
            const cadastros = JSON.parse(localStorage.getItem("listaClientes")) || [];
            cadastros.splice(indiceSelecionado, 1);
            localStorage.setItem("listaClientes", JSON.stringify(cadastros));
            indiceSelecionado = null;
            carregarCadastros();
        },
        () => {
            // Callback vazio para Cancelar
        }
    );
}

document.addEventListener("DOMContentLoaded", function() {
    ordenarMaisNovos();

    document.getElementById("btnMaisNovos")?.addEventListener("click", ordenarMaisNovos);
    document.getElementById("btnMaisAntigos")?.addEventListener("click", ordenarMaisAntigos);

    document.getElementById("btnEditar")?.addEventListener("click", editarCadastroSelecionado);
    document.getElementById("btnExcluir")?.addEventListener("click", excluirCadastroSelecionado);

    document.getElementById("buscaInput")?.addEventListener("input", (event) => {
        filtrarCadastros(event.target.value);
    });

    // Event listener para desselecionar a linha ao clicar fora da tabela
    document.body.addEventListener('click', function(event) {
        const tabela = document.getElementById('tabela-cadastros');
        const isClickInsideTable = tabela && tabela.contains(event.target);

        if (!isClickInsideTable && indiceSelecionado !== null) {
            document.querySelectorAll("#lista-cadastros tr").forEach(tr => tr.classList.remove("selecionado"));
            indiceSelecionado = null;
        }
    });
});

function abrirRelatorioModal(cliente) {
    const container = document.getElementById("detalhesCliente");
    if (!container) return;

    const mapeamentoGeneros = {
        "male": "Masculino",
        "female": "Feminino",
        "others": "Outro",
        "none": "Prefiro não dizer",
    };

    const generoPortugues = mapeamentoGeneros[cliente.genero.toLowerCase()] || cliente.genero;

    container.innerHTML = `
        <p><strong>Nome:</strong> ${cliente.nome} ${cliente.sobrenome}</p>
        <p><strong>Email:</strong> ${cliente.email}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
        <p><strong>Gênero:</strong> ${generoPortugues}</p>
        <p><strong>Interesses:</strong> ${cliente.interesses || "Nenhum"}</p>
        <p><strong>Sentimentos:</strong> ${cliente.sentimentos || "Nenhum"}</p>
        <p><strong>Valores:</strong> ${cliente.valores || "Nenhum"}</p>
    `;

    const modal = document.getElementById("relatorioModal");
    if (modal) modal.style.display = "flex";
}

function fecharModal() {
    const modal = document.getElementById("relatorioModal");
    if (modal) modal.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
    // Obtém o caminho da URL atual (ex: /menu.html, /dashboard.html)
    const currentPath = window.location.pathname;

    // Seleciona todos os botões da sidebar
    const sidebarButtons = document.querySelectorAll('.sidebar .btn');

    sidebarButtons.forEach(button => {
        // Obtém o href de cada botão
        const buttonHref = button.getAttribute('href');

        // Verifica se o href do botão corresponde ao caminho da URL atual
        // Usamos endsWith para lidar com casos onde o caminho pode ser mais complexo
        if (currentPath.endsWith(buttonHref)) {
            // Adiciona a classe 'selecionado' ao botão correspondente
            button.classList.add('selecionado');
        }
    });
});