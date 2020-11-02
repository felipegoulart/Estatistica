import tabela from "./tabela.js"

const calcularNormal = document.querySelector('#calcularNormal')
const resultNormal = document.querySelector('.resultNormal')

calcularNormal.addEventListener('click', () => {
    const media = document.querySelector('#media').valueAsNumber
    const desv = document.querySelector('#desv').valueAsNumber
    const intervalo = document.querySelector('#intervalo').value
    const opt_intervalo = document.querySelector('#selectIntervalo').value

    let i, y, z, coluna, linha, p, probabilidade_int, int_tratado
    let prob = []
    
    
    let vetIntervalo = intervalo.split(';').map(num => Number(num))
     
    if (opt_intervalo == 'maior' || opt_intervalo == 'menor'){   
        debugger 
        
        z = (vetIntervalo[0]-media)/desv
        if (z < 0) z *= -1 // se o número for negativo, ele passa para positivo

        debugger
        i = z.toFixed(2)
        y = [...i]
    
        linha = parseFloat(y[0] + y[2])
        coluna = parseInt(i[2])
        if(linha <= 39){
            p = tabela[lin][coluna]
        }else if (linha > 39 ) {
            p = 0.5000
        }
        
        if (int_tratado[0] > media){
            probabilidade_int = ((0.5 - p) * 100).toFixed(2)
        }else{
            probabilidade_int = ((0.5 + p) * 100).toFixed(2)
        }         
    } else {
        for (let int = 0; int < int_tratado.length; int++){
            if (int_tratado[int] != media){
                z = ((int_tratado[int]-media)/desv).toFixed(2)
                if (z < 0){
                    z = z * -1
                }
                i = z.toString()
                y = i.split('')
                linha = parseFloat(y[0] + y[1] + y[2])
                coluna = parseInt(i[3])
            
                for (let lin in tabela){
                    if(tabela[lin][0] == linha){
                        p = tabela[lin][coluna + 1]
                    }else if (linha > 3.9 ) {
                        p = 0.5000
                    }
                }
                prob.push(p)   
            }
        }
        if (int_tratado[0] > int_tratado[1] || int_tratado[0] < media){    
            probabilidade_int = ((prob.reduce((a,b) => a + b))*100).toFixed(2)
        }else{
            probabilidade_int = ((prob.reduce((a,b) => b - a))*100).toFixed(2)
        }
    }

    resultNormal.innerHTML = `
        <div>
            <span>Probabilidade:</span>
            <strong>${probabilidade_int}</strong>
        </div>
        `
})