document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const mensagemErro = document.getElementById("mensagem-erro");

  form.addEventListener("submit", function (e) {
    mensagemErro.textContent = ""; 

    if (email.value.trim() === "" || senha.value.trim() === "") {
      mensagemErro.textContent = "Por favor, preencha todos os campos!";
      e.preventDefault(); 
    } else {
      e.preventDefault();
      window.location.href = "dashboard.html";
    }
  });
});

