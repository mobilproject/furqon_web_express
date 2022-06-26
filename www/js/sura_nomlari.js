/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var indexdb;
var databaseName = "surah_titles";
var databaseVersion = 5;

var openRequest = indexedDB.open(databaseName, databaseVersion);

openRequest.onerror = function (event) {
    console.log(event.errorCode);
};
openRequest.onsuccess = function (event) {
    indexdb = event.target.result;
    console.log("database opened", indexdb);

};
openRequest.onupgradeneeded = function (event) {
    indexdb = event.target.result;
    indexdb.onerror = function () {
        console.log("error loading the database");
    };
    if (event.oldVersion < 5) {

        if (check_title_store("titles")) {
            indexdb.deleteObjectStore("titles");
        }
        //the titles dont exist
        //create
        var store = indexdb.createObjectStore("titles", {autoIncrement: true});
        //copy of the actual database table
        store.createIndex("chapterId", "chapterId", {unique: false});
        store.createIndex("title", "title", {unique: true});
        store.createIndex("languageNo", "languageNo", {unique: false});

        store.transaction.oncomplete = function (event) {
            console.log("database upgraded successfully!");
            //populate data
            get_surah_names();
        };

    } else {
        var store = indexdb.createObjectStore("titles", {autoIncrement: true});
        //copy of the actual database table
        store.createIndex("chapterId", "chapterId", {unique: false});
        store.createIndex("title", "title", {unique: true});
        store.createIndex("languageNo", "languageNo", {unique: false});

        store.transaction.oncomplete = function (event) {
            console.log("database upgraded successfully!");
            //populate data
            get_surah_names();
        };
    }
};
function check_title_store(titles)
{
    if (indexdb.objectStoreNames.contains(titles))
    {
        return true;
    } else {
        return false;
    }
}
function input_title_data(titlenames) {

    var transaction = indexdb.transaction(['titles'], "readwrite");
    var titleStore = transaction.objectStore('titles');
    titlenames.forEach(function (i) {
        //console.log(i);
        titleStore.put(i);
    });
    transaction.oncomplete = function (event) {
        console.log("All done!");
        //get_surah_names();
    };
}
var dataset = [];
function get_surah_names()
{
    try {
        var transaction = indexdb.transaction(["titles"]);
        var objectStore = transaction.objectStore("titles");
        var request = objectStore.get(1);
        request.onerror = function (event) {
            // Handle errors!
        };
        request.onsuccess = function (event) {
            // Do something with the request.result!
            console.log(event.target.result);


            if (event.target.result)
            {

                //load titles from here
                var transaction = indexdb.transaction(["titles"]);
                var objectStore = transaction.objectStore("titles");
                dataset = [];
                var request = objectStore.openCursor();

                request.onerror = function (event) {
                    // Handle errors!
                    console.log(event);
                };

                request.onsuccess = function (event) {
                    // Do something with the request.result!
                    var cursor = event.target.result;

                    if (cursor)
                    {
                        dataset.push(cursor.value);
                        cursor.continue();
                    } else {
                        //console.log("The result is", dataset);
                        display_surah_names(dataset);
                        dataset = [];
                        console.log("displaying titles");
                    }
                };

            } else {

                //the titles dont exist
                //create
                console.log("requesting titles from server");
                var data = {
                    action: "names_as_objects",
                    language_id: language_id
                };
                ajax(data);
            }
        };
    } catch (e)
    {

    }
}



function get_current_suraname() {
    try {
        var transaction = indexdb.transaction(["titles"]);
        var objectStore = transaction.objectStore("titles");
        var ind = objectStore.index("chapterId");
        var request = ind.getAll(selected_surah.toString());
        request.onerror = function (event) {
            // Handle errors!
        };
        request.onsuccess = function (event) {
            // Do something with the request.result!
            console.log(event.target.result);
            if (event.target.result)
            {
                //load titles from here
                var transaction = indexdb.transaction(["titles"]);
                var objectStore = transaction.objectStore("titles");
                dataset = [];
                var ind = objectStore.index("chapterId");
                var request = ind.getAll(selected_surah.toString());

                request.onerror = function (event) {
                    // Handle errors!
                    console.log(event);
                };

                request.onsuccess = function (event) {
                    // Do something with the request.result!
                    var cursor = event.target.result;


                    //console.log("The result is", dataset);
                    $("#random-sura-name").text(cursor[1].title);
                    //dataset = [];
                    console.log("displaying titles");
                };

            } else {
                //the titles dont exist
                //create
                console.log("requesting titles from server");
                var data = {
                    action: "names_as_objects",
                    language_id: language_id
                };
                ajax(data);
            }
        };
    } catch (e)
    {
        console.warn(e);
    }
}
