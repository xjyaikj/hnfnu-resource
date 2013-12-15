window.addEvent('domready',function(){
    var searchSelect = new Select('searchSelect',[
        {
            name:'站内资源',
            value:'站内资源'
        },
        {
            name:'百度网盘',
            value:'百度网盘'
        }
    ], {
        height:34
    }).animate().addButtonClass('btn-group-left');
    var keyWords = new Input($$('#headSearch input')).addClass('input-group-center');
    var searchButton = new Button($$('button')[1]).addClass('btn-group-right');
    new Tab('subtopic_tab', {
        tabChangeEvent:'mouseover',
        tabTitleCss:'tabTitle subtopic'
    });
    $$('#headMenu a').each(function(item,index) {
        var option = {
            width:120
        };
        if(index == 0){
            new Button(item,option).addClass('btn-group-left').addClass('btn-blue-border');
        } else if(index == 3) {
            new Button(item).addClass('btn-group-right').addClass('btn-blue-border');
        } else {
            new Button(item,option).addClass('btn-group-center').addClass('btn-blue-border');
        }

    });
});