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
let processo, idProcesso, chegadaProcesso, rajadaProcesso, prioridadeProcesso, tempoTotalProcessamento, tempoTotalEspera, quantidadeTrocasContexto, tempoFinalizacao, inicioProcesso;

let tempo = 0;
let tempoRestante = 0;
let mediaTempoDeRetorno = 0;
let mediaTempoEspera = 0;
// Vetor que armazena os IDS na ordem de finalização dos processos
let ordemfinalizacao = new Array;
// Vetor que armazena os o tempo de retono de cada processo
let tempoDeRetorno = new Array;
// Vetor que armazena os tempos de finalização de cada processo
let finalizacaoProcesso = new Array;
// Vetor que armazena os tempos de espera de cada processo
let tempoEspera = new Array;

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
        fcfs(modoExecucao, ordemfinalizacao, finalizacaoProcesso, idProcesso, tempoTotalProcessamento, tempo, tempoDeRetorno, mediaTempoDeRetorno, inicioProcesso, tempoEspera, mediaTempoEspera);
        break;
    case "SRTF":
        srtf(modoExecucao, ordemfinalizacao, finalizacaoProcesso, idProcesso, tempoTotalProcessamento, tempo, tempoDeRetorno, mediaTempoDeRetorno, inicioProcesso, tempoEspera, mediaTempoEspera, tempoRestante);
        break;
    case "RR":
        rr(modoExecucao);
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
function fcfs(modoExecucao, ordemfinalizacao, finalizacaoProcesso, idProcesso, tempoTotalProcessamento, tempo, tempoDeRetorno, mediaTempoDeRetorno, inicioProcesso, tempoEspera, mediaTempoEspera) {

    for (let i = 1; i < processos.length; i++) {
        // Separação do objeto processos em um array para cada processo
        processo = processos[i].split(',');

        // Atribuição dos elementos de cada array() em uma variável distinta
        idProcesso = processo[0];
        chegadaProcesso = Number(processo[1]);
        rajadaProcesso = Number(processo[2]);
        prioridadeProcesso = Number(processo[3]);
        inicioProcesso = tempo;

        ordemfinalizacao.push(idProcesso);

        tempoEspera.push(inicioProcesso - chegadaProcesso + 1);

        do {
            rajadaProcesso--;
            tempo++;
        } while (rajadaProcesso > 0);

        tempoDeRetorno.push(tempo - chegadaProcesso);
    }

    for (let i = 0; i < tempoDeRetorno.length; i++) {
        mediaTempoDeRetorno += tempoDeRetorno[i];
    }
    for (let i = 0; i < tempoEspera.length; i++) {
        mediaTempoEspera += tempoEspera[i];
    }

    mediaTempoDeRetorno /= tempoDeRetorno.length;
    mediaTempoEspera /= tempoEspera.length;


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
            //Tempo total de execução
            console.log("\n ======================================= \n");
            console.log("* O tempo total de execução do processamento foi de", tempo, "unidades de tempo\n");

            //Media de tempo de retorno
            console.log("* A média de tempo de retorno é de:", mediaTempoDeRetorno, "unidedes de tempo\n");

            //Media de tempo de espera
            console.log("* A média de espera dos processos é de: ", mediaTempoEspera, "unidades de tempo");
            //Trocas de contexto
            break;
        default:
            console.log("Valor inválido");
            break;
    }

}
function srtf(modoExecucao, ordemfinalizacao, finalizacaoProcesso, idProcesso, tempoTotalProcessamento, tempo, tempoDeRetorno, mediaTempoDeRetorno, inicioProcesso, tempoEspera, mediaTempoEspera, tempoRestante) {
    // Separação do objeto processos em um array para cada processo

    let processosSrtf = new Array;
    let processosChegados = new Array;
    let procesosFinalizados = new Array;


    do {
        // 1-  Armazenar todos os processos que chegaram ate o momento
        for (let i = 1; i < processos.length; i++) {
            processo = processos[i].split(',');

            // Atribuição dos elementos de cada array() em uma variável distinta
            idProcesso = processo[0];
            chegadaProcesso = Number(processo[1]);
            rajadaProcesso = Number(processo[2]);
            prioridadeProcesso = Number(processo[3]);
            inicioProcesso = tempo;

            if (tempo >= chegadaProcesso) {
                // checa se o processo ja esta no array
                // caso não esteja, adiciona
                if (!processosSrtf.includes(idProcesso)) {
                    processosSrtf.push(idProcesso);
                }
            }
        }
        console.log(tempo, "====", processosSrtf);


        // 2- checa se o processo foi completado e atualiza os dados caso tenha sido
        // 3- popula o vetor dos chegados com processos que nao tenham sido terminados
        // 4- filtra o vetor temporario e identifica o processo que devera ser executado no instante queueTime

        tempo++;
    } while (procesosFinalizados.length != processos.length - 1);
}

/* ======================================================= */