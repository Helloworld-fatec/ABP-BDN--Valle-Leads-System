// ======================================================
// AGGREGATION 1 - LEADS POR ORIGEM
//
// Objetivo:
// Identificar quais canais de comunicação
// geram mais leads para a empresa.
//
// Operadores utilizados:
// $group
// $sort
// ======================================================

db.leads.aggregate([

{
    $group: {

        _id: "$origem",

        total: {

            $sum: 1

        }

    }

},

{
    $sort: {

        total: -1

    }

}

])



// ======================================================
// AGGREGATION 2 - LEADS POR STATUS
//
// Objetivo:
// Verificar a quantidade de leads
// em cada etapa do processo comercial.
//
// Operadores utilizados:
// $group
// $sort
// ======================================================

db.leads.aggregate([

{
    $group: {

        _id: "$status",

        total: {

            $sum: 1

        }

    }

},

{
    $sort: {

        total: -1

    }

}

])



// ======================================================
// AGGREGATION 3 - LEADS POR ATENDENTE
//
// Objetivo:
// Avaliar a distribuição dos leads
// entre os atendentes da empresa.
//
// Operadores utilizados:
// $group
// $sort
// ======================================================

db.leads.aggregate([

{
    $group: {

        _id: "$atendente_id",

        total: {

            $sum: 1

        }

    }

},

{
    $sort: {

        total: -1

    }

}

])



// ======================================================
// AGGREGATION 4 - LEADS POR IMPORTÂNCIA
//
// Objetivo:
// Identificar quantos leads existem
// em cada nível de prioridade.
//
// Operadores utilizados:
// $group
// $sort
// ======================================================

db.leads.aggregate([

{
    $group: {

        _id: "$importancia",

        total: {

            $sum: 1

        }

    }

},

{
    $sort: {

        _id: 1

    }

}

])



// ======================================================
// AGGREGATION 5 - TAXA DE CONVERSÃO
//
// Objetivo:
// Analisar a quantidade de leads
// em cada status para medir o
// desempenho comercial.
//
// Operadores utilizados:
// $group
// $project
// ======================================================

db.leads.aggregate([

{
    $group: {

        _id: "$status",

        quantidade: {

            $sum: 1

        }

    }

},

{
    $project: {

        _id: 0,

        status: "$_id",

        quantidade: 1

    }

}

])



// ======================================================
// AGGREGATION 6 - LEADS IMPORTANTES
//
// Objetivo:
// Exibir apenas leads com importância
// maior ou igual a 8.
//
// Operadores utilizados:
// $match
// $project
// ======================================================

db.leads.aggregate([

{
    $match: {

        importancia: {

            $gte: 8

        }

    }

},

{
    $project: {

        _id: 1,

        cliente_id: 1,

        origem: 1,

        importancia: 1,

        status: 1

    }

}

])



// ======================================================
// AGGREGATION 7 - NEGOCIAÇÕES ATIVAS
//
// Objetivo:
// Exibir apenas negociações que
// permanecem abertas.
//
// Operadores utilizados:
// $match
// $project
// ======================================================

db.negociacoes.aggregate([

{
    $match: {

        ativa: true

    }

},

{
    $project: {

        _id: 1,

        lead_id: 1,

        veiculo: 1,

        valor_interesse: 1

    }

}

])



// ======================================================
// AGGREGATION 8 - VALOR TOTAL EM NEGOCIAÇÃO
//
// Objetivo:
// Calcular o valor financeiro total
// das negociações cadastradas.
//
// Operadores utilizados:
// $group
// ======================================================

db.negociacoes.aggregate([

{
    $group: {

        _id: null,

        valor_total: {

            $sum: "$valor_interesse"

        }

    }

}

])



// ======================================================
// AGGREGATION 9 - MÉDIA DE IMPORTÂNCIA DOS LEADS
//
// Objetivo:
// Calcular a importância média
// dos leads cadastrados.
//
// Operadores utilizados:
// $group
// ======================================================

db.leads.aggregate([

{
    $group: {

        _id: null,

        media_importancia: {

            $avg: "$importancia"

        }

    }

}

])



// ======================================================
// AGGREGATION 10 - QUANTIDADE DE LEADS POR LOJA
//
// Objetivo:
// Verificar qual loja recebe
// mais oportunidades de venda.
//
// Operadores utilizados:
// $group
// $sort
// ======================================================

db.leads.aggregate([

{
    $group: {

        _id: "$loja_id",

        total: {

            $sum: 1

        }

    }

},

{
    $sort: {

        total: -1

    }

}

])