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

}

const calculaFreqSi = dados => {
    dados.vetorDados.forEach(elemento => {
        dados.valoresAgrupados[elemento] ? dados.valoresAgrupados[elemento] += 1
            : dados.valoresAgrupados[elemento] = 1
    })
}

// Responsável pelos calculos das frequencias
const calcFreqPercent = dados => {
    let vetorFsPerc = []
    let vetorFreAc = []
    let vetorFreAcPerc = []
    let freAc = 0 
    let frecAcPerc = 0
    
    
    for (let v in dados.valoresAgrupados){
        let percentSi = ((dados.valoresAgrupados[v] / dados.vetorDados.length) * 100).toFixed(2)
        vetorFsPerc.push(percentSi)
    
        freAc += dados.valoresAgrupados[v]
        vetorFreAc.push(freAc)
    }
    
    vetorFreAc.forEach(num => {
        frecAcPerc = ((num / dados.vetorDados.length) * 100).toFixed(2)
        vetorFreAcPerc.push(frecAcPerc)
    })

    return [vetorFsPerc, vetorFreAc, vetorFreAcPerc]
}

const calculaMediaModaMediana = obj => {
    let media, moda, mediana
    let vetLimites = [], vetFreqSimples = [] 

    let meioVet = Math.trunc(obj.vetorDados.length /2)
    let valorCentral = obj.vetorDados[meioVet]

    if(obj.tipoVar === 'continua') {
        for (let dt in obj.valoresAgrupados){
            vetLimites.push((dt.split(' |--- ')))
            vetFreqSimples.push(obj.valoresAgrupados[dt])
        }

        let vetLimiteInferior = [], vetLimiteSuperior = []
        let limiteInferior, fant, fimd, intervalo
        for (let vetor of vetLimites){
            vetLimiteInferior.push(Number(vetor[0]))
            vetLimiteSuperior.push(Number(vetor[1]))   
        }

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

        for(let q = 0; q < u.length; q++){
            ponto.push((u[q] + w[q])/2)
            soma = soma + (ponto[q]*fi[q])
        }
        
        media = (soma / vetorFreAc[vetorFreAc.length - 1]).toFixed(1)
        let au = []
        for(let data in dados.valoresAgrupados){
            au.push(dados.valoresAgrupados[data])
        }
        let a = au.reduce(function(a,b){return Math.max(a,b)})
        let t = au.indexOf(a)
        moda = ((u[t] + w[t])/2).toFixed(0)

        mediana = (limiteInferior + ((meioVet - fant) / fimd) * intervalo)
    }

    let au = []
    for(let data in obj.valoresAgrupados){
        au.push(obj.valoresAgrupados[data])
    }
    console.log(obj.valoresAgrupados);
    let a = au.reduce((a,b) => Math.max(a,b))
    for(let dt in obj.valoresAgrupados){
        if (obj.valoresAgrupados[dt] === a){
            moda = dt
        }
    }

    return [media, moda, mediana]
}

//Separatrizes
const calculaSeparatrizDiscreta = () => {
    let z =[]
    for (let dt in dados.valoresAgrupados){
            u.push(parseInt(dt))
            w.push(dados.valoresAgrupados[dt])
        }

        
        for (let o = 0; o < u.length; o++){
            f = parseInt(w[o]) * parseInt(u[o])
            ex.push(f)
        }   
        soma = ex.reduce((total, currentElement) => total + currentElement)
        media = (soma/ vetorFreAc[vetorFreAc.length - 1]).toFixed(2)
        meio = (vetorFreAc[vetorFreAc.length -1]/2).toFixed()
        e = dados.vetorDados.sort((a,b) => a-b)
        mediana = e[meio]
        
        sep = e[se]
        if (dados.tipoCalc === 'populacao'){
            for (var o = 0; o < u.length; o++){
                ax = (u[o] - media)**2 * w[o]
                z.push(ax)
            }
            soma = z.reduce((total, currentElement) => total + currentElement)
            desvio = Math.sqrt(soma/vetorFreAc[vetorFreAc.length - 1]).toFixed(2)
            cv = ((desvio/media)*100).toFixed(2)
        }else{
            for (var o = 0; o < u.length; o++){
                ax = (u[o] - media)**2 * w[o]
                z.push(ax)
            }
            soma = z.reduce((total, currentElement) => total + currentElement)
            desvio = Math.sqrt(soma/(vetorFreAc[vetorFreAc.length - 1] - 1)).toFixed(2)
            cv = ((desvio/media)*100).toFixed(2)
    }
}

const calculaSeparatrizContinua = () => {
    sep = (f + (((se - fant)/fimd)*h)).toFixed(2)

    
    let v = []
    let xi = []
    for (var p = 0; p < u.length; p++){
        ax = parseInt((u[p] + w[p])/2).toFixed(0)
        xi.push(ax)
        v.push(xi[p] * au[p])
    }
    soma = v.reduce((total, currentElement) => total + currentElement)
    let medDesvio = 0
    medDesvio = (soma/vetorFreAc[vetorFreAc.length  - 1]).toFixed(2)
    let z = []
    for (var o = 0; o < u.length; o++){
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

    if(dados.vetorDados.length % 2 == 0){

        if(dados.vetorDados[meio] == dados.vetorDados[meio + 1]){
            mediana = [dados.vetorDados[meio]]
        } else {
            mediana = [dados.vetorDados[meio], dados.vetorDados[meio + 1]]
        }
        
    } else mediana = dados.vetorDados[meio]

    for(let data in dados.valoresAgrupados){
        au.push(dados.valoresAgrupados[data])
    }

    const a = au.reduce((a,b) => Math.max(a,b))
        
    for(let dt in dados.valoresAgrupados){
        if(dados.valoresAgrupados[dt] === a) auxiliar.push(dt)
    }
        
    if(auxiliar.length === au.length) moda.push('Estes dados são amodais')
    
    else moda = auxiliar
    
    sep = dados.vetorDados[se]
    media = ['Não Possui média']

    return [mediana, media, moda, sep]
}

export default {
    calculaContinua: calculaContinua,
    calculaFreqSi: calculaFreqSi,
    calcFreqPercent: calcFreqPercent,
    calculaMediaModaMediana: calculaMediaModaMediana
}