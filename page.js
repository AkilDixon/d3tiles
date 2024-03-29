// PAGES (collection of pages)

function pages(surf) {

    this.pageList = {};
    this.activePage = '';
    this.surface = surf;
    this.mouseX; //current mouse pos.
    this.mouseY;

    this.menuOpen = false; //if any side menu's are open

    this.notiBool = false; //3 menu bools
    this.tileBool  = false;
    this.dashBool  = false;

    this.width = $(document).width();
    this.height = $(document).height();
    this.midWidth = (this.width/2) - 200;
    this.midHeight = (this.height/2) - 200;
    var that = this;

    this.surface.append('<div class="topButtons"></div>'); //top logout/settings button
    this.surface.append('<div class="notifBar">'+
                            '<div class="notifArea"></div>'+
                            '<input id="notifToggle" type="button" value="Expand" />'+
                        '</div>');
    this.surface.append('<div class="tileDock"></div>');
    this.surface.append('<div class="dashDock"></div>');
    this.surface.append('<div class="garbage">TRASH</div>');
    this.surface.css('height', ($(document).height()-16)+'px');

    this.addPage = function(id) {
        that.pageList[id] = new page(that, id);
    };

    this.removePage = function(id) {
        that.pageList[id].removeGroups();
        delete that.pageList[id];
    };

    this.changeToPage = function(id) {
        that.activePage = id;
        that.surface.append('<div id="'+id+'" class="page"></div>');
    };

    this.showNotifBar = function(autoclose) {
        if(!that.menuOpen)
        {
            that.menuOpen = true;
            $('.notifBar').animate({
                top: 0
            }, 200, function(){
                that.menuOpen = false;
            });
        }
        if(autoclose !== undefined && autoclose && !that.notiBool) {
            setTimeout(function(){
                that.hideNotifBar();
            }, 5000); //5 seconds, then close notif
        }
    };
    this.hideNotifBar = function() {
        if(!that.menuOpen)
        {
            that.menuOpen = true;
            $('.notifBar').animate({
                top: -60
            }, 200, function(){
                that.menuOpen = false;
            });
        }
    };
    this.expandNotifBar = function() {
        if(!that.menuOpen)
        {
            that.menuOpen = true;
            that.notiBool = true;
            $('#notifToggle').val('Collapse');
            $('.notifBar').animate({
                height: 500
            }, 200, function(){
                that.menuOpen = false;
            });
        }
    };
    this.collapseNotifBar = function() {
        if(!that.menuOpen)
        {
            that.menuOpen = true;
            that.notiBool = false;
            $('#notifToggle').val('Expand');
            $('.notifBar').animate({
                height: 50
            }, 200, function(){
                that.menuOpen = false;
            });
        }
    };

    this.addAnnon = function(sev, str) {
        var announce = '<div class="anon announc_'+getSev(sev)+'">'+str+'<i class="close_anon"></i></div>';
        $('.notifArea').prepend(announce);
        that.showNotifBar(true);
    };

    this.removeAnnon = function(annon) {
        annon.remove();
    };

    this.showTileDock = function() {
        if(!that.tileBool)
        {
            that.tileBool = true;
            $('.tileDock').animate({
                left: 0
            }, 250, function(){
                that.tileBool = false;
            });
        }
    };
    this.hideTileDock = function() {
        if(!that.tileBool)
        {
            that.tileBool = true;
            $('.tileDock').animate({
                left: -310
            }, function(){
                that.tileBool = false;
            });
        }
    };

    this.showDashDock = function() {
        if(!that.dashBool)
        {
            that.dashBool = true;
            $('.dashDock').animate({
                bottom: 0
            }, 200, function(){
                that.dashBool = false;
            });
        }
    };
    this.hideDashDock = function() {
        if(!that.dashBool)
        {
            that.dashBool = true;
            $('.dashDock').animate({
                bottom: -85
            }, function(){
                that.dashBool = false;
            });
        }
    };

    $('div.notifBar').on("mouseleave", function() {
        setTimeout(function(){
            if(!that.notiBool)
                that.hideNotifBar();
        }, 1000);
    });
    $('div.tileDock').on("mouseleave", function() {
        setTimeout(function(){
            that.hideTileDock();
        }, 1000);
    });
    $('div.dashDock').on("mouseleave", function() {
        setTimeout(function(){
            that.hideDashDock();
        }, 1000);
    });

    $('#notifToggle').click(function(){
        if (!that.notiBool)
            that.expandNotifBar();
        else
            that.collapseNotifBar();
    });

    $(this.surface).on('click', '.close_anon', function() {
        that.removeAnnon($(this).parent());
    });

    this.surface.on('mousemove', function(e) {
        that.mouseX = e.clientX;
        that.mouseY = e.clientY;

        if(that.mouseX > that.midWidth && that.mouseX < that.midWidth + 400)
        {
            if(that.mouseY > that.height - 75)
                that.showDashDock();

            else if(that.mouseY <= 50)
                that.showNotifBar();
        }

        if(that.mouseY > that.midHeight && that.mouseY < that.midHeight + 400)
        {
            if(that.mouseX <= 75)
                that.showTileDock();
        }
    });
}

