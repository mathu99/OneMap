/**
 * Created on 2015/08/12.
 */
var express = require('express');
var docModel = require('./DocumentModel');
var app = express();
app.use(express.static('Modules'));
docModel.initialize();

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname+"/index.html");
});

app.get('/Query', function (req, res) {
    var type = req.query.type;
    if(type =='Marker') {
        docModel.Marker.find({}, function (err, things) {
            if (err) return console.error(err);
            res.json(things)
            console.log("Local - Marker Completed");
        })
    }
    else if (type =='Polygon')
    {
        docModel.Polygon.find({}, function (err, things) {
            if (err) return console.error(err);
            res.json(things)
            console.log("Local - Polygon Completed");
        })
    }
    else if (type =='Floor')
    {
        docModel.Floor.find({}, function (err, things) {
            if (err) return console.error(err);
            res.json(things)
            console.log("Local - Floor Completed");
        })
    }
});

app.get('/Insert', function (req, res) {
    var json =req.query;
    var insertDoc;
    if(JSON.stringify(json).indexOf('Marker')!=-1) {
        insertDoc = new docModel.Marker(json);
    }
    else if (JSON.stringify(json).indexOf('Polygon')!=-1) {
        insertDoc = new docModel.Polygon(json);
    }
    insertDoc.save(function(err, thor) {
        if (err) return console.error(err);
        console.log("Local - Insert Object Completed");
    });

});

app.get('/Delete', function (req, res) {
    
	
	var type = req.query.type;
	var ID = req.query.ID;
	console.log(type+" "+ID)
    if(type =='Marker') {
        docModel.Marker.findOne({Marker_Id:ID}, function (err, things) {
            if (err) return console.error(err);
            if (things!= undefined)	
			{
				things.remove();
			    console.log ("ghg");
			}
        })
    }
    else if (type =='Polygon')
    {
        docModel.Polygon.findOne({Polygon_Id:ID}, function (err, things) {
            if (err) return console.error(err);
			if (things!= undefined)	
			{
				things.remove();
			    console.log ("ghg");
			}
        })
          
        
    }
	
});



