/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var language_id = 1;
var languages = Boolean(localStorage.language) ? JSON.parse(localStorage.language) : [120];
var language = Boolean(localStorage.menu_language) ? localStorage.menu_language : "uzbek";
var selected_surah = 1;
var selected_title;
var bookmarklist = Boolean(localStorage.bookmarklist) ? JSON.parse(localStorage.bookmarklist) : {};
var playpositions = Boolean(localStorage.playpositions) ? JSON.parse(localStorage.playpositions) : {};
var deviceready;
var lastdayopen = Date.now();
var au;
var aus;
var dialog;

var lang = {
    english: {
        home_title: "Surah List",
        settings: "Settings",
        about: "About",
        main_page: "Select a Surah",
        settings_page: "Settings",
        menu_language: "Menu Language",
        text_settings: "Text Settings",
        comments: "Comments",
        about_page: "From the Author",
        surah_title: "Surah: ",
        loading: "Loading...",
        data_load_error_message: "Retry?",
        dle_title: "Error loading data",
        toast_disabled: "Option disabled",
        close_app: "Do you want to close the app?",
        close_app_title: "Exit App",
        adpop: "Click to view ads. Check out for more",
        playposition_text: "Surah play position stored",
        close_app_buttons: ["Yes", "No"],
        first_message: ["Version updates", "Offline mode for text(after each first access)<br>Audio player<br>Continue from the last position of text and audio"],
        greeting: "Assalaamu alaykum",
        bookmark_found_message: "Bookmark found at verse: ",
        chapter_loaded: "Now this chapter is available offline. You can download any other chapter the same way",
        choose_chapter: "Click a title to open a chapter",
        gr_text: "Dear brothers and sisters, I have tried to make the application easy to use as much as I could and I am continually working on improving it. <br>My goal is to bring high quality products to spread the truth. <br>The application is the result of knowledge and hard work of a person. <br> Your support in any form is highly appreciated and will surely be rewarded accordingly by Allah Almighty. <br> Please, share and purchase to support the cause."
    },
    uzbek: {
        home_title: "Suralar",
        settings: "Sozlamalar",
        about: "Muallifdan",
        main_page: "Surani Tanlang",
        settings_page: "Dastur Sozlamalari",
        menu_language: "Menyu Tili",
        text_settings: "Matn Sozlamalari",
        comments: "Izohlar",
        about_page: "Muallifdan",
        surah_title: "Sura: ",
        loading: "Yuklash...",
        data_load_error_message: "Yana urinib ko`rasizmi?",
        dle_title: "Xatolik",
        toast_disabled: "Vaqtinchalik o`chirilgan",
        close_app: "Dasturdan chiqmoqchimisiz?",
        close_app_title: "Chiqish",
        adpop: "Reklama ko`rish - dastur muallifiga minnatdorchilik",
        close_app_buttons: ["Ha", "Yo`q"],
        playposition_text: "Xotiraga joylandi",
        first_message: ["Versiya yangiliklari", "Avtonom rejim<br>Audio player<br>Matn va audio uchun kelgan joyidan davom etish"],
        greeting: "Assalomu alaykum",
        bookmark_found_message: "Xat cho`pli oyat: ",
        chapter_loaded: "Ofarin! <br>Bu surani endi avtonom tarzda har doim o`qish va qolgan suralarni ham shu tarzda yuklab olish mumkin",
        choose_chapter: "Surani tanlash uchun nomini bosing",
        gr_text: "Qadrli muxlislar, men bu dasturni sizga foydalanish qulay bo`lishi uchun baholi qudrat harakat qildim va bunda davom etmoqdaman. Maqsadimiz yuqori sifatli dasturlar taklif qilish va haqiqatni shu yo`l bilan yetkazish. <br>Dastur insonning mehnati, bilimi va harakati evaziga keladigan narsadir. Uni haqqini qo`lingizdan kelganicha qo`llab quvvatlash va tanishlaringizga ham ulashish orqali ado qiling. <br> Olloh Taolo sizdan va bizdan har bir xayrli amalimizni qabul qilsin."
    },
    russian: {
        home_title: "Суры",
        settings: "Установки",
        about: "О программе",
        main_page: "Выберите Суру",
        settings_page: "Установки",
        menu_language: "Язык меню",
        text_settings: "Текстовые установки",
        comments: "Комментарии",
        about_page: "От Автора",
        surah_title: "Сура: ",
        loading: "Загрузка...",
        data_load_error_message: "Повторить попытку?",
        dle_title: "Ошибка при загрузке",
        toast_disabled: "Опция отключена",
        close_app: "Вы хотите закрыть приложение?",
        close_app_title: "Выход",
        adpop: "Посмотрите объявление. Средство благодарности автору",
        close_app_buttons: ["Да", "нет"],
        playposition_text: "сохранена последняя позиция",
        first_message: ["Новости версии", "Автономный режим<br>Аудиоплеер<br>Продолжить с последней позиции текста и аудио"],
        greeting: "Ассаляму аляйкум",
        bookmark_found_message: "Закладка найдена на стихе: ",
        chapter_loaded: "Теперь эту суру можно читать автономно, а остальные суры могут быть загружены таким же образом",
        choose_chapter: "Нажмите, чтобы выбрать суру",
        gr_text: "Дорогие братья и сестры, я постарался чтобы эта программа стала наиболее удобна в пользовании и все еще продолжаю работу. <br>Моя цель расспространить верный путь посредством своей работы.<br>Приложение является результатом знаний и упорного труда человека. <br>Аллах Субханаху ва Таала вознаградит каждого за вклад обязательно. Присоединитесь же своим.<br>Пожалуйста поделитесь с друзьями и приобретайте, чтобы я мог дальше, лучше и больше писать."
    }
};

