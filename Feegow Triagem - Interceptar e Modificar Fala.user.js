// ==UserScript==
// @name         Interceptar e Modificar Fala e Texto na Tela (Atualizado com Nomes e Diferenciação de Setores) - Otimizado
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Modifica a fala e o texto na tela, diferenciando chamadas de triagem e exames. - Otimizado com logs detalhados condicionais
// @match        https://core.feegow.com/tvcall/panelV3/vvAM/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const debugMode = 0; // 1 para habilitar os logs, 0 para desabilitar

    const log = (message) => {
        if (debugMode) {
            console.log(message);
        }
    };

    log("[Tampermonkey] Iniciando script de interceptação e modificação de fala (versão otimizada com logs detalhados condicionais).");

    const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
    let ultimosPacientes = [];

    function atualizarListaPacientes(nomePaciente, setor) {
        log(`[Atualização] Adicionando/atualizando paciente: ${nomePaciente} -> ${setor}`);
        ultimosPacientes = ultimosPacientes.filter(p => p.nome.toUpperCase() !== nomePaciente.toUpperCase());
        ultimosPacientes.unshift({ nome: nomePaciente.toUpperCase(), setor });
        if (ultimosPacientes.length > 5) ultimosPacientes.pop();
        log("[Atualização] Lista de últimos pacientes atualizada:", ultimosPacientes);
        log(`[Atualização] Lista de últimos pacientes após atualização: ${JSON.stringify(ultimosPacientes)}`);
    }

    function alterarTextoNaTela() {
        if (ultimosPacientes.length > 0) {
            const ultimoPaciente = ultimosPacientes[0];
            const setor = ultimoPaciente.setor;

            const elementoFonteMedia = document.querySelector('p.fonteMedia.colorBlue');
            if (elementoFonteMedia && elementoFonteMedia.textContent.includes("Sala de exame 01 - MATRIZ")) {
                elementoFonteMedia.textContent = setor === "Sala de Exames 01" ? "Sala de Exames 01" : "Sala de Triagem";
                log(`[Modificação] Texto na tela alterado para '${setor === "Sala de Exames 01" ? "Sala de Exames 01" : "Sala de Triagem"}' (fonteMedia colorBlue).`);
            }
        }
    }

    function modificarUltimasGeral() {
        log("[Observer] Verificando e alterando nomes em #ultimasGeral.");
        log("[Observer] Lista de últimos pacientes:", ultimosPacientes); // Log da lista de pacientes

        const tds = document.querySelectorAll('#ultimasGeral td');
        tds.forEach(td => {
            const nomeElement = td.querySelector('p:first-of-type');
            const setorElement = td.querySelector('p:last-of-type');

            if (nomeElement && setorElement && setorElement.textContent.includes("Sala de exame 01 - MATRIZ")) {
                const nomePaciente = nomeElement.textContent.trim();
                log(`[Observer] Nome encontrado: ${nomePaciente}`);
                log(`[Observer] Setor encontrado: ${setorElement.textContent}`);

                ultimosPacientes.forEach(paciente => {
                    log(`[Observer] Comparando com paciente: ${paciente.nome}`);
                    if (paciente.nome === nomePaciente) {
                        setorElement.textContent = paciente.setor;
                        log(`[Observer] Atualizando: ${nomePaciente} -> ${paciente.setor}`);
                    }
                });
            }
        });
    }

    function observarMudancasUltimasGeral() {
        const alvo = document.querySelector('#ultimasGeral');
        if (!alvo) {
            log("[Observer] Elemento #ultimasGeral não encontrado.");
            return;
        }

        const observer = new MutationObserver(mutations => {
            log("[Observer] Mudança detectada em #ultimasGeral."); // Log de detecção do observador
            observer.disconnect();
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    modificarUltimasGeral();
                    alterarTextoNaTela();
                }
            });
            observer.observe(alvo, { childList: true, subtree: true });
        });

        observer.observe(alvo, { childList: true, subtree: true });
        log("[Observer] Monitorando mudanças em #ultimasGeral.");
        log("[Atualização] Lista de últimos pacientes:");
        ultimosPacientes.forEach((p, index) => {
            log(`${index + 1}. ${p.nome} -> ${p.setor}`);
        });
    }

    observarMudancasUltimasGeral();

    window.speechSynthesis.speak = function(utterance) {
        log("[Interceptação] Função 'speak' foi chamada.");
        log("[Interceptação] Texto original recebido:", utterance.text);

        log("[Interceptação] Propriedades da utterance:");
        log(` - Texto: ${utterance.text}`);
        log(` - Idioma: ${utterance.lang}`);
        log(` - Velocidade (rate): ${utterance.rate}`);
        log(` - Tom (pitch): ${utterance.pitch}`);
        log(` - Volume: ${utterance.volume}`);

        const textoOriginal = utterance.text.toLowerCase();
        log(`[Interceptação] Texto convertido para minúsculas: ${textoOriginal}`);

        const comecaComDr = utterance.text.startsWith("dr.  ");
        log(`[Interceptação] Chamada começa com "dr.  "? ${comecaComDr}`);

        const regexNomePaciente = /(?:dr\.\s{2})?está chamando paciente ([a-zA-ZÀ-ÿ\s'-]+) para atendimento na sala de exame 01 - matriz/i;
        const match = utterance.text.match(regexNomePaciente);

        if (match) {
            const nomePaciente = match[1].trim();
            const setor = comecaComDr ? "Sala de Exames 01" : "Sala de Triagem";

            log(`[Interceptação] Nome extraído: ${nomePaciente}`);
            log(`[Interceptação] Setor determinado: ${setor}`);

            atualizarListaPacientes(nomePaciente, setor);

            utterance.text = `Enfermagem está chamando ${nomePaciente} para ${setor}.`;
            log(`[Modificação] Texto final para fala: ${utterance.text}`);

            alterarTextoNaTela();
        }

        try {
            log("[Tampermonkey] Preparando para chamar a função original 'speechSynthesis.speak'.");
            log("[Tampermonkey] Texto final para fala:", utterance.text);
            originalSpeak(utterance);
            log("[Tampermonkey] Função 'speak' foi executada com sucesso.");
        } catch (error) {
            log(`[Erro] Falha ao executar a função original 'speak': ${error}`);
        }

        log("[Interceptação] Fim da execução da função 'speak'.");
    };

    log("[Tampermonkey] Interceptação e modificação da função 'speak' configurada com sucesso (versão otimizada com logs detalhados condicionais).");
})();
