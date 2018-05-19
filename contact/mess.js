const clientPromise = stitch.StitchClientFactory.create('messager-yljif');

let client;
let db;

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + date.getHours() + seperator2 + date.getMinutes()
                    + seperator2 + date.getSeconds();
    return currentdate;
}

function displayCommentsOnLoad() {
    clientPromise.then(stitchClient => {
        client = stitchClient;
        db = client.service('mongodb', 'mongodb-atlas').db('blog');
        return client.login().then(displayComments)
    });
}

function displayComments() {
    db.collection('comments').find({}).limit(1000).execute().then(docs => {
        var html = "";
        docs.map(c => {
            if (c.comment.substring(0,1) == 'X') {
                html += "<div><font color='#4B0082' size='1'>" + c.time +
                '</font><br><kbd style="background-color:#E6E6FA; color:#000000">' + c.comment + "</kbd></div>";
            }
            else {
                html += "<div align='right'><font color='#0099FF' size='1'>" + c.time +
                '</font><br><kbd style="background-color:#B0C4DE; color:#000000">' + c.comment + "</kbd></div>";
            }
        });
        
        document.getElementById("comments").innerHTML = html;
    });

    /* db.collection('comments').find({}).limit(1000).execute().then(docs => {
        var html = docs.map(c => "<div><font color='#0099FF' size='1'>" + c.time + '</font><br>' + c.comment + "</div>").join("");
        document.getElementById("comments").innerHTML = html;
    }); */
}

function addComment() {
    var foo = document.getElementById("new_comment");
    var timestamp = getNowFormatDate();
    
    if (foo.value.substring(0,3) === "DEL") {
        timestamp = foo.value.substring(4);
        db.collection("comments").deleteOne({time: timestamp}).then(displayComments);
    }
    else {
        db.collection("comments").insertOne({owner_id : client.authedId(), time: timestamp, comment: foo.value}).then(displayComments);
        foo.value = "";
    }
}
