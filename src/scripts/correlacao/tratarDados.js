export default {
  limparDados (vetorX, vetorY) {
    const vetorXLimpo = vetorX.filter(elemento => elemento != '')
      .map(elemento => elemento.trim())

    const vetorYLimpo = vetorY.filter(elemento => elemento != '')
      .map(elemento => elemento.trim())

    return  [vetorXLimpo, vetorYLimpo]
  },

  limparDadosArquivo (vetor) {
    let vetorLimpo = vetor.map(elemento => elemento.trim())
    while (vetorLimpo.includes('') || vetorLimpo.includes(';')) {
      vetorLimpo.pop()
    }

    return  vetorLimpo.map(elemento => elemento.split(';'))
  },

  capturaDadosInputManual (inputX, inputY) {
    const vetorX = inputX.split(';')
    const vetorY = inputY.split(';')

    return this.limparDados(vetorX, vetorY)
  },

  separarDadosArquivo (vetArquivo) {
    vetArquivo.shift()
    const vetLimpo = this.limparDadosArquivo(vetArquivo)

    const vetorX = []
    const vetorY = []
    vetLimpo.forEach(vetLinha => {
      vetorX.push(vetLinha[0])
      vetorY.push(vetLinha[1])
    });

    return [vetorX, vetorY]
  }
}