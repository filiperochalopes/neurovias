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
var APP_ASSETS_PATH = m_cfg.get_assets_path("neurovias2");

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
    m_data.load("assets/neurovias2.json", load_cb, preloader_cb);
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
    
    var activeObj;

    //[nome, R, G, B, A]

    var arrayObj = [
        ["substancia_branca", 0.799, 0.745, 0.651, 1],
        ["substancia_cinzenta", 0.260, 0.260, 0.260, 1],       
        ["trato_espinotalamico_lateral", 0.325, 0, 0, 1],       
        ["trato_espinotalamico_anterior", 0.8, 0.555, 0, 1],       
        ["trato_cortico_espinhal_anterior", 0.028, 0.391, 0.8, 1],       
        ["trato_cortico_espinhal_lateral", 0.079, 0.8, 0.247, 1],       
        ["trato_espino_cerebelar_posterior", 0.8, 0.071, 0.420, 1],       
        ["trato_espino_cerebelar_anterior", 0.8, 0.068, 0.137, 1],       
        ["fasciculo_cuneiforme", 0.8, 0.386, 0.031, 1],     
        ["fasciculo_gracil", 0.8, 0.665, 0.151, 1],     
        ];

    var arrayPerg = [2,3,4,5,6,7,8,9],
        alternativas = [];

    var vias = {
        trato_espinotalamico_lateral : {
            nome: "Trato espinotalâmico lateral",
            origem: "Coluna posterior",
            funcao: "Temperatura e dor",
            terminacao: "Tálamo",
            clinica: "Inibição da dor e percepção de temperatura"
        },

        trato_espinotalamico_anterior : {
            nome: "Trato espinotalâmico anterior",
            origem: "Coluna posterior",
            funcao: "Tato protopático e pressão",
            terminacao: "Tálamo",
            clinica: "Sensibilidade grosseira prejudicada e de pressão"
        },

        trato_cortico_espinhal_anterior : {
            nome: "Trato cortico espinhal anterior",
            origem: "Córtex motor",
            funcao: "Motricidade voluntária axial e proximal dos membros superiores (MMSS)",
            terminacao: "Musculatura axial e proximal de MMSS",
            clinica: "Relaxamento da postura e fraqueza de MMSS"
        },


        trato_cortico_espinhal_lateral : {
            nome: "Trato corticoespinhal lateral",
            origem: "Córtex motor",
            funcao: "Motricidade voluntária da musculatura distal",
            terminacao: "Mulculatura distal",
            clinica: "Perda de movimentos finos"
        },

        trato_espino_cerebelar_posterior : {
            nome: "Trato espinocerebelar posterior",
            origem: "Coluna posterior (núcleo torácico) [Funículo lateral]",
            funcao: "Propriocepção inconscente",
            terminacao: "Cerebelo",
            clinica: "Inibição da (ver função)"
        },

        trato_espino_cerebelar_anterior : {
            nome: "Trato espinocerebelar anterior",
            origem: "Coluna posterior e substância cinzenta intermédia [Funículo lateral]",
            funcao: "Propriocepção inconsciente. Detecção dos níveis de atividade do t. corticoespinhal",
            terminacao: "Cerebelo",
            clinica: "Inibição da (ver função)"
        },

        fasciculo_cuneiforme : {
            nome: "Fascículo cuneiforme",
            origem: "Funículo posterior [Evidente a partir da medula torácica alta]",
            funcao: "Tato epicrítico, propriocepção consciente (cinestesia) [permiti determinar localização e posição de membro sem ver], sensibilidade vibratória e estereognosia [reconhecer forma e tamanho dos objetos sem ver, depende dos receptores de tato e propiocepção]",
            terminacao: "Núcleo cuneiforme [situado no tubérculo do núcleo cuneiforme - bulbo]",
            clinica: "Perda de discriminação de dois pontos, cinestesia dos membros superiores e metade superior do tronco"
        },

        fasciculo_gracil : {
            nome: "Fascículo grácil",
            origem: "Funículo posterior",
            funcao: "Tato epicrítico, propriocepção consciente (cinestesia) [permiti determinar localização e posição de membro sem ver], sensibilidade vibratória e estereognosia [reconhecer forma e tamanho dos objetos sem ver, depende dos receptores de tato e propiocepção]",
            terminacao: "Núcleo grácil [situado no tubérculo do núcleo grácil - bulbo]",
            clinica: "Perda de discriminação de dois pontos e demais aferências (ver função) do tronco para baixo"
        },


    }

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
    
    var substancia_branca = m_scenes.get_object_by_name("substancia_branca"),
            substancia_cinzenta = m_scenes.get_object_by_name("substancia_cinzenta"),
            trato_espinotalamico_lateral = m_scenes.get_object_by_name("trato_espinotalamico_lateral"),
            trato_espinotalamico_anterior = m_scenes.get_object_by_name("trato_espinotalamico_anterior"),
            trato_cortico_espinhal_anterior = m_scenes.get_object_by_name("trato_cortico_espinhal_anterior"),
            trato_cortico_espinhal_lateral = m_scenes.get_object_by_name("trato_cortico_espinhal_lateral"),
            trato_espino_cerebelar_posterior = m_scenes.get_object_by_name("trato_espino_cerebelar_posterior"),
            trato_espino_cerebelar_anterior = m_scenes.get_object_by_name("trato_espino_cerebelar_anterior"),
            fasciculo_cuneiforme = m_scenes.get_object_by_name("fasciculo_cuneiforme"),
            fasciculo_gracil = m_scenes.get_object_by_name("fasciculo_gracil");
    
    /*document.querySelector("#menu-bt").onclick = function(){    
        
        m_log_nodes.run_entrypoint("Scene", "trato_espinotalamico_lateral");       
        setAlpha("trato_espinotalamico_lateral");

    }*/
    
    document.querySelector("#quiz").onclick = function(){
        m_log_nodes.run_entrypoint("Scene", "random_quiz");
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
        if(localStorage.getItem("neuro2_certo") == null){
            localStorage.setItem("neuro2_certo", "0");
        }
        
        var certo = localStorage.getItem("neuro2_certo");
        
        if(localStorage.getItem("neuro2_errado") == null){
            localStorage.setItem("neuro2_errado", "0");
        }
        
        var errado = localStorage.getItem("neuro2_errado");
        
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
    
    // -------------- TWOCLICKS
    
    function showSubmenu(obj){
        obj.attr("data-submenu", 1);
        obj.find("ul").show();
    }
    
    function hideSubmenu(obj){
        obj.attr("data-submenu", 0);
        obj.find("ul").hide();
    }
    
    $(".twoclicks").click( function(){
        var clicks = parseInt($(this).attr("data-clicks")),
            submenu = parseInt($(this).attr("data-submenu"));
        if(clicks == 0){
            if(submenu == 1){
                hideSubmenu($(this));
            }else{
                $(this).find(".secondclick").show();
                $(this).attr("data-clicks", 1);
            }
        }else{
            $(this).find(".secondclick").hide(); 
            $(this).attr("data-clicks", 0);
            //mostra submenu
            if(submenu != 99){
                showSubmenu($(this));
            }
        }
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
