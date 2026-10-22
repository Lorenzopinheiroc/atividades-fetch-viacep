const formulario = document.getElementById("formulario-cep");
const campoCep = document.getElementById("cep");
const botaoBuscar = document.getElementById("botao-buscar");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultado");

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;
}

function limparResultado() {
    resultado.hidden = true;
    document.getElementById("rua").textContent = "—";
    document.getElementById("bairro").textContent = "—";
    document.getElementById("cidade").textContent = "—";
    document.getElementById("estado").textContent = "—";
    document.getElementById("cep-resultado").textContent = "—";
}

async function buscarCEP(cep) {
    limparResultado();
    mostrarMensagem("Consultando CEP...", "");
    botaoBuscar.disabled = true;

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        if (!resposta.ok) {
            throw new Error("Não foi possível consultar o serviço.");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            throw new Error("CEP não encontrado. Confira os números e tente novamente.");
        }

        document.getElementById("rua").textContent = dados.logradouro || "Não informado";
        document.getElementById("bairro").textContent = dados.bairro || "Não informado";
        document.getElementById("cidade").textContent = dados.localidade || "Não informado";
        document.getElementById("estado").textContent = dados.uf || "Não informado";
        document.getElementById("cep-resultado").textContent = dados.cep || cep;

        resultado.hidden = false;
        mostrarMensagem("Endereço encontrado com sucesso!", "sucesso");
    } catch (erro) {
        limparResultado();
        mostrarMensagem(
            erro.message === "Failed to fetch"
                ? "Não foi possível conectar à API. Verifique sua internet e tente novamente."
                : erro.message || "Ocorreu um erro. Tente novamente.",
            "erro"
        );
    } finally {
        botaoBuscar.disabled = false;
    }
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const cep = campoCep.value.replace(/\D/g, "");

    if (cep.length !== 8) {
        limparResultado();
        mostrarMensagem("Digite um CEP válido com 8 números.", "erro");
        return;
    }

    buscarCEP(cep);
});

campoCep.addEventListener("input", function() {
    let numeros = campoCep.value.replace(/\D/g, "").slice(0, 8);

    if (numeros.length > 5) {
        numeros = numeros.slice(0, 5) + "-" + numeros.slice(5);
    }

    campoCep.value = numeros;
});
