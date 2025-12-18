<div align="center">

# 🏥 Feegow TV Panel Interceptor
### Otimização de Chamadas de Pacientes e UX para HOC Caraguatatuba

![Version](https://img.shields.io/badge/version-2.2.5-blue?style=for-the-badge&logo=none)
![Maintainer](https://img.shields.io/badge/maintainer-Nicolas_Bonza-orange?style=for-the-badge&logo=github)
![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=for-the-badge)

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-comandos-de-teste">Comandos</a> •
  <a href="#-debug--logs">Debug</a>
</p>

</div>

---

## 📝 Sobre

O **Feegow TV Panel Interceptor** é um Userscript avançado desenvolvido para otimizar o fluxo de chamadas no painel de TV do sistema **Feegow** no **HOC Hospital de Olhos de Caraguatatuba**.

O sistema original não diferenciava verbalmente ou visualmente com clareza os setores de atendimento. Este script intercepta a API de síntese de voz do navegador (`speechSynthesis`) e manipula o DOM em tempo real para categorizar chamadas automaticamente entre **Sala de Pré-Consulta** (Triagem) e **Central de Diagnósticos** (Exames), melhorando significativamente a experiência do paciente e a organização do fluxo hospitalar.

---

## 🛠️ Tecnologias

<table>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
    </td>
    <td align="center">
      <img src="https://img.shields.io/badge/Tampermonkey-Userscript-004838?style=for-the-badge&logo=tampermonkey&logoColor=white" alt="Tampermonkey"/>
    </td>
    <td align="center">
      <img src="https://img.shields.io/badge/DOM_Manipulation-MutationObserver-orange?style=for-the-badge&logo=html5&logoColor=white" alt="DOM"/>
    </td>
  </tr>
</table>

---

## ✨ Funcionalidades

### 🎤 Interceptação de Áudio Inteligente
* **Context Aware:** Analisa o padrão da string de chamada. Se detectar o prefixo "Dr.", redireciona para *Central de Diagnósticos*. Caso contrário, direciona para *Sala de Pré-Consulta*.
* **Refinamento de Fala:** Remove redundâncias como "sala de exame 01 - matriz" e substitui por termos amigáveis ao paciente.
* **Normalização:** Corrige erros gramaticais do sistema original (ex: "na consultório" para "no consultório").

### 🖥️ Manipulação de Interface (UI)
* **Atualização Dinâmica:** Utiliza `MutationObserver` para alterar o texto visível na tela (`#ultimasGeral` e elementos de destaque) em sincronia com o áudio modificado.
* **Fullscreen Nativo:** Adiciona um botão de controle de tela cheia persistente e não intrusivo na interface.
* **Histórico Local:** Mantém um array local dos últimos pacientes chamados para garantir consistência entre o áudio e o texto exibido.

### 🔧 Developer Experience (DX)
* **Console Visual:** Interface de logs flutuante injetada na página para debugging em produção sem necessidade de abrir o DevTools.
* **Comandos de Simulação:** Ferramentas para testar fluxos sem depender de chamadas reais do sistema.

---

## 🚀 Instalação

1.  **Pré-requisito:** Instale a extensão **Tampermonkey** no seu navegador ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | [Firefox](https://addons.mozilla.org/pt-BR/firefox/addon/tampermonkey/)).
2.  **Instalação do Script:**
    * Crie um novo script no painel do Tampermonkey.
    * Copie o código fonte do arquivo `Feegow Triagem - Interceptar e Modificar Fala.user.js`.
    * Salve (Ctrl+S).
3.  **Acesso:** O script será ativado automaticamente nas URLs:
    * `https://core.feegow.com/tvcall/panelV3/*`

---

## 🎮 Comandos de Teste

Para validar o funcionamento sem aguardar pacientes reais, ative o modo debug (`debugMode = 1`) e utilize o input flutuante injetado na tela:

| Comando | Descrição | Exemplo |
| :--- | :--- | :--- |
| `/testedr` | Simula chamada de **Médico/Consultório**. | `/testedr João Silva` |
| `/testexames` | Simula chamada para **Central de Diagnósticos**. | `/testexames Maria Souza` |
| `/testetriagem` | Simula chamada para **Pré-Consulta (Triagem)**. | `/testetriagem Pedro Santos` |

---

## 📢 Comparativo de Modificação

Abaixo, exemplos de como o script transforma a experiência:

### Cenário 1: Triagem
> **🔴 Original:** "Está chamando paciente Rafaela para atendimento na sala de exame 01 - matriz"
>
> **🟢 Modificado:** "Enfermagem está chamando Rafaela para Sala de Pré-Consulta."

### Cenário 2: Exames
> **🔴 Original:** "Dr. está chamando paciente João para atendimento na sala de exame 01 - matriz"
>
> **🟢 Modificado:** "Enfermagem está chamando João para Central de Diagnósticos."

---

## 🐛 Debug & Logs

O script possui um sistema robusto de logs condicionais. Para ativar, altere a variável no início do código:

```javascript
const debugMode = 1; // 0 = Desativado (Prod), 1 = Ativado (Dev)

```

<details>
<summary><strong>📂 Clique para ver detalhes da Interface Visual de Logs</strong></summary>




Quando ativo, uma janela preta translúcida aparecerá no canto direito contendo:

* Timestamp preciso de cada ação.
* Propriedades da voz (Rate, Pitch, Volume).
* Texto original *vs* Texto modificado.
* Status dos seletores DOM (se encontrou ou não os elementos HTML).
* Logs de transição de tela cheia.

Esta interface usa CSS injetado dinamicamente para não interferir no layout original do Feegow.

</details>

---

## ⚠️ Notas Importantes

* **Ambiente:** Desenvolvido especificamente para a estrutura DOM do Feegow v3. Alterações no ID dos elementos pelo fornecedor podem requerer manutenção neste script.
* **Performance:** O `MutationObserver` está configurado para observar apenas a subárvore relevante (`#ultimasGeral`), minimizando impacto na memória do navegador.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE] para mais detalhes.

---

<div align="center">

**Desenvolvido por Nicolas Bonza Cavalari Borges**





*HOC Hospital de Olhos de Caraguatatuba*

</div>
