/* 
 * Author Ahmad - an engineer, teacher and content creator
 * Date: 2021 January 21 
 */

var searchString = window.location.search.replace("?","");
searchArgs = getParameters(searchString);          


/**
 * Search and find the verse by the reference
 */
searchForAyah(searchArgs[0], searchArgs[1]);

function searchForAyah(p1, p2)
{
    
}

function getParameters(s){
    var s_one = "";
    var s_two = "";
    if(s!=undefined){
        if(s.indexOf("&")>0){
            var s_ar = s.split("&");
            if(s_ar.length>1){
                //ideally, this should work as the url is constructed in my android app
                //the way I expect
                s_one = s_ar[0].split("=")[1];
                s_two = s_ar[1].split("=")[1];
                console.log(s_ar);
                setTimeout(()=>{
                    //TODO
                    //also display a button with message on the main page,
                    //to allow manual open, in case of failure
                    searchByAyahFlag = true;
                    openRandomAyah();
                }, 1000);
                
                return [s_one, s_two];                
            }else{
                //we may never hit this
                
            }
        }else{
            //parameter pattern doesn`t match
        }
    }else{
        //string is NULL        
        searchByAyahFlag = false;
    }    
    return [s_one, s_two];
}

