## 📌 Sobre o Projeto
Este projeto consiste no desenvolvimento de um banco de dados não relacional utilizando **MongoDB** para a empresa **1000 Valle Multimarcas**, uma revendedora de veículos multimarcas[cite: 5, 24]. O objetivo central é gerenciar o fluxo de atendimento desde a geração do lead até a conclusão da negociação, adaptando uma estrutura originalmente pensada para bancos relacionais (PostgreSQL/Prisma) para a flexibilidade do modelo de documentos.

Projeto desenvolvido para a disciplina de **Banco de Dados Não Relacional** da **Fatec**, sob orientação da **Prof. Lucineide**.

---

## 🛠️ Tecnologias e Ferramentas
* **Banco de Dados:** MongoDB
* **Interface de Gerenciamento:** MongoDB Compass
* **Modelagem de Origem:** Prisma Schema (PostgreSQL)

---

## 📂 Estrutura de Dados (Modelagem)
A modelagem foi fundamentada na conversão de um esquema relacional para o modelo de documentos, aplicando os conceitos de **Embedding** e **Referencing** conforme exigido.

### Principais Coleções
* **clientes:** Armazena dados cadastrais dos clientes.
* **leads:** Centraliza os interesses de compra e origens de contato.
* **usuarios:** Perfis de atendentes, gerentes e administradores.
* **lojas:** Unidades da revendedora e suas equipes.
* **negociacoes:** Registro das vendas em andamento com **Embedding** do histórico completo de status, estágios e importância.
* **logs:** Rastro de auditoria das ações no sistema.

---

## 📊 Requisitos Técnicos Implementados
O projeto contempla as seguintes funcionalidades de consulta e análise de dados:

### 🔍 Consultas Operacionais
Uso de operadores avançados para filtragem e exibição de dados:
* Operadores lógicos: `$and` e `$or`.
* Operadores de comparação: `$gt` e `$lt`.
* Verificação de existência: `$exists`.
* Projeção, Ordenação e Paginação (`skip`, `limit`).

### 📈 Aggregations (Dashboard Gerencial)
Pipelines de agregação para geração de indicadores]:
* Leads agrupados por origem e status.
* Cálculo de taxa de conversão.
* Desempenho por atendente e classificação de importância.
* Estágios utilizados: `$match`, `$group`, `$sort` e `$project`.

---

## 📋 Regras de Negócio
1. Cada lead deve estar vinculado a um cliente, uma loja e um atendente.
2. O sistema permite apenas **uma negociação ativa** por lead.
3. O histórico de negociação deve ser mantido de forma cronológica dentro do documento da negociação.

---

## 👥 Equipe (Grupo de 7 Integrantes)
1. **[Nome do Aluno]** - Gestão de Projeto e GitHub
2. **[Nome do Aluno]** - Modelagem e Arquitetura de Dados
3. **[Nome do Aluno]** - Implementação de Scripts e Inserção
4. **[Nome do Aluno]** - Desenvolvimento de Consultas (Queries)
5. **[Nome do Aluno]** - Especialista em Aggregations (BI)
6. **[Nome do Aluno]** - Redação Técnica e Justificativas
7. **[Nome do Aluno]** - QA, Capturas de Tela e Apresentação

---

## 📄 Entrega Final
O documento oficial de entrega (**BDN-Documento-ABP.pdf**) contém o script completo, os prints de execução no MongoDB Compass e a fundamentação teórica das decisões de modelagem.
