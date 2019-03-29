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

// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("neurovias1");

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: DEBUG,
        console_verbose: DEBUG,
        autoresize: true,
        show_fps: false,
        alpha: true,
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

    m_log_nodes.append_custom_callback("showinfo", showinfo);

    load();
}

/**
 * load the scene data
 */
function load() {
    m_data.load("assets/neurovias1.json", load_cb, preloader_cb);
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
function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }

    m_app.enable_camera_controls();

    // place your code here

}
    
    function showinfo(in_params, out_params){
        $("#backdrop").show();
        $("#"+in_params[0]).css({"display": "block"});
    }

});

// import the app module and start the app by calling the init method
b4w.require("neurovias1_main").init();


// ----------------------------- JQUERY

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
        console.log("oi");
        if($("nav").css("display") == "none"){
            $("nav").show();
        }else{
            $("nav").hide();
        }
    });
    
    $(".showbox").click( function(){
        var box = $(this).attr("data-showbox");
        $("#backdrop").show();
        $("#"+box).show();
    });
    
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
        console.log("OI");
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
    
    // -------------- LOGO BACK
    
    $("#logo_back").click(function(){
        window.history.back();
    });
    
});
