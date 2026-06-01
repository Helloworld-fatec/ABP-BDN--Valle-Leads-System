// ======================================================
// CONSULTA 1 - OPERADOR $and
// Objetivo:
// Localizar leads que estejam "Em andamento"
// e possuam importância maior que 5.
// ======================================================

db.leads.find({

    $and: [

        { status: "Em andamento" },

        { importancia: { $gt: 5 } }

    ]

})


// ======================================================
// CONSULTA 2 - OPERADOR $or
// Objetivo:
// Localizar leads que vieram do WhatsApp
// ou do Instagram.
// ======================================================

db.leads.find({

    $or: [

        { origem: "WhatsApp" },

        { origem: "Instagram" }

    ]

})


// ======================================================
// CONSULTA 3 - OPERADORES $gt E $lt
// Objetivo:
// Buscar leads com importância entre 6 e 8.
// ======================================================

db.leads.find({

    importancia: {

        $gt: 5,

        $lt: 9

    }

})


// ======================================================
// CONSULTA 4 - OPERADOR $exists
// Objetivo:
// Verificar clientes que possuem
// o campo e-mail cadastrado.
// ======================================================

db.clientes.find({

    email: {

        $exists: true

    }

})


// ======================================================
// CONSULTA 5 - PROJEÇÃO
// Objetivo:
// Exibir apenas nome e e-mail
// dos clientes cadastrados.
// ======================================================

db.clientes.find(

{},

{

    nome: 1,

    email: 1,

    _id: 0

}

)


// ======================================================
// CONSULTA 6 - ORDENAÇÃO (SORT)
// Objetivo:
// Listar os leads da maior para a menor
// importância.
// ======================================================

db.leads.find()

.sort({

    importancia: -1

})


// ======================================================
// CONSULTA 7 - PAGINAÇÃO (SKIP E LIMIT)
// Objetivo:
// Ignorar os dois primeiros registros
// e exibir apenas os próximos três.
// ======================================================

db.leads.find()

.skip(2)

.limit(3)


// ======================================================
// CONSULTA 8 - LEADS NOVOS
// Objetivo:
// Exibir todos os leads com status "Novo".
// ======================================================

db.leads.find({

    status: "Novo"

})


// ======================================================
// CONSULTA 9 - LEADS FECHADOS
// Objetivo:
// Exibir todos os leads já fechados.
// ======================================================

db.leads.find({

    status: "Fechado"

})


// ======================================================
// CONSULTA 10 - NEGOCIAÇÕES ATIVAS
// Objetivo:
// Exibir todas as negociações que ainda
// estão em andamento.
// ======================================================

db.negociacoes.find({

    ativa: true

})


// ======================================================
// CONSULTA 11 - CLIENTES DE SÃO JOSÉ DOS CAMPOS
// Objetivo:
// Localizar clientes da cidade de
// São José dos Campos.
// ======================================================

db.clientes.find({

    cidade: "São José dos Campos"

})


// ======================================================
// CONSULTA 12 - LOGS DE UM USUÁRIO
// Objetivo:
// Consultar ações realizadas pelo
// usuário de ID 101.
// ======================================================

db.logs.find({

    usuario_id: 101

})