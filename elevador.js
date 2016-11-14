// Modo debug
var DEBUG_MODE = true;

// matriz para armazenar controles cima / baixo
var queue = [];
// direção
var subindo = true;
// se não houver pedido. executando == false
var funcionamento = false;
// piso atual do elevador
var andarAtual = 1;

// superior e inferior do predio
var ANDAR_MAX = 5;
var ANDAR_MIN = 0;

// tempo global
var timer = null;

// botoes


function abrirPorta() {
    $("#portaesquerda").css("left", "10px");
    $("#portadireita").css("left", "110px");
}

function fecharPorta() {
    $("#portaesquerda").css("left", "40px");
    $("#portadireita").css("left", "80px");
}

$("#abrir").click(abrirPorta);
$("#fechar").click(fecharPorta);

// chamando o elevador para o andar correto
function indicar(floor) {
    if ( queue.indexOf(floor) < 0 ) {               
        queue.push(floor);
        queue.sort();
        if(!funcionamento) {
            checkStatus();
        }
    }
}

// chave de ligação
$(".sobe").click(function(){
    var this_id = $(this).parent().parent()[0].id;
    indicar(Number(this_id.substr(5)));
    $(this).addClass("on");
});

$(".desce").click(function(){
    var this_id = $(this).parent().parent()[0].id;
    indicar(Number(this_id.substr(5)));
    $(this).addClass("on");
});

$("#indicar .button").click(function(){
    var this_id = $(this)[0].id;
    indicar(Number(this_id.substr(4)));
    $(this).addClass("pressed");
});


// apagar as luzes quando chegar
function luzesApagadas(floor) {
    if ($("#andar" + floor + " td a")[0])
        $("#andar" + floor + " td a")[0].className = "sobe";
    if ($("#andar" + floor + " td a")[1])
        $("#andar" + floor + " td a")[1].className = "desce";

    if ($("#indicar" + floor))
        $("#indicar" + floor).removeClass("pressed");
}

// mover
function subir() {
    if ( andarAtual < ANDAR_MAX )
        andarAtual++;
}

function descer() {
    if ( andarAtual > ANDAR_MIN )
        andarAtual--;
}

// informações sobre o piso atual
function updateInfoAndar() {
    $("#tabela tr").each(function(){
        $(this).children()[0].innerHTML = "";
    });
    $("#andar"+andarAtual).children()[0].innerHTML = "<div id='principal2'><div id='elevador'><p><span id='tituloAndar'>1</span> Andar </p><div class='porta' id='portaesquerda'></div><div class='porta' id='portadireita'></div><div class='painel' id='painelesquerdo'></div><div class='painel' id='paineldireito'></div></div></div>";

    $("#indicador li.atual").removeClass("atual");
    $("#indicador li")[andarAtual].className = "atual";

    if(andarAtual>0) {
        $("#tituloAndar").text(""+andarAtual);
        $("#floorOnScreen").text(""+andarAtual);
    } else {
        $("#tituloAndar").text("B"+(1-andarAtual));
        $("#floorOnScreen").text("B"+(1-andarAtual));
    }
}

// algoritmo principal
function play() {
    if (DEBUG_MODE) {
        console.log("funcionamento:"+funcionamento + "  subindo:"+subindo + "  queue:"+queue + " previousFloor:"+andarAtual);
    }
    
    if(funcionamento) {
        if (queue.indexOf(andarAtual) > -1) {            
            ding(andarAtual);
        } else {
            subindo ? subir() : descer();
            updateInfoAndar();
        }
        checkStatus();
    }
}

function ding(floor) {
    if (timer)
        clearInterval(timer);
    luzesApagadas(floor);
    removeFromQueue(queue, floor);
    abrirPorta();
    setTimeout(function(){
        fecharPorta();
        setTimeout(function(){
            timer = setInterval(play, 1000);
        }, 3000);
    }, 4000);
}


function checkStatus() {
    funcionamento = ( queue.length > 0) ? true : false;

    if(andarAtual == ANDAR_MIN) {
        subindo = true;
    } else if (andarAtual == ANDAR_MAX) {
        subindo = false;
    } else {
        (  subindo && (!funcionamento || andarAtual < getMaxInQueue(queue)) ) ? subindo = true  : subindo = false;
        ( !subindo && (!funcionamento || andarAtual > getMinInQueue(queue)) ) ? subindo = false : subindo = true;
    }
}

// obert o máximo de matriz
function getMaxInQueue(queue) {
    if (queue.length <= 0) {
        throw new Error("");
        return false;
    }
    if (queue.length == 1) {
        return queue[0];
    } else {
        var max = queue[0];
        for(var i in queue) {
            if (queue[i] > max) {
                max = queue[i];
            }
        }
        return max;
    }
}


function getMinInQueue(queue) {
    if (queue.length <= 0) {
        throw new Error("");
        return false;
    }
    if (queue.length == 1) {
        return queue[0];
    } else {
        var min = queue[0];
        for(var i in queue) {
            if (queue[i] < min) {
                max = queue[i];
            }
        }
        return min;
    }
}

// remover andares determinados da fila
function removeFromQueue(queue, floor) {
    if (queue.indexOf(floor) < 0) {
        throw new Error("");
        return false;
    }
    if (queue.length <= 0) {
        throw new Error("");
        return false;
    }
    for (var i=0, len=queue.length; i<len; i++) {
        if (queue[i] == floor) {
            for(var j=i; j<len-1; j++) {
                queue[j] = queue[j+1]
            }
            queue.pop();
        }
    }
}

timer = setInterval(play, 1000);