ons.ready(function () {
    console.log("Onsen UI is ready!");


    if (Boolean(localStorage.language))
    {
        language = localStorage.menu_language;
    } else {

        localStorage.menu_language = language;
    }
    document.querySelector('#navigator').pushPage("home.html");
    document.addEventListener("deviceready", function () {
        window.FirebasePlugin.getToken(function (token) {
            // save this server-side and use it to push notifications to this device
            console.log("Device ready token", token);
            deviceready = true;
        }, function (error) {
            console.error(error);
        });

        // Get notified when a token is refreshed
        window.FirebasePlugin.onTokenRefresh(function (token) {
            // save this server-side and use it to push notifications to this device
            console.log("Refresh to get new token: " + token);
        }, function (error) {
            alert(error);
        });

        // Get notified when the user opens a notification
        window.FirebasePlugin.onNotificationOpen(function (notification) {
            console.log(JSON.stringify(notification));
            ons.notification.alert(notification.body);
        }, function (error) {
            console.error(error);
        });
        initAd();

        for (i in languages)
        {
            languages[i] = JSON.parse(languages[i]);
        }

        ons.setDefaultDeviceBackButtonListener(function (event) {
            ons.notification.confirm({
                message: lang[language].close_app,
                title: lang[language].close_app_title,
                buttonLabels: lang[language].close_app_buttons,
                animation: 'default', // or 'none'
                primaryButtonIndex: 1,
                cancelable: true,
                callback: function (index) {
                    // -1: Cancel
                    // 0-: Button index from the left
                    console.log(index, "index");
                    if (index == 0) { // OK button
                        navigator.app.exitApp(); // Close the app
                    }
                }
            });


        });
    }, false);
});


//pages
document.addEventListener('init', function (event) {
    var page = event.target;
    console.log(page.id); // can detect which page
    //
    //resetDate();

    switch (page.id)
    {
        case "titles":
            searchByAyahFlag = false;
            console.log("surah title list");
            get_surah_names();
            //show only once
            if (!Boolean(localStorage.first_open))
            {
                ons.notification.alert({
                    message: lang[language].first_message[1],
                    // or messageHTML: '<div>Message in HTML</div>',
                    title: lang[language].first_message[0],
                    buttonLabel: 'OK',
                    animation: 'default', // or 'none'
                    // modifier: 'optional-modifier'
                    callback: function () {
                        // Alert button is closed!
                        localStorage.first_open = "done";
                        showPopover(document.getElementsByClassName("ayah_id")[0]);
                        document.getElementById("poptext").innerHTML = lang[language].choose_chapter;
                    }
                });
            }

            break;
        case "randomayah":
            get_by_randomsuraid();
            document.querySelector("audio").addEventListener("play", play_start);
            document.querySelector("audio").addEventListener("pause", play_paused);
            break;
        case "surah_text":
            searchByAyahFlag = false;
            select_surah();
            document.querySelector("audio").addEventListener("play", play_start);
            document.querySelector("audio").addEventListener("pause", play_paused);
            if (deviceready) {

            }
            break;
        case "settings":
            searchByAyahFlag = false;
            set_settings();
            if (deviceready)
            {

            }
            break;
        case "about":
            searchByAyahFlag = false;            
            set_about_page();
            if (deviceready)
            {

            }

            break;
    }
});

