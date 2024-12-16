//CALCULOS

        function degToRad(degrees) {
            return degrees * Math.PI / 180;
        }

        function c(i, x) {
            if (i == 0) {
                return 1;
            }
            let previous = c(i - 1, x);
            return Math.sqrt(1 + previous ** 2 - 2 * previous * Math.cos(x));
        }

        function a(i,x){
            let actual = c(i,x)
            let previous = c(i-1, x)
            const angle = Math.acos((actual**2+previous**2-1)/(2*actual*previous))
            return angle
        }

        function k(x, y){

            let sum = 0
            let i = 1
        
            while (sum < y){
                
                sum += a(i, x)
                if (sum+a(i+1,x) > y){
                    let p = (y-sum)/(a(i+1,x)) 
                    return i + p
                }
                i++
            }
        }

        function numOfSolutions(a,b,y){
            let aK = f(degToRad(a), degToRad(y))
            let bK = f(degToRad(b), degToRad(y))
            return parseInt(bK) - parseInt(aK)
        }

        function searchAngles(min, max, y){
        
            const minimum = min
            const maximum = max
        
            //Process
        
            let half = (min+max)/2
            let halfK = f(degToRad(half), degToRad(y))
            let solutions = []
            const firstK = Math.ceil(f(degToRad(minimum), degToRad(y)))
            const lastK = Math.floor(f(degToRad(maximum), degToRad(y)))
        
            for (let k = firstK; k <= lastK; k++) {
                
                //Enclosing an interval where there is known to be only one solution
        
                while (numOfSolutions(min, half,y) > 1){
                    half = (min + half)/2
                }
        
                while (numOfSolutions(min, half,y) === 0) {
                    half = (half+max)/2
                }
        
                halfK = f(degToRad(half), degToRad(y))
    
                //Searching ONE solution inside AN interval
        
                while (Math.abs(k-halfK) > 0.0000001) {
        
                    half = (min+max)/2  
                    halfK = f(degToRad(half), degToRad(y))
        
                    if (halfK > k){
                        max = half
                    } else if (halfK < k){
                        min = half
                        } 
                    
                }
            
                min = half
                max = maximum
        
                solutions.push({half, k})       
            }
        
            return solutions
        }

        function mcd(a,b) {
            
            let arr = [[a,b]]
            let i = 1

            while(arr[i-1][1] > 0){        
                
                let nextA = arr[i-1][1]
                let nextB = arr[i-1][0] % arr[i-1][1]
                arr.push([nextA, nextB])
                i++
            }
            
            return arr[arr.length - 1][0]
        }

        function pInverse(p){
            let n;
            if (p % 2 !== 0){
                n = 2*p
            } else if (p % 4 == 0){
                n = p
            } else{
                n = p/2
            }

            let randM = parseInt((Math.random()/2)*n)

            while (mcd(randM, n) > 1){
                randM = parseInt((Math.random()+1)*(n/4 ))
            }

            return `x = ${((randM/n)*180).toFixed(4)}`
        }
        
        function qInverse(q){

            let n;

            if(q % 2 == 0){
                n = q/2
            } else {
                n = q
            }
            
            let mArr = []

            for (let m = 1; m < n; m++) {
                if(mcd(m,n) == 1){ mArr.push(m)}
            }

            let randM = mArr[parseInt(Math.random()*mArr.length)]
            
            if(q % 2 !== 0){
                if (randM % 2 == 0){randM -= 1}
            }
            if (q % 2 == 0 && q % 4 !== 0){
                if(randM % 2 !== 0){randM -= 1}
            }
                return `x = ${((randM/n)*180).toFixed(4)}`

        }

//TECNOLOGIA DE GENERACION DE FIGURAS

        //TRIANGULOS

    function createTriangle(points) {
        const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        triangle.setAttribute("points", points);
        triangle.setAttribute("fill", "none");
        triangle.setAttribute("stroke", "black");
        triangle.setAttribute("stroke-width", "1");

        return triangle;
    }

        async function drawTriangleFormation(containerID, x, k, delay, sideLength) {
            const container = document.getElementById(containerID);
            container.innerHTML = ""; 

            let ax = 300
            let ay = 300

            let bx = ax + sideLength;
            let by = ay;

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");

            for (let i = 0; i < k; i++) {
                const dx = bx - ax; 
                const dy = by - ay; 

                // Calcular las componentes de u (vector unitario)
                const uLength = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / uLength;
                const uy = dy / uLength;

                // Calcular las componentes de v (vector rotado x grados)
                const vx = ux * Math.cos(degToRad(x)) - uy * Math.sin(degToRad(x));
                const vy = ux * Math.sin(degToRad(x)) + uy * Math.cos(degToRad(x));

                const cx = ax + sideLength * vx;
                const cy = ay + sideLength * vy;

                const points = `${ax},${ay} ${bx},${by} ${cx},${cy}`;
                const triangle = createTriangle(points);

                svg.appendChild(triangle);

                ax = cx;
                ay = cy;

                await new Promise(resolve => setTimeout(resolve, delay));

                container.appendChild(svg);
            }
        }

        function dibujarGrafico(angle, n) {

            let angulos2 = [];
            for (let i = 0; i <= n; i++) {
                angulos2.push(i);
            }

            const valoresC = angulos2.map((el) => c(el, (angle / 180) * Math.PI));
            const $grafico = document.querySelector("#grafico");
            const datosDeC = {
                label: `Valor de c con x=${angle}º`,
                data: valoresC,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            };

            new Chart($grafico, {
                type: 'line',
                data: {
                    labels: angulos2,
                    datasets: [datosDeC],
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                    },
                }
            });
        }

        function calcularPInverse() {
            const p = parseInt(document.getElementById("puntas").value); 
            const resultado = pInverse(p); 
            document.getElementById("resultado").textContent = resultado; 
        }

        function miFuncionT() {
            let angle = document.getElementById("angulo").value;
            let tam;

            if(angle > 0){tam = 400}
            if (angle > 45){tam=200}
            if(angle > 70){tam=150}
            if(angle > 79){tam=80}
            if(angle > 90){tam = 40}

            drawTriangleFormation("svg-container", -angle, 2100, 180, tam);
            dibujarGrafico(angle, 200);
        }

        function descargarSVGT() {

            const svgContent = document.getElementById("svg-container").innerHTML;
            const svgWrapper = `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1000" height="1000" viewBox="0 0 1000 1000">
                    ${svgContent}
                </svg>
            `;
            const blob = new Blob([svgWrapper], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "T.svg";
            link.click();

            URL.revokeObjectURL(url);
        }

        function eliminarTriangulos() {

            const svgContainer = document.getElementById("svg-container");
            const triangles = svgContainer.querySelectorAll("polygon");
    
            for (let i = 0; i < 100 && i < triangles.length; i++) {
                triangles[i].remove();
            }
        }  

        //PARALELOGRAMOS
  
    function createParallelogram(points) {
        const parallelogram = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        parallelogram.setAttribute("points", points);
        parallelogram.setAttribute("fill", "none");
        parallelogram.setAttribute("stroke", "black");
        parallelogram.setAttribute("stroke-width", "1"); 
        return parallelogram;
    }

        async function drawParallelogramFormation(containerID, x, k, delay, sideLength) {
            const container = document.getElementById(containerID);
            container.innerHTML = ""; 
    
            let ax = 500;
            let ay = 320;
    
            let bx = ax + sideLength;
            let by = ay;
    
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "1500px");
            svg.setAttribute("height", "1500px");
    
            for (let i = 0; i < k; i++) {
                const dx = bx - ax;
                const dy = by - ay;
    
                // Vector rotado según el ángulo
                const uLength = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / uLength;
                const uy = dy / uLength;
    
                const vx = ux * Math.cos(degToRad(x)) - uy * Math.sin(degToRad(x));
                const vy = ux * Math.sin(degToRad(x)) + uy * Math.cos(degToRad(x));
    
                const cx = ax + sideLength * vx;
                const cy = ay + sideLength * vy;
    
                const dx2 = cx + (bx - ax); 
                const dy2 = cy + (by - ay);
    
                const points = `${ax},${ay} ${bx},${by} ${dx2},${dy2} ${cx},${cy}`;
                const parallelogram = createParallelogram(points);
    
                svg.appendChild(parallelogram);
    
                ax = dx2;
                ay = dy2;
    
                await new Promise(resolve => setTimeout(resolve, delay));

                container.appendChild(svg);
            }
        }
    
        function miFuncionP() {

            let angle = document.getElementById("angulo").value;
            drawParallelogramFormation("svg-container", -angle, 200, 100, 150);

        }

        function descargarSVGP() {

            const svgContent = document.getElementById("svg-container").innerHTML;
            const svgWrapper = `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1000" height="1000" viewBox="0 0 1000 1000">
                    ${svgContent}
                </svg>
            `;
            const blob = new Blob([svgWrapper], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "P.svg";
            link.click();

            URL.revokeObjectURL(url); 
        }

        function calcularQInverse() {
            const q = parseInt(document.getElementById("puntas").value); 
            const resultado = qInverse(q); 
            document.getElementById("resultado").textContent = resultado; 
        }
