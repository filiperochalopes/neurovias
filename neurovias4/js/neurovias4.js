$(document).ready( function(){
  //done [questao_id, 0|1] 0 errado, 1 certo
  var done = [],
  global_questao = {}
  questaoselecionada = 5,
  global_alternativas = [],
  global_array = [],
  num_questoes = 2;

  localStorage.setItem('neuro4_certo', 0)
  localStorage.setItem('neuro4_errado', 0)
  
  $.getJSON("js/casos.json", function(array){
    global_array = array;
    questaoAleatoria(array)
  })

  function questaoAleatoria(array){
    if(verificaQuestionarioCompleto() == false){
      var questao = array[Math.floor(Math.random()*array.length)];

      console.log(questao);
      
      var i = 0,
      retorno = true;

      if(done.length > 0){
        done.forEach(function(el, index){

          i++;

          console.log("verificar", el[0], questao.id);
          
          if(el[0] == questao.id){
            //chama novamente
            retorno = false;
          }

          if(i == done.length){
            //callback
            if (retorno) { 
              //prossegue
              preencherQuestao(questao);
              console.log("prossegue");
            }else{
              //tenta outro
              questaoAleatoria(array);
              console.log("tenta outro");
            }
          }
          
        })
      }else{
        if (retorno) preencherQuestao(questao);
      }

    }else{
      verificaQuestionarioCompleto()
    }
  }

  function selecionaQuestao(id){
    $("#alternativas li").removeClass();
    $("#alternativas li[data-alt="+id+"]").addClass("selected");

    questaoselecionada = id;
  }

  function reset(){
    $("#questao").show();
    $("#alternativas").show();
    $("#confirmar").show();

    $("#resposta").hide();
    $("#explicacao").hide();
    $("#proximo").hide();
  }

  function preencherQuestao(questao){
    //salva objeto questao
    global_questao = questao;

    //reset
    reset();

    //registra questao no done

    console.log(done.length);
    var numeroquestao  =  done.length + 1 ;

    $("#questao").html("<strong>QUESTÃO "+numeroquestao+"</strong><p>"+questao.questao+"</p>");
    $("#alternativas").text("");

    global_alternativas = shuffle(global_questao.alternativas);

    global_alternativas.map(function(alternativa){
      className = (alternativa[0] == questaoselecionada) ? "selected" : "";
      $("#alternativas").append("<li class='"+className+"' data-alt='"+alternativa[0]+"'>"+alternativa[1]+"</li>");
    })

    $("#explicacao").text(questao.explicacao);
    $("#fontes").html("Fonte(s): "+questao.fontes);

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

  function verificaAlternativa(alternativa){
    if(alternativa != 5){
      console.log(alternativa, global_questao.correta);
      if(alternativa == global_questao.correta){
        mostraResultados(true);
      }else{
        mostraResultados(false);
      }
    }
  }

  function mostraResultados(c_e){

    $("#resposta").show().removeClass().text("");
    $("#explicacao").show();

    $("#questao").hide();
    $("#alternativas").hide();
    $("#confirmar").hide();
    $("#proximo").show();

    if(c_e){
      $("#resposta").addClass("green").text("Resposta correta!");
      resultado = 1;
    }else{
      $("#resposta").addClass("red").text("Resposta errada!");
      resultado = 0;
    }

    done.push([global_questao.id, resultado]);
    console.log(done);
    marcarPontuacao(resultado)
    
  }

  function marcarPontuacao(c_e){
    c_e = (c_e == 1) ? true : false;
    console.log(c_e);
    if(c_e){
      localStorage.setItem('neuro4_certo', parseInt($("#score .certo").text())+1);     
      $("#score .certo").text(localStorage.getItem('neuro4_certo'));
    }else{
      localStorage.setItem('neuro4_errado', parseInt($("#score .errado").text())+1);     
      $("#score .errado").text(localStorage.getItem('neuro4_errado'));
    }
  }

  $("#alternativas").on("click", "li", function(){
    selecionaQuestao($(this).attr("data-alt"));    
  })

  $("#confirmar").click( function(){
    verificaAlternativa(questaoselecionada); 
    questaoselecionada = 5; //reset
  })

  $("#proximo").click( function(){
    questaoAleatoria(global_array)
  })

  function mostraFim(){
    $("#questao").hide();
    $("#alternativas").hide();
    $("#resposta").hide();
    $("#explicacao").hide();
    $("#fontes").hide();
    $("#confirmar").hide();
    $("#proximo").hide();
    $("#score").hide();

    $("#fim").show();
    var errado = parseInt(localStorage.getItem("neuro4_errado")),
    certo = parseInt(localStorage.getItem("neuro4_certo")),
    score = (certo/(certo+errado)*10);

    $("#fim").removeClass();
    if(score >= 5){
      $("#fim").addClass("green");
      texto = "Parabéns! Continue estudando e fazendo outras questões para fixar melhor o conteúdo!";
    }else{
      $("#fim").addClass("red");
      texto = "Cuidado! Você não está conseguindo associar os conceitos básicos aprendidos, mas continue estudando, peça ajuda ao seu professor que você chega lá, é questão de prática!";
    }

    $("#fim h3").text(score);
    $("#fim p").text(texto);
  }

  function verificaQuestionarioCompleto(){
    //caso > 5 ativa essa funcao que vê a quantidade de estrelas.
    console.log(done)
    if(done.length >= num_questoes){
      //questionario terminou

      mostraFim();
      return true;
    }else{
      return false;
    }
  }

  $("#logo_back").click(function(){
    window.history.back();
});
})
