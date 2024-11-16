# Feegow - Ajuste na Fala de Chamada para Triagem

## Descrição

Este é um script do Tampermonkey para modificar a fala gerada pelo sistema Feegow utilizado no **HOC Hospital de Olhos de Caraguatatuba**, especificamente na chamada de pacientes para atendimento. O script intercepta a função de síntese de fala do navegador e altera o texto de chamadas, substituindo a referência a sala de exames 01 para "sala de triagem".

---

## Funcionalidade

O script detecta chamadas de pacientes contendo a frase "está chamando paciente [nome]" seguida da referência à sala de exame 01. Quando detectado, o texto é alterado, substituindo "está chamando paciente" por "Enfermagem está chamando paciente" e trocando "sala de exame 01" por "triagem", garantindo a correção da informação transmitida.

---

## Como funciona

1. **Interceptação da função de fala**: A função `speechSynthesis.speak` do navegador é interceptada para que o texto possa ser modificado antes de ser pronunciado.
   
2. **Verificação de condições**: O script verifica se o texto da fala contém "exame 01" ou "está chamando paciente [nome]". Dependendo do caso, o texto é modificado para garantir precisão.

3. **Modificação do texto**:
   - Se a fala mencionar "está chamando paciente [nome] para atendimento na sala de exame 01 - matriz", o nome do paciente é extraído, "está chamando paciente" é substituído por "Enfermagem está chamando paciente", e a sala é corrigida para "triagem".
   - Se a fala contiver apenas "exame 01", o texto é alterado para "Enfermagem está chamando para atendimento na sala de triagem".

4. **Execução da fala modificada**: Após as alterações, o texto modificado é passado para a função original de síntese de fala para ser pronunciado pelo navegador.

---

## Como usar

1. Instale o Tampermonkey como extensão no seu navegador.
2. Ative o **modo desenvolvedor** no Google Chrome:
   - Clique nos três pontos no canto superior direito e vá em **Mais ferramentas** > **Extensões**.
   - No canto superior direito da página de extensões, ative o botão **Modo do desenvolvedor**.
3. Crie um novo script no Tampermonkey e cole o código.
4. O script será executado automaticamente ao acessar a URL do sistema Feegow: `https://core.feegow.com/tvcall/panelV3/vvAM/0`.

---

## Exemplo de Modificação de Fala

#### Texto original:
> "está chamando paciente Rafaela para atendimento na sala de exame 01 - matriz"

---

#### Texto modificado:
> "Enfermagem está chamando paciente Rafaela para atendimento na sala de triagem"

---

## Logs de Depuração

O script inclui diversos logs de depuração no console para auxiliar no monitoramento de sua execução. Isso pode ser útil para verificar se as condições estão sendo atendidas corretamente e se o texto está sendo modificado conforme esperado.

---

## Dependências

- **Tampermonkey**: Extensão do navegador para rodar scripts de usuários (userscripts).
- **Navegador compatível**: O script foi testado em navegadores como Google Chrome e Firefox, que suportam a API `speechSynthesis`.
- **Modo desenvolvedor ativo**: Para instalar o script diretamente pelo Tampermonkey no Google Chrome, é necessário ativar o **modo desenvolvedor** das extensões.

---

## Atenção

- Este script foi desenvolvido especificamente para o sistema Feegow do HOC Hospital de Olhos de Caraguatatuba.
- Pode ser necessário ajustar a lógica caso haja outras modificações nas mensagens de fala ou no formato dos dados.

---

## **Licença**

Este projeto está licenciado sob a **MIT License**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## **Autor**

Desenvolvido por **Nicolas Bonza Cavalari Borges**.

---

## **Contribuições**

Se você encontrar algum problema ou quiser sugerir melhorias, fique à vontade para abrir uma **issue** ou enviar um **pull request**.

---
