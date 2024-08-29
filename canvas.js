const ctx = document.getElementById("Grafo").getContext("2d");

//====================================================================================================== dados do grafo ======================================================================================================
var matriz_cst = []
var anterior = []
var caminho = []    

var data = {
    nodes: [
        {id: "LON", pos : [50,50]}, 
        {id: "PSR", pos : [50,150]},
        {id: "TRC", pos : [50,350]},
        {id: "BRT", pos : [50,450]},
        {id: "OTA", pos : [50,550]},
        {id: "RDS", pos : [150,100]},
        {id: "AGN", pos : [200,250]},
        {id: "AGR", pos : [200,450]},
        {id: "ATA", pos : [300,350]},
        {id: "LAU", pos : [350,250]},
        {id: "PET", pos : [350,450]},
        {id: "AUR", pos : [450,100]},  
        {id: "ITU", pos : [450,350]},
        {id: "VID", pos : [550,350]},
        {id: "ALF", pos : [550,450]}
    ],
    edges: [
      {from: "RDS", to: "AGN", val: 20.80},
      {from: "RDS", to: "LAU", val: 26.60},
      {from: "RDS", to: "TRC", val: 40.80},
      {from: "RDS", to: "LON", val: 12.80},
      {from: "RDS", to: "AUR", val: 28.00},
      {from: "RDS", to: "PSR", val: 101.10},
      {from: "AGN", to: "LAU", val: 9.50},
      {from: "AGN", to: "TRC", val: 23.20},
      {from: "AGN", to: "PSR", val: 75.30},
      {from: "LAU", to: "PSR", val: 97.20},
      {from: "TRC", to: "PSR", val: 55.20},
      {from: "TRC", to: "AGR", val: 27.40},
      {from: "TRC", to: "BRT", val: 14.40},
      {from: "AUR", to: "ITU", val: 26.60},
      {from: "OTA", to: "BRT", val: 85.14},
      {from: "AGR", to: "BRT", val: 30.80},
      {from: "AGR", to: "ATA", val: 6.10},
      {from: "ITU", to: "ATA", val: 47.96},
      {from: "ITU", to: "PET", val: 38.00},
      {from: "ITU", to: "VID", val: 63.2},
      {from: "ITU", to: "ALF", val: 113.00}
    ]
  };  

let qtdNodes = Object.keys(data.nodes).length
let qtdArestas = Object.keys(data.edges).length

//====================================================================================================== funcoes graficas ======================================================================================================

function getNodeById(id){
    for(var i = 0; i <= qtdNodes; i++){
        if (data.nodes[i].id == id){
            return data.nodes[i]
        }
    }
}

function draw() {
    //primeiro desenha os caminhos
    for(var i = 0; i < qtdArestas; i++){
        let posIni = getNodeById(data.edges[i].from).pos
        let posDes = getNodeById(data.edges[i].to).pos

        //desenha a linha
        ctx.beginPath();
        ctx.moveTo(posIni[0],posIni[1])
        ctx.lineTo(posDes[0],posDes[1]);
        ctx.lineWidth = 2
        if((caminho.includes(data.edges[i].to) && caminho.includes(data.edges[i].from)) && 
           (caminho.indexOf(data.edges[i].to) == caminho.indexOf(data.edges[i].from)-1 || caminho.indexOf(data.edges[i].to) == caminho.indexOf(data.edges[i].from)+1)){
            ctx.strokeStyle = "red"
        }else{
            ctx.strokeStyle = "black"
        }

        ctx.stroke();   

        //desenha o texto
        ctx.font = "bold 10px Arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        //desenha o fundo do texto
        ctx.fillStyle='White';
        ctx.fillText('████', ((posDes[0]-posIni[0])/2)+posIni[0], ((posDes[1]-posIni[1])/2)+posIni[1]);

        ctx.fillStyle='Red';
        ctx.fillText(data.edges[i].val, ((posDes[0]-posIni[0])/2)+posIni[0], ((posDes[1]-posIni[1])/2)+posIni[1]);
    }
    
    //depois desenha os nodes.
    for(var i = 0; i < qtdNodes; i++){
        ctx.beginPath();        
        ctx.arc(data.nodes[i].pos[0], data.nodes[i].pos[1], 15, 0, 2 * Math.PI);
        if(caminho.includes(data.nodes[i].id)){
            ctx.fillStyle = "red"
        }else{
            ctx.fillStyle = "Green"
        }
        ctx.fill();   

        ctx.font = "10px Arial";
        ctx.fillStyle='white';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(data.nodes[i].id, data.nodes[i].pos[0], data.nodes[i].pos[1]);

    }
}

function limpa(){
    ctx.clearRect(0, 0, 600,600);
}