function set_about_page() {

    document.querySelector("#ppb").innerHTML = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">' +
            '<input type="hidden" name="cmd" value="_s-xclick">' +
            '<input type="hidden" name="hosted_button_id" value="S2DS9ET9PCZF2">' +
            '<table>' +
            '<tr><td><input type="hidden" name="on0" value="Himmatingiz">Himmatingiz</td></tr><tr><td><select name="os0">' +
            '<option value="Himmat 1">Himmat 1 $1.00 USD</option>' +
            '<option value="Himmat 3">Himmat 3 $3.00 USD</option>' +
            '<option value="Himmat 7">Himmat 7 $7.00 USD</option>' +
            '<option value="Himmat 19">Himmat 19 $19.00 USD</option>' +
            '<option value="Himmat 99">Himmat 99 $99.00 USD</option>' +
            '</select> </td></tr>' +
            '</table>' +
            '<input type="hidden" name="currency_code" value="USD">' +
            '<input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online!">' +
            '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">' +
            '</form>';
    document.querySelector("#muallifdantitle").innerHTML = lang[language].about_page;
    document.querySelector("#greetingtitle").innerHTML = lang[language].greeting;
    document.querySelector("#greetingtext").innerHTML = lang[language].gr_text;
    document.querySelector("#muallifdantitle").innerHTML = lang[language].about;

}

function set_settings()
{
    //document.querySelector("#settingstitle").innerHTML = lang[language].settings;
    document.querySelector("#appsettingstitle").innerHTML = lang[language].settings_page;
    document.querySelector("#menulangtitle").innerHTML = lang[language].menu_language;
    document.querySelector("#textsettitle").innerHTML = lang[language].text_settings;
    document.querySelector("ons-list-item[lang-id='" + language + "']").querySelector("ons-radio").checked = true;



    //$(".qavs_ichi").hide();
    try {
        languages = JSON.parse(localStorage.language);
    } catch (e)
    {
        localStorage.language = JSON.stringify([120]);
        languages = JSON.parse(localStorage.language);
    }

    menuitems = $(".lang");
    for (i = 0; i < languages.length; i++)
    {
        for (k = 0; k < menuitems.length; k++)
        {
            if (menuitems[k].getAttribute("db_id") == languages[i])
            {
                menuitems[k].checked = true;
            }
        }
    }
}





function select_surah(event) {

    izoh_data = {action: "izohsiz_text_obj", surah_id: selected_surah, database_id: languages};

    if (check_store(selected_surah)) {
        get_by_suraid();
    } else {
        ajax(izoh_data);
    }
    aus = document.createElement("source");
    au = document.querySelector("#surahaudio");
    au.innerHTML = "";
    aus.src = "https://mobilproject.github.io/furqon_web_express/by_sura/" + selected_surah + ".mp3";
    au.appendChild(aus);

    $("#sura_title").text(selected_surah + ", " + selected_title);

    $(document).off().on('swiperight', function (event) {
        console.log("SWIPE");
        if ($('#surah_text').has(event.target).length > 0) {
            console.log('Swipe left is detected.');
            setTimeout(function () {
                document.querySelector('#navigator').popPage();
            }, 100);

        }

    });
}


