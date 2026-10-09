
const formulario = document.querySelector("#formulario");
const campoCep = document.querySelector("#cep");
const botaoBuscar = document.querySelector("#botaoBuscar");
const statusTela = document.querySelector("#status");
const resultado = document.querySelector("#resultado");
const listaHistorico = document.querySelector("#listaHistorico");

// Histórico armazenado em um array de objetos
const historico = [];

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    // 1. Limpar espaços e validar o CEP
    const cep = campoCep.value.trim();

    if (!/^\d{8}$/.test(cep)) {
        statusTela.textContent =
            "Digite um CEP válido com exatamente 8 números.";

        resultado.replaceChildren();
        return;
    }

    // 2. Estado de carregamento
    botaoBuscar.disabled = true;
    statusTela.textContent = "Buscando...";
    resultado.replaceChildren();

    try {
        // 3. Consultar a API ViaCEP
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        // 4. Verificar erro HTTP
        if (!resposta.ok) {
            throw new Error("Falha na conexão.");
        }

        const dados = await resposta.json();

        // 5. Verificar se o CEP não foi encontrado
        if (dados.erro) {
            statusTela.textContent = "CEP não encontrado.";
            return;
        }

        // 6. Criar o resultado dinamicamente
        resultado.replaceChildren();

        const listaDados = document.createElement("dl");

        const campos = [
            ["Rua", dados.logradouro],
            ["Bairro", dados.bairro],
            ["Cidade", dados.localidade],
            ["UF", dados.uf]
        ];

        campos.forEach(function ([nome, valor]) {
            const termo = document.createElement("dt");
            const descricao = document.createElement("dd");

            termo.textContent = nome;
            descricao.textContent = valor || "Não informado";

            listaDados.appendChild(termo);
            listaDados.appendChild(descricao);
        });

        resultado.appendChild(listaDados);

        // Limpar mensagem de status no sucesso
        statusTela.textContent = "";

        // 7. Guardar no histórico
        const pesquisa = {
            cep: cep,
            cidade: dados.localidade || "Não informada",
            uf: dados.uf || "--"
        };

        historico.push(pesquisa);

        // 8. Atualizar a lista do histórico
        listaHistorico.replaceChildren();

        historico.forEach(function (item) {
            const elemento = document.createElement("li");

            elemento.textContent =
                `${item.cep} — ${item.cidade}/${item.uf}`;

            listaHistorico.appendChild(elemento);
        });

    } catch (erro) {
        // Erro de rede ou falha na consulta
        statusTela.textContent =
            "Falha na conexão. Verifique sua internet e tente novamente.";

        resultado.replaceChildren();

        console.error(erro);

    } finally {
        // O botão é reativado mesmo se ocorrer um erro
        botaoBuscar.disabled = false;
    }
});