//page (indivial page)


function viewPage(id)
{
    var html = "<h1 style='left: 0; line-height: 200px;  position: absolute; text-align:center; top 50%; width: 100%'>"+id+"</h1>";
    $('#tileable').append(html);
}


function page(par, id) {
    this.id = id;
    this.parent = par;
    this.groupList = {};
    var that = this;

    var html = "<button onclick='viewPage("+id+")'style='height:50px; width:50px; margin-left:5px'>"+id+"</button>";
    $('.dashDock').prepend(html);


    this.addGroup = function(id) {
        that.groupList[id] = new group(that, id);
        if(that.parent.activePage == that.id)
            $('#'+that.id).append('<div id="'+id+'"></div>');
    };
    this.removeGroup = function(id) {
        that.groupList[id].removeTiles();
    };
    this.removeGroups = function() {
        for(var iter in that.groupList) {
            that.groupList[iter].removeTiles();
            delete that.groupList[iter];
        }
    };
}

//group (indivial group)

function group(par, id) {
    this.id = id;
    this.parent = par;
    this.dragging = false;
    this.data = {};
    this.filters = {};
    this.settings = {};
    this.tileList = {};

    var that = this;

    this.addData = function(data) {
        that.data = data;
    };

    this.addFilters = function(filters) {
        that.filters = filters;
    };

    this.addSettings = function(settings) {
        that.settings = settings;
    };

    this.addTile = function(id, x, y) {
        console.log(that, id, x, y);
        that.tileList[id] = new tile(that, id, x, y);
        if (that.parent.parent.activePage == that.parent.id)
            console.log("Need to draw tile");
    };

    this.removeAllTiles = function() {
        console.log("Remove all tiles here");
    };

    this.removeTile = function(id, tile) {
        $('#'+that.tileList[tile].id).remove();
        delete that.tileList[tile];
    };
}

/* Tile Object */

