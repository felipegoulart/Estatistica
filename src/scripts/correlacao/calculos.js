export default {
  // Calcula a somatória da coluna
  calculoSomatoria(x) {
    const vetorTratado = x.map(numero => Number(numero))
    return vetorTratado.reduce((a,b) => a + b)
  },
  
  // Calcula as colunas xy, x^2 e y^2
  calculoDemaisColunas(x,y) {
    // variaveis auxiliares
    let auxiliar_x2 = []
    let auxiliar_y2 = []
    let auxiliar_xy = []

    //faz os calculos para as demais colunas da correlação
    for(let i = 0; i < x.length; i++){
      auxiliar_xy.push(x[i] * y[i])
      auxiliar_x2.push(x[i]**2)
      auxiliar_y2.push(y[i]**2)
    }
    
    // calcula a somatória das demais colunas
    const soma_xy = this.calculoSomatoria(auxiliar_xy)
    const soma_x2 = this.calculoSomatoria(auxiliar_x2)
    const soma_y2 = this.calculoSomatoria(auxiliar_y2)
    
    return [soma_xy, soma_x2, soma_y2]
  },

  calculoCorrelacao(vetor_x, soma_x, soma_y, soma_xy, soma_x2, soma_y2) {
    const n = vetor_x.length //Definição da quantidade de linhas presentes na tabela

    // Calculo da correlação 
    const r = ((n * soma_xy) - (soma_x * soma_y))
      / ((((n * soma_x2) - (soma_x**2))**(1/2))
      * (((n * soma_y2) - (soma_y**2))**(1/2)))

    return r
  },

  tipoCorrelacao(r) { //Verifica o tipo de Correlação
    if (r == 1) return 'Perfeita Positiva'
    
    else if (r == -1) return 'Perfeita Negativa'
    
    else if (r == 0) return 'Variéveis não correlacionadas'
    
    else if (r > 0 && r < 0.30) return 'Fraca Positiva'
    
    else if (r < 0 && r > -0.30) return 'Fraca Negativa'
    
    else if (r > 0.3 && r < 0.7) return 'Moderada Positiva'
    
    else if (r < -0.3 && r > - 0.7) return "Moderada Negativa"
    
    else if (r > 0.7 && r < 1) return 'Forte Positiva'
    
    else return 'Forte Negativa'
  },

  //Calculos de regrassão linear simples 
  calculoRegressao(coef_angular, vetor_x, soma_x, soma_y, soma_xy, soma_x2) {
    const n = vetor_x.length //Definição da quantidade de linhas presentes na tabela
    
    let coefiente // declara a variavel para o calculo da regressão
     // Substitui a virgula se necessário 
    if (typeof(coef_angular) == 'string') coefiente = coef_angular.replace(',', '.')

    // calculo para achar o A para realizar a regressão
    const a = (((n*soma_xy) - (soma_x*soma_y))/((n*soma_x2) - soma_x**2))
    // calculo para achar o B para realizar a regressão
    const b = (soma_y - a * soma_x) / n
    const regressao = (a * Number(coefiente)) + b

    return {
      a: a,
      b: b,
      resultadoRegressao: regressao
    }
  }
}

