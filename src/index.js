/*
   == IFCE - Campus Cedro == 
  * Disciplina de Sistemas Operacionais
  * Escalonador de processos com JavaScript através do NodeJS

  * Equipe integrante do projeto:
    - Francisco Leandro Araujo Felix
    - Maria Janiele Alves de Oliveira
    - Rayanne Oliveira dos Santos
    - Amanda Silva de Souza
    - Cicero Danilo do Nascimento Pereira
*/


// * Importação dos módulos <fs> para manipulação de arquivos
const fs = require("node:fs");

// FUNCOES SORT
function menorChegada(a, b) {
  if (a.chegada < b.chegada) {
    return -1;
  }
  if (a.chegada > b.chegada) {
    return 1;
  }
  return 0;
}

function menorRajada(a, b) {
  if (a.rajada < b.rajada) {
    return -1;
  }
  if (a.rajada > b.rajada) {
    return 1;
  }
  return 0;
}

function menorPrioridade(a, b) {
  if (a.prioridade < b.prioridade) {
    return -1;
  }
  if (a.prioridade > b.prioridade) {
    return 1;
  }
  return 0;
}

function maiorExecucoes(a, b) {
  if (a.prioridade < b.prioridade) {
    return 1;
  }
  if (a.prioridade > b.prioridade) {
    return -1;
  }
  return 0;
}

// * Definição das flags de execução do sistema:
// < urlCSV > [Armazena o endereço do arquivo CSV]
// < modo > [Refere-se ao modo de escalonamento dos processos]
// < modoExecucao > [Refere-se a exibição simplificada ou detalhada]

const urlCSV = process.argv[2];
const modoEscalonamento = process.argv[3];
const modoExecucao = Number(process.argv[4]);

const arquivoCSV = fs.readFileSync(urlCSV, "utf-8");

// Armazena todas as instancias de processos
var processos = new Array();
var processosProntos = new Array();

// Armazena o tempo
var tempo = 1;

class Processo {
  constructor(id, chegada, rajada, prioridade) {
    this.id = id;
    this.chegada = chegada;
    this.rajada = rajada;
    this.prioridade = prioridade;
    this.comeco = undefined;
    this.termino = 1;
    this.contexto = 1;
    this.terminado = false;
    this.quantum = 0;
  }

  debug() {
    console.log(
      "id -> ",
      this.id,
      "chegada ->",
      this.chegada,
      "rajada -> ",
      this.rajada,
      "prioridade ->",
      this.prioridade
    );
  }
}

console.log({ urlCSV, modoEscalonamento, modoExecucao });

// Leitura do arquivo CSV através da biblioteca fs:node
const arquivo = arquivoCSV.split("\n");

// Para  cada linha do arquivo csv
// exceto a primeira, pois são os cabeçalhos
for (let linha = 1; linha < arquivo.length; linha++) {
  // id | chegada | rajada | prioridade
  let split = arquivo[linha].split(",");

  // cria um processo com os dados acima
  let processo = new Processo(split[0][1], split[1], split[2], split[3][0]);

  // envia o processo para a variavel global processos
  processos.push(processo);
}

