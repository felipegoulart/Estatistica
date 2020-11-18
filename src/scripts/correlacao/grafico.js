let meuGrafico = null

export default {
  geraGrafico (areaGrafico, valores, nomeGraf = 'Gráfico', opt) {
    if(meuGrafico) meuGrafico.destroy()
  
    meuGrafico = areaGrafico.getContext('2d');
    meuGrafico = new Chart(grafico, {
      type: 'scatter',
      data: {
        labels: 'Gráfico de correlação',
        datasets: [{
          label: nomeGraf,
          data: valores,
          backgroundColor: ['#E6A433','#2984E6'],
          borderWidth: 2,
        }]
      },
      options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
    })
  }
}