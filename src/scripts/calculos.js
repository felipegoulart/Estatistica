import funcoesTratarDados from './tratarDados.js'
import funcoesDOM from './tabelas.js'
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
    console.log(dados.tipoVar);
    let media, mediana, moda = ''
    let soma = 0
    let vetLimites = [], vetFreqSimples = []

    let meioVet = Math.round(dados.vetorDados.length /2)
    let valorCentral = dados.vetorDados[meioVet]

    for(const data in dados.valoresAgrupados) { // cria vetor de frequências simples
        vetFreqSimples.push(dados.valoresAgrupados[data])
    }

    let maiorFi = Math.max(...vetFreqSimples) // para usar na moda

    let fiAcc =  dados.vetorFreAc.reduce(
        (acumulador,valorAtual) => acumulador + valorAtual )

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
        media = (soma / fiAcc).toFixed(1)
        
        // ----Moda Contínua---- \\
        let indexMaiorFi = vetFreqSimples.indexOf(maiorFi)
        moda = ((vetLimiteInferior[indexMaiorFi] + vetLimiteSuperior[indexMaiorFi]) / 2)
            .toFixed(0)

    } else if (dados.tipoVar === 'discreta'){
        // ----Mediana Discreta---- \\
        mediana = valorCentral
        
        // ----Media Discreta---- \\
        soma = dados.vetorDados.reduce((acumulador,valorAtual) => 
             acumulador + valorAtual)   
        media = (soma / dados.vetorFreAc[dados.vetorFreAc.length -1]).toFixed(2)
        
        // ----Moda Discreta---- \\
        let modaTemp = ''
        for(let data in dados.valoresAgrupados){
            if (dados.valoresAgrupados[data] === maiorFi){
                modaTemp += `${data} `
            }
        }
        moda = modaTemp.trim().replace(/ /g, ', ') // Usando uma RegEx para
        //substituir todos os espaços em branco
         
    } else {
        // ----Mediana Qualitativa---- \\
        if(dados.vetorDados.length % 2 == 0){
            if(dados.vetorDados[meioVet] == dados.vetorDados[meioVet + 1]){
                mediana = [dados.vetorDados[meioVet]]
            } else {
                mediana = [dados.vetorDados[meioVet], dados.vetorDados[meioVet + 1]]
            }
            
        } else mediana = dados.vetorDados[meioVet]
    
        // ----Moda Qualitativa---- \\
        let au = []
        for(let data in dados.valoresAgrupados){
            au.push(dados.valoresAgrupados[data])
        }
        debugger
        for(let data in dados.valoresAgrupados){
            if(dados.valoresAgrupados[data] === maiorFi) auxiliar.push(data)
        }
            
        if(auxiliar.length === au.length) moda.push('Estes dados são amodais')
        
        else moda = auxiliar
        
        media = ['Não Possui média']
    }


    funcoesDOM.criaCaixasDeMedias([media, moda, mediana])
    // calculaSeparatrizContinua()
}

//Separatrizes
const calculaSeparatrizDiscreta = () => {
    // sep = e[se]
        // if (obj.tipoCalc === 'populacao'){
        //     for (var o = 0; o < vetLimiteInferior.length; o++){
        //         ax = (vetLimiteInferior[o] - media)**2 * vetLimiteSuperior[o]
        //         z.push(ax)
        //     }
        //     soma = z.reduce((total, currentElement) => total + currentElement)
        //     desvio = Math.sqrt(soma/vetorFreAc[vetorFreAc.length - 1]).toFixed(2)
        //     cv = ((desvio/media)*100).toFixed(2)
        // }else{
        //     for (var o = 0; o < vetLimiteInferior.length; o++){
        //         ax = (vetLimiteInferior[o] - media)**2 * vetLimiteSuperior[o]
        //         z.push(ax)
        //     }
        //     soma = z.reduce((total, currentElement) => total + currentElement)
        //     desvio = Math.sqrt(soma/(vetorFreAc[vetorFreAc.length - 1] - 1)).toFixed(2)
        //     cv = ((desvio/media)*100).toFixed(2)
        // }
}

const calculaSeparatrizContinua = () => {
    sep = (f + (((se - fant)/fimd)*h)).toFixed(2)

    
    let v = []
    let xi = []
    for (var p = 0; p < vetLimiteInferior.length; p++){
        ax = parseInt((vetLimiteInferior[p] + vetLimiteSuperior[p])/2).toFixed(0)
        xi.push(ax)
        v.push(xi[p] * au[p])
    }
    soma = v.reduce((total, currentElement) => total + currentElement)
    let medDesvio = 0
    medDesvio = (soma/vetorFreAc[vetorFreAc.length  - 1]).toFixed(2)
    let z = []
    for (var o = 0; o < vetLimiteInferior.length; o++){
        ax = (xi[o] - medDesvio)**2 * au[o]
        z.push(ax)
    }
    soma = z.reduce((total, currentElement) => total + currentElement)
    desvio = Math.sqrt(soma/vetorFreAc[vetorFreAc.length - 1]).toFixed(2)
    cv = ((desvio/media)*100).toFixed(2)
}

const calculaSeparatrizQualitativa = dados => {
    let au = []
    let auxiliar = []
    let mediana
    let moda

    let esq = 0
    let dir = dados.vetorDados.length - 1
    let meio = Math.trunc((esq + dir) / 2)

    
    sep = dados.vetorDados[se]
}

export default {
    calculaContinua: calculaContinua,
    calculaFreqSi: calculaFreqSi,
    calcFreqPercent: calcFreqPercent,
    calculaMediaModaMediana: calculaMediaModaMediana
}