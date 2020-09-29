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
    
    for(let i = 0; i < linhas; i++ ) {
        !inicio ? inicio = vetor[0] : inicio = fim
        fim = inicio + intervalo
    
        const nomeAtributo = `${inicio} |--- ${fim}`
    
        vetor.forEach(elemento => {
            if(elemento >= inicio && elemento < fim) {
                !dados.valoresAgrupados[nomeAtributo] ? dados.valoresAgrupados[nomeAtributo] = 1
                    : dados.valoresAgrupados[nomeAtributo] += 1
            }
        })
    }
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
        let au = []
        for(data in dados.valoresAgrupados){
            au.push(dados.valoresAgrupados[data])
        }
        let a = au.reduce(function(a,b){return Math.max(a,b)})
        for(dt in dados.valoresAgrupados){
            if (dados.valoresAgrupados[dt] === a){
                moda = dt
            }
        }
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
    for (let dt in dados.valoresAgrupados){
        ex.push((dt.split(' |--- ')))
        fi.push(dados.valoresAgrupados[dt])
    }
    med  = Math.trunc(vetorFreAc[vetorFreAc.length-1] /2)
    let x = e[med]
    for (let num in ex){
        u.push(parseInt(ex[num][0]))
        w.push(parseInt(ex[num][1]))   
    }
    for (let z = 0; z <= u.length; z++){
        if (x>= u[z] && x< w[z]){
            f = u[z]
            if ((z-1) != -1){
                fant = fi[z-1]
            }else{
                fant = 0
            }
            fimd = fi[z]
            h = w[z] - u[z]
            break
        }
        
    }
    
    mediana = (f + (((med - fant)/fimd)*h)).toFixed(2)
    sep = (f + (((se - fant)/fimd)*h)).toFixed(2)
    for(let q = 0; q < u.length;q++){
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
}