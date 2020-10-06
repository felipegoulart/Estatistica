import funcoesTratarDados from './tratarDados.js'
import funcoesDOM from './tabelas.js'
import grafico from './graficos.js'


const calculaIntervalo = valores => {
    const menor = valores[0], maior = valores[valores.length -1]
    let amplitude = maior - menor
    
    const j = Math.trunc(valores.length ** 0.5)
    const i = j -1
    const k = j +1

    do {
        amplitude++
        if(amplitude % i == 0) {
            return [i, amplitude / i]
        }
        else if(amplitude % j == 0) {
            return [j, amplitude / j]
        }
        else if(amplitude % k == 0) {
            return [k, amplitude / k]
        }
    } while (true)
}

const calculaContinua = dados => {
    const vetor = dados.vetorDados
    const [linhas, intervalo] = calculaIntervalo(vetor)

    let inicio = null
    let fim = null
    let objTemp = {}
    
    for(let i = 0; i < linhas; i++ ) {
        !inicio ? inicio = vetor[0] : inicio = fim
        fim = inicio + intervalo
    
        const nomeAtributo = `${inicio} |--- ${fim}`

        vetor.forEach(elemento => {
            if(elemento >= inicio && elemento < fim) {
                !objTemp[nomeAtributo] ? objTemp[nomeAtributo] = 1
                    : objTemp[nomeAtributo] += 1
            }
        })
    }
    dados.valoresAgrupados = objTemp
    calcFreqPercent(dados)
}

const calculaFreqSi = dados => {
    dados.vetorDados.forEach(elemento => {
        dados.valoresAgrupados[elemento] ? dados.valoresAgrupados[elemento] += 1
            : dados.valoresAgrupados[elemento] = 1
    })
    calcFreqPercent(dados)
}

// Responsável pelos calculos das frequencias
const calcFreqPercent = dados => {
    let vetorFsPerc = []
    let vetorFreAc = []
    let vetorFreAcPerc = []
    let freAc = 0 
    let frecAcPerc = 0
    
    
    for (let i in dados.valoresAgrupados){
        let percentSi = ((dados.valoresAgrupados[i] / dados.vetorDados.length) * 100).toFixed(2)
        vetorFsPerc.push(percentSi)
    
        freAc += dados.valoresAgrupados[i]
        vetorFreAc.push(freAc)
    }
    
    vetorFreAc.forEach(num => {
        frecAcPerc = ((num / dados.vetorDados.length) * 100).toFixed(2)
        vetorFreAcPerc.push(frecAcPerc)
    })

    dados.vetorFsPerc = vetorFsPerc
    dados.vetorFreAc = vetorFreAc
    dados.vetorFreAcPerc = vetorFreAcPerc

    funcoesTratarDados.agrupaValoresEmObjeto(dados)
}

const calculaMediaModaMediana = dados => {
    let media, mediana, moda = ''
    let soma = 0
    let vetLimites = [], vetFreqSimples = []

    let meioVet = Math.round(dados.vetorDados.length /2)
    let valorCentral = dados.vetorDados[meioVet]

    for(const data in dados.valoresAgrupados) { // cria vetor de frequências simples
        vetFreqSimples.push(dados.valoresAgrupados[data])
    }

    let maiorFi = Math.max(...vetFreqSimples) // para usar na moda
    
    let fiTotal =  vetFreqSimples.reduce(
        (acumulador,valorAtual) => acumulador + valorAtual )

    let se = Math.trunc(25 * (fiTotal / 100)) // valor inicial para a separatriz
    let separatriz, DP, CV

    dados.maiorFi = maiorFi
    dados.fiTotal = fiTotal
    dados.meioVet = meioVet
    dados.vetorFi = vetFreqSimples

    if(dados.tipoVar === 'continua') {
        for (let data in dados.valoresAgrupados){
            vetLimites.push((data.split(' |--- ')))
        }

        let vetLimiteInferior = [], vetLimiteSuperior = []
        let limiteInferior, fant, fimd, intervalo
        for (let vetor of vetLimites){
            vetLimiteInferior.push(Number(vetor[0]))
            vetLimiteSuperior.push(Number(vetor[1]))   
        }

        // ----Mediana Contínua---- \\
        for (let i = 0; i <= vetLimiteInferior.length; i++) {
            if (valorCentral >= vetLimiteInferior[i] 
                    && valorCentral < vetLimiteSuperior[i]) {
                limiteInferior = vetLimiteInferior[i]

                // Caso não seja a primeira linha, deve usar Frq acumulada anterior
                if ((i - 1) != -1) fant = vetFreqSimples[i - 1]
                // Caso seja a primeira linha a Frq acumulada anterior será 0
                else fant = 0

                fimd = vetFreqSimples[i] // frequencia simples da linha atual
                intervalo = vetLimiteSuperior[i] - vetLimiteInferior[i] // calcula o intervalo
                break
            }
        }
        mediana = (limiteInferior + ((meioVet - fant) / fimd) * intervalo)
        
        
        
        // ----Media Contínua---- \\
        for(let i = 0; i < vetLimiteInferior.length; i++){
            soma += ((vetLimiteInferior[i] + vetLimiteSuperior[i]) / 2)
                * vetFreqSimples[i]
        }
        media = (soma / fiTotal).toFixed(1)
        
        // ----Moda Contínua---- \\
        let indexMaiorFi = vetFreqSimples.indexOf(maiorFi)
        moda = ((vetLimiteInferior[indexMaiorFi]
            + vetLimiteSuperior[indexMaiorFi]) / 2).toFixed(0)

        dados.dadosContinua = {
            limiteInferior: vetLimiteInferior,
            limiteSuperior: vetLimiteSuperior,
            fant: fant,
            fimd: fimd,
            h: intervalo
        }

        separatriz = calculaSeparatrizContinua(dados, se);
        [DP, CV] = calculaDesvioEVariacaoContinua(dados, media)

    } else if (dados.tipoVar === 'discreta'){
        // ----Mediana Discreta---- \\
        mediana = valorCentral
        
        // ----Media Discreta---- \\
        soma = dados.vetorDados.reduce((acumulador,valorAtual) => 
             acumulador + valorAtual)   
        media = (soma / dados.fiTotal).toFixed(2)
        
        // ----Moda Discreta---- \\
        let modaTemp = ''
        for(let data in dados.valoresAgrupados){
            if (dados.valoresAgrupados[data] === maiorFi){
                modaTemp += `${data} `
            }
        }
        moda = modaTemp.trim().replace(/ /g, ', ') // Usando uma RegEx para
        //substituir todos os espaços em branco

        separatriz = calculaSeparatrizDiscreta(se);
        [DP, CV] = calculaDesvioEVariacaoDiscreta(dados, media)

    } else {
        // ----Mediana Qualitativa---- \\
        if(dados.vetorDados.length % 2 == 0){
            if(dados.vetorDados[meioVet] == dados.vetorDados[meioVet + 1])
                mediana = [dados.vetorDados[meioVet]]

            else mediana = [dados.vetorDados[meioVet], dados.vetorDados[meioVet + 1]]
                
        } else mediana = dados.vetorDados[meioVet]
    
        // ----Moda Qualitativa---- \\
        let auxiliar = []
        for(let data in dados.valoresAgrupados){
            if(dados.valoresAgrupados[data] === maiorFi) auxiliar.push(data)
        }
            
        if(auxiliar.length == vetFreqSimples.length) moda = 'Estes dados são amodais'
        else moda = auxiliar

        // ----Moda Qualitativa---- \\
        media = ['Não Possui média']

        separatriz = calculaSeparatrizQualitativa(se)
        DP = ['Não Possui']
        CV = ['Não Possui']
    }
    dados.media = media
    dados.moda = moda
    dados.mediana = mediana

    funcoesDOM.criaCaixasDeMedias([media, moda, mediana])
    funcoesDOM.criaCaixasDeSeparatrizes([separatriz, DP, CV])
    grafico(dados)
}

