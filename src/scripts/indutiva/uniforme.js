const calcularUniforme = document.querySelector('#calcularUniforme')
const resultUniforme = document.querySelector('.resultUniforme')

calcularUniforme.addEventListener('click', () => {
  debugger
  //Captura dos dados 
  const a = document.querySelector('#minimo').valueAsNumber
  const b = document.querySelector('#maximo').valueAsNumber
  const tipoIntevalo = document.querySelector('#selectIntervaloUniforme').value
  const dist = document.querySelector('#distancia').value
  // declaração das variaveis
  let probabilidade, media, desvio

  //Criação de um vetor para alocar os limtes para o calculo
    
  //Teste condicional para a definição do calculo da probabilidade
  if(tipoIntevalo === 'maior') probabilidade = ((1 / (b - a) * (b - Number(dist)))
    * 100)
    .toFixed(2)

  else if(tipoIntevalo === 'menor') probabilidade = ((1 / (b - a) * (Number(dist) - a))
    * 100)
    .toFixed(2)
  
  else {
    const vetDist = dist.split(';').map(value => Number(value))
    const [menor, maior] = vetDist.sort((a,b) => a - b)

    probabilidade = ((1 / (b - a) * (maior - menor)) * 100)
    .toFixed(2)
  }
  //Calculo da Média
  media = ((b + a) / 2).toFixed(2)
  //Calculo do Devio Padrão 
  desvio = ((((b - a)**2) / 12)**(1/2)).toFixed(2)

  //Impressão dos resultados
  resultUniforme.innerHTML = `
  <div>
    <span>Probabilidade:</span>
    <strong>${probabilidade}%</strong>
  </div>

  <div>
    <span>Média:</span>
    <strong>${media}</strong>
  </div>

  <div>
    <span>Desvio padrão:</span>
    <strong>${desvio}</strong>
  </div>
  `
})
  
