export default {
  limparDados (vetorX, vetorY) {
    const vetorXLimpo = vetorX.filter(elemento => elemento != '')
      .map(elemento => elemento.trim())

    const vetorYLimpo = vetorY.filter(elemento => elemento != '')
      .map(elemento => elemento.trim())

    return  [vetorXLimpo, vetorYLimpo]
  },

  capturaDadosInputManual (inputX, inputY) {
    const vetorX = inputX.value.split(';')
    const vetorY = inputY.value.split(';')

    return this.limparDados(vetorX, vetorY)
  },

  separarDadosArquivo (vetArquivo) {
    const vetorX = vetArquivo.shift()
    const vetorY = vetArquivo

    return this.limparDados(vetorX, vetorY)
  }
}