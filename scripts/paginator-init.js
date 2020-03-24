$(document).ready(function () {
  const data1 = [{text: "JavaScript"}, {text:"Swift"}, {text:"Python"}, {text:"Java"}, {text:"C++"}, {text:"Ruby"}, {text:"Rust"}, {text:"Elixir"}, {text:"Scala"}, {text:"PHP"}];
  $("#pager1").motypager({
    norefresh: true,
    pages_shown: 5,
    color:"black",
    disabled_color:"#c8cdd2",
    hover_color:"black",
    cur_bgcolor:"transparent",
    cur_color:"#0195FF",
    first:false,
    last:false,
    prev:true,
    next:true,
    hide_when_only_one:true,
    first_text: "1",
    last_text: function() {
      return data1.length;
    },
    prev_text:"‹",
    next_text:"›",
    url:function(index) {
      return "index_" + index;
    },
    clicked: function(index, update) {
      $('#span1').text(data1[index - 1]['text']);
      update(data1.length);
      console.log(index);
    }
  }).motypager("pageTo", 1);
});
