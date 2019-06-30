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
    if (infiniteList == null) {
    }
    var itemcount = big_data.length;
    console.log(infiniteList);
    infiniteList.delegate = {
        createItemContent: function (i) {
            //console.log(create_row(i), infiniteList);
            return create_row(i);
        },
        countItems: function () {
            //console.log("list item count", big_data.length);
            return itemcount;
        }
    };
    infiniteList.refresh();
    $("#surahaudio").off().on("pause", function () {
        save_playposition();
    });
    if (!Boolean(localStorage.first_surah))
    {
        localStorage.first_surah = "done";
        showPopover(document.getElementsByClassName("ayah_id")[0]);
        document.getElementById("poptext").innerHTML = lang[language].chapter_loaded;
    }
    restore_bookmark();
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
        onsi.setAttribute("class", "zmdi zmdi-bookmark-outline");
        var sp = document.createElement("span");
        sp.setAttribute("class", "ayah_id");
        sp.innerText = big_data[i]['VerseID'];
        onslist.appendChild(onsrow);
        onsrow.appendChild(onscol);
        onscol.appendChild(onsi);
        //onscol.appendChild(sp);

        var onsrow2 = document.createElement("ons-row");
        var onscol2 = document.createElement("ons-col");
        var onsspeed = document.createElement("div");
        onsspeed.setAttribute("class", "ayah_text");
        var onssdi = document.createElement("ons-button");
        onssdi.setAttribute("onmousedown", "bookmark_ayahid(event)");
        onssdi.setAttribute("chapter_no", big_data[i]["SuraID"]);
        onssdi.setAttribute("ayah_no", big_data[i]["VerseID"]);
        var onsicon2 = document.createElement("ons-icon");
        onsicon2.setAttribute("icon", "md-bookmark");
        onssdi.appendChild(onsicon2);

        var onssdi2 = document.createElement("ons-button");
        onssdi2.setAttribute("onmousedown", "share_ayah(event)");
        onssdi2.setAttribute("chapter_no", big_data[i]["SuraID"]);
        onssdi2.setAttribute("ayah_no", big_data[i]["VerseID"]);
        var onsicon3 = document.createElement("ons-icon");
        onsicon3.setAttribute("icon", "md-share");
        onssdi2.appendChild(onsicon3);

        var sp2 = document.createElement("span");
        sp2.setAttribute("class", "oyatmatni");
        sp2.innerHTML = izohsiz;
        onscol2.appendChild(sp2);

        onslist.appendChild(onsrow2);
        onsrow2.appendChild(onscol2);


        var divx = document.createElement("div");
        divx.setAttribute("class", "expandable-content");

        divx.appendChild(sp);
        divx.appendChild(onsspeed);

        onsspeed.appendChild(onssdi);
        onsspeed.appendChild(onssdi2);
        onslist.appendChild(divx);
        row = onslist;
    }
    //console.log(row);
    return row;
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

function get_surah() {
    selected_surah = 1;
    languages = [120];
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
                        document.querySelector('#loading_circle').hide();
                        console.log(big_data.length);
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
        izoh_data = {action: "izohsiz_text_obj", surah_id: selected_surah, database_id: languages};
        ajax(izoh_data);
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

function searchText() {
    sdb.objectStoreNames;
}

function hide_comments(i) {
    var izohsiz = big_data[i]['AyahText'].replace(/\(/g, '<i class="zmdi zmdi-code-setting"></i><span class="qavs_ichi">');
    izohsiz = izohsiz.replace(/\)/g, '</span>');

    return izohsiz;
}
function get_by_randomsuraid() {
    if (sdb.objectStoreNames.contains(selected_surah))
    {
        document.querySelector("#loadingtitle").innerHTML = lang[language].loading;
        document.querySelector('#loading_circle').show();
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
                    document.querySelector('#loading_circle').hide();
                    if (big_data.length > 0)
                    {
                        console.log(big_data);
                        document.querySelector("audio").src = "https://mobilproject.github.io/furqon_web_express/by_sura/" + selected_surah + ".mp3"
                        $("#ayah-number").text(1);
                        $("#random-ayah-text").fadeOut();
                        $("#random-ayah-text").html("");
                        get_current_suraname();

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
//SUBTITLE synch
var ri = 0;//set it again after synching audio with subs
var stpos = 0;
var subdelay;
function rec_subs() {
    if (subdelay) {
        clearTimeout(subdelay);
    }
    if (stpos > 0) {
        subdelay = setTimeout(setsubs, (stpos * 1000));
        stpos = 0;
    } else {
        try {
            if (big_data.length > 0 && Boolean(big_data[ri].audio_at)) {
                subdelay = setTimeout(setsubs, (timedif(ri) * 1000));

            }
        } catch (e) {
            console.log(e);
        }
    }
}
function setsubs() {
    //console.log(timedif(ri), ri);
    $("#random-ayah-text").fadeOut(500, function () {
        $("#random-ayah-text").html(hide_comments(ri > 0 ? ri - 1 : 0)).fadeIn(500);
    });

    $("#ayah-number").text(big_data[ri].VerseID);
    if (ri < big_data.length) {
        ri++;
        rec_subs();
    } else {
        clearTimeout(subdelay);
    }

}
function timedif(vv) {
    if (ri > 0) {
        return big_data[ri].audio_at - big_data[ri - 1].audio_at;
    }
    return big_data[ri].audio_at;
}
//END of subtitle synch



function play_start() {
    var player = event.target;
//calculate currentTime difference
//find the correct position
    console.log("play");
    if (big_data.length > 0 && big_data[0].audio_at) {
        for (var i = 0; i < big_data.length; i++) {
            if (big_data[i].audio_at > player.currentTime) {
                ri = i;
                stpos = big_data[i].audio_at - player.currentTime;
                console.log(ri, big_data[i].audio_at, stpos, player.currentTime);
                rec_subs();
                //$("#random-ayah-text").fadeIn();

                break;
            }

        }

    }
}
function play_paused() {
    console.log("pause");
    clearTimeout(subdelay);
    ri = 0;
    stpos = 0;
}

function addAudioSynchData() {
    var objectStore = sdb.transaction(selected_surah, "readwrite").objectStore(selected_surah);
    var request = objectStore.openCursor();
    request.onerror = function (event) {
        // Handle errors!
    };
    request.onsuccess = function (event) {
        // Get the old value that we want to update

        var cursor = event.target.result;
        //console.log(cursor);
        // update the value(s) in the object that you want to change
        if (cursor) {
            if (cursor.value.VerseID == current_verse) {
                var data = cursor.value;
                ct = document.querySelector("audio").currentTime;
                data.audio_at = ct;
                var request = cursor.update(data);
                request.onsuccess = function () {
                    console.log('audio synch data added ' + current_verse + ", " + ct);
                };
            }
            cursor.continue();
        } else {
            console.log('Entries displayed.');
        }


    };
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