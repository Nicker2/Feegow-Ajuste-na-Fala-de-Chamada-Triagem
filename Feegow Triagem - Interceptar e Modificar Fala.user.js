// ==UserScript==
// @name         Interceptar e Modificar Fala e Texto na Tela (Atualizado com Nomes e Diferenciação de Setores) - Otimizado
// @namespace    http://tampermonkey.net/
// @version      2.2.7
// @description  Modifica a fala e o texto na tela, diferenciando chamadas de triagem (Sala de Triagem) e exames (Central de Diagnósticos), com botão de tela cheia no canto superior esquerdo.
// @match        https://core.feegow.com/tvcall/panelV3/vvAM/*
// @match        https://core.feegow.com/tvcall/panelV3/pzMY/7
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const debugMode = 0; // 1 para habilitar os logs, 0 para desabilitar
    let ultimosPacientes = []; // Declare e inicialize ultimosPacientes

    const log = (message, speak = false) => {
        if (debugMode) {
            console.log(message);

            // Cria o elemento do log se ele ainda não existir
            if (!document.getElementById('log-container')) {
                const logContainer = document.createElement('div');
                logContainer.id = 'log-container';
                logContainer.style.position = 'fixed';
                logContainer.style.top = '0';
                logContainer.style.bottom = '50px';
                logContainer.style.right = '0';
                logContainer.style.width = '400px';
                logContainer.style.overflowY = 'auto';
                logContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                logContainer.style.color = 'white';
                logContainer.style.padding = '10px';
                logContainer.style.fontFamily = 'sans-serif';
                logContainer.style.fontSize = '16px';
                logContainer.style.textAlign = 'left';
                document.body.appendChild(logContainer);

                // Injeta o CSS dinamicamente
                const style = document.createElement('style');
                style.textContent = `
                    .log-message {
                        opacity: 0;
                        transition: opacity 0.5s ease-in-out;
                        margin-bottom: 5px;
                    }

                    .log-message.fade-in {
                        opacity: 1;
                    }
                `;
                document.head.appendChild(style);
            }

            const logContainer = document.getElementById('log-container');

            const logMessage = document.createElement('div');
            logMessage.classList.add('log-message');

            // Adiciona a hora da mensagem
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            logMessage.textContent = `${time} - ${message}`;

            // Insere a nova mensagem no final do contêiner
            logContainer.appendChild(logMessage);

            setTimeout(() => {
                logMessage.classList.add('fade-in');
            }, 10);

            // Rola para a parte inferior
            logContainer.scrollTop = logContainer.scrollHeight;

            if (speak) {
                const utterance = new SpeechSynthesisUtterance(message);
                speechSynthesis.speak(utterance);
            }

            if (!document.getElementById('input-command')) {
                // Cria a caixa de texto e o botão
                const input = document.createElement('input');
                input.id = 'input-command';
                input.type = 'text';
                input.placeholder = 'Digite um comando: /testedr NOME';
                input.style.position = 'fixed';
                input.style.bottom = '10px';
                input.style.right = '100px';
                input.style.width = '300px';
                input.style.height = '35px';
                document.body.appendChild(input);

                const button = document.createElement('button');
                button.textContent = 'Executar';
                button.style.position = 'fixed';
                button.style.bottom = '10px';
                button.style.right = '10px';
                button.style.height = '35px';
                button.style.width = '85px';
                document.body.appendChild(button);

                const executeCommand = () => {
                    const text = input.value;
                    const parts = text.split(' ');
                    let command = parts[0];
                    command = command.toLowerCase();
                    const name = parts.slice(1).join(' ');

                    switch (command) {
                        case '/testedr':
                            atualizarListaPacientes(name, "Consultório 05 - MATRIZ");
                            log(`dr.  está chamando paciente ${name} para atendimento na consultório 05 - matriz`, true);
                            break;
                        case '/testexames': {
                            atualizarListaPacientes(name, "Central de Diagnósticos");
                            const elementoFonteMedia = document.querySelector('p.fonteMedia.colorBlue');
                            if (elementoFonteMedia) {
                                log(`[Info] Elemento p.fonteMedia.colorBlue encontrado com texto: "${elementoFonteMedia.textContent.trim()}". Alterando para "Central de Diagnósticos".`);
                                setTimeout(() => {
                                    const elementoFonteMediaAtualizado = document.querySelector('p.fonteMedia.colorBlue');
                                    if (elementoFonteMediaAtualizado) {
                                        const elementosH1 = document.querySelectorAll('h1.fonteMedia.colorDarkBlue, h1.fonteGrande.colorDarkBlue');
                                        if (elementosH1.length > 0) {
                                            const elementoH1 = elementosH1[0];
                                            const nomeAtual = elementoH1.textContent.trim();
                                            if (nomeAtual === name) {
                                                log(`[Info] Elemento h1 encontrado já contém o nome "${name}". Nenhuma alteração necessária.`);
                                            } else {
                                                log(`[Info] Elemento h1 encontrado contém: "${nomeAtual}". Alterando para "${name}".`);
                                                elementoH1.textContent = name;
                                                log(`[Modificação] Elemento h1 alterado com sucesso.`);
                                                if (elementoH1.classList.contains('fonteGrande')) {
                                                    elementoH1.classList.remove('fonteGrande');
                                                    elementoH1.classList.add('fonteMedia');
                                                    log(`[Modificação] Classe do elemento h1 alterada de fonteGrande para fonteMedia.`);
                                                }
                                            }
                                        } else {
                                            log(`[Erro] Nenhum elemento h1 encontrado com as classes especificadas.`);
                                        }
                                        log(`[Modificação] Alterando elemento p.fonteMedia.colorBlue para: Central de Diagnósticos`);
                                        elementoFonteMediaAtualizado.textContent = "Central de Diagnósticos";
                                        log(`[Modificação] Elemento p.fonteMedia.colorBlue alterado com sucesso.`);
                                    } else {
                                        log(`[Erro] Elemento p.fonteMedia.colorBlue não encontrado após atraso.`);
                                    }
                                }, 100);
                            } else {
                                log(`[Erro] Elemento p.fonteMedia.colorBlue não encontrado.`);
                            }
                            const primeiroTdExames = document.querySelector('#ultimasGeral td');
                            log(`[Info] Procurando primeiro <td> em #ultimasGeral: ${primeiroTdExames ? 'Encontrado' : 'Não encontrado'}`);

                            if (primeiroTdExames) {
                                const primeiroParagrafo = primeiroTdExames.querySelector('p:first-of-type');
                                const ultimoParagrafo = primeiroTdExames.querySelector('p:last-of-type');

                                log(`[Info] Primeiro parágrafo encontrado: ${primeiroParagrafo ? 'Sim' : 'Não'}`);
                                log(`[Info] Último parágrafo encontrado: ${ultimoParagrafo ? 'Sim' : 'Não'}`);

                                if (primeiroParagrafo) {
                                    log(`[Modificação] Alterando primeiro parágrafo para: ${name}`);
                                    primeiroParagrafo.textContent = name;
                                    log(`[Modificação] Primeiro parágrafo alterado com sucesso.`);
                                } else {
                                    log(`[Erro] Primeiro parágrafo não encontrado no primeiro <td> em #ultimasGeral.`);
                                }

                                if (ultimoParagrafo) {
                                    log(`[Modificação] Alterando último parágrafo para: Central de Diagnósticos`);
                                    ultimoParagrafo.textContent = "Central de Diagnósticos";
                                    log(`[Modificação] Último parágrafo alterado com sucesso.`);
                                } else {
                                    log(`[Erro] Último parágrafo não encontrado no primeiro <td> em #ultimasGeral.`);
                                }
                                window.speechSynthesis.speak(new SpeechSynthesisUtterance(`dr.  está chamando paciente ${name} para atendimento na Central de Diagnósticos`));
                            } else {
                                log(`[Erro] Primeiro <td> não encontrado em #ultimasGeral.`);
                                window.speechSynthesis.speak(new SpeechSynthesisUtterance(`dr.  está chamando paciente ${name} para atendimento na Central de Diagnósticos`));
                            }
                            break;
                        }
                        case '/testetriagem': {
                            atualizarListaPacientes(name, "Sala de Triagem");
                            const elementoFonteMedia = document.querySelector('p.fonteMedia.colorBlue');
                            if (elementoFonteMedia) {
                                log(`[Info] Elemento p.fonteMedia.colorBlue encontrado com texto: "${elementoFonteMedia.textContent.trim()}". Alterando para "Sala de Triagem".`);
                                setTimeout(() => {
                                    const elementoFonteMediaAtualizado = document.querySelector('p.fonteMedia.colorBlue');
                                    if (elementoFonteMediaAtualizado) {
                                        const elementosH1 = document.querySelectorAll('h1.fonteMedia.colorDarkBlue, h1.fonteGrande.colorDarkBlue');
                                        if (elementosH1.length > 0) {
                                            const elementoH1 = elementosH1[0];
                                            const nomeAtual = elementoH1.textContent.trim();
                                            if (nomeAtual === name) {
                                                log(`[Info] Elemento h1 encontrado já contém o nome "${name}". Nenhuma alteração necessária.`);
                                            } else {
                                                log(`[Info] Elemento h1 encontrado contém: "${nomeAtual}". Alterando para "${name}".`);
                                                elementoH1.textContent = name;
                                                log(`[Modificação] Elemento h1 alterado com sucesso.`);
                                                if (elementoH1.classList.contains('fonteGrande')) {
                                                    elementoH1.classList.remove('fonteGrande');
                                                    elementoH1.classList.add('fonteMedia');
                                                    log(`[Modificação] Classe do elemento h1 alterada de fonteGrande para fonteMedia.`);
                                                }
                                            }
                                        } else {
                                            log(`[Erro] Nenhum elemento h1 encontrado com as classes especificadas.`);
                                        }
                                        log(`[Modificação] Alterando elemento p.fonteMedia.colorBlue para: Sala de Triagem`);
                                        elementoFonteMediaAtualizado.textContent = "Sala de Triagem";
                                        log(`[Modificação] Elemento p.fonteMedia.colorBlue alterado com sucesso.`);
                                    } else {
                                        log(`[Erro] Elemento p.fonteMedia.colorBlue não encontrado após atraso.`);
                                    }
                                }, 100);
                            } else {
                                log(`[Erro] Elemento p.fonteMedia.colorBlue não encontrado.`);
                            }
                            const primeiroTdTriagem = document.querySelector('#ultimasGeral td');
                            log(`[Info] Procurando primeiro <td> em #ultimasGeral: ${primeiroTdTriagem ? 'Encontrado' : 'Não encontrado'}`);

                            if (primeiroTdTriagem) {
                                const primeiroParagrafo = primeiroTdTriagem.querySelector('p:first-of-type');
                                const ultimoParagrafo = primeiroTdTriagem.querySelector('p:last-of-type');

                                log(`[Info] Primeiro parágrafo encontrado: ${primeiroParagrafo ? 'Sim' : 'Não'}`);
                                log(`[Info] Último parágrafo encontrado: ${ultimoParagrafo ? 'Sim' : 'Não'}`);

                                if (primeiroParagrafo) {
                                    log(`[Modificação] Alterando primeiro parágrafo para: ${name}`);
                                    primeiroParagrafo.textContent = name;
                                    log(`[Modificação] Primeiro parágrafo alterado com sucesso.`);
                                } else {
                                    log(`[Erro] Primeiro parágrafo não encontrado no primeiro <td> em #ultimasGeral.`);
                                }

                                if (ultimoParagrafo) {
                                    log(`[Modificação] Alterando último parágrafo para: Sala de Triagem`);
                                    ultimoParagrafo.textContent = "Sala de Triagem";
                                    log(`[Modificação] Último parágrafo alterado com sucesso.`);
                                } else {
                                    log(`[Erro] Último parágrafo não encontrado no primeiro <td> em #ultimasGeral.`);
                                }
                                window.speechSynthesis.speak(new SpeechSynthesisUtterance(`está chamando paciente ${name} para atendimento na Sala de Triagem`));
                            } else {
                                log(`[Erro] Primeiro <td> não encontrado em #ultimasGeral.`);
                                window.speechSynthesis.speak(new SpeechSynthesisUtterance(`está chamando paciente ${name} para atendimento na Sala de Triagem`));
                            }
                            break;
                        }
                        default:
                            log('Comando inválido.', true);
                    }
                    log(`Lista de pacientes: ${JSON.stringify(ultimosPacientes)}`);
                    input.value = '';
                };

                button.addEventListener('click', executeCommand);

                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        executeCommand();
                        input.value = '';
                    }
                });

                // Array de comandos
                const commands = [
                    'Digite um comando: /testedr NOME',
                    'Digite um comando: /testexames NOME',
                    'Digite um comando: /testetriagem NOME'
                ];

                let commandIndex = 0;

                // Alterna os comandos a cada 2 segundos
                setInterval(() => {
                    input.placeholder = commands[commandIndex];
                    commandIndex = (commandIndex + 1) % commands.length;
                }, 2000);
            }
        }
    };

    // Função para ativar o modo de tela cheia
    function ativarTelaCheia() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                log("[Tela Cheia] Modo de tela cheia ativado com sucesso.");
                atualizarBotaoTelaCheia();
            }).catch(err => {
                log(`[Erro] Falha ao ativar tela cheia: ${err}`);
            });
        } else {
            log("[Tela Cheia] Já está em modo de tela cheia.");
        }
    }

    // Função para atualizar a visibilidade do botão de tela cheia
    function atualizarBotaoTelaCheia() {
        const botaoTelaCheia = document.getElementById('fullscreen-button');
        if (document.fullscreenElement && botaoTelaCheia) {
            botaoTelaCheia.remove();
            log("[Tela Cheia] Botão de tela cheia removido, pois a página está em tela cheia.");
        } else if (!document.fullscreenElement && !botaoTelaCheia) {
            criarBotaoTelaCheia();
        }
    }

    // Função para criar o botão de tela cheia no canto superior esquerdo
    function criarBotaoTelaCheia() {
        if (!document.body) {
            log("[Erro] document.body não está disponível para criar o botão de tela cheia.");
            return;
        }
        const botao = document.createElement('button');
        botao.id = 'fullscreen-button';
        botao.textContent = 'Tela Cheia';
        botao.style.position = 'fixed';
        botao.style.top = '10px';
        botao.style.left = '10px';
        botao.style.padding = '10px';
        botao.style.backgroundColor = '#007bff';
        botao.style.color = 'white';
        botao.style.border = 'none';
        botao.style.borderRadius = '5px';
        botao.style.cursor = 'pointer';
        botao.style.zIndex = '9999';
        botao.addEventListener('click', ativarTelaCheia);
        document.body.appendChild(botao);
        log("[Tela Cheia] Botão de tela cheia criado no canto superior esquerdo.");
    }

    // Monitorar mudanças no estado de tela cheia
    document.addEventListener('fullscreenchange', atualizarBotaoTelaCheia);

    // Criar o botão inicialmente, se não estiver em tela cheia
    if (document.body && !document.fullscreenElement) {
        criarBotaoTelaCheia();
    }

    log("[Tampermonkey] Iniciando script de interceptação e modificação de fala (versão otimizada com logs detalhados condicionais).");

    const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);

    function atualizarListaPacientes(nomePaciente, setor) {
        log(`[Atualização] Adicionando/atualizando paciente: ${nomePaciente} -> ${setor}`);
        if (nomePaciente) {
            const nomePacienteTrimmed = nomePaciente.trim().toUpperCase();
            ultimosPacientes = ultimosPacientes.filter(p => {
                if (p.nome) {
                    const pNomeTrimmed = p.nome.trim().toUpperCase();
                    log(`[Info] p.nome (dentro do array 'ultimosPacientes') encontrado: ${p.nome}. Comparando com a variável 'nomePaciente' (vindo da utterance via função atualizarListaPacientes): ${nomePaciente}.`);
                    return pNomeTrimmed !== nomePacienteTrimmed;
                } else {
                    log(`[Aviso] p.nome (dentro do array 'ultimosPacientes') é undefined. Ignorando este paciente na filtragem.`);
                    return true;
                }
            });
            ultimosPacientes.unshift({ nome: nomePacienteTrimmed, setor });
            if (ultimosPacientes.length > 5) ultimosPacientes.pop();
            log(`[Atualização] Lista de últimos pacientes atualizada: ${JSON.stringify(ultimosPacientes)}`);
        } else {
            log(`[Erro] nomePaciente (vinda da função atualizarListaPacientes) é undefined. Atualização da lista de pacientes ignorada.`);
        }
    }

    function alterarTextoNaTela() {
        if (ultimosPacientes.length > 0) {
            const ultimoPaciente = ultimosPacientes[0];
            const setor = ultimoPaciente.setor;

            const elementoFonteMedia = document.querySelector('p.fonteMedia.colorBlue');
            if (elementoFonteMedia) {
                // Verifica se contém qualquer uma das salas de exame
                const textoAtual = elementoFonteMedia.textContent.trim();
                if (textoAtual.includes("Sala de exame 01 - MATRIZ") || 
                    textoAtual.includes("Sala de exame 02 - MATRIZ") || 
                    textoAtual.includes("Sala de exame 03 - MATRIZ")) {
                    
                    const novoSetor = "Central de Diagnósticos";
                    log(`[Info] Elemento p.fonteMedia.colorBlue encontrado com texto: "${textoAtual}". Alterando para "${novoSetor}".`);
                    elementoFonteMedia.textContent = novoSetor;
                    log(`[Modificação] Texto na tela alterado para '${novoSetor}' (fonteMedia colorBlue).`);
                }
            } else {
                log(`[Erro] Elemento p.fonteMedia.colorBlue não encontrado.`);
            }
        } else {
            log(`[Erro] Lista de últimos pacientes vazia, não é possível alterar texto na tela.`);
        }
    }

    function modificarUltimasGeral() {
        log("[Observer] Verificando e alterando nomes em #ultimasGeral.");
        if (!ultimosPacientes || ultimosPacientes.length === 0) {
            log("[Observer] Lista de pacientes vazia.");
            return;
        }

        log(`[Observer] Lista de últimos pacientes: ${JSON.stringify(ultimosPacientes)}`);

        const tds = document.querySelectorAll('#ultimasGeral td');
        if (tds.length === 0) {
            log(`[Erro] Nenhum elemento <td> encontrado em #ultimasGeral.`);
            return;
        }

        tds.forEach((td, index) => {
            const nomeElement = td.querySelector('p:first-of-type');
            const setorElement = td.querySelector('p:last-of-type');

            if (nomeElement && setorElement) {
                const textoSetor = setorElement.textContent.trim();
                // Verifica se contém qualquer uma das salas de exame
                if (textoSetor.includes("Sala de exame 01 - MATRIZ") || 
                    textoSetor.includes("Sala de exame 02 - MATRIZ") || 
                    textoSetor.includes("Sala de exame 03 - MATRIZ")) {
                    
                    const nomePaciente = nomeElement.textContent.trim();
                    log(`[Observer] TD ${index + 1}: Nome encontrado: ${nomePaciente}, Setor encontrado: ${textoSetor}`);

                    // Procura na lista de pacientes para determinar o setor correto
                    let setorEncontrado = "Central de Diagnósticos"; // Padrão para salas de exame
                    ultimosPacientes.forEach(paciente => {
                        if (paciente.nome === nomePaciente.toUpperCase()) {
                            log(`[Observer] Correspondência encontrada para paciente: ${paciente.nome}, setor: ${paciente.setor}`);
                            if (paciente.setor === "Sala de Triagem") {
                                setorEncontrado = "Sala de Triagem";
                            }
                        }
                    });
                    
                    log(`[Observer] Atualizando TD ${index + 1}: ${nomePaciente} -> ${setorEncontrado}`);
                    setorElement.textContent = setorEncontrado;
                }
            } else {
                log(`[Erro] TD ${index + 1}: Nome ou setor não encontrado (nomeElement: ${nomeElement ? 'Sim' : 'Não'}, setorElement: ${setorElement ? 'Sim' : 'Não'}).`);
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
            log("[Observer] Mudança detectada em #ultimasGeral.");
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
        log(`[Interceptação] Texto original recebido: ${utterance.text}`);

        log("[Interceptação] Propriedades da utterance:");
        log(` - Texto: ${utterance.text}`);
        log(` - Idioma: ${utterance.lang}`);
        log(` - Velocidade (rate): ${utterance.rate}`);
        log(` - Tom (pitch): ${utterance.pitch}`);
        log(` - Volume: ${utterance.volume}`);

        const textoOriginal = utterance.text.toLowerCase();
        log(`[Interceptação] Texto convertido para minúsculas: ${textoOriginal}`);

        const comecaComDr = utterance.text.startsWith("dr.  ");
        if (comecaComDr) {
            log(`[Interceptação] A chamada começa com "dr." seguido de dois espaços.`);
        } else {
            log(`[Interceptação] A chamada NÃO começa com "dr." seguido de dois espaços.`);
        }

        // Regex atualizada para capturar todas as salas de exame (01, 02, 03)
        const regexNomePaciente = /(?:dr\.\s{2})?está chamando paciente ([a-zA-ZÀ-ÿ\s'-]+) para atendimento na (?:sala de exame 0[1-3] - matriz)/i;
        const match = utterance.text.match(regexNomePaciente);

        if (match) {
            const nomePaciente = match[1].trim();
            const setor = "Central de Diagnósticos"; // Todas as salas de exame vão para Central de Diagnósticos

            log(`[Interceptação] Nome extraído: ${nomePaciente}`);
            log(`[Interceptação] Setor determinado: ${setor}`);

            atualizarListaPacientes(nomePaciente, setor);

            utterance.text = `Enfermagem está chamando ${nomePaciente} para ${setor}.`;
            log(`[Modificação] Texto final para fala: ${utterance.text}`);

            alterarTextoNaTela();
            modificarUltimasGeral();
        }

        // Regex adicional para capturar chamadas de triagem
        const regexTriagem = /está chamando paciente ([a-zA-ZÀ-ÿ\s'-]+) para atendimento na sala de triagem/i;
        const matchTriagem = utterance.text.match(regexTriagem);

        if (matchTriagem && !match) {
            const nomePaciente = matchTriagem[1].trim();
            const setor = "Sala de Triagem";

            log(`[Interceptação] Nome extraído para triagem: ${nomePaciente}`);
            log(`[Interceptação] Setor determinado: ${setor}`);

            atualizarListaPacientes(nomePaciente, setor);

            utterance.text = `Enfermagem está chamando ${nomePaciente} para ${setor}.`;
            log(`[Modificação] Texto final para fala: ${utterance.text}`);

            alterarTextoNaTela();
            modificarUltimasGeral();
        }

        if (utterance.text.includes("atendimento na consultório")) {
            utterance.text = utterance.text.replace("atendimento na consultório", "atendimento no consultório");
            log(`[Modificação] Texto após substituição de 'na consultório' por 'no consultório': ${utterance.text}`);
        }

        if (utterance.text.includes("dr.  ")) {
            utterance.text = utterance.text.replace("dr.  ", "dr. ");
            log(`[Modificação] Texto após substituição de 'dr.  ': ${utterance.text}`);
        }

        if (utterance.text.includes(" - matriz")) {
            utterance.text = utterance.text.replace(" - matriz", ".");
            log(`[Modificação] Texto após substituição de ' - matriz': ${utterance.text}`);
        }

        if (utterance.text.includes("está chamando paciente")) {
            utterance.text = utterance.text.replace("está chamando paciente", "está chamando");
            log(`[Modificação] Texto após substituição de 'está chamando paciente' por 'está chamando': ${utterance.text}`);
        }

        try {
            log("[Tampermonkey] Preparando para chamar a função original 'speechSynthesis.speak'.");
            log(`[Tampermonkey] Texto final para fala: ${utterance.text}`);
            originalSpeak(utterance);
            log("[Tampermonkey] Função 'speak' foi executada com sucesso.");
        } catch (error) {
            log(`[Erro] Falha ao executar a função original 'speak': ${error}`);
        }

        log("[Interceptação] Fim da execução da função 'speak'.");
    };

    log("[Tampermonkey] Interceptação e modificação da função 'speak' configurada com sucesso (versão otimizada com logs detalhados condicionais).");
})();