function ajax(d)
{
    $.ajax({
        url: "https://created.link/php/ajax_quran_test.php",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: d,
        beforeSend: function (xhr) {
            //document.querySelector("#loadingtitle").innerHTML = lang[language].loading;
            $('#loading_circle').show();
        },
        success: function (data) {
            document.querySelector('#loading_circle').hide();
            if (data.indexOf("chapterId") > 0)
            {
                var data = JSON.parse(data);

                for (i in data)
                {

                    try {
                        data[i] = JSON.parse(data[i]);
                    } catch (e) {
                        input_title_data(data);
                    }
                }
                input_title_data(data);

            } else if (data.indexOf("VerseID") >= 0)
            {
                var data = JSON.parse(data);
                for (i in data)
                {
                    data[i] = JSON.parse(data[i]);
                }
                show_surah_content(data);

            }

        },
        error: function ()
        {
            ons.notification.confirm({
                message: lang[language].data_load_error_message,
                // or messageHTML: '<div>Message in HTML</div>',
                title: lang[language].dle_title,
                buttonLabel: lang[language].close_app_buttons,
                animation: 'default', // or 'none'
                primaryButtonIndex: 2,
                cancelable: true,
                // modifier: 'optional-modifier'
                callback: function (index) {
                    // Alert button is closed!
                    document.querySelector('#loading_circle').hide();
                    switch (index)
                    {
                        case - 1:
                            //cancel
                            break;
                        case 0:
                            console.log("yes");
                            ajax(izoh_data);
                            break;
                        case 1:
                            console.log("no");
                            break;
                    }

                }
            });
        }
    });
}
var hideDialog = function (id) {
    document
            .getElementById(id)
            .hide();
};
function audio_dialog(d)
{
    switch (d)
    {
        case "dialog":

            break;
        case "stop":
            if (au)
            {
                au.load();
            }
            break;
        case "play":
            if (au)
            {
                aus.src = "https://mobilproject.github.io/furqon_web_express/by_sura/" + selected_surah + ".mp3";
                au.play();
                console.log(au);
            } else {
                au = document.getElementById("audio");

                aus.src = "https://mobilproject.github.io/furqon_web_express/by_sura/" + selected_surah + ".mp3";
                au.appendChild(aus);
                au.play();
            }
            break;
        case "pause":
            if (au) {
                au.pause();
            }
            break;

    }

}

function set_langauge()
{
    if (event.currentTarget.querySelector("ons-radio").disabled)
    {
        ons.notification.toast(lang[language].toast_disabled, {timeout: 500, animation: "fall"});
    } else {
        language = event.currentTarget.getAttribute("lang-id");
        localStorage.menu_language = language;
        console.log(event.currentTarget);
    }
}
var revorder;
function display_surah_names(data)
{
    data.sort(function (a, b) {
        //console.log(a, b);
        //Number(a.orderNo) - Number(b.orderNo)
        if ( Number(a.orderNo) < Number(b.orderNo)){
            return -1;
        }
        if (Number(a.orderNo) > Number(b.orderNo)){
            return 1;
        }
        return 0;        
    });
    
    var kk=0;
    revorder = document.createElement("div");
    for (i=0; i<data.length; i++)
    {        
        if(i%2==0){
            var oli = document.createElement("ons-list-item");
            oli.setAttribute("tappable", "true");
            oli.setAttribute("id", "sura-" + data[i].chapterId);            
            oli.setAttribute("surahNo", data[i].chapterId);
            oli.setAttribute("onmouseup", "show_surah(event)");
            oli.setAttribute("class", "list-item");            
        
            
            var dlil = document.createElement("div");
            var or_a = document.createElement("ons-row");
            var oc_a = document.createElement("ons-col");
            var sai = document.createElement("span");
            var dcal = document.createElement("div");
            var dcalrow = document.createElement("ons-row");
            var dcalocol = document.createElement("ons-col");
            var or_u = document.createElement("ons-row");
            var oc_u = document.createElement("ons-col");
            dlil.setAttribute("class", "left list-item__left");
            sai.setAttribute("class", "ayah_id");
            dcal.setAttribute("class", "center arabic list-item__center");
            oli.appendChild(dlil);
            dlil.appendChild(or_a);
            or_a.appendChild(oc_a);
            oc_a.appendChild(sai);
            oli.appendChild(dcal);
            dcal.appendChild(dcalrow);
            dcalrow.appendChild(dcalocol);
            
            or_u.appendChild(oc_u);
            oli.appendChild(or_u);
        }    
            if(data[i]["languageNo"] == 1)
            {
                dcalocol.textContent = data[i].title;
                sai.textContent = data[i].chapterId;                
            }else{                
                oc_u.textContent = data[i].title;
                oli.setAttribute("title", data[i].title);
                
            }
            
        
        try {
                document.getElementById("main_table").appendChild(oli);
            } catch (e) {
            }
        
    
        
        
            
            
            
            
            
    
            
        }
   
    
    /*console.log(data);
    for (i in data)
    {

        if (data[i]["languageNo"] == 1)
        {
            var oli = document.createElement("ons-list-item");
            oli.setAttribute("tappable", "true");
            oli.setAttribute("id", "sura-" + data[i].chapterId);
            oli.setAttribute("title", data[i].title);
            oli.setAttribute("surahNo", data[i].chapterId);
            oli.setAttribute("onmouseup", "show_surah(event)");
            oli.innerHTML = '<div class="left"><ons-row><ons-col><span class="ayah_id">' + data[i].chapterId + '</span></ons-col></ons-row></div><div class="center arabic"><ons-row><ons-col>' + data[i].title + '</ons-col></ons-row></div>';
        } else if (data[i]["languageNo"] != 1 && data[i].title != undefined) {
            oli.innerHTML += "<ons-row><ons-col>" + data[i].title + "</ons-col></ons-row>";
            try {
                revorder.appendChild(oli);
            } catch (e) {
                console.warn(e);
            }
        }
    }*/
    if (deviceready)
    {
    }
    document.querySelector("#selectsurahtitle").innerHTML = lang[language].home_title;
}
document.addEventListener('prechange', function (event) {
    document.getElementById("main_table_revelation").innerHTML = revorder.innerHTML;
});

