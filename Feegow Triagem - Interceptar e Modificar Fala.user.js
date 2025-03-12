// ==UserScript==
// @name         Interceptar e Modificar Fala e Texto na Tela (Atualizado com Nomes e Diferenciação de Setores)
// @namespace    http://tampermonkey.net/
// @version      1.9.0
// @description  Modifica a fala e o texto na tela, diferenciando chamadas de triagem e exames.
// @match        https://core.feegow.com/tvcall/panelV3/vvAM/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Tampermonkey] Iniciando script de interceptação e modificação de fala.");

    // Armazena a função original de `speechSynthesis.speak`
    const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
    console.log("[Tampermonkey] Função original 'speechSynthesis.speak' foi salva com sucesso.");

    // Variável para armazenar os 10 últimos pacientes com seus setores
    let ultimosPacientes = [];

    // Função para atualizar a lista de pacientes e seus setores
    function atualizarListaPacientes(nomePaciente, setor) {
        console.log(`[Atualização] Adicionando/atualizando paciente: ${nomePaciente} -> ${setor}`);

        // Remove entrada anterior do mesmo paciente, se existir
        ultimosPacientes = ultimosPacientes.filter(p => p.nome !== nomePaciente);

        // Adiciona nova entrada no topo da lista
        ultimosPacientes.unshift({ nome: nomePaciente, setor });

        // Mantém apenas os últimos 10 registros
        if (ultimosPacientes.length > 10) {
            ultimosPacientes.pop();
        }

        console.log("[Atualização] Lista de últimos pacientes atualizada:", ultimosPacientes);
    }
    // Função para alterar o texto na tela (tanto no <p class="fonteMedia colorBlue"> quanto no <tbody id="ultimasGeral">)
    function alterarTextoNaTela() {
        // Verifica se existe a variável ultimosPacientes e se ela não está vazia
        if (ultimosPacientes.length > 0) {
            // Verifica o último paciente na lista para determinar o setor
            const ultimoPaciente = ultimosPacientes[0]; // Pega o primeiro paciente (último na lista)
            const setor = ultimoPaciente.setor; // "Sala de Exames 01" ou "Sala de Triagem"

            // Altera o texto no <p class="fonteMedia colorBlue">
            const elemento = document.querySelector('p.fonteMedia.colorBlue');
            if (elemento && elemento.textContent.includes("Sala de exame 01 - MATRIZ")) {
                elemento.textContent = setor === "Sala de Exames 01" ? "Sala de Exames 01" : "Sala de Triagem";
                console.log(`[Modificação] Texto na tela alterado para '${setor === "Sala de Exames 01" ? "Sala de Exames 01" : "Sala de Triagem"}' (fonteMedia colorBlue).`);
            }

            // Altera o texto no <tbody id="ultimasGeral">
            const linhas = document.querySelectorAll('#ultimasGeral p');
            linhas.forEach(p => {
                if (p.textContent.includes("Sala de exame 01 - MATRIZ")) {
                    p.textContent = setor === "Sala de Exames 01" ? "Sala de Exames 01" : "Sala de Triagem";
                    console.log(`[Modificação] Texto na tela alterado para '${setor === "Sala de Exames 01" ? "Sala de Exames 01" : "Sala de Triagem"}' (ultimasGeral).`);
                }
            observarMudancasUltimasGeral();
            });
        }
    }
    // Função para modificar a exibição de nomes na lista #ultimasGeral
    function modificarUltimasGeral() {
        console.log("[Observer] Verificando e alterando nomes em #ultimasGeral.");

        const linhas = document.querySelectorAll('#ultimasGeral p');
        linhas.forEach(p => {
            ultimosPacientes.forEach(paciente => {
                if (p.textContent.includes(paciente.nome)) {
                    console.log(`[Observer] Atualizando: ${p.textContent} -> ${paciente.setor}`);
                    p.textContent = `${paciente.nome}\n${paciente.setor}`;
                }
            });
        });
    }

    // Função para observar mudanças na lista #ultimasGeral e modificar corretamente
    function observarMudancasUltimasGeral() {
        const alvo = document.querySelector('#ultimasGeral');
        if (!alvo) {
            console.warn("[Observer] Elemento #ultimasGeral não encontrado.");
            return;
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    console.log("[Observer] Mudança detectada em #ultimasGeral.");
                    modificarUltimasGeral();
                    alterarTextoNaTela(); // Garante que o texto seja alterado sempre que necessário
                }
            });
        });

        observer.observe(alvo, { childList: true, subtree: true });
        console.log("[Observer] Monitorando mudanças em #ultimasGeral.");
        console.log("[Atualização] Lista de últimos pacientes:");
        ultimosPacientes.forEach((p, index) => {
            console.log(`${index + 1}. ${p.nome} -> ${p.setor}`);
        });
    }

    // Inicia o observador assim que o script carregar
    observarMudancasUltimasGeral();

    // Sobrescreve a função `speak()`
    window.speechSynthesis.speak = function(utterance) {
        console.log("[Interceptação] Função 'speak' foi chamada.");
        console.log("[Interceptação] Texto original recebido:", utterance.text);

        // Verifica se a chamada começa com "dr.  "
        const comecaComDr = utterance.text.startsWith("dr.  ");
        console.log(`[Interceptação] Chamada começa com "dr.  "? ${comecaComDr}`);

        // Regex para capturar o nome do paciente
        const regexNomePaciente = /(?:dr\.\s{2})?está chamando paciente ([a-zA-ZÀ-ÿ\s'-]+) para atendimento na sala de exame 01 - matriz/i;
        const match = utterance.text.match(regexNomePaciente);

        if (match) {
            const nomePaciente = match[1].trim();
            const setor = comecaComDr ? "Sala de Exames 01" : "Sala de Triagem";

            console.log(`[Interceptação] Nome extraído: ${nomePaciente}`);
            console.log(`[Interceptação] Setor determinado: ${setor}`);

            // Atualiza a lista de últimos pacientes
            atualizarListaPacientes(nomePaciente, setor);

            // Modifica o texto a ser falado
            utterance.text = `Enfermagem está chamando ${nomePaciente} para ${setor}.`;
            console.log("[Modificação] Texto final para fala:", utterance.text);

            // Garante que a alteração seja refletida na tela
            alterarTextoNaTela();
        }

        // Chama a função original com o texto (modificado ou não)
        try {
            console.log("[Tampermonkey] Preparando para chamar a função original 'speechSynthesis.speak'.");
            originalSpeak(utterance);
            console.log("[Tampermonkey] Função 'speak' foi executada com sucesso.");
        } catch (error) {
            console.error("[Erro] Falha ao executar a função original 'speak':", error);
        }

        console.log("[Interceptação] Fim da execução da função 'speak'.");
    };

    console.log("[Tampermonkey] Interceptação e modificação da função 'speak' configurada com sucesso.");
})();
