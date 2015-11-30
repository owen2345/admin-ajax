jQuery(function(){
    /**
     * small camaleon ajax requester (alternative to turbolinks)
     * support for links and forms by adding the class: cama_ajax_request. Also you can add the class in a div to apply this for all inner links
     * data-before-callback: is an attribute where you can put the function name called before start request.
     *  Also this can return false to stop continuing
     * data-after-callback: is an attribute where you can put the function name called after request was completed
     * data-error-callback: is an attribute where you can put the function name called when a error occurred in the request
     */
    var do_ajax_request = function(){
        var link = $(this);
        var url = link.attr("href") || link.attr("action");
        var method = (link.attr("method") || link.attr("data-method") || "get").toLowerCase();
        if(!url || url == "#") return true;

        var before = link.attr("data-before-callback");
        var after = link.attr("data-after-callback");
        var error = link.attr("data-error-callback");
        var flag = true; if(before) flag = window[before](link); if(flag == false) return; // verify cancel action on before callback
        try{var onunload = window.onbeforeunload(); if(onunload && !confirm(onunload)) return false; }catch(e){}

        if(link.attr("data-confirm") && !confirm(link.attr("data-confirm"))) return false; // confirm message

        var data = {cama_ajax_request: true};
        var save_cache = method.toLowerCase() == "get" ? true : false;
        if(save_cache) save_cache = !((link.attr("rel")||"").toLowerCase() == "nofollow" || link.attr("data-confirm"));

        if(link.is("form")){ // form element
            link.prepend("<input name='cama_ajax_request' value='true' type='hidden'>");
            data = link.serialize();
        }else if(method != "get"){ //delete | put method fix
            data[$.rails.csrfParam()] = $.rails.csrfToken();
            data["_method"] = method;
            method = "post";
        }

        var state_data = {data: data, url: url, method: method, after: after, before: before, error: error};
        // save as cache this url
        if(save_cache) history.pushState(state_data, '', url);
        $(document).add(link).trigger("page:before-load", state_data, link);
        do_request(state_data, link);
        return false;
    }

    // execute the ajax request
    function do_request(state_data, link){
        showLoading();
        var panel = $("#admin_content").fadeTo(0, 0.5);
        $.ajax({
            type: state_data.method || "get",
            url: state_data.url,
            data: state_data.data || {cama_ajax_request: true},
            success: function(res){
                if(res.search("<!DOCTYPE html>") == 0){
                    $.fn.alert({title: I18n("msg.system_error", "System Error"), type: 'error', content: I18n("msg.internal_error_refresh", "An error occurred to load the page, please reload.")});
                    return;
                }
                window.onbeforeunload = null;
                panel.replaceWith(res);

                // do callback
                if(state_data.after) window[state_data.after](link, res);
                $(document).trigger("page:changed", res, link);

                hideLoading();

                // check redirected and save
                var res_url = $("#admin_content").fadeTo("slow", 1).attr("data-url").replace(/(\&|\?)cama_ajax_request=redirect/, "");
                if(res_url) history.pushState({url: res_url}, '', res_url);

                // fix after page changed: Hide all visible modals
                $("body > .modal").modal("hide");

            }, error: function(e, status, msg){
                $.fn.alert({type: "error", content: msg});
                if(state_data.error) window[state_data.error](link, arguments);
            }
        });
    }

    function add_click_events(){
        // add events to specific elements
        $("body").on("submit", "form.cama_ajax_request", do_ajax_request);
        $("body").on("click", "a.cama_ajax_request, .cama_ajax_request:not(form) a", do_ajax_request);
        $("body").on("click", "#admin_content > .breadcrumb a", do_ajax_request);

        // sidebar active link marker
        $("#sidebar-menu a").bind("page:before-load", function(){
            if(!$(this).parent().hasClass("xn-openable")){
                var li = $(this).closest("li").addClass("active");
                $("#sidebar-menu li").not(".xn-openable").not(".treeview").not(li).removeClass("active");
            }
        });

    }

    add_click_events();
    // save the current path
    try{ history.replaceState({url: window.location.href}, null, window.location.href); }catch(e){}

    //back or forward history
    // trigger before reload page
    window.addEventListener('popstate', function(e) {
        if(e.state){
            $(document).trigger("page:before-reload", e.state);
            do_request(e.state);
        }
    });

    // permit to refresh current page
    // trigger before reload page
    $(document).bind("page:refresh", function(){
        $(document).trigger("page:before-reload", window.history.state);
        do_request(window.history.state);
    });
});