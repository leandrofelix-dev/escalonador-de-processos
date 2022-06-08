// * Importação dos módulos <fs> para manipulação de arquivos
const fs = require('node:fs');

// * Definição das flags de execução do sistema:
// < urlCSV > [Armazena o endereço do arquivo CSV]
// < modo > [Refere-se ao modo de escalonamento dos processos]
// < modoExecucao > [Refere-se a exibição simplificada ou detalhada]

const urlCSV = process.argv[2];
const modoEscalonamento = process.argv[3];
const modoExecucao = Number(process.argv[4]);

const arquivoCSV = fs.readFileSync(urlCSV, 'utf-8');

// Declaração das variáveis auxiliares
let processo, idProcesso, chegadaProcesso, rajadaProcesso, prioridadeProcesso, tempoTotalProcessamento, tempoTotalEspera, quantidadeTrocasContexto, tempoFinalizacao;
let tempo = 1;
let finalizou = false;
// Vetor que armazena os IDS na ordem de finalização dos processos
let ordemfinalizacao = new Array;

// Vetor que armazena os tempos de finalização de cada processo
let finalizacaoProcesso = new Array;

console.log({ urlCSV, modoEscalonamento, modoExecucao });

// Leitura do arquivo CSV através da biblioteca fs:node
const processos = arquivoCSV.split('\n');

// Determina a função a ser executada baseada no modo de escalonamento
switch (modoEscalonamento) {
    case "TEST":
        //Execução da função de teste, para debug da aplicação
        test(idProcesso, chegadaProcesso, rajadaProcesso, prioridadeProcesso);
        break;
    case "FCFS":
        fcfs(modoExecucao, ordemfinalizacao, finalizacaoProcesso, idProcesso, tempoTotalProcessamento, tempo);
        break;
    case "SRTF":
        srtf(modoExecucao);
        break;
    case "RR":
        rr();
        break;
    case "SRTPF":
        srtpf(modoExecucao);
        break;
    case "PRIO":
        prio(modoExecucao);
        break;
    case "PRIOP":
        priop(modoExecucao);
        break;

    default:
        console.log("Insira um parâmetro válido");
        break;
}

/* MODO DE DEBUG PARA O DESENVOLVIMENTO */
function test(idProcesso, chegadaProcesso, rajadaProcesso, prioridadeProcesso) {

    for (let i = 1; i < processos.length; i++) {
        // Separação do objeto processos em um array para cada processo
        processo = processos[i].split(',');

        // Atribuição dos elementos de cada array() em uma variável distinta
        idProcesso = processo[0];
        chegadaProcesso = Number(processo[1]);
        rajadaProcesso = Number(processo[2]);
        prioridadeProcesso = Number(processo[3]);

        console.log("# Processo", i);
        console.log("ID:", idProcesso);
        console.log("Chegada:", chegadaProcesso);
        console.log("Rajada:", rajadaProcesso)
        console.log("Prioridade:", prioridadeProcesso);
        console.log("\n ====================================================== \n");
    }
}

/* MODO DE EXECUÇÃO FCFS */
function fcfs(modoExecucao, ordemfinalizacao, finalizacaoProcesso, idProcesso, tempoTotalProcessamento, tempo) {

    for (let i = 1; i < processos.length; i++) {
        // Separação do objeto processos em um array para cada processo
        processo = processos[i].split(',');

        // Atribuição dos elementos de cada array() em uma variável distinta
        idProcesso = processo[0];
        chegadaProcesso = Number(processo[1]);
        rajadaProcesso = Number(processo[2]);
        prioridadeProcesso = Number(processo[3]);

        ordemfinalizacao.push(idProcesso);

        while (rajadaProcesso >= 0) {
            rajadaProcesso--;
            tempo++;
        }

        finalizacaoProcesso.push(tempo);
        // ! finalizacaoProcesso || ordemfinalizacao
    }

    tempoTotalProcessamento = finalizacaoProcesso[(processos.length) - 2];

    //* O vetor processo já está na ordem de finalização correta, logo, não necessita ser alterado.
    switch (modoExecucao) {
        case 1:
            // FCFS == MODO 1 ==
            for (let i = 0; i < processos.length - 1; i++) {
                console.log("O processo", ordemfinalizacao[i], "encerrou no tempo: ", finalizacaoProcesso[i]);
            }
            break;
        case 2:
            // FCFS == MODO 2 ==
            console.log(" O tempo total de execução do processamento foi de", tempoTotalProcessamento, "unidades de tempo");
            break;
        default:
            console.log("Valor inválido");
            break;
    }

}

/* ======================================================= */