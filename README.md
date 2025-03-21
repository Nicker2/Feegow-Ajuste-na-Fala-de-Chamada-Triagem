# 🏥 Feegow - Interceptar e Modificar Fala e Texto na Tela 🎤🖥️

## 📝 Descrição

Este é um script **Tampermonkey** que intercepta e modifica a fala e o texto exibido na tela do sistema **Feegow**, diferenciando chamadas de **triagem** e **exames**. Ele foi desenvolvido para o **HOC Hospital de Olhos de Caraguatatuba** 👁️ e otimizado com **logs detalhados condicionais** para facilitar a depuração e o monitoramento. 🛠️🔍

---

## 🛠️ Funcionalidades

- **Interceptação da fala**: Modifica o texto de chamadas de pacientes, substituindo referências à **sala de exame 01** por **"sala de triagem"** ou **"sala de exames 01"**, dependendo do contexto. 🎤🔄
- **Atualização dinâmica da tela**: Altera o texto exibido na interface do Feegow para refletir as modificações feitas na fala. 🖥️✨
- **Logs detalhados**: Exibe logs no console e em uma interface visual para facilitar o acompanhamento das alterações. 📜🖥️
- **Comandos personalizados**: Permite testar chamadas de pacientes via comandos como `/testedr`, `/testexames` e `/testetriagem`. 🎮🔧
- **Interface de logs interativa**: Cria uma janela de logs fixa na tela, com mensagens em tempo real e efeitos de transição. 🪟📝

---

## ⚙️ Como Funciona

1. **Interceptação da função de fala**: O script substitui a função `speechSynthesis.speak` do navegador para modificar o texto antes de ser pronunciado. 🎤🔧
2. **Verificação de condições**: O texto da fala é analisado para identificar se a chamada é para **triagem** ou **exames**. 🔍✅
3. **Modificação do texto**:
   - Se a fala mencionar **"sala de exame 01 - matriz"**, o texto é alterado para **"sala de triagem"** ou **"sala de exames 01"**, dependendo do contexto. 🏥🔄
   - O nome do paciente é extraído e utilizado para atualizar a lista de últimos pacientes chamados. 📋👤
4. **Atualização da interface**: O texto exibido na tela é alterado para refletir as modificações feitas na fala. 🖥️✨
5. **Logs detalhados**: Todas as ações são registradas no console e em uma interface visual para facilitar o monitoramento. 📜🖥️

---

## 🚀 Como Usar

1. **Instale o Tampermonkey** como extensão no seu navegador. 🐒
2. **Crie um novo script** no Tampermonkey e cole o código fornecido. 📜
3. **Acesse a URL do Feegow**: O script será executado automaticamente nas URLs correspondentes. 🌐
4. **Teste os comandos**:
   - Use `/testedr NOME` para simular uma chamada de consultório. 🩺
   - Use `/testexames NOME` para simular uma chamada de exames. 🧪
   - Use `/testetriagem NOME` para simular uma chamada de triagem. 🚨
5. **Monitore os logs**: Acompanhe as alterações em tempo real na interface de logs. 🖥️📝

---

## 📢 Exemplo de Modificação de Fala

#### Texto original:
> "dr.  está chamando paciente Rafaela para atendimento na sala de exame 01 - matriz" 🗣️

---

#### Texto modificado:
> "Enfermagem está chamando Rafaela para sala de triagem." 🚨👩‍⚕️

---

## 📜 Logs de Depuração

O script inclui **logs detalhados** no console e em uma interface visual para auxiliar no monitoramento de sua execução. Isso permite verificar se as condições estão sendo atendidas corretamente e se o texto está sendo modificado conforme esperado. 🖥️🔍

---

## 📦 Dependências

- **Tampermonkey**: Extensão do navegador para rodar scripts de usuários (userscripts). 🐒
- **Navegador compatível**: O script foi testado em navegadores como Google Chrome e Firefox, que suportam a API `speechSynthesis`. 🌐
- **Modo desenvolvedor ativo**: Para instalar o script diretamente pelo Tampermonkey no Google Chrome, é necessário ativar o **modo desenvolvedor** das extensões. 🧑‍💻

---

## ⚠️ Atenção

- Este script foi desenvolvido especificamente para o sistema Feegow do **HOC Hospital de Olhos de Caraguatatuba**. 👁️🏥
- Pode ser necessário ajustar a lógica caso haja outras modificações nas mensagens de fala ou no formato dos dados. 🔄

---

## 📜 **Licença**

Este projeto está licenciado sob a **MIT License**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes. 📄

---

## 👤 **Autor**

Desenvolvido por **Nicolas Bonza Cavalari Borges**. 🧑‍💻

---

## 🤝 **Contribuições**

Se você encontrar algum problema ou quiser sugerir melhorias, fique à vontade para abrir uma **issue** ou enviar um **pull request**. 🛠️🚀

---
