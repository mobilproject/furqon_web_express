/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var sdb;
var big_data = [];
var databaseName = "suralar";
var izoh_data;
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. Some features will not be available.");
} else {
//start
    console.log("sdb initiated");
    var request = indexedDB.open(databaseName);
    request.onsuccess = function (e) {
        sdb = e.target.result;
    };
}


function show_surah_content(data)
{
    sdb.close();
    manage_object_stores(databaseName, selected_surah, data);
    //document.querySelector("#ayah_list").innerHTML = data;
}

function show_surah_content_now()
{
    var infiniteList = document.getElementById('infinite-list');
    var itemcount = big_data.length;
    console.log(infiniteList);

    infiniteList.delegate = {
        createItemContent: function (i) {
            //console.log(create_row(i), infiniteList);         
            return create_row(i);
        },
        configureItemScope: function (index, itemScope) {
            console.log(index, itemScope);
            itemScope.name = infiniteList.filteredItems[index].name;
        },
        countItems: function () {
            //console.log("list item count", big_data.length);            
            return itemcount;
        }
    };

    infiniteList.refresh();




    //load data from 
    //console.log(rows);    


    $("#surahaudio").off().on("pause", function () {
        save_playposition();
    });

    if (!Boolean(localStorage.first_surah))
    {
        localStorage.first_surah = "done";
        showPopover(document.getElementsByClassName("ayah_id")[0]);
        document.getElementById("poptext").innerHTML = lang[language].chapter_loaded;
    }

    restore_favorite();
}

