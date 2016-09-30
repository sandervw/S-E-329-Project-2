var http = require('http');
var fs   = require('fs');
var server = http.createServer();

/*
Since this is a one page site, any requests ("\index.html" or "\drop\all\tables\)
will be handled by sending the main page
*/

// attach handler
server.on('request', function (req,res) {
    //get the data directory
    var file_path = __dirname;
    //go up one level, to find index.html
    file_path = file_path.substr(0,file_path.length-4)+'index.html';
    var rs = fs.createReadStream(file_path);
    //send index.html
    rs.pipe(res);
}); // end server on handler

console.log('http server online! :)');

server.listen(4000);
