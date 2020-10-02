import funcoesCalculo from './calculos.js'
import funcoesDOM from './tabelas.js'

const salvarDadosNoObjeto = (dados, nome, valores )=> {
    dados.nome = nome
    dados.vetorDados = valores
    dados.tipoVar = document.querySelector('input[name="tipoVariavel"]:checked').value
    dados.tipoCalc = document.querySelector('#tipoCalculo').value
}

const ordenarVetor = (vetor) => {
    const tipoNumerico = vetor.every(elemento => Number(elemento))
    if(tipoNumerico) {
        vetor = vetor.map(elemento => Number(elemento))
        return vetor.sort((a,b) => a - b)
    } else {
        return vetor.sort()
    }
}

const limparDados = (vetor, nomeVariavel) => {
    const nomeLimpo = nomeVariavel.trim()
    const vetorDadosLimpo = vetor.filter(elemento => elemento != '')
        .map(elemento => elemento.trim())
    const vetorDadosOrdenado = ordenarVetor(vetorDadosLimpo)
    return  [nomeLimpo, vetorDadosOrdenado ]
}

const capturaDadosInputManual = (inputDados, inputNome) => {
    let nomeVariavel = inputNome.value
    let vetorDados = inputDados.value.split(';')
    return limparDados(vetorDados, nomeVariavel)
}

const separarDadosArquivo = vetArquivo => {
    let nomeVariavel = vetArquivo.shift()
    let vetorDados = vetArquivo
    return limparDados(vetorDados, nomeVariavel)
}

const agrupaValoresEmObjeto = dados => {
    let vetTemp =[]
    let i = 0
    
    for (let data in dados.valoresAgrupados){
        let objTemp = {}

        objTemp['nome'] = data
        objTemp['freqSimp'] = dados.valoresAgrupados[data]
        objTemp['freqSimpPerc'] = dados.vetorFsPerc[i]
        objTemp['freqAc'] = dados.vetorFreAc[i]
        objTemp['freqAcPerc'] = dados.vetorFreAcPerc[i]
        i++
        vetTemp.push(objTemp)
    }
    dados.vetorObjetos = vetTemp

    funcoesDOM.criarTabela(dados)
    funcoesCalculo.calculaMediaModaMediana(dados)
}

export default {
    capturaDadosInputManual: capturaDadosInputManual,
    separarDadosArquivo: separarDadosArquivo,
    salvarDadosNoObjeto:salvarDadosNoObjeto,
    agrupaValoresEmObjeto: agrupaValoresEmObjeto,
}