const calculaSeparatrizContinua = (dados, se) => {
    const vetorDados = JSON.parse(sessionStorage.getItem('vetorDados'))
    const posicaoSeparatriz = vetorDados[se - 1]
    let limiteInferior, fant, fimd
    for(let i = 0; i < dados.dadosContinua.limiteInferior.length; i++) {
        if(posicaoSeparatriz >= dados.dadosContinua.limiteInferior[i]
            && posicaoSeparatriz < dados.dadosContinua.limiteSuperior[i]) {
            
            if(i == 0) fant = 0
            else fant = dados.vetorFreAc[ i-1 ]
            
            limiteInferior = dados.dadosContinua.limiteInferior[i]
            fimd = dados.vetorFi[i]
            break
        }
    }

    return (limiteInferior + (((se - fant)
        / fimd)
        * dados.dadosContinua.h))
        .toFixed(2)
}
        
const calculaDesvioEVariacaoContinua = (dados, media) => {
    let soma = 0
    let somaDesvio = 0
    let xi = []
    let medDesvio = 0

    for (let i = 0; i < dados.dadosContinua.limiteInferior.length; i++){
        const auxiliar = Number((dados.dadosContinua.limiteInferior[i]
            + dados.dadosContinua.limiteSuperior[i]) / 2)
                        
        xi.push(auxiliar)
        soma += xi[i] * dados.vetorFi[i]
    }

    medDesvio = (soma / dados.fiTotal).toFixed(2)

    for (let i = 0; i < dados.dadosContinua.limiteInferior.length; i++){
        somaDesvio += ((xi[i] - medDesvio) ** 2) * dados.vetorFi[i]
    }

    let desvio = Math.sqrt(somaDesvio / dados.fiTotal).toFixed(2)
    let cv = ((Number(desvio) / Number(media)) * 100).toFixed(2)

    return [desvio, cv]
}

const calculaSeparatrizDiscreta = (se) => {
    const vetorDados = JSON.parse(sessionStorage.getItem('vetorDados'))
    return vetorDados[se - 1]
}

const calculaDesvioEVariacaoDiscreta = (dados, media) => {
    let soma = 0
    let desvio, cv
    for (let i = 0; i <dados.vetorFi.length; i++){
        soma += (dados.vetorObjetos[i]['nome'] - media)
            ** 2 * dados.vetorFi[i]
    }
    if(dados.tipoCalc === 'populacao') {
        desvio = Math.sqrt(soma / dados.fiTotal).toFixed(2)
        cv = ((desvio / media) * 100).toFixed(2)
    } else { // amostra
        desvio = Math.sqrt(soma / (dados.fiTotal - 1)).toFixed(2)
        cv = ((desvio / media) * 100).toFixed(2)
    }
    return [desvio, cv]
}

const calculaSeparatrizQualitativa = (se) => {
    debugger
    const vetorDados = JSON.parse(sessionStorage.getItem('vetorDados'))
    return vetorDados[se - 1]
}

export default {
    calculaContinua: calculaContinua,
    calculaFreqSi: calculaFreqSi,
    calcFreqPercent: calcFreqPercent,
    calculaMediaModaMediana: calculaMediaModaMediana,
    calculaSeparatrizContinua: calculaSeparatrizContinua,
    calculaSeparatrizDiscreta: calculaSeparatrizDiscreta,
    calculaSeparatrizQualitativa: calculaSeparatrizQualitativa
}