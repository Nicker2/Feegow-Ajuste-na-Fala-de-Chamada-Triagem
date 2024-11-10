// ==UserScript==
// @name         Interceptar e Modificar Fala (Atualizado com Nomes)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Modifica a fala quando há referência a "exame 01" ou "dr.  está chamando paciente [nome]"
// @match        https://core.feegow.com/tvcall/panelV3/vvAM/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Tampermonkey] Iniciando script de interceptação e modificação de fala.");

    // Armazena a função original de `speechSynthesis.speak`
    const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
    console.log("[Tampermonkey] Função original 'speechSynthesis.speak' foi salva com sucesso.");

    // Sobrescreve a função `speak()`
    window.speechSynthesis.speak = function(utterance) {
        console.log("[Interceptação] Função 'speak' foi chamada.");
        console.log("[Interceptação] Texto original recebido:", utterance.text);

        // Exibe propriedades da utterance para análise
        console.log("[Interceptação] Propriedades da utterance:");
        console.log(" - Texto:", utterance.text);
        console.log(" - Idioma:", utterance.lang);
        console.log(" - Velocidade (rate):", utterance.rate);
        console.log(" - Tom (pitch):", utterance.pitch);
        console.log(" - Volume:", utterance.volume);

        // Converte o texto para minúsculas para uma busca case-insensitive
        const textoOriginal = utterance.text.toLowerCase();
        console.log("[Interceptação] Texto convertido para minúsculas:", textoOriginal);

        // Verifica as condições
        const contemExame01 = textoOriginal.includes("exame 01");
        const contemDoutorChamando = textoOriginal.includes("dr.  está chamando paciente");

        console.log(`[Interceptação] Verificação de 'exame 01': ${contemExame01}`);
        console.log(`[Interceptação] Verificação de 'dr.  está chamando paciente': ${contemDoutorChamando}`);

        // Modifica o texto se contiver tanto "dr.  está chamando paciente" quanto "exame 01"
        if (contemDoutorChamando && contemExame01) {
            console.log("[Interceptação] Condição atendida: Texto contém 'dr.  está chamando paciente' e 'exame 01'.");

            // Usando expressão regular para capturar a parte com o nome
            const regexDoutorChamando = /dr\.  está chamando paciente ([a-zA-Z\s]+) para atendimento na sala de exame 01 - matriz/i;
            const match = utterance.text.match(regexDoutorChamando);

            if (match) {
                const nomePaciente = match[1].trim(); // Extrai o nome do paciente
                console.log(`[Modificação] Nome encontrado: ${nomePaciente}`);

                // Substitui "dr.  está chamando paciente" por "Enfermagem está chamando paciente", mantendo o nome
                utterance.text = utterance.text.replace(regexDoutorChamando, `Enfermagem está chamando paciente ${nomePaciente} para atendimento na sala de triagem.`);
                console.log("[Modificação] Texto alterado para:", utterance.text);
            }
        } else if (contemExame01) {
            console.log("[Interceptação] Condição atendida: Texto contém apenas 'exame 01'.");
            utterance.text = "Enfermagem está chamando para atendimento na sala de triagem.";
            console.log("[Modificação] Texto alterado para:", utterance.text);
        } else {
            console.log("[Interceptação] Condição não atendida: Nenhuma modificação feita.");
        }

        // Tentativa de chamar a função original com o texto (modificado ou não)
        try {
            console.log("[Tampermonkey] Preparando para chamar a função original 'speechSynthesis.speak'.");
            console.log("[Tampermonkey] Texto final para fala:", utterance.text);
            originalSpeak(utterance);
            console.log("[Tampermonkey] Função 'speak' foi executada com sucesso.");
        } catch (error) {
            console.error("[Erro] Falha ao executar a função original 'speak':", error);
        }

        // Log adicional para indicar o fim da execução da função 'speak'
        console.log("[Interceptação] Fim da execução da função 'speak'.");
    };

    console.log("[Tampermonkey] Interceptação e modificação da função 'speak' configurada com sucesso.");
})();
