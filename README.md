🏥 Feegow - Interceptar e Modificar Fala e Texto na Tela 🎤🖥️
📝 Descrição
Este é um script Tampermonkey que intercepta e modifica a fala e o texto exibido na tela do sistema Feegow, diferenciando chamadas de triagem (Sala de Pré-Consulta) e exames (Central de Diagnósticos). Desenvolvido para o HOC Hospital de Olhos de Caraguatatuba 👁️, o script foi otimizado com logs detalhados condicionais, uma interface de logs interativa e um botão de tela cheia para melhorar a experiência do usuário. 🛠️🔍

🛠️ Funcionalidades

Interceptação da fala: Modifica o texto de chamadas de pacientes, substituindo referências à sala de exame 01 - matriz por "Sala de Pré-Consulta" ou "Central de Diagnósticos", conforme o contexto. 🎤🔄
Atualização dinâmica da tela: Altera o texto exibido na interface do Feegow para refletir as modificações feitas na fala. 🖥️✨
Logs detalhados condicionais: Exibe logs no console e em uma interface visual quando o modo de depuração está ativo, facilitando o monitoramento. 📜🖥️
Comandos personalizados: Permite testar chamadas de pacientes com comandos como /testedr, /testexames e /testetriagem. 🎮🔧
Interface de logs interativa: Cria uma janela fixa de logs com mensagens em tempo real e transições suaves. 🪟📝
Botão de tela cheia: Adiciona um botão no canto superior esquerdo para ativar o modo de tela cheia. 📺🔲


⚙️ Como Funciona

Interceptação da função de fala: Substitui a função speechSynthesis.speak do navegador para modificar o texto antes de ser pronunciado. 🎤🔧
Verificação de condições: Analisa o texto da fala para identificar se a chamada é para triagem (sem "dr.") ou exames (com "dr."). 🔍✅
Modificação do texto:
Substitui "sala de exame 01 - matriz" por "Sala de Pré-Consulta" ou "Central de Diagnósticos", conforme o contexto. 🏥🔄
Extrai o nome do paciente e atualiza a lista de últimos pacientes chamados. 📋👤


Atualização da interface: Modifica elementos da tela (como p.fonteMedia.colorBlue e #ultimasGeral) para refletir as alterações na fala. 🖥️✨
Logs detalhados: Registra todas as ações no console e na interface visual (quando debugMode = 1). 📜🖥️
Modo de tela cheia: Adiciona um botão para ativar/desativar o modo de tela cheia, com monitoramento automático do estado. 📺🔲


🚀 Como Usar

Instale o Tampermonkey como extensão no seu navegador (Chrome, Firefox, etc.). 🐒
Crie um novo script no Tampermonkey e cole o código fornecido. 📜
Acesse a URL do Feegow: O script é executado automaticamente nas URLs configuradas (https://core.feegow.com/tvcall/panelV3/*). 🌐
Ative o modo de depuração (opcional): Defina debugMode = 1 no script para habilitar logs no console e na interface visual. 🔍
Teste os comandos (com debugMode = 1):
/testedr NOME: Simula uma chamada de consultório. 🩺
/testexames NOME: Simula uma chamada de exames. 🧪
/testetriagem NOME: Simula uma chamada de triagem. 🚨


Monitore os logs: Acompanhe as alterações em tempo real na interface de logs (visível com debugMode = 1). 🖥️📝
Use o botão de tela cheia: Clique no botão no canto superior esquerdo para ativar o modo de tela cheia. 📺🔲


📢 Exemplo de Modificação de Fala
Texto original:

"dr.  está chamando paciente Rafaela para atendimento na sala de exame 01 - matriz" 🗣️

Texto modificado:

"Enfermagem está chamando Rafaela para Central de Diagnósticos." 🧪👩‍⚕️

Texto original:

"está chamando paciente João para atendimento na sala de exame 01 - matriz" 🗣️

Texto modificado:

"Enfermagem está chamando João para Sala de Pré-Consulta." 🚨👩‍⚕️


📜 Logs de Depuração
Quando debugMode = 1, o script exibe logs detalhados no console e em uma interface visual, incluindo:

Texto original e modificado da fala.
Propriedades da fala (idioma, velocidade, tom, volume).
Alterações nos elementos da tela.
Atualizações na lista de últimos pacientes.
Estado do modo de tela cheia.

A interface visual de logs aparece como uma janela fixa no canto direito da tela, com mensagens em tempo real e transições suaves. 🪟📝

📦 Dependências

Tampermonkey: Extensão para rodar userscripts. 🐒
Navegador compatível: Testado em Google Chrome e Firefox, com suporte à API speechSynthesis. 🌐
Modo desenvolvedor ativo: Necessário para instalar o Tampermonkey no Chrome. 🧑‍💻


⚠️ Atenção

Este script foi desenvolvido para o sistema Feegow do HOC Hospital de Olhos de Caraguatatuba. 👁️🏥
Ajustes podem ser necessários se houver mudanças nas mensagens de fala ou na estrutura do Feegow. 🔄
O modo de depuração (debugMode = 1) deve ser desativado (debugMode = 0) em produção para evitar sobrecarga de logs. ⚙️


📜 Licença
Este projeto está licenciado sob a MIT License. Consulte o arquivo LICENSE para mais detalhes. 📄

👤 Autor
Desenvolvido por Nicolas Bonza Cavalari Borges. 🧑‍💻

🤝 Contribuições
Encontrou um problema ou tem sugestões de melhorias? Abra uma issue ou envie um pull request no repositório. 🛠️🚀
