const calcularUniforme = document.querySelector('#calcularUniforme')
const resultUniforme = document.querySelector('.resultUniforme')

calcularUniforme.addEventListener('click', () => {
  debugger
  //Captura dos dados 
  const a = document.querySelector('#minimo')
  const b = document.querySelector('#maximo')
  const tipoIntevalo = document.querySelector('#selectIntervaloUniforme')
  const dist = document.querySelector('#distancia')
  
  let evento_tratado = []
  let au = dist.value.split(';')
  for (let i = 0; i < au.length; i++)   evento_tratado.push(parseInt(au[i]))
  //Validação dos dados
  for (let i = 0; i < evento_tratado.length; i++){
    if (isNaN(au[i]) == true || au[i] == ''){
      alert('Dados invalidos')
      evento.focus()
      return 
    }
  }
  if (isNaN(a.value) == true || a.value == ''){
    alert('Dados invalidos')
    a.focus()
    return
  }
  if (isNaN(b.value) == true || b.value == ''){
    alert('Dados invalidos')
    b.focus()
    return
  }if (tipoIntevalo == null){
    alert('Dados invalidos')
    tipoIntevalo.focus()
    return
  }
  // declaração das variaveis
  let probabilidade, media, desvio

  //Criação de um vetor para alocar os limtes para o calculo
    
  //Teste condicional para a definição do calculo da probabilidade
  if(tipoIntevalo.value === 'maior') probabilidade = ((1 / (b.value - a.value) * (b.value - Number(dist.value)))
    * 100)
    .toFixed(2)

  else if(tipoIntevalo.value === 'menor') probabilidade = ((1 / (b.value - a.value) * (Number(dist.value) - a.value))
    * 100)
    .toFixed(2)
  
  else {
    const vetDist = dist.value.split(';').map(value => Number(value))
    const [menor, maior] = vetDist.sort((a,b) => a - b)

    probabilidade = ((1 / (b.value - a.value) * (maior - menor)) * 100)
    .toFixed(2)
  }
  //Calculo da Média
  media = ((b.value + a.value) / 2).toFixed(2)
  //Calculo do Devio Padrão 
  desvio = ((((b.value - a.value)**2) / 12)**(1/2)).toFixed(2)

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
  