function tile(parent, id, x, y) {
    this.id = id;
    this.parent = parent;
    this.size = [x, y];
    this.chart = null;
    this.filters = {};
    this.settings = {};

    var that = this;
    var html = "<div id='"+this.id+"' class='tile tile_"+x+"x"+y+"'>";
    $('#'+this.parent.id).append(html);

    $.get('tiles/tile_'+x+'x'+y+'.html', function(result) {
        $('#'+id).append(result);
        that.drawChart();
    });

    $('#'+this.id).draggable({
        opacity: 0.35,
        snap: ".tile",
        snapMode: 'outer',
        containment: "#tileable",
        handle: '.setting_span',
    });

    $('#'+this.id).on('dragstart', function(e, ui) { //moving tile around
        $('.garbage').addClass('visible');
        groups.dragging = true;
    });

    $('#'+this.id).on('dragstop', function(e, ui) { //moving tile around
        //check if over trash can
        var trash = $('.garbage');
        if (mouseX >= trash.offset().left && mouseX <= trash.offset().left + trash.outerWidth() &&
            mouseY >= trash.offset().top && mouseY <= trash.offset().top + trash.outerHeight()) {
            groups.removeTile(that.parent, that.id);
        }

        $('.garbage').removeClass('visible');
        groups.dragging = false;
    });

    $('#'+this.id).on('click', '.save_btn', function() {
        $(this).closest('.back').find('.contents').children().each(function() {
            var which = 'settings';
            if ($(this).hasClass('settings'))
                which = 'settings';
            else if ($(this).hasClass('filter'))
                which = 'filters';
            $(this).children().each(function() {
                var value = false;
                var found = false;
                //grab each setting
                if ($(this).context.localName == 'input') {
                    switch($(this).attr('type')) {
                        case 'checkbox':
                            if($(this).is(":checked"))
                                value = true;
                            else
                                value = false;
                        break;
                        case 'radio':
                            if($(this).is(":checked"))
                                value = true;
                            else
                                value = false;
                        break;
                        case 'text':
                        case 'number':
                        case 'range':
                        case 'input':
                            if($(this).val() != '')
                                value = $(this).val();
                        break;
                    }
                    found = true;
                }
                else if ($(this).context.localName == 'textarea') {
                    if($(this).val() != '') {
                        value = $(this).val();
                        found = true;
                    }
                }
                else if ($(this).context.localName == 'select') {
                    if($(this).val() != '') {
                        value = $(this).val();
                        found = true;
                    }
                }
                if (found) {
                    if (which == 'settings')
                        that.settings[$(this).attr('setFilt')] = value;
                    else
                        that.filters[$(this).attr('setFilt')] = value;
                }
            });
        });
        that.drawChart();
    });

    this.addFilters = function(filters) {
        this.filters = filters;
    };

    this.addSettings = function(settings) {
        this.settings = settings;
    };

    this.addTitle = function(title) {
        this.title = title;
    };

    this.generate = function(options, settings, filters) {
        var stuff = {};
        if("data" in options) {
            stuff.data = {columns: options.data};
        }
        if("legend" in settings) {
            stuff.legend = {show: settings.legend};
        }
        if("size" in options) {
            stuff.size = {width: options.size[0], height: options.size[1]};
        }
        if("bindto" in options) {
            stuff.bindto = options.bindto;
        }
        if("type" in settings) {
            stuff.data.type = settings.type;
        }
        if("subchart" in settings) {
            stuff.subchart = {show: settings.subchart};
        }
        if("zoom" in settings) {
            stuff.zoom = {enabled: settings.zoom};
        }
        if("min" in filters && "max" in filters) {
            stuff.axis = {
                y: {
                    max: parseInt(filters.max),
                    min: parseInt(filters.min),
                }
            };
        }
        stuff.data.groups = [['data1', 'data2']];
        chart = c3.generate(stuff);
    };

    this.drawChart = function() {
        var settings = that.parent.settings;
        var filters = that.parent.filters;
        var chart = {};
        chart.bindto = '#'+id+' > .front > .contents';
        chart.type = 'area';
        chart.size = [150 * this.size[0], 150 * this.size[1]];
        chart.data = that.parent.data;
        this.generate(chart, mergeObjects(that.settings, settings), mergeObjects(that.filters, filters));
    };
}

//merge Objects, tile > group precendance
function mergeObjects(tileObj, groupObj) {
    if (groupObj == undefined)
        groupObj = {};
    for(var iter in tileObj)
        groupObj[iter] = tileObj[iter];
    return groupObj;
}

function getSev(num) {
    switch(num) {
        case 1:
            return 'severe';
        break;
        case 2:
            return 'warning';
        break;
        case 3:
            return 'info';
        break;
        case 4:
            return 'success';
        break;
        case 5:
        default:
            return 'default';
    }
}

var data = [
    ['data1', 20, 200, 150, 200, 120, 240, 40, 25, 105, 410, 100, 90],
    ['data2', 150, 59, 50, 260, 700, 10, 70, 60, 10, 70, 0, 200]
];

var pages;

$( document ).ready(function() {

    pages = new pages($('#tileable'));
    var counter = 0;
    var html = "<button id='addAPage' style='height:50px; width:50px; margin-left:5px'>+</button>";
    $('.dashDock').append(html);
    $('#addAPage').click(function(){
        counter = counter + 1;
        pages.addPage(counter);
        pages.changeToPage(counter);
        pages.pageList[counter].addGroup('firstGroup');
        pages.pageList[counter].groupList['firstGroup'].addData(data);
        pages.pageList[counter].groupList['firstGroup'].addTile('newTile', 3, 2);
    })

});

$(window).resize(function(){
    page.width = $(window).width();
    page.height = $(window).height();
    page.midWidth = (page.width/2) - 200;
    page.midHeight = (page.height/2) - 200;
});