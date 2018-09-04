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
var favoritelist = Boolean(localStorage.favoritelist) ? JSON.parse(localStorage.favoritelist) : {};
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
        playposition_text: "Surah play position stored",
        close_app_buttons: ["Yes", "No"],
        first_message: ["Version updates", "Offline mode for text(after each first access)<br>Audio player<br>Continue from the last position of text and audio"],
        greeting: "Assalaamu alaykum",
        favorite_found_message: "Bookmark found at verse: ",
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
        close_app_buttons: ["Ha", "Yo`q"],
        playposition_text: "Xotiraga joylandi",
        first_message: ["Versiya yangiliklari", "Avtonom rejim<br>Audio player<br>Matn va audio uchun kelgan joyidan davom etish"],
        greeting: "Assalomu alaykum",
        favorite_found_message: "Xat cho`pli oyat: ",
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
        close_app_buttons: ["Да", "нет"],
        playposition_text: "сохранена последняя позиция",
        first_message: ["Новости версии", "Автономный режим<br>Аудиоплеер<br>Продолжить с последней позиции текста и аудио"],
        greeting: "Ассаляму аляйкум",
        favorite_found_message: "Закладка найдена на стихе: ",
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
        case "surah_text":
            select_surah();
            //showBannerFunc();
            if (deviceready) {
                window.plugins.AdMob.destroyBannerView();
            }
            break;
        case "settings":
            set_settings();
            if (deviceready)
            {
                showBannerFunc();
            }
            break;
        case "about":
            set_about_page();
            if (deviceready)
            {
                showBannerFunc();
            }

            break;
    }
});
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
    registerAdEvents();

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
function set_about_page() {

    document.querySelector("#muallifdantitle").innerHTML = lang[language].about_page;
    document.querySelector("#greetingtitle").innerHTML = lang[language].greeting;
    document.querySelector("#greetingtext").innerHTML = lang[language].gr_text;
    document.querySelector("#abouttitle").innerHTML = lang[language].about;

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
        url: "https://ajpage.janjapanweb.com/ajax_quran.php",
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: d,
        beforeSend: function (xhr) {
            document.querySelector("#loadingtitle").innerHTML = lang[language].loading;
            document.querySelector('#loading_circle').show();
        },
        success: function (data) {
            document.querySelector('#loading_circle').hide();
            if (data.indexOf("chapterId") > 0)
            {
                var data = JSON.parse(data);
                //display_surah_names(data);
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

function addListeners()
{
  
        
    



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

function display_surah_names(data)
{
    document.querySelector("#selectsurahtitle").innerHTML = lang[language].home_title;    
        
        
    for (i in data)
    {
        //data[i] = JSON.parse(data[i]);
        //console.log(data[i]["languageNo"]);
        if (data[i]["languageNo"] == 1)
        {
            var oli = document.createElement("ons-list-item");
            oli.setAttribute("tappable", "true");
            oli.setAttribute("id", "sura-" + data[i].chapterId);
            oli.setAttribute("title", data[i].title);
            oli.setAttribute("surahNo", data[i].chapterId);
            oli.setAttribute("onmouseup", "show_surah(event)");
            oli.innerHTML = `<div class="left"><ons-row><ons-col><span class="ayah_id"> ${data[i].chapterId} </span></ons-col></ons-row></div><div class="center arabic"><ons-row><ons-col>${data[i].title }</ons-col></ons-row></div>`;
        } else if (data[i]["languageNo"] != 1 && data[i].title != undefined) {
            oli.innerHTML += "<ons-row><ons-col>" + data[i].title + "</ons-col></ons-row>";
            document.getElementById("main_table").appendChild(oli);
        }
    }
    location.hash = "sura-" + (Number(selected_surah) - 1);
    if (deviceready)
    {

        window.plugins.AdMob.destroyBannerView();

    }
    
}

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

//initialize the goodies
function initAd() {
    if (window.plugins && window.plugins.AdMob) {
        var ad_units = {
            ios: {
                banner: 'ca-app-pub-3838820812386239/2551267023', //PUT ADMOB ADCODE HERE
                interstitial: 'ca-app-pub-3838820812386239/2551267023'	//PUT ADMOB ADCODE HERE
            },
            android: {
                banner: 'ca-app-pub-3838820812386239/6533462802', //PUT ADMOB ADCODE HERE
                interstitial: 'ca-app-pub-3838820812386239/2551267023'	//PUT ADMOB ADCODE HERE
            }
        };
        var admobid = (/(android)/i.test(navigator.userAgent)) ? ad_units.android : ad_units.ios;

        window.plugins.AdMob.setOptions({
            publisherId: admobid.banner,
            interstitialAdId: admobid.interstitial,
            adSize: window.plugins.AdMob.AD_SIZE.SMART_BANNER, //use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
            bannerAtTop: false, // set to true, to put banner at top
            overlap: true, // banner will overlap webview
            offsetTopBar: false, // set to true to avoid ios7 status bar overlap
            isTesting: false, // receiving test ad
            autoShow: true // auto show interstitial ad when loaded
        });

        registerAdEvents();
    } else {
        //alert( 'admob plugin not ready' );
    }
}
//functions to allow you to know when ads are shown, etc.
function registerAdEvents() {
    document.addEventListener('onReceiveAd', function () {});
    document.addEventListener('onFailedToReceiveAd', function (data) {});
    document.addEventListener('onPresentAd', function () {});
    document.addEventListener('onDismissAd', function () { });
    document.addEventListener('onLeaveToAd', function () { });
    document.addEventListener('onReceiveInterstitialAd', function () { });
    document.addEventListener('onPresentInterstitialAd', function () { });
    document.addEventListener('onDismissInterstitialAd', function () { });
}
//display the banner
function showBannerFunc() {
    window.plugins.AdMob.createBannerView();
}

//display the interstitial
var showPopover = function (target) {
    document
            .getElementById('popover')
            .show(target);

};

var hidePopover = function () {
    document
            .getElementById('popover')
            .hide();
};

$(window).ready(function () {

    document.querySelector('ons-navigator').addEventListener('prepop', function () {
        console.log("prepop");
        try{
            $("#surahaudio")[0].pause();
        }
        catch (e){
            
        }
    });
    
    document.querySelector('ons-navigator').addEventListener('postpop', function () {
        console.log("postpop", event.enterPage);
        switch (event.enterPage.getAttribute("id"))
    {
        case "titles":
            console.log("surah title list");
            document.querySelector("#selectsurahtitle").innerHTML = lang[language].home_title;
            break;
        case "surah_text":
            
            break;
        case "settings":
            
            break;
        case "about":
            
            break;
    }
    });
});