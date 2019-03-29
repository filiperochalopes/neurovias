"use strict"

// register the application module
b4w.register("neurovias1_main", function(exports, require) {

// import modules used by the app
var m_app       = require("app");
var m_cfg       = require("config");
var m_data      = require("data");
var m_preloader = require("preloader");
var m_ver       = require("version");    
var m_log_nodes = require("logic_nodes");
var m_transf = require("transform");
    
var m_mat = require("material");
var m_scenes = require("scenes");

// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("neurovias3");

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: false,
        console_verbose: DEBUG,
        autoresize: true,
        alpha: true,
        assets_dds_available: !DEBUG,
        assets_min50_available: !DEBUG,
        console_verbose: true,
        physics_enabled: false
    });
}

/**
 * callback executed when the app is initialized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    
    m_log_nodes.append_custom_callback("pergunta", pergunta);
    m_log_nodes.append_custom_callback("random_number", random_number);
    m_log_nodes.append_custom_callback("callback_depoisCliqueTrato", callback_depoisCliqueTrato);
    m_log_nodes.append_custom_callback("callback_tratoclick", callback_tratoclick);
    m_log_nodes.append_custom_callback("callback_objclick", callback_objclick);

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load("assets/neurovias3.json", load_cb, preloader_cb);
}

/**
 * update the app's preloader
 */
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

/**
 * callback executed when the scene data is loaded
 */


    function showBoxDefinicao(obj, resposta){
        $("#backdrop").show();
        $("#BoxDefinicao").show();
        $("#BoxDefinicao td[data-info=nome]").html("Nome: "+obj.nome);
        $("#BoxDefinicao td[data-info=origem]").html("Origem: "+obj.origem);
        $("#BoxDefinicao td[data-info=funcao]").html("Função: "+obj.funcao);
        $("#BoxDefinicao td[data-info=terminacao]").html("Destino: "+obj.terminacao);
        $("#BoxDefinicao td[data-info=clinica]").html("Repercussão clínica em caso de lesão: "+obj.clinica);

        var mensagem = "",
            color = "#ccc";

        if(resposta == "certo"){
            mensagem = '<span class="resultadoQuiz"><i class="far fa-check-circle"></i> Parabéns, resposta correta! Veja mais detalhes:</span>';
            color = "#6bd662";
        }else if(resposta == "errado"){
            mensagem = '<span class="resultadoQuiz"><i class="far fa-times-circle"></i> Errado! A resposta correta era:</span> ';
            color = "#d44550";
        }

        $("#BoxDefinicao .resposta").html(mensagem).css({color: color});
        $("#quizBox").hide();
    }

    function removerItemArray(item, array){
        var idx = array.indexOf(item);
        if(idx != -1) {
            array.splice(idx, 1);
        }

        return array;
    }

    function getNomebyId(id){
        var ref = arrayObj[id][0];
        return vias[ref].nome;
    }

    function mostrarAlternativas(alternativas){
        $("#backdrop").show();
        $("#quizBox").show();
        //console.log("alternativas", alternativas);
        $("#quizBox div[data-alternativa=a]").text(getNomebyId(alternativas[0])).attr("data-id", alternativas[0]);
        $("#quizBox div[data-alternativa=b]").text(getNomebyId(alternativas[1])).attr("data-id", alternativas[1]);;
        $("#quizBox div[data-alternativa=c]").text(getNomebyId(alternativas[2])).attr("data-id", alternativas[2]);;
        $("#quizBox div[data-alternativa=d]").text(getNomebyId(alternativas[3])).attr("data-id", alternativas[3]);;
        $("#quizBox div[data-alternativa=e]").text(getNomebyId(alternativas[4])).attr("data-id", alternativas[4]);;
        $("#quizBox div[data-alternativa=resposta]").text(alternativas[5]);
    }
    
