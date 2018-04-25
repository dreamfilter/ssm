

function changeSelect(originalSelect, purposeSelect) {
    $("#" + originalSelect + " option:selected").appendTo($("#" + purposeSelect));
    $("#" + purposeSelect + " option").removeAttr("selected");
}
function changeSelectAll(originalSelect, purposeSelect) {
    $("#" + originalSelect + " option").appendTo($("#" + purposeSelect));
}
function changeSelectUp(purposeSelect) {
    $("#" + purposeSelect + " option:selected").each(function(){
        var $this=$(this);
        var $prev=$this.prev("option");
        if ($prev.attr("selected")=="selected") {
            return;
        }
        $this.insertBefore($prev)
    });
}
function changeSelectDown(purposeSelect) {
    var list=[];
    $("#" + purposeSelect + " option:selected").each(function(){
       list.push($(this));
    });
    list.reverse();
    for(var i=0;i<list.length;i++){
        var $this=list[i];
        var $next=$this.next("option");
        if ($next.attr("selected")=="selected") {
            return;
        }
        $next.insertBefore($this);

    }
}

