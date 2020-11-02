import tabela from "./tabela.js"

const calcularNormal = document.querySelector('#calcularNormal')
const resultNormal = document.querySelector('.resultNormal')

calcularNormal.addEventListener('click', () => {
    const media = document.querySelector('#media').valueAsNumber
    const desv = document.querySelector('#desv').valueAsNumber
    const intervalo = document.querySelector('#intervalo').value
    const opt_intervalo = document.querySelector('#selectIntervalo').value

    let i, y, z, coluna, linha, p, probabilidade_int
    let prob = []
    
    
    let vetIntervalo = intervalo.split(';').map(num => Number(num))
     
    if (opt_intervalo == 'maior' || opt_intervalo == 'menor'){   
       
        z = (vetIntervalo[0]-media) / desv
        if (z < 0) z *= -1 // se o número for negativo, ele passa para positivo

        i = z.toFixed(2)
        y = [...i]
    
        linha = parseFloat(y[0] + y[2])
        coluna = parseInt(i[3])
        if(linha <= 39){
            p = tabela[linha][coluna]
        }else if (linha > 39 ) {
            p = 0.5000
        }
        
        if (vetIntervalo[0] < media){
            probabilidade_int = ((0.5 - p) * 100).toFixed(2)
        }else{
            probabilidade_int = ((0.5 + p) * 100).toFixed(2)
        }  

    } else {
        debugger
        for (let int of vetIntervalo) {
            if (int != media){
                z = (int-media)/desv
                if (z < 0){
                    z = z * -1
                }

                i = z.toFixed(2)
                y = [...i]
            
                linha = parseFloat(y[0] + y[2])
                coluna = parseInt(i[3])
                if(linha <= 39){
                    p = tabela[linha][coluna]
                }else if (linha > 39 ) {
                    p = 0.5000
                }
                prob.push(p)   
            }
        }

        if (vetIntervalo[0] > vetIntervalo[1] || vetIntervalo[0] > media){    
            probabilidade_int = ((prob.reduce((a,b) => a + b))*100).toFixed(2)
        }else{
            probabilidade_int = ((prob.reduce((a,b) => a - b))*100).toFixed(2)
        }
    }

    resultNormal.innerHTML = `
        <div>
            <span>Probabilidade:</span>
            <strong>${probabilidade_int}%</strong>
        </div>
        `
})