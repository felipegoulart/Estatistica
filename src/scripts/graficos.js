let meuGrafico = null

// ----------Gráficos--------- \\
// Funções para gerar os Graficos
export const geraGrafico = (areaGrafico, tipoGraf = 'bar', nomesCol, valores, nomeGraf = 'Gráfico', opt) => {
    if(meuGrafico) meuGrafico.destroy()

    meuGrafico = areaGrafico.getContext('2d');
    meuGrafico = new Chart(grafico, {
        type: tipoGraf,
        data: {
            labels: nomesCol,
            datasets: [{
                label: nomeGraf,
                data: valores,
                backgroundColor: cor(valores), // Usa o tamanho do vetor para gerar as cores
                borderWidth: 2,
            }]
        },
        options: opt
    })
}

export const geraGraficoContinua = (grafico, tipoGraf = 'bar', nomesCol, valores, nomeGraf = 'Gráfico', opt) => {
    if(meuGrafico) meuGrafico.destroy()

    meuGrafico = areaGrafico.getContext('2d');
    meuGrafico = new Chart(grafico, {
        type: tipoGraf,
        data: {
            labels: nomesCol,
            datasets: [{
                label: nomeGraf,
                data: valores,
                borderWidth: 1,
                backgroundColor: cor(valores),
                borderColor: cor(valores), // Usa o tamanho do vetor para gerar as cores
                barPercentage: 1.25,
            }]
        },
        options: opt
    })
}

// Funções de tipos de gráfico
export function optGraficoPizza () {
    return {tooltips: {
        backgroundColor: '#fff',
        cornerRadius: 10, 

        bodyFontColor: '#222',
        bodyFontSize: 13,
        bodyFontStyle: 'bold',

        xPadding: 12,
        yPadding: 15,

        callbacks: {
            label: editarLabelComPorcent
        }
    }}
}

export function optGraficoColuna () {
    return {
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    callback: function(value) {
                        return value + "%"
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: "Em Porcentagem"
                }
            }]
        },
        tooltips: {
            backgroundColor: '#fff',
            cornerRadius: 10, 

            titleFontColor: '#222',
            bodyFontColor: '#222',
            bodyFontSize: 13,
            bodyFontStyle: 'bold',

            xPadding: 12,
            yPadding: 15,

            callbacks: {
                label: editarLabelComPorcent
            }
        }
    }
}

// Função para gerar as cores para o Gráfico de acordo com o número de elementos
function cor(vetor) { 
    let cores = []

    for(let i = 0; i < vetor.length; i++) {
        i % 2 == 0 ? cores.push('#6C63FF') : cores.push('#FFE663')
    }
    return cores
}

// A função recebe os nomes da Label e valor para retornar uma label com numeros em %
function editarLabelComPorcent(tooltipItem, data) {
    let label = data.labels[tooltipItem.index] || '';
    let valor = data.datasets[0].data[tooltipItem.index]
    if (label) {
        label += ': ';
    }
    label += valor + '%';
    return label;
}
