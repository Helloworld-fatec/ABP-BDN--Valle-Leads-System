# 🚗 Sistema de Gestão de Leads – 1000 Valle Multimarcas

## 📌 Sobre o Projeto

Este projeto foi desenvolvido para a disciplina de **Banco de Dados Não Relacional** da **FATEC**, sob orientação da Prof.ª Lucineide.

O objetivo consiste na construção de um banco de dados não relacional utilizando **MongoDB** para atender às necessidades da empresa **1000 Valle Multimarcas**, responsável pela comercialização de veículos multimarcas.

A solução foi projetada para gerenciar todo o fluxo comercial da empresa, desde a captação de clientes interessados até a conclusão das negociações, permitindo maior organização dos leads, acompanhamento das oportunidades de venda e geração de indicadores gerenciais.

---

# 🎯 Objetivos

O sistema foi desenvolvido para:

* Registrar clientes interessados na compra de veículos;
* Controlar a entrada de leads por diferentes canais;
* Associar leads a lojas e atendentes responsáveis;
* Acompanhar negociações comerciais;
* Armazenar histórico de atendimentos;
* Gerar indicadores para análise gerencial;
* Aplicar conceitos de modelagem não relacional utilizando MongoDB.

---

# 🛠️ Tecnologias Utilizadas

* MongoDB
* MongoDB Compass
* JavaScript (Mongo Shell)
* GitHub

---

# 🏢 Contexto do Negócio

A empresa 1000 Valle Multimarcas recebe diariamente contatos de potenciais clientes por diversos canais de atendimento:

* WhatsApp
* Instagram
* Telefone
* Atendimento presencial
* Formulários digitais

Cada contato gera um lead que precisa ser acompanhado durante todo o processo comercial, desde o primeiro atendimento até o fechamento da venda.

---

# 🗄️ Estrutura do Banco de Dados

O banco de dados foi desenvolvido utilizando seis collections principais:

## clientes

Armazena os dados cadastrais dos clientes:

* CPF
* Nome
* Telefone
* E-mail
* Cidade

## lojas

Representa as unidades da empresa:

* Nome
* Cidade
* Telefone

## usuarios

Responsável pelo cadastro de:

* Atendentes
* Gerentes
* Administradores

## leads

Centraliza as oportunidades de venda:

* Cliente associado
* Loja responsável
* Atendente responsável
* Origem do contato
* Status do lead
* Nível de importância
* Veículo de interesse

## negociacoes

Controla o andamento das negociações:

* Lead associado
* Veículo negociado
* Valor de interesse
* Situação da negociação
* Histórico completo de movimentações

## logs

Registra ações executadas pelos usuários para auditoria do sistema.

---

# 🔗 Estratégias de Modelagem

## Referencing

Foi utilizado para relacionar documentos de diferentes collections.

Exemplos:

* Lead → Cliente
* Lead → Loja
* Lead → Usuário
* Negociação → Lead

Essa abordagem reduz redundâncias e facilita a manutenção dos dados.

## Embedding

Foi utilizado na collection **negociacoes**.

O histórico da negociação foi armazenado dentro do próprio documento através de um array contendo:

* Status
* Estágio
* Data

Essa estratégia permite acesso rápido ao histórico completo sem necessidade de múltiplas consultas.

---

# 📋 Regras de Negócio Implementadas

* Cada lead está vinculado a um cliente.
* Cada lead está vinculado a uma loja.
* Cada lead está vinculado a um atendente.
* Apenas uma negociação ativa é permitida por lead.
* O histórico da negociação é armazenado cronologicamente.
* Todas as ações relevantes são registradas em logs.

---

# 🔍 Consultas Implementadas

O projeto contempla consultas utilizando:

### Operadores Lógicos

* `$and`
* `$or`

### Operadores de Comparação

* `$gt`
* `$lt`

### Operadores de Existência

* `$exists`

### Manipulação de Resultados

* Projeção
* Ordenação (`sort`)
* Paginação (`skip` e `limit`)

---

# 📊 Dashboard Gerencial (Aggregations)

Foram desenvolvidas pipelines de agregação utilizando:

* `$match`
* `$group`
* `$sort`
* `$project`

Indicadores gerados:

* Leads por origem;
* Leads por status;
* Taxa de conversão;
* Leads por atendente;
* Leads por importância.

Esses indicadores auxiliam gestores na tomada de decisões e no acompanhamento do desempenho comercial.

---

# ✅ Benefícios da Solução

* Centralização das informações comerciais;
* Melhor organização dos leads;
* Controle das negociações;
* Histórico completo dos atendimentos;
* Facilidade para geração de relatórios;
* Suporte à tomada de decisão;
* Flexibilidade proporcionada pelo MongoDB.

---

# 👥 Equipe

| Integrante                     | Responsabilidade                    |
| ------------------------------ | ----------------------------------- |
| Alicia Silva Dias              | Gestão de Projeto e GitHub          |
| Bruna Rodrigues Gomes          | Modelagem e Arquitetura de Dados    |
| Bruno Berval Moreira de Godoi  | Implementação de Scripts e Inserção |
| Pedro Enrique de Jesus Freitas | Desenvolvimento de Consultas        |
| Nicolas Kaue da Silva          | Aggregations e Indicadores          |
| Ryan Pedro Tinel de Andrade    | Documentação e Justificativas       |
| Suelen Souza de Castro         | QA, Capturas de Tela e Apresentação |

---

# 📄 Entrega

O arquivo **BDN-Documento-ABP.pdf** contém:

* Script completo do MongoDB;
* Capturas de tela das execuções;
* Justificativas de modelagem;
* Consultas realizadas;
* Aggregations desenvolvidas;
* Conclusão do projeto.

---

## 🎓 Disciplina

Banco de Dados Não Relacional – FATEC

Prof.ª Lucineide

2026
