$(document).ready(function(){
    
    function calculaPosicaoBalao(objRelativo){
        console.log(objRelativo);
        console.log(objRelativo.offset().left, objRelativo.offset().top);
        console.log($(window).width(), $(window).height());
        w= $(window).width() * 0.9;
        h= $(window).height() * 0.7;
        x= 0 - objRelativo.offset().left + (0.05*w);
        y= 0 - objRelativo.offset().top + (0.15*h);
        return [w, h, x, y];
    }
    
    window.addEventListener("load",function() {
        setTimeout(function(){
            // This hides the address bar:
            window.scrollTo(0, 1);
        }, 0);
    });
    
    $(".botaobalao").click(function(){
        if($(this).attr("data-status") == undefined || $(this).attr("data-status") == "fechado"){
            $(".balaomensagem").attr("style", "");
            $(".balaomensagem div").hide();
            
            var posicao = calculaPosicaoBalao($(this));
            $(this).find(".balaomensagem").css({ top: posicao[3], left: posicao[2], width: posicao[0], height: posicao[1], borderColor: "#ccc", boxShadow: "0 2px 1px #e6e6e6"}).find("div").show();
            $(this).attr("data-status", "aberto");
        }else{
            //fechar
            $(".balaomensagem").attr("style", "");
            $(".balaomensagem div").hide();
            $(this).attr("data-status", "fechado");
        }
    });
    
})