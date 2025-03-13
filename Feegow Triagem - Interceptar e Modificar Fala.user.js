// ==UserScript==
// @name         Interceptar e Modificar Fala e Texto na Tela (Atualizado com Nomes e Diferenciação de Setores) - Otimizado
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Modifica a fala e o texto na tela, diferenciando chamadas de triagem e exames. - Otimizado
// @match        https://core.feegow.com/tvcall/panelV3/vvAM/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Tampermonkey] Iniciando script de interceptação e modificação de fala (versão otimizada).");

    // Armazena a função original de `speechSynthesis.speak`
    const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);

    // Variável para armazenar os 10 últimos pacientes com seus setores
    let ultimosPacientes = [];

    // Função para atualizar a lista de pacientes e seus setores
    function atualizarListaPacientes(nomePaciente, setor) {
        ultimosPacientes = ultimosPacientes.filter(p => p.nome !== nomePaciente);
        ultimosPacientes.unshift({ nome: nomePaciente, setor });
        if (ultimosPacientes.length > 10) ultimosPacientes.pop();
    }

    // Função para alterar o texto na tela
    function alterarTextoNaTela() {
        if (ultimosPacientes.length > 0) {
            const ultimoPaciente = ultimosPacientes[0];
            const setor = ultimoPaciente.setor;

            const elementoFonteMedia = document.querySelector('p.fonteMedia.colorBlue');
            if (elementoFonteMedia && elementoFonteMedia.textContent.includes("Sala de exame 01 - MATRIZ")) {
                elementoFonteMedia.textContent = setor === "Sala de Exames 01" ? "Sala de Exames 01" : "Sala de Triagem";
            }

            document.querySelectorAll('#ultimasGeral p').forEach(p => {
                if (p.textContent.includes("Sala de exame 01 - MATRIZ")) {
                    p.textContent = setor === "Sala de Exames 01" ? "Sala de Exames 01" : "Sala de Triagem";
                }
            });
        }
    }

    // Função para modificar a exibição de nomes na lista #ultimasGeral
    function modificarUltimasGeral() {
        const linhas = document.querySelectorAll('#ultimasGeral p');
        linhas.forEach(p => {
            ultimosPacientes.forEach(paciente => {
                if (p.textContent.includes(paciente.nome)) {
                    p.textContent = `${paciente.nome}\n${paciente.setor}`;
                }
            });
        });
    }

    // Função para observar mudanças na lista #ultimasGeral
    function observarMudancasUltimasGeral() {
        const alvo = document.querySelector('#ultimasGeral');
        if (!alvo) return;

        const observer = new MutationObserver(mutations => {
            observer.disconnect(); // Desconecta o observador temporariamente
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    modificarUltimasGeral();
                    alterarTextoNaTela();
                }
            });
            observer.observe(alvo, { childList: true, subtree: true }); // Reconecta o observador
        });

        observer.observe(alvo, { childList: true, subtree: true });
    }

    // Inicia o observador assim que o script carregar
    observarMudancasUltimasGeral();

    // Sobrescreve a função `speak()`
    window.speechSynthesis.speak = function(utterance) {
        const comecaComDr = utterance.text.startsWith("dr.  ");
        const regexNomePaciente = /(?:dr\.\s{2})?está chamando paciente ([a-zA-ZÀ-ÿ\s'-]+) para atendimento na sala de exame 01 - matriz/i;
        const match = utterance.text.match(regexNomePaciente);

        if (match) {
            const nomePaciente = match[1].trim();
            const setor = comecaComDr ? "Sala de Exames 01" : "Sala de Triagem";
            atualizarListaPacientes(nomePaciente, setor);
            utterance.text = `Enfermagem está chamando ${nomePaciente} para ${setor}.`;
            alterarTextoNaTela();
        }

        try {
            originalSpeak(utterance);
        } catch (error) {
            console.error("[Erro] Falha ao executar a função original 'speak':", error);
        }
    };

    console.log("[Tampermonkey] Interceptação e modificação da função 'speak' configurada com sucesso (versão otimizada).");
})();
