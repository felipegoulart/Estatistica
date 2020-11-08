const search = (callback, vetor, valorBusca, inicio = 0, fim = vetor.length - 1) => {
  if(fim >= inicio) {
    // Math.floor(): retira as casas decimais de um número
    const meio = Math.floor((fim + inicio) / 2)

    const res = callback(vetor[meio], valorBusca)

    // Verifica se o valor na posição média é o valor de busca
    if(res == 0) return vetor[meio]   // Condição de saída 

    else if(res < 0) return search(callback, vetor, valorBusca, inicio, meio - 1) // procura na metade menor
    
    else return search(callback, vetor, valorBusca, meio + 1, fim) // procura na metade maior
          
  }
  // Condição de saída
  return -1   // Valor não encontrado
}

export default search