function show_surah()
{
    selected_surah = event.currentTarget.getAttribute("surahno");
    selected_title = event.currentTarget.getAttribute("title");
    console.log(selected_surah, "selected_surah");
    //fn.load("surah.html");
    document.querySelector('#navigator').pushPage('surah.html');
}


function set_languages(event)
{
    var ar = [];
    $(".lang").each(function () {
        if (this.checked)
        {
            console.log(event.target);
            ar.push(Number(this.getAttribute("db_id")));
        }
        localStorage.language = JSON.stringify(ar);
        languages = ar;

        for (i in languages)
        {
            languages[i] = JSON.parse(languages[i])
        }
    });
}


var showPopover = function (target) {
    document
            .getElementById('popover')
            .show(target);

};

var hidePopover = function () {
    document
            .getElementById('popover')
            .hide();
    //showInterstitialFunc();
};

$(window).ready(function () {

    document.querySelector('ons-navigator').addEventListener('prepop', function () {
        console.log("prepop");
        try {
            $("#surahaudio")[0].pause();
        } catch (e) {

        }
    });

    document.querySelector('ons-navigator').addEventListener('postpop', function () {
        //console.log("postpop", event.enterPage);
        try {

        } catch (exception) {
            console.log(exception);
        }

        switch (event.enterPage.getAttribute("id"))
        {
            case "titles":
                //console.log("surah title list");
                try {
                    document.querySelector("#selectsurahtitle").innerHTML = lang[language].home_title;
                } catch (exception) {

                }

                break;
            case "surah_text":

                break;
            case "randomayah":
                console.log("random ayat");
                //get_by_randomsuraid();

                break;
            case "settings":

                break;
            case "about":

                break;
        }
    });

    //ADD EVENT LISTENERS
    document.querySelector("body").addEventListener("keyup", nextAyat);

});
current_verse = 1;
var nextAyat = function () {
    console.log(event.keyCode);
    current_ayah_no = Number($("#ayah-number").text());
    
    if (event.keyCode == 37 && current_ayah_no > 1) {
        current_ayah_no--;
    } else if (event.keyCode == 39 && current_ayah_no < big_data.length) {
        current_ayah_no++;
    }
    if (event.keyCode == 37 || event.keyCode == 39 || searchByAyahFlag) {
        current_verse = current_ayah_no;
        $("#ayah-number").text(current_ayah_no);
        //document.querySelector("audio").currentTime * 1000;
        $("#random-ayah-text").fadeOut(500, function () {
            $("#random-ayah-text").html(hide_comments(Number(current_verse) - 1)).fadeIn(500);
        });
        //console.log(big_data[Number(current_ayah_no) - 1].audio_at, current_verse);
        try {
            //document.querySelector("audio").currentTime = big_data[Number(current_ayah_no) - 1].audio_at;
            addAudioSynchData();
        } catch (e) {
            addAudioSynchData();
        }
    }
}

function openTitles()
{
    document.querySelector('#navigator').pushPage('titles.html');
}
function openRandomAyah()
{
    document.querySelector('#navigator').pushPage('randomayah.html');
}
function openFavourites()
{
    document.querySelector('#navigator').pushPage('favourites.html');
}
function openSearch()
{
    document.querySelector('#navigator').pushPage('search.html');
}
function openAyah()
{
    document.querySelector('#navigator').pushPage('oneayah.html');
}
function openSetting()
{
    document.querySelector('#navigator').pushPage('settings.html');
}
function openAbout()
{
    document.querySelector('#navigator').pushPage('about.html');
}
function popPage()
{

    document.querySelector('#navigator').popPage();
}

