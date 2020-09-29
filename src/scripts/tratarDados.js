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

const agrupaValoresEmObjeto = (dados, vetorFsPerc, vetorFreAc, vetorFreAcPerc) => {
    let vet =[]
    let i = -1
    
    for (let data in dados){
        let obj = {}
        i += 1 

        obj[data] = dados[data]
        obj['freqSimpPerc'] = vetorFsPerc[i]
        obj['freqAc'] = vetorFreAc[i]
        obj['freqAcPerc'] = vetorFreAcPerc[i]
        vet.push(obj)
    }
    return vet
}

export default {
    capturaDadosInputManual: capturaDadosInputManual,
    separarDadosArquivo: separarDadosArquivo,
    agrupaValoresEmObjeto: agrupaValoresEmObjeto,
}