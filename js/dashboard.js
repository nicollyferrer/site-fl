let indiceSelecionado = null;
const NUMERO_DE_LINHAS_DASHBOARD = 8;

function carregarCadastros() {
    ordenarMaisNovos();
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

function renderizarTabela(listaCompleta) {
    const corpoTabela = document.getElementById("lista-cadastros");
    if (!corpoTabela) return;

    corpoTabela.innerHTML = "";

    const mapeamentoGeneros = {
        "male": "Masculino",
        "female": "Feminino",
        "other": "Outro",
    };

    const cadastrosParaExibir = listaCompleta.slice(0, NUMERO_DE_LINHAS_DASHBOARD);

    if (cadastrosParaExibir.length === 0) {
        corpoTabela.innerHTML = `
            <tr><td colspan="7" style="text-align: center;">Nenhum cadastro encontrado.</td></tr>
        `;
        return;
    }

    cadastrosParaExibir.forEach((cadastro, index) => {
        const linha = document.createElement("tr");
        linha.dataset.index = listaCompleta.indexOf(cadastro);

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

    const linhasAtuais = cadastrosParaExibir.length;
    if (linhasAtuais < NUMERO_DE_LINHAS_DASHBOARD) {
        for (let i = 0; i < (NUMERO_DE_LINHAS_DASHBOARD - linhasAtuais); i++) {
            const linhaVazia = document.createElement("tr");
            linhaVazia.innerHTML = `
                <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
                <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
            `;
            linhaVazia.style.height = "40px";
            linhaVazia.style.backgroundColor = "#fdfdfd";
            corpoTabela.appendChild(linhaVazia);
        }
    }
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
    window.location.href = "cadastrar.html"; // CORRETO
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
        "other": "Outro",
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

// Funções específicas do Dashboard (contagem, dias desde último cadastro)
function contarCadastrosNoMesAtual() {
    const lista = JSON.parse(localStorage.getItem("listaClientes")) || [];
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();

    return lista.filter(cliente => {
        const data = new Date(cliente.dataCriacao);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    }).length;
}

function diasDesdeUltimoCadastro() {
    const lista = JSON.parse(localStorage.getItem("listaClientes")) || [];
    if (lista.length === 0) return "–";

    const datas = lista
        .map(c => new Date(c.dataCriacao))
        .filter(d => !isNaN(d));

    if (datas.length === 0) return "–";

    const ultimaData = new Date(Math.max(...datas.map(d => d.getTime())));

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    ultimaData.setHours(0, 0, 0, 0);

    const diffMs = hoje - ultimaData;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return `Há ${diffDias} dia${diffDias !== 1 ? 's' : ''}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const listaOriginal = JSON.parse(localStorage.getItem("listaClientes")) || [];

    const totalClientes = document.getElementById("totalClientes");
    if (totalClientes) totalClientes.textContent = listaOriginal.length;

    const relatorios = document.getElementById("relatoriosEnviados");
    if (relatorios) relatorios.textContent = listaOriginal.length;

    const acesso = document.getElementById("ultimoAcesso");
    if (acesso) {
        const agora = new Date();
        acesso.textContent = agora.toLocaleDateString("pt-BR");
    }

    const tabelaDashboard = document.getElementById("tabelaClientes"); // Renomeado para evitar conflito
    if (tabelaDashboard) {
        const clientesOrdenados = [...listaOriginal].sort((a, b) => {
            const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
            const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
            return dataB - dataA;
        });
        const clientesParaExibir = clientesOrdenados.slice(0, NUMERO_DE_LINHAS_DASHBOARD);
        
        tabelaDashboard.innerHTML = "";
        if (!clientesParaExibir || clientesParaExibir.length === 0) {
            tabelaDashboard.innerHTML = `<tr><td colspan="3">Nenhum cliente encontrado.</td></tr>`;
        } else {
            clientesParaExibir.forEach((cliente) => {
                const linha = document.createElement("tr");
                const dataFormatada = cliente.dataCriacao
                    ? new Date(cliente.dataCriacao).toLocaleDateString('pt-BR')
                    : "-";
                linha.innerHTML = `
                    <td>${cliente.nome} ${cliente.sobrenome}</td>
                    <td>${cliente.email}</td>
                    <td>${dataFormatada}</td>
                `;
                linha.addEventListener("click", () => {
                    abrirRelatorioModal(cliente);
                });
                tabelaDashboard.appendChild(linha);
            });

            const linhasAtuais = clientesParaExibir.length;
            if (linhasAtuais < NUMERO_DE_LINHAS_DASHBOARD) {
                for (let i = 0; i < (NUMERO_DE_LINHAS_DASHBOARD - linhasAtuais); i++) {
                    const linhaVazia = document.createElement("tr");
                    linhaVazia.innerHTML = `
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    `;
                    tabelaDashboard.appendChild(linhaVazia);
                }
            }
        }
    }

    const inputBusca = document.getElementById("buscaInput");
    if (inputBusca) {
        inputBusca.addEventListener("input", function () {
            const termo = this.value.toLowerCase();
            const filtrados = listaOriginal.filter(cliente =>
                `${cliente.nome} ${cliente.sobrenome}`.toLowerCase().includes(termo) ||
                cliente.email.toLowerCase().includes(termo) ||
                cliente.telefone?.toLowerCase().includes(termo)
            );
            
            const clientesOrdenadosFiltrados = [...filtrados].sort((a, b) => {
                const dataA = a.dataCriacao ? new Date(a.dataCriacao).getTime() : 0;
                const dataB = b.dataCriacao ? new Date(b.dataCriacao).getTime() : 0;
                return dataB - dataA;
            });
            const clientesParaExibirFiltrados = clientesOrdenadosFiltrados.slice(0, NUMERO_DE_LINHAS_DASHBOARD);

            tabelaDashboard.innerHTML = "";
            if (!clientesParaExibirFiltrados || clientesParaExibirFiltrados.length === 0) {
                tabelaDashboard.innerHTML = `<tr><td colspan="3">Nenhum cliente encontrado.</td></tr>`;
            } else {
                clientesParaExibirFiltrados.forEach((cliente) => {
                    const linha = document.createElement("tr");
                    const dataFormatada = cliente.dataCriacao
                        ? new Date(cliente.dataCriacao).toLocaleDateString('pt-BR')
                        : "-";
                    linha.innerHTML = `
                        <td>${cliente.nome} ${cliente.sobrenome}</td>
                        <td>${cliente.email}</td>
                        <td>${dataFormatada}</td>
                    `;
                    linha.addEventListener("click", () => {
                        abrirRelatorioModal(cliente);
                    });
                    tabelaDashboard.appendChild(linha);
                });

                const linhasAtuais = clientesParaExibirFiltrados.length;
                if (linhasAtuais < NUMERO_DE_LINHAS_DASHBOARD) {
                    for (let i = 0; i < (NUMERO_DE_LINHAS_DASHBOARD - linhasAtuais); i++) {
                        const linhaVazia = document.createElement("tr");
                        linhaVazia.innerHTML = `
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        `;
                        tabelaDashboard.appendChild(linhaVazia);
                    }
                }
            }
        });
    }

    document.getElementById("board-novos-cadastros").textContent = contarCadastrosNoMesAtual();
    document.getElementById("board-dias-ultimo").textContent = diasDesdeUltimoCadastro();
});
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const sidebarButtons = document.querySelectorAll('.sidebar .btn');

    sidebarButtons.forEach(button => {
        const buttonHref = button.getAttribute('href');
        if (currentPath.endsWith(buttonHref)) {
            button.classList.add('selecionado');
        }
    });
});