function restore_favorite()
{



    try {
        set_favorites();
    } catch (e) {

    }


}
function ayah_click(event) {
    if ($(event.currentTarget).find(".ayah_id").is(":visible"))
    {
        console.log($(event.currentTarget).find(".qavs_ichi").is(":visible"));
        $(event.currentTarget).find(".qavs_ichi").hide();
        $(event.currentTarget).find(".zmdi-code-setting").show();
        event.currentTarget.querySelector("ons-speed-dial").hideItems();
        $(event.currentTarget).find(".ayah_id").hide();
    } else {
        $(event.currentTarget).find(".qavs_ichi").show();
        $(event.currentTarget).find(".zmdi-code-setting").hide();
        event.currentTarget.querySelector("ons-speed-dial").showItems();
        $(event.currentTarget).find(".ayah_id").css("display", "block");
        event.currentTarget.showExpansion();
        
    }

}
function set_favorites()
{
    if (favoritelist[selected_surah])
    {
        if ($("#ayah-" + selected_surah + "-" + favoritelist[selected_surah]).length > 0)
        {
            console.log("surah and ayah", selected_surah, favoritelist[selected_surah]);
            document.querySelector("#ayah-" + selected_surah + "-" + favoritelist[selected_surah])[0].scrollIntoView({behavior:"smooth"});            
            $("#ayah-" + selected_surah + "-" + favoritelist[selected_surah])[0].getElementsByClassName("zmdi")[0].classList.remove("zmdi-favorite-outline");
            $("#ayah-" + selected_surah + "-" + favoritelist[selected_surah])[0].getElementsByClassName("zmdi")[0].classList.add("zmdi-favorite");
            setTimeout(function(){
                $('#loading_circle').hide();
            },300);
            ons.notification.toast(lang[language].favorite_found_message + favoritelist[selected_surah], {timeout: 1000, animation: 'fall'});
        } else {
            console.log("settimeout");
            var listitems = $(".list-item");
            listitems[listitems.length - 1].scrollIntoView({behavior:"instant"});
            setTimeout(function () {
                set_favorites();
            }, 100);
        }
    }
    else {
        document.querySelector('#loading_circle').hide();
    }

    if (playpositions[selected_surah])
    {
        $("#surahaudio")[0].currentTime = playpositions[selected_surah] - 5;
    }
    
    
}
function create_row(i)
{
    var row;
    if (big_data[i]['DatabaseID'] == 1)
    {
        var oli = document.createElement("ons-list-item");
        oli.id = "ayah-" + big_data[i]['SuraID'] + "-" + big_data[i]['VerseID'];
        oli.setAttribute("onclick", "ayah_click(event)");
        oli.setAttribute("modifier", "tappable");
        var onrow = document.createElement("ons-row");
        var oncol = document.createElement("ons-col");
        var sp = document.createElement("span");
        sp.setAttribute("class", "ayah_id");
        sp.innerText = big_data[i]['VerseID'];
        oncol.appendChild(sp);
        onrow.appendChild(oncol);
        oli.appendChild(onrow);

        var onsrow = document.createElement("ons-row");
        var onscol = document.createElement("ons-col");
        onscol.setAttribute("class", "arabic");
        var sp2 = document.createElement("span");
        sp2.setAttribute("class", "ayah_text arabic");
        sp2.innerText = big_data[i]['AyahText'];
        onscol.appendChild(sp2);
        onsrow.appendChild(onscol);
        oli.appendChild(onsrow);

        row = oli;

    } else {
        var izohsiz = big_data[i]['AyahText'].replace(/\(/g, '<i class="zmdi zmdi-code-setting"></i><span class="qavs_ichi">');
        izohsiz = izohsiz.replace(/\)/g, '</span>');
        var onslist = ons.createElement("<ons-list-item>");
        onslist.setAttribute("modifier", "tappable");
        onslist.setAttribute("expandable", "");
        
        onslist.setAttribute("onclick", "ayah_click(event)");
        onslist.id = "ayah-" + big_data[i]['SuraID'] + "-" + big_data[i]['VerseID'];
        var onsrow = document.createElement("ons-row");
        var onscol = document.createElement("ons-col");
        var onsi = document.createElement("i");
        onsi.setAttribute("class", "zmdi zmdi-favorite-outline");
        var sp = document.createElement("span");
        sp.setAttribute("class", "ayah_id");
        sp.innerText = big_data[i]['VerseID'];
        onslist.appendChild(onsrow);
        onsrow.appendChild(onscol);
        onscol.appendChild(onsi);
        //onscol.appendChild(sp);

        var onsrow2 = document.createElement("ons-row");
        var onscol2 = document.createElement("ons-col");
        var onsspeed = document.createElement("ons-speed-dial");
        onsspeed.setAttribute("position", "bottom right");
        onsspeed.setAttribute("direction", "left");        
        onsspeed.setAttribute("class", "ayah_text");
        var onsfab = document.createElement("ons-fab");
        var onsicon = document.createElement("ons-icon");
        onsicon.setAttribute("icon", "md-share");
        onsfab.appendChild(onsicon);

        var onssdi = document.createElement("ons-speed-dial-item");
        onssdi.setAttribute("onmousedown", "favorite_ayahid(event)");
        onssdi.setAttribute("chapter_no", big_data[i]["SuraID"]);
        onssdi.setAttribute("ayah_no", big_data[i]["VerseID"]);
        var onsicon2 = document.createElement("ons-icon");
        onsicon2.setAttribute("icon", "md-favorite");
        onssdi.appendChild(onsicon2);

        var onssdi2 = document.createElement("ons-speed-dial-item");
        onssdi2.setAttribute("onmousedown", "share_ayah(event)");
        onssdi2.setAttribute("chapter_no", big_data[i]["SuraID"]);
        onssdi2.setAttribute("ayah_no", big_data[i]["VerseID"]);
        var onsicon3 = document.createElement("ons-icon");
        onsicon3.setAttribute("icon", "md-share");
        onssdi2.appendChild(onsicon3);

        var sp2 = document.createElement("span");
        sp2.innerHTML = izohsiz;
        onscol2.appendChild(sp2);

        onslist.appendChild(onsrow2);
        onsrow2.appendChild(onscol2);
        
        
        var divx = document.createElement("div");
        divx.setAttribute("class","expandable-content");
        
        divx.appendChild(sp);
        divx.appendChild(onsspeed);
        onsspeed.appendChild(onsfab);
        onsspeed.appendChild(onssdi);
        onsspeed.appendChild(onssdi2);
        onslist.appendChild(divx);
        row = onslist;
    }
    //console.log(row);
    return row;
}
function share_ayah(event)
{
    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
        message: event.currentTarget.parentElement.parentElement.innerText + " (Qur'an, " + event.currentTarget.getAttribute("chapter_no") + ":" + event.currentTarget.getAttribute("ayah_no") + ");",
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
function favorite_ayahid(event)
{
    var favorite_sura_no = Number(event.currentTarget.getAttribute("chapter_no"));
    var favorite_ayah_no = Number(event.currentTarget.getAttribute("ayah_no"));
    console.log(favorite_sura_no, favorite_ayah_no);

    favoritelist[Number(favorite_sura_no)] = Number(favorite_ayah_no);
    localStorage.favoritelist = JSON.stringify(favoritelist);
    $(".zmdi-favorite").removeClass("zmdi-favorite").addClass("zmdi-favorite-outline");
    event.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("zmdi")[0].classList.remove("zmdi-favorite-outline");
    event.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("zmdi")[0].classList.add("zmdi-favorite");

}
function manage_object_stores(databaseName, selected_surah, rd) {

    var request = indexedDB.open(databaseName);
    request.onsuccess = function (e) {
        sdb = e.target.result;
        var version = parseInt(sdb.version);
        //check if the objectStore exists
        console.log("checking the store", sdb);
        if (sdb.objectStoreNames.contains(selected_surah))
        {
            //the selected_surah exists. Call startTransaction            
            console.log("secondRequest");
            startTransaction(rd);
        } else {
            sdb.close();
            //objectStoreNames does not CONTAIN the selected_surah
            //Create new one
            var secondRequest = indexedDB.open(databaseName, version + 1);
            console.log("manage stores is processing version upgrade", version, secondRequest);
            secondRequest.onupgradeneeded = function (e) {

                sdb = e.target.result;
                try {
                    console.log("upgrading", version + 1);
                    var objectStore = sdb.createObjectStore(selected_surah, {
                        autoIncrement: true
                    });
                    objectStore.createIndex("VerseID", "VerseID", {
                        unique: false
                    });
                    objectStore.createIndex("DatabaseID", "DatabaseID", {
                        unique: false
                    });
                    objectStore.createIndex("SuraID", "SuraID", {
                        unique: false
                    });
                } catch (e) {
                    console.log(e.message);
                }
            };
            secondRequest.onsuccess = function (e) {
                e.target.result.close();
                console.log("new data store created");
                startTransaction(rd);
            };
            secondRequest.onerror = function (e) {
                console.log(e.target.error.message, "store Name failed to create?");
            };
        }

    };
    request.onerror = function (e) {
        console.log(e.type);
    }
}
function startTransaction(rd) {

    var request = indexedDB.open(databaseName);
    request.onsuccess = function (e) {
        sdb = e.target.result;
        //console.log(sdb);
        var transaction = sdb.transaction([selected_surah], "readwrite");
        var lotStore = transaction.objectStore(selected_surah);
        //console.log(lotStore);
        rd.forEach(function (ayah) {
            ////console.log("adding rows " + lot); //JSON.stringify(lot)
            //add more properties here                
            var request = lotStore.put(ayah);
            request.onsuccess = function (e) {
                ////console.log(e.target.result + " " + " is the result id (key)");
            }
            request.oncomplete = function (e) {
            }
        });
        // Do something when all the data is added to the database.
        transaction.oncomplete = function (event) {
            console.log("All done!");
            /////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////
            //HERE CALL display function
            get_by_suraid();
        };
        transaction.onerror = function (event) {
            // Don't forget to handle errors!
            console.log("error! " + event.target.error.message);

        };
    };
    request.onerror = function (event) {
        //console.log(event);
    }
}

function get_by_suraid() {

    console.log("get_by_surah");
    if (sdb.objectStoreNames.contains(selected_surah))
    {
        document.querySelector("#loadingtitle").innerHTML = lang[language].loading;
        document.querySelector('#loading_circle').show();
//the selected_surah exists. Data also exists?
        console.log(selected_surah, "exists, proceed to data retrieval");
        var store = sdb.transaction(selected_surah, "readonly").objectStore(selected_surah);
        var index = store.index('SuraID');
        keyRange = IDBKeyRange.only(["SuraID"]);
        console.log(index);
        // To use one of the key ranges, pass it in as the first argument of openCursor()/openKeyCursor()
        var request = index.count(keyRange);
        request.onsuccess = function (event) {
            big_data = [];
            var cursor = event.target.result;
            console.log(cursor, "row counts");
            request = index.openCursor();
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    //include only selected languages
                    if (languageID(cursor.value.DatabaseID))
                    {
                        big_data.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    //console.log("loading complete", big_data);

                    if (big_data.length > 0)
                    {
                        show_surah_content_now();
                    } else {
                        //no data 
                        console.log(big_data.length, "big data empty for ", selected_surah);
                        ajax(izoh_data);
                    }



                }
            };
            console.log(cursor, "cursor length");
        };
        request.onerror = function (e)
        {
            console.log(e, "error loading data");
        }

    } else {
        sdb.close();
        console.log("closed sdb, selected_surah does not exist, will CREATE a store now");
    }
}
function languageID(l)
{
    l = Number(l);
    var bul;
    for (var i = 0; i < languages.length; i++)
    {
        //console.log(languages[i], l);
        if (languages[i] === l)
        {
            bul = true;
        }
    }
    return bul;
}
function check_store(selected_surah)
{
    if (sdb.objectStoreNames.contains(selected_surah))
    {
        return true;
    } else {
        return false;
    }
}