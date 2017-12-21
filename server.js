//Loading modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var b = require('bonescript');

// Create a variable called led, which refers to P9_14
var ersw0 = "P8_8";
var ersw1 = "P8_10";
var ersw2 = "P8_12";

var erain0 = "P9_39"
var erain1 = "P9_40"
var erain2 = "P9_37"
var erain3 = "P9_38"

// Initialize the led as an OUTPUT
b.pinMode(ersw0, b.OUTPUT);
b.pinMode(ersw1, b.OUTPUT);
b.pinMode(ersw2, b.OUTPUT);




loop();

function loop() {
  b.analogRead(erain0, printValue1);
  b.analogRead(erain1, printValue2);
  b.analogRead(erain2, printValue2);
  setTimeout(loop,1000);
}

function printValue1(x) {
    console.log("1",x.value)
}

function printValue2(x) {
    console.log("2",x.value)
}

// Initialize the server on port 8888
var server = http.createServer(function (req, res) {
    // requesting files
    var file = '.'+((req.url=='/')?'/index.html':req.url);
    var fileExtension = path.extname(file);
    var contentType = 'text/html';
    // Uncoment if you want to add css to your web page
    /*
    if(fileExtension == '.css'){
        contentType = 'text/css';
    }*/
    fs.exists(file, function(exists){
        if(exists){
            fs.readFile(file, function(error, content){
                if(!error){
                    // Page found, write content
                    res.writeHead(200,{'content-type':contentType});
                    res.end(content);
                }
            })
        }
        else{
            // Page not found
            res.writeHead(404);
            res.end('Page not found');
        }
    })
}).listen(8888);

// Loading socket io module
var io = require('socket.io').listen(server);

// When communication is established
io.on('connection', function (socket) {
    socket.on('changeState', handleChangeState);
});


// Change led state when a button is pressed
function handleChangeState(data) {
    console.log("handleChangeState");
    var newData = JSON.parse(data);
    var userid = newData.userid;
    var passwordhash = newData.passwordhash
     if( (userid == "admin") && (passwordhash == ("admin")) ) {
       console.log("ersw= " + newData.switch + " " + newData.state);
       // turns SW1 ON or OFF
       switch(newData.switch) {
           case 0:
                b.digitalWrite(ersw0, newData.state);
                break;
           case 1:
                b.digitalWrite(ersw1, newData.state);
                break;
           case 2:
                b.digitalWrite(ersw2, newData.state);
                break;
       }
    } else {
       console.log("Invalid userid or password:" + newData.userid + "/" + "???");
    }

}

// Displaying a console message for user feedback

server.listen(process.env.PORT || port, process.env.ip || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server running at", addr.address + ":" + addr.port);
});