function restore_bookmark()
{



    try {
        set_bookmarks();
    } catch (e) {

    }


}
function ayah_click(event) {

    console.log($(event.currentTarget).find(".qavs_ichi").css("display"));
    if ($(event.currentTarget).find(".qavs_ichi").css("display") == "inline")
    {

        $(event.currentTarget).find(".qavs_ichi").hide();
        $(event.currentTarget).find(".zmdi-code-setting").show();
        //event.currentTarget.querySelector("ons-speed-dial").hideItems();
        //$(event.currentTarget).find(".ayah_id").hide();
    } else {
        //event.currentTarget.showExpansion();
        $(event.currentTarget).find(".qavs_ichi").show();
        $(event.currentTarget).find(".zmdi-code-setting").hide();
        //event.currentTarget.querySelector("ons-speed-dial").showItems();
        //$(event.currentTarget).find(".ayah_id").css("display", "block");


    }
    console.log($(event.currentTarget).find(".expandable-content").eq(0).is(":visible"));

}
function set_bookmarks()
{
    if (bookmarklist[selected_surah])
    {
        if ($("#ayah-" + selected_surah + "-" + bookmarklist[selected_surah]).length > 0)
        {
            $('#loading_circle').css("display", "none");
            console.log("surah and ayah", selected_surah, bookmarklist[selected_surah]);
            document.querySelector("#ayah-" + selected_surah + "-" + bookmarklist[selected_surah]).scrollIntoView();
            $("#ayah-" + selected_surah + "-" + bookmarklist[selected_surah])[0].getElementsByClassName("zmdi")[0].classList.remove("zmdi-bookmark-outline");
            $("#ayah-" + selected_surah + "-" + bookmarklist[selected_surah])[0].getElementsByClassName("zmdi")[0].classList.add("zmdi-bookmark");
            var sectimer = setTimeout(function () {
                console.log("sttt");

            }, 300);
            ons.notification.toast(lang[language].bookmark_found_message + bookmarklist[selected_surah], {timeout: 1000, animation: 'fall'});
        } else {
            console.log("settimeout");
            var listitems = $(".list-item");
            listitems[listitems.length - 1].scrollIntoView({behavior: "instant"});
            setTimeout(function () {
                set_bookmarks();
            }, 300);
        }
    } else {
        document.querySelector('#loading_circle').hide();
    }

    if (playpositions[selected_surah])
    {
        $("#surahaudio")[0].currentTime = playpositions[selected_surah] - 5;
    }


}
function share_ayah(event)
{
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
        message: event.currentTarget.parentElement.parentElement.parentElement.getElementsByClassName("oyatmatni")[0].innerText + " (Qur'an, " + event.currentTarget.getAttribute("chapter_no") + ":" + event.currentTarget.getAttribute("ayah_no") + ");",
        subject: 'the subject', // fi. for email

    };

    var onSuccess = function (result) {
        console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
        console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    };

    var onError = function (msg) {
        console.log("Sharing failed with message: " + msg);
    };

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}
function save_playposition()
{
    var playpos = Math.floor(document.querySelector("#surahaudio").currentTime);
    console.log("save_playposition", selected_surah, playpos);

    playpositions[Number(selected_surah)] = Number(playpos);
    localStorage.playpositions = JSON.stringify(playpositions);
    ons.notification.toast(lang[language].playposition_text, {timeout: 1000, animation: "fall"});
}
function bookmark_ayahid(event)
{
    var bookmark_sura_no = Number(event.currentTarget.getAttribute("chapter_no"));
    var bookmark_ayah_no = Number(event.currentTarget.getAttribute("ayah_no"));
    console.log(bookmark_sura_no, bookmark_ayah_no);

    bookmarklist[Number(bookmark_sura_no)] = Number(bookmark_ayah_no);
    localStorage.bookmarklist = JSON.stringify(bookmarklist);
    $(".zmdi-bookmark").removeClass("zmdi-bookmark").addClass("zmdi-bookmark-outline");
    var myfav = event.currentTarget.parentElement.parentElement.parentElement.getElementsByClassName("zmdi-bookmark-outline")[0];
    myfav.classList.remove("zmdi-bookmark-outline");
    myfav.classList.add("zmdi-bookmark");

}