let meuGrafico = null

export default {
  geraGrafico (areaGrafico, valores, Xminimo, Xmaximo, a, b) {
    if(meuGrafico) meuGrafico.destroy()
  
    meuGrafico = areaGrafico.getContext('2d');
    meuGrafico = new Chart(meuGrafico, {
      type: 'scatter',
      data: {
        labels: 'Gráfico de correlação',
        datasets: [{
          label: 'Gráfico de Correlação',
          data: valores,
          backgroundColor: '#2984E6',
          borderWidth: 2,
        },
        {
          label: 'Reta de Regressão',
          data: [
            {x: Xminimo, y: this.calculoLinhaDeRegressao(Xminimo, a, b)},
            {x: Xmaximo, y: this.calculoLinhaDeRegressao(Xmaximo, a, b)}
          ],
          borderColor: '#E6A433',
          pointBackgroundColor: '#E6A433',
          backgroundColor: 'transparent',
          type: 'line'
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom'
          }]
        },
        title: {
          display: true,
          text: 'Gráfico de Dispersão',
          fontSize: 16,
        },
        legend: {
          display: false,
        }
      }
    })
  },

  agrupaValoresObjeto(vetorX,vetorY) {
    let vetObjetosValores = []
    for(let i = 0; i < vetorX.length; i++) {
      vetObjetosValores.push({
        x: vetorX[i],
        y: vetorY[i]
      })
    }

    const Xminimo = Math.min(...vetorX)
    const Xmaximo = Math.max(...vetorX)
    return [vetObjetosValores, Xminimo, Xmaximo]
  },

  calculoLinhaDeRegressao(value , a, b) {
    return Number(value) * a + b 
  },

  cor(vetor) { 
    let cores = []
  
    for(let i = 0; i < vetor.length; i++) {
      i % 2 == 0 ? cores.push('#E6A433') : cores.push('#2984E6')
    }
    return cores
  }
}