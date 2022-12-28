var http = require("http");
var url = require("url");
var request = require("postman-request");

const proxyRequest = (req, res) => {
  var queryData = url.parse(req.url, true).query;
  const newHeaders = {
    ...req.headers,
    host: undefined,
    accept: undefined,
    connection: undefined,
    'accept-encoding': undefined,
    'content-length': undefined
  }

  if (req.method === "POST") {
    var body = "";

    req.on("data", function (data) {
      body += data;
      if (body.length > 1e6) request.connection.destroy();
    });

    req.on("end", function () {
      request
        .post(queryData.url, {
          headers: newHeaders,
          body: body,
        })
        .on("error", function (e) {
          res.end("An error occured" + e);
        })
        .pipe(res);
    });
  } else if (req.method === "GET") {
    if (queryData.url) {
      request({
        url: queryData.url,
      })
        .on("error", function (e) {
          res.end("An error occured" + e);
        })
        .pipe(res);
    } else {
      res.end("Please enter URL Property");
    }
  }
};

http.createServer(proxyRequest).listen(8000);