// Determina a função a ser executada baseada no modo de escalonamento
switch (modoEscalonamento) {
  case "TEST":
    //Execução da função de teste, para debug da aplicação
    test();
    break;
  case "FCFS":
    fcfs(modoExecucao);
    break;
  case "SRTF":
    srtf(modoExecucao);
    break;
  case "RR":
    rr(modoExecucao);
    break;
  case "SRTFP":
    srtfp(modoExecucao);
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
function test() {
  console.log("oi");
}

function fcfs(modoExecucao) {
  // filtra todos os processos na ordem de chegada
  let ordemChegada = processos.sort(menorChegada);

  // enquanto o ultimo processo nao for terminado
  while (!ordemChegada[ordemChegada.length - 1].terminado) {
    // checa se o primeiro processo terminou
    if (ordemChegada[0].terminado) {
      // se tiver terminado, tira o processo da fila
      ordemChegada.shift();
    }

    if (ordemChegada[0].comeco == undefined) {
      ordemChegada[0].comeco = tempo;
    }
    // se nao tiver terminado, executa outra vez
    ordemChegada[0].rajada--;

    // checa se foi a ultima execucao
    if (ordemChegada[0].rajada == 0) {
      // se for, anota que terminou
      ordemChegada[0].termino = tempo;
      ordemChegada[0].terminado = true;
      processosProntos.push(ordemChegada[0]);
    }

    // aumenta o tempo
    tempo++;
  }

  if (modoExecucao == 1) {
    for (processo of processosProntos) {
      console.log(
        "O processo ",
        processo.id,
        " terminou no tempo ",
        processo.termino
      );
    }
  } else {
    // estatisticas

    let totalRetorno = 0;
    let totalEspera = 0;
    let trocasContexto = 0;

    for (processo of processosProntos) {
      totalRetorno += processo.termino - processo.chegada;
      totalEspera += processo.comeco - processo.chegada;
      trocasContexto += processo.contexto;
    }

    console.log(
      "Tempo total de processamento = ",
      processosProntos[processosProntos.length - 1].termino
    );
    console.log(
      "Media do tempo de retorno = ",
      totalRetorno / processosProntos.length
    );
    console.log(
      "Media do tempo de espera = ",
      totalEspera / processosProntos.length
    );
    console.log("Trocas de contexto = ", trocasContexto);
  }
}

function srtfp(modoExecucao) {
  // armazena quem ja chegou
  let chegados = new Array();

  // calcula o tempo maximo de execucao
  let tempoMaximo = 0;

  for (processo of processos) {
    tempoMaximo += parseInt(processo.rajada);
  }

  let ultimoProcessado = 0;

  // enquanto o ultimo processo nao for terminado
  while (tempo <= tempoMaximo) {
    // adiciona os processos que ja chegaram ao array chegados
    for (processo of processos) {
      if (tempo == processo.chegada) {
        chegados.push(processo);
      }
    }

    // filtra o array dos chegados
    let ordemRajada = chegados.sort(menorRajada);

    if (ordemRajada[0].comeco == undefined) {
      ordemRajada[0].comeco = tempo;
    }

    // checa se o primeiro processo terminou
    if (ordemRajada[0].terminado) {
      // se tiver terminado, tira o processo da fila
      ordemRajada.shift();
    }

    // se nao tiver terminado, executa outra vez
    ordemRajada[0].rajada--;

    if (ultimoProcessado != ordemRajada[0].id) {
      ordemRajada[0].contexto++;
    }

    ultimoProcessado = ordemRajada[0].id;

    // checa se foi a ultima execucao
    if (ordemRajada[0].rajada == 0) {
      // se for, anota que terminou
      ordemRajada[0].terminado = true;
      ordemRajada[0].termino = tempo;
      processosProntos.push(ordemRajada[0]);
    }

    // aumenta o tempo
    tempo++;
  }

  if (modoExecucao == 1) {
    for (processo of processosProntos) {
      console.log(
        "O processo ",
        processo.id,
        " terminou no tempo ",
        processo.termino
      );
    }
  } else {
    // estatisticas

    let totalRetorno = 0;
    let totalEspera = 0;
    let trocasContexto = 0;

    for (processo of processosProntos) {
      totalRetorno += processo.termino - processo.chegada;
      totalEspera += processo.comeco - processo.chegada;
      trocasContexto += processo.contexto;
    }

    console.log(
      "Tempo total de processamento = ",
      processosProntos[processosProntos.length - 1].termino
    );
    console.log(
      "Media do tempo de retorno = ",
      totalRetorno / processosProntos.length
    );
    console.log(
      "Media do tempo de espera = ",
      totalEspera / processosProntos.length
    );
    console.log("Trocas de contexto = ", trocasContexto);
  }
}

function srtf(modoExecucao) {
  // armazena quem ja chegou
  let chegados = new Array();
  // armazena na ordem de menor rajada
  let ordemRajada = new Array();

  // calcula o tempo maximo de execucao
  let tempoMaximo = 0;

  for (processo of processos) {
    tempoMaximo += parseInt(processo.rajada);
  }

  // enquanto o ultimo processo nao for terminado
  while (tempo <= tempoMaximo) {
    // adiciona os processos que ja chegaram ao array chegados
    for (processo of processos) {
      if (tempo == processo.chegada) {
        chegados.push(processo);
      }
    }

    // filta a primeira vez
    if (tempo == 1) {
      ordemRajada = chegados.sort(menorRajada);
    }

    if (ordemRajada[0].comeco == undefined) {
      ordemRajada[0].comeco = tempo;
    }

    // checa se o primeiro processo terminou
    if (ordemRajada[0].terminado) {
      // se tiver terminado, tira o processo da fila

      ordemRajada[0].termino = tempo;
      ordemRajada[0].terminado = true;
      processosProntos.push(ordemRajada[0]);

      ordemRajada.shift();
      // filtra o array dos chegados
      ordemRajada = chegados.sort(menorRajada);
    }

    // se nao tiver terminado, executa outra vez
    ordemRajada[0].rajada--;

    // checa se foi a ultima execucao
    if (ordemRajada[0].rajada == 0) {
      // se for, anota que terminou
      ordemRajada[0].terminado = true;
      ordemRajada[0].termino = tempo;
    }

    // aumenta o tempo
    tempo++;
  }

  if (modoExecucao == 1) {
    for (processo of processosProntos) {
      console.log(
        "O processo ",
        processo.id,
        " terminou no tempo ",
        processo.termino
      );
    }
  } else {
    // estatisticas

    let totalRetorno = 0;
    let totalEspera = 0;
    let trocasContexto = 0;

    for (processo of processosProntos) {
      totalRetorno += processo.termino - processo.chegada;
      totalEspera += processo.comeco - processo.chegada;
      trocasContexto += processo.contexto;
    }

    console.log(
      "Tempo total de processamento = ",
      processosProntos[processosProntos.length - 1].termino
    );
    console.log(
      "Media do tempo de retorno = ",
      totalRetorno / processosProntos.length
    );
    console.log(
      "Media do tempo de espera = ",
      totalEspera / processosProntos.length
    );
    console.log("Trocas de contexto = ", trocasContexto);
  }
  // console.log(processos[processos.length -1].termino);
}

function prio(modoExecucao) {
  // armazena quem ja chegou
  let chegados = new Array();
  // armazena na ordem de menor rajada
  let ordemPrioridade = new Array();

  // calcula o tempo maximo de execucao
  let tempoMaximo = 0;

  for (processo of processos) {
    tempoMaximo += parseInt(processo.rajada);
  }

  // enquanto o ultimo processo nao for terminado
  while (tempo <= tempoMaximo) {
    // adiciona os processos que ja chegaram ao array chegados
    for (processo of processos) {
      if (tempo == processo.chegada) {
        chegados.push(processo);
      }
    }

    // filta a primeira vez
    if (tempo == 1) {
      ordemPrioridade = chegados.sort(menorPrioridade);
    }

    // checa se o primeiro processo terminou
    if (ordemPrioridade[0].terminado) {
      // se tiver terminado, tira o processo da fila
      ordemPrioridade.shift();

      // filtra o array dos chegados
      ordemPrioridade = chegados.sort(menorPrioridade);
    }

    if (ordemPrioridade[0].comeco == undefined) {
      ordemPrioridade[0].comeco = tempo;
    }

    // se nao tiver terminado, executa outra vez
    ordemPrioridade[0].rajada--;

    // checa se foi a ultima execucao
    if (ordemPrioridade[0].rajada == 0) {
      // se for, anota que terminou
      ordemPrioridade[0].terminado = true;
      ordemPrioridade[0].termino = tempo;

      processosProntos.push(ordemPrioridade[0]);
    }

    // aumenta o tempo
    tempo++;
  }

  if (modoExecucao == 1) {
    for (processo of processosProntos) {
      console.log(
        "O processo ",
        processo.id,
        " terminou no tempo ",
        processo.termino
      );
    }
  } else {
    // estatisticas

    let totalRetorno = 0;
    let totalEspera = 0;
    let trocasContexto = 0;

    for (processo of processosProntos) {
      totalRetorno += processo.termino - processo.chegada;
      totalEspera += processo.comeco - processo.chegada;
      trocasContexto += processo.contexto;
    }

    console.log(
      "Tempo total de processamento = ",
      processosProntos[processosProntos.length - 1].termino
    );
    console.log(
      "Media do tempo de retorno = ",
      totalRetorno / processosProntos.length
    );
    console.log(
      "Media do tempo de espera = ",
      totalEspera / processosProntos.length
    );
    console.log("Trocas de contexto = ", trocasContexto);
  }

  // console.log(processos[processos.length -1].termino);
}

function priop(modoExecucao) {
  // armazena quem ja chegou
  let chegados = new Array();

  // calcula o tempo maximo de execucao
  let tempoMaximo = 0;

  for (processo of processos) {
    tempoMaximo += parseInt(processo.rajada);
  }

  let ultimoProcessado = 0;

  // enquanto o ultimo processo nao for terminado
  while (tempo <= tempoMaximo) {
    // adiciona os processos que ja chegaram ao array chegados
    for (processo of processos) {
      if (tempo == processo.chegada) {
        chegados.push(processo);
      }
    }

    // filtra o array dos chegados
    let ordemPrioridade = chegados.sort(menorPrioridade);

    // checa se o primeiro processo terminou
    if (ordemPrioridade[0].terminado) {
      // se tiver terminado, tira o processo da fila
      ordemPrioridade.shift();
    }

    if (ordemPrioridade[0].comeco == undefined) {
      ordemPrioridade[0].comeco = tempo;
    }

    // se nao tiver terminado, executa outra vez
    ordemPrioridade[0].rajada--;

    if (ultimoProcessado != ordemPrioridade[0].id) {
      ordemPrioridade[0].contexto++;
    }

    ultimoProcessado = ordemPrioridade[0].id;

    // checa se foi a ultima execucao
    if (ordemPrioridade[0].rajada == 0) {
      // se for, anota que terminou
      ordemPrioridade[0].terminado = true;
      ordemPrioridade[0].termino = tempo;

      processosProntos.push(ordemPrioridade[0]);
    }

    // aumenta o tempo
    tempo++;
  }

  if (modoExecucao == 1) {
    for (processo of processosProntos) {
      console.log(
        "O processo ",
        processo.id,
        " terminou no tempo ",
        processo.termino
      );
    }
  } else {
    // estatisticas

    let totalRetorno = 0;
    let totalEspera = 0;
    let trocasContexto = 0;

    for (processo of processosProntos) {
      totalRetorno += processo.termino - processo.chegada;
      totalEspera += processo.comeco - processo.chegada;
      trocasContexto += processo.contexto;
    }

    console.log(
      "Tempo total de processamento = ",
      processosProntos[processosProntos.length - 1].termino
    );
    console.log(
      "Media do tempo de retorno = ",
      totalRetorno / processosProntos.length
    );
    console.log(
      "Media do tempo de espera = ",
      totalEspera / processosProntos.length
    );
    console.log("Trocas de contexto = ", trocasContexto);
  }
}

function rr(modoExecucao) {
  // armazena quem ja chegou
  let chegados = new Array();

  // calcula o tempo maximo de execucao
  let tempoMaximo = 0;

  for (processo of processos) {
    tempoMaximo += parseInt(processo.rajada);
  }

  // enquanto o ultimo processo nao for terminado
  while (tempo <= tempoMaximo) {
    // adiciona os processos que ja chegaram ao array chegados
    for (processo of processos) {
      if (tempo == processo.chegada) {
        chegados.push(processo);
      }
    }

    if (chegados[0].comeco == undefined) {
      chegados[0].comeco = tempo;
    }

    if (chegados[0].rajada == 0) {
      chegados[0].terminado = true;
      chegados[0].termino = tempo;

      processosProntos.push(chegados[0]);

      chegados.shift();
    }

    if (chegados[0].quantum == 4) {
      chegados[0].contexto++;
      chegados.push(chegados[0]);
      chegados.quantum = 0;
      chegados.shift();
    }

    chegados[0].quantum++;
    chegados[0].rajada--;

    if (chegados[0].rajada == 0) {
      chegados[0].terminado = true;
      chegados[0].termino = tempo;

      processosProntos.push(chegados[0]);

      chegados.shift();
    }
    // aumenta o tempo
    tempo++;
  }

  if (modoExecucao == 1) {
    for (processo of processosProntos) {
      console.log(
        "O processo ",
        processo.id,
        " terminou no tempo ",
        processo.termino
      );
    }
  } else {
    // estatisticas

    let totalRetorno = 0;
    let totalEspera = 0;
    let trocasContexto = 0;

    for (processo of processosProntos) {
      totalRetorno += processo.termino - processo.chegada;
      totalEspera += processo.comeco - processo.chegada;
      trocasContexto += processo.contexto;
    }

    console.log(
      "Tempo total de processamento = ",
      processosProntos[processosProntos.length - 1].termino
    );
    console.log(
      "Media do tempo de retorno = ",
      totalRetorno / processosProntos.length
    );
    console.log(
      "Media do tempo de espera = ",
      totalEspera / processosProntos.length
    );
    console.log("Trocas de contexto = ", trocasContexto);
  }
}

/* ======================================================= */