function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }

    m_app.enable_camera_controls();

    // place your code here
    
    /*document.querySelector("#menu-bt").onclick = function(){    
        
        m_log_nodes.run_entrypoint("Scene", "trato_espinotalamico_lateral");       
        setAlpha("trato_espinotalamico_lateral");

    }*/
    
    document.querySelector("#tcel").onclick = function(){
      m_log_nodes.run_entrypoint("Scene", "tcel");      
    }

    document.querySelector("#tcea").onclick = function(){
      m_log_nodes.run_entrypoint("Scene", "tcea");
    }

    document.querySelector("#teta").onclick = function(){
      m_log_nodes.run_entrypoint("Scene", "teta");
    }

    document.querySelector("#tetl").onclick = function(){
      m_log_nodes.run_entrypoint("Scene", "tetl");
    }

    document.querySelector("#gracil").onclick = function(){
      m_log_nodes.run_entrypoint("Scene", "gracil");
    }

    document.querySelector("#cuneiforme").onclick = function(){
      m_log_nodes.run_entrypoint("Scene", "cuneiforme");
    }

    document.querySelector("#vertudo").onclick = function(){
      m_log_nodes.run_entrypoint("Scene", "vertudo");
    }
    
    function setAlpha(obj){
        var alpha = 0.35;
        
        //corrige todas as cores
        arrayObj.forEach( function(element, index, array){
            m_mat.set_diffuse_color(eval(element[0]), element[0], [element[1], element[2], element[3], 1]);
        });
        
        arrayObj.forEach( function(element, index, array){
            if(element[0] != obj){
                m_mat.set_diffuse_color(eval(element[0]), element[0], [1, 1, 1, alpha]);
            }else{
               activeObj = index; 
            }
        });
        
        //activeObj = m_scenes.get_object_by_name(obj);
        
        //m_mat.set_diffuse_color(substancia_branca, "substancia_branca", [0.799, 0.745, 0.651, alpha]);
    }

}
    
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
    
    function callback_tratoclick(in_params, out_params){
        console.log(activeObj);
        out_params[0] = activeObj;
    }
    
    function callback_objclick(in_params, out_params){
        console.log(in_params[1]);
    }
    
    function callback_depoisCliqueTrato(in_params, out_params){
        var nomeobj = arrayObj[in_params[0]][0]
        console.log(nomeobj);
        console.log(vias);
        console.log(vias[arrayObj[in_params[0]][0]]);
        showBoxDefinicao(vias[arrayObj[in_params[0]][0]]);
    }
    
    function random_number(in_params, out_params){
        var array = [2,3,4,5,6,7,8,9];
        var selected = array[Math.floor(Math.random()*array.length)];
        out_params[0] = selected;
    }
    
    function pergunta(in_params, out_params){
        var resposta = parseInt(in_params[0]);
        arrayPerg = [2,3,4,5,6,7,8,9];
        alternativas = [];
        alternativas.push(resposta);
        //remove a resposta das possiveis alternativas
        var arrayPergPossivel = arrayPerg;
        //console.log("verifica argumentos", arrayPerg, arrayPergPossivel);
        removerItemArray(resposta, arrayPergPossivel);
        for (var i = 0; i < 4; i++) {
            var radom = arrayPergPossivel[Math.floor(Math.random()*arrayPergPossivel.length)];
            alternativas.push(radom);
            removerItemArray(radom, arrayPergPossivel);
        }
        alternativas = shuffle(alternativas);
        alternativas.push(resposta);
        //a resposta sempre é o ultimo
        mostrarAlternativas(alternativas);
    }
    
    $(document).ready( function(){
        
    // -------------- RESPOSTA
        if(localStorage.getItem("neuro3_certo") == null){
            localStorage.setItem("neuro3_certo", "0");
        }
        
        var certo = localStorage.getItem("neuro3_certo");
        
        if(localStorage.getItem("neuro3_errado") == null){
            localStorage.setItem("neuro3_errado", "0");
        }
        
        var errado = localStorage.getItem("neuro3_errado");
        
        $("#score .certo").text(certo);
        $("#score .errado").text(errado)
    
        $("#quizBox > div").click(function(){
            console.log("foi");
            var minhaalternativa = $(this).attr("data-id"),
            respostacorreta = $("#quizBox > div[data-alternativa=resposta]").text();
            if(minhaalternativa == respostacorreta){
                //true
                showBoxDefinicao(vias[arrayObj[respostacorreta][0]], "certo");
                certo = parseInt(certo);
                certo++;
                localStorage.setItem("neuro2_certo", certo);
                $("#score .certo").text(certo);
            }else{
                //false
                showBoxDefinicao(vias[arrayObj[respostacorreta][0]], "errado");
                errado = parseInt(errado);
                errado++;
                localStorage.setItem("neuro2_errado", errado);
                $("#score .errado").text(errado);
            }
        });
        
    });
    
});

// import the app module and start the app by calling the init method
b4w.require("neurovias1_main").init();

$(document).ready( function(){
    
    $("#backdrop").click( function(){
        $(this).hide();
        $(".info").hide();
    });
    
    $(".info .close").click( function(){
        $(this).parent().hide();
        $("#backdrop").hide();
    });
    
    $("#menu-bt").click( function(){
        if($("nav").css("display") == "none"){
            $("nav").show();
        }else{
            $("nav").hide();
        }
    });
    
    // -------------- MENU SELECT
    
    $("nav li").click(function(){
      $("#menu-bt").click();
    });
    
    // -------------- CLIQUE BALAO
    
    function calculaPosicaoBalao(objRelativo){
        console.log(objRelativo);
        console.log(objRelativo.offset().left, objRelativo.offset().top);
        console.log($(window).width(), $(window).height());
        var w = $(window).width() * 0.9,
        h = $(window).height() * 0.7,
        x = 0 - objRelativo.offset().left + (0.05*w),
        y = 0 - objRelativo.offset().top + (0.15*h);
        return [w, h, x, y];
    }
    
    $(".botaobalao").click(function(){
        if($(this).attr("data-status") == undefined || $(this).attr("data-status") == "fechado"){
            $(".balaomensagem").attr("style", "");
            $(".balaomensagem div").hide();
            
            var posicao = calculaPosicaoBalao($(this));
            $(this).find(".balaomensagem").css({ top: posicao[3], left: posicao[2], width: posicao[0], height: posicao[1], borderColor: "#ccc", boxShadow: "0 2px 1px #e6e6e6", background: "#f7f7f7"}).find("div").show();
            $(this).attr("data-status", "aberto");
        }else{
            //fechar
            $(".balaomensagem").attr("style", "");
            $(".balaomensagem div").hide();
            $(this).attr("data-status", "fechado");
        }
    });
    
    // -------------- BACKDROP
    
    $("#backdrop").click(function(){
        $("#BoxDefinicao").hide();
        $("#quizBox").hide();
    });
    
    // -------------- LOGO BACK
    
    $("#logo_back").click(function(){
        window.history.back();
    });
    
    
    
});
