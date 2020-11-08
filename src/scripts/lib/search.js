export default (callback, vetor, valorBusca, inicio = 0, fim = vetor.length - 1) => {
  
  if(fim >= inicio) {
      // Math.floor(): retira as casas decimais de um número
      const meio = Math.floor((fim + inicio) / 2)

      const res = callback(vetor[meio], valorBusca)

      // Verifica se o valor na posição média é o valor de busca
      if(res == 0) return meio   // Condição de saída 

      else if(res < 0) return buscaBinaria(vetor, valorBusca, callback, inicio, meio - 1) // procura na metade menor
      
      else return buscaBinaria(vetor, valorBusca, callback, meio + 1, fim) // procura na metade maior
          
  }
  // Condição de saída
  return -1   // Valor não encontrado
}