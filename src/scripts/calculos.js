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

export default {
    calculaContinua: calculaContinua,
    calculaFreqSi: calculaFreqSi,
    calcFreqPercent: calcFreqPercent
}