/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var ayat_db;
var ayat_databadeName = "ayatDB";
var databaseVersion = 1;

var openRequest = indexedDB.open(ayat_databadeName);

openRequest.onerror = function (event) {
    console.log(event.errorCode);
};
openRequest.onsuccess = function (event) {
    ayat_db = event.target.result;
    console.log("database opened", ayat_db);

};
openRequest.onupgradeneeded = function (event) {
    ayat_db = event.target.result;
    ayat_db.onerror = function () {
        console.log("error loading the database");
    };

    var store = ayat_db.createObjectStore('favorites', {autoIncrement: true});
    //copy of the actual database table
    store.createIndex("VerseID", "VerseID", {unique: false});
    store.createIndex("DatabaseID", "DatabaseID", {unique: false});
    store.createIndex("SuraID", "SuraID", {unique: false});

    store.transaction.oncomplete = function (event) {
        console.log("database upgraded successfully!");
        //populate data
        //get_surah_names();
    };
};

function input_favorite_data(titlenames) {

    var transaction = ayat_db.transaction(['favorites'], "readwrite");
    var titleStore = transaction.objectStore('favorites');
    titlenames.forEach(function (i) {
        //console.log(i);
        titleStore.put(i);
    });
    transaction.oncomplete = function (event) {
        console.log("Favorites entry done!");
        //get_surah_names();
    };

}

function get_favorite_ayats()
{
    try {
        var transaction = ayat_db.transaction(["favorites"]);
        var objectStore = transaction.objectStore("favorites");
        var request = objectStore.get(1);
        request.onerror = function (event) {
            // Handle errors!
        };
        request.onsuccess = function (event) {
            // Do something with the request.result!
            if (event.target.result)
            {
                //load favorites from here
                var transaction = ayat_db.transaction(["favorites"]);
                var objectStore = transaction.objectStore("favorites");
                var dataset = [];
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
                        display_favorites(dataset);
                        dataset = [];
                        //console.log("displaying favorites");
                    }
                };

            } else {
                //the favorites dont exist
                //create
                
            }
        };
    } catch (e)
    {

    }
}
