db.negociacoes.insertMany([

{
    _id: 1,
    lead_id: 1,
    ativa: true,
    valor_interesse: 85000,
    veiculo: "Honda Civic 2020",

    historico: [

        {
            status: "Lead recebido",
            estagio: "Primeiro contato",
            data: new Date()
        },

        {
            status: "Proposta enviada",
            estagio: "Negociação",
            data: new Date()
        }

    ]
},

{
    _id: 2,
    lead_id: 2,
    ativa: true,
    valor_interesse: 78000,
    veiculo: "Toyota Corolla 2019",

    historico: [

        {
            status: "Contato iniciado",
            estagio: "Atendimento",
            data: new Date()
        },

        {
            status: "Cliente respondeu",
            estagio: "Negociação",
            data: new Date()
        }

    ]
},

{
    _id: 3,
    lead_id: 3,
    ativa: false,
    valor_interesse: 120000,
    veiculo: "BMW X1",

    historico: [

        {
            status: "Negociação encerrada",
            estagio: "Finalizado",
            data: new Date()
        }

    ]
},

{
    _id: 4,
    lead_id: 4,
    ativa: true,
    valor_interesse: 95000,
    veiculo: "Jeep Compass",

    historico: [

        {
            status: "Teste drive agendado",
            estagio: "Visita",
            data: new Date()
        }

    ]
},

{
    _id: 5,
    lead_id: 5,
    ativa: true,
    valor_interesse: 65000,
    veiculo: "HB20",

    historico: [

        {
            status: "Análise de proposta",
            estagio: "Negociação",
            data: new Date()
        }

    ]
},

{
    _id: 6,
    lead_id: 6,
    ativa: true,
    valor_interesse: 110000,
    veiculo: "Fiat Toro",

    historico: [

        {
            status: "Lead recebido",
            estagio: "Primeiro contato",
            data: new Date()
        },

        {
            status: "Cliente aguardando retorno",
            estagio: "Atendimento",
            data: new Date()
        }

    ]
},

{
    _id: 7,
    lead_id: 7,
    ativa: true,
    valor_interesse: 135000,
    veiculo: "Audi A3",

    historico: [

        {
            status: "Contato realizado",
            estagio: "Atendimento",
            data: new Date()
        },

        {
            status: "Proposta aprovada",
            estagio: "Fechamento",
            data: new Date()
        }

    ]
},

{
    _id: 8,
    lead_id: 8,
    ativa: false,
    valor_interesse: 58000,
    veiculo: "Onix",

    historico: [

        {
            status: "Negociação encerrada",
            estagio: "Finalizado",
            data: new Date()
        }

    ]
},

{
    _id: 9,
    lead_id: 9,
    ativa: true,
    valor_interesse: 98000,
    veiculo: "Renegade",

    historico: [

        {
            status: "Visita agendada",
            estagio: "Atendimento",
            data: new Date()
        }

    ]
},

{
    _id: 10,
    lead_id: 10,
    ativa: true,
    valor_interesse: 145000,
    veiculo: "Corolla Cross",

    historico: [

        {
            status: "Proposta enviada",
            estagio: "Negociação",
            data: new Date()
        },

        {
            status: "Aguardando aprovação",
            estagio: "Fechamento",
            data: new Date()
        }

    ]
}

])