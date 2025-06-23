document.addEventListener("DOMContentLoaded", () => {
    const pathname = window.location.pathname;

    // Função para exibir mensagem de erro abaixo do campo
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`error-${fieldId}`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Função para limpar todas as mensagens de erro
    function clearErrors() {
        document.querySelectorAll(".error-message").forEach(el => {
            el.textContent = "";
        });
    }

    if (pathname.includes("cadastrar.html")) {
        const indiceEdicao = localStorage.getItem("indiceEdicao");
        const lista = JSON.parse(localStorage.getItem("listaClientes")) || [];

        if (indiceEdicao !== null) {
            const cliente = lista[indiceEdicao];
            if (cliente) {
                document.getElementById("firstname").value = cliente.nome || "";
                document.getElementById("lastname").value = cliente.sobrenome || "";
                document.getElementById("email").value = cliente.email || "";
                document.getElementById("number").value = cliente.telefone || "";
                const generoRadio = document.getElementById(cliente.genero);
                if (generoRadio) generoRadio.checked = true;
            }
        }

        const buttonContinuar = document.getElementById("continuarBtn");

        if (buttonContinuar) {
            buttonContinuar.addEventListener("click", () => {
                clearErrors(); // Limpa erros anteriores ao tentar enviar
                let isValid = true; // Flag para verificar se todos os campos são válidos

                const nome = document.getElementById("firstname").value.trim();
                const sobrenome = document.getElementById("lastname").value.trim();
                const email = document.getElementById("email").value.trim();
                const telefone = document.getElementById("number").value.trim();
                const genero = document.querySelector('input[name="gender"]:checked');

                if (!nome) {
                    showError("firstname", "Por favor, preencha o nome.");
                    isValid = false;
                }
                if (!sobrenome) {
                    showError("lastname", "Por favor, preencha o sobrenome.");
                    isValid = false;
                }
                if (!email) {
                    showError("email", "Por favor, preencha o email.");
                    isValid = false;
                }
                if (!telefone) {
                    showError("number", "Por favor, preencha o telefone.");
                    isValid = false;
                }
                if (!genero) {
                    showError("gender", "Por favor, selecione o gênero.");
                    isValid = false;
                }

                if (!isValid) {
                    return; // Impede a continuação se houver erros
                }

                const dadosCliente = {
                    nome,
                    sobrenome,
                    email,
                    telefone,
                    genero: genero.id
                };

                localStorage.setItem("clienteCadastro", JSON.stringify(dadosCliente));
                window.location.href = "cadastrar-pt2.html";
            });
        }
    }

    if (pathname.includes("cadastrar-pt2.html")) {
        const form2 = document.getElementById("formFinalizar");
        const etapaFinalDiv = document.getElementById("etapaFinal");

        const indiceEdicao = localStorage.getItem("indiceEdicao");
        const lista = JSON.parse(localStorage.getItem("listaClientes")) || [];

        if (indiceEdicao !== null) {
            const cliente = lista[indiceEdicao];
            if (cliente) {
                document.getElementById("interesses").value = cliente.interesses || "";
                document.getElementById("sentimentos").value = cliente.sentimentos || "";
                document.getElementById("valores").value = cliente.valores || "";
            }
        }

        if (form2 && etapaFinalDiv) {
            form2.addEventListener("submit", function(event) {
                event.preventDefault();
                clearErrors(); // Limpa erros anteriores ao tentar enviar
                let isValid = true; // Flag para verificar se todos os campos são válidos

                const interesses = document.getElementById("interesses").value.trim();
                const sentimentos = document.getElementById("sentimentos").value.trim();
                const valores = document.getElementById("valores").value.trim();

                if (!interesses) {
                    showError("interesses", "Por favor, preencha seus interesses.");
                    isValid = false;
                }
                if (!sentimentos) {
                    showError("sentimentos", "Por favor, preencha seus sentimentos.");
                    isValid = false;
                }
                if (!valores) {
                    showError("valores", "Por favor, preencha seus valores.");
                    isValid = false;
                }

                if (!isValid) {
                    return; // Impede a continuação se houver erros
                }

                const parte1 = JSON.parse(localStorage.getItem("clienteCadastro"));

                if (!parte1) {
                    // Mantido o alert aqui para um erro mais grave (dados da etapa anterior ausentes)
                    alert("Erro: informações da etapa 1 não encontradas. Retornando ao cadastro inicial.");
                    window.location.href = "cadastrar.html";
                    return;
                }

                const clienteCompleto = {
                    ...parte1,
                    interesses,
                    sentimentos,
                    valores,
                    dataCriacao: new Date().toISOString()
                };

                if (indiceEdicao !== null) {
                    lista[parseInt(indiceEdicao)] = clienteCompleto;
                    localStorage.removeItem("indiceEdicao");
                } else {
                    lista.push(clienteCompleto);
                }

                localStorage.setItem("listaClientes", JSON.stringify(lista));
                localStorage.removeItem("clienteCadastro");

                form2.style.display = "none";
                etapaFinalDiv.style.display = "block";
            });
        }
    }
});

function voltarPagina() {
    history.back();
}

function voltarMenu() {
    window.location.href = "dashboard.html";
}

function verListagem() {
    window.location.href = "listagem.html";
}