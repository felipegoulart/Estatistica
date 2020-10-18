const sectionResultados = document.querySelector('.resultados')
let probabilidade, media, dp

const resultados = `
    <p>Probabilidade: ${probabilidade}</p>
    <p>Média: ${media}</p>
    <p>Desvio Padrão: ${dp}</p>`

sectionResultados.innerHTML = resultados