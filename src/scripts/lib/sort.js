function quickSort (callback, vetor, inicio = 0, fim = vetor.length - 1) {

  if(fim > inicio) {
      let posDiv = inicio - 1
      let posPivot = fim
      for(let i = inicio; i < fim; i++) {
          if(callback(vetor[i], vetor[posPivot])) {
              posDiv++
              [vetor[i], vetor[posDiv]] = [vetor[posDiv], vetor[i]]
          }
      }

      posDiv++
      [vetor[posDiv], vetor[posPivot]] = [vetor[posPivot], vetor[posDiv]]
      quickSort(callback, vetor, inicio, posDiv - 1)
      quickSort(callback, vetor, posDiv + 1, fim)
  }
  return vetor
}

export default quickSort