//====================================================================================================== funcoes de processamento ======================================================================================================

function getIndexById(id){
    for(var i = 0; i < qtdNodes; i++){
        if(data.nodes[i].id == id){
            return i
        }
    }
}

function addArestas(){
    for(var i = 0; i < qtdArestas; i++){
        let o = getIndexById(data.edges[i].from)
        let d = getIndexById(data.edges[i].to)

        //como a matriz é não direcionada, adiciona indo e vindo!
        matriz_cst[o][d] = data.edges[i].val
        matriz_cst[d][o] = data.edges[i].val
    }       
}

function criaMatrizCst(){
    matriz_cst = []
    //Cria uma matriz NxN cheia de 0
    for(var i = 0; i < qtdNodes; i++){
        matriz_cst[i] = []    
        for(var j = 0; j < qtdNodes; j++){
            matriz_cst[i][j] = 0
        }
    }
    //Adiciona os valores conforme a matriz de custo
    addArestas();
}

function calculaDistancia(ini){
    //limpa a lista dos anteriores
    anterior = []
    //Lista para verificar quais vertices já foram visitadas.
    visitado = []
    for(var i = 0; i < qtdNodes; i++){
        visitado[i] = false
    }

    //Lista para armazenar as distâncias em comparação ao início.
    let distancia  = []
    for(var i = 0; i < qtdNodes; i++){
        distancia [i] = Infinity
    }

    verticeIni = self.getIndexById(ini)
    distancia[verticeIni] = 0

    //Percorrer cada nó não visitado buscando a proxima menor distancia
    for(var i = 0; i < qtdNodes; i++){
        let minDistancia = Infinity
        let minVertice = -1
        
        // se o vertice não foi visitado e possui valor menor que a menor distancia, utilizaremos ele para o proximo cálculo
        for(var j = 0; j < qtdNodes; j++){
            if(visitado[j] == false && distancia[j] < minDistancia){
                minDistancia = distancia[j]
                minVertice = j    
            }
        }   

        /*
        se encontrou um vertice novo, busca na matriz de custo se existe alguma adjacência ao vertice e 
        calcula a distância atual do vertice + o valor da adjacência para os proximos vertices. 
        */
        if(minVertice != -1){
            visitado[minVertice] = true

            for(var j = 0; j < qtdNodes; j++){
                if(matriz_cst[minVertice][j] != 0 && visitado[j] == false){
                    let distanciaCalculada = distancia[minVertice] + matriz_cst[minVertice][j]
                    
                    //Se a distancia calculada for menor que o valor previamente armazenado, substitui pelo menor valor.
                    if (distanciaCalculada < distancia[j]){
                        distancia[j] = distanciaCalculada

                        //adiciona o caminho mais curto para o proximo vertice
                        anterior[j] = minVertice
                    }
                }    
            }
        }
    }

    return distancia
}

function getCaminho(ori, dest){
    caminho = []
    let atual = getIndexById(dest)

    while (atual != null && atual != getIndexById(ori)){
        caminho[caminho.length] = data.nodes[atual].id
        atual = anterior[atual]
    }

    caminho[caminho.length] = ori
}

function Execute(ori, dest){

    let distancias = calculaDistancia(ori)

    getCaminho(ori, dest)
    limpa();
    draw();

    document.getElementById('Dist').innerHTML = 'Distância: '+distancias[getIndexById(dest)].toFixed(2)
}

let DocOri = null
let DocDes = null

criaMatrizCst();
draw();
createButtons();
// ============================================================ Funções de interface ============================================================


function createButtons(){
    let ori = document.getElementById('origem');
    let des = document.getElementById('destino');
    for(let i = 0; i < qtdNodes; i++){
        ori.innerHTML += '<h4 id = "'+data.nodes[i].id+'_ori" onclick="selectNode(this, 1)">'+data.nodes[i].id+'</h4>';
        des.innerHTML += '<h4 id = "'+data.nodes[i].id+'_des" onclick="selectNode(this, 2)">'+data.nodes[i].id+'</h4>';
    }
}

function selectNode(node, type){
    if (type == 1){
        if(DocOri != null){
            DocOri.style.background = 'white';
            DocOri.style.color = 'black';
        }
        DocOri = node;

        DocOri.style.background = 'darkgreen';
        DocOri.style.color = 'white';
    }else{
        if(DocDes != null){
            DocDes.style.background = 'white';
            DocDes.style.color = 'black';
        }
        DocDes = node;

        DocDes.style.background = 'darkgreen';
        DocDes.style.color = 'white';
    }
}

function Calc(){
    if(DocOri != null && DocDes != null){
        Execute(DocOri.innerHTML, DocDes.innerHTML)
    }
}
