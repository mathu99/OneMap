/**
 * Created on 2015/08/15.
 */


this.initialize = function() {

    this.mongoose = require('mongoose');
    this.mongoose.connect('mongodb://localhost/OneMap');


    /*Marker Schema declaration*/
    this.MarkerSchema = new this.mongoose.Schema({
		Marker_Id: String,
        Marker_GeoJson: String,
        Marker_Description: String,
		Marker_Lon: String,
		Marker_Lat: String,
        Marker_Type: String,
        Marker_Colour:String,
        Marker_Level: String
    });

    this.MarkerTypeSchema = new this.mongoose.Schema({
        MarkerType_Colour: String,
        MarkerType_Icon: String
    });

    this.PolygonSchema = new this.mongoose.Schema({
        Polygon_Id: String,
		Polygon_GeoJson: String,
        Polygon_Description: String,
		Polygon_Lon: String,
		Polygon_Lat: String,
        Polygon_Colour: String,
        Polygon_Level: String
    });
    /*var map = function () {
        var output= {firstname:this.name.first, lastname:this.name.last , department:db.department.findOne({_id:this.department}).department}
        emit(this._id, output);
    };
    var reduce = function(key, values) {
        var outs={ firstname:null , lastname:null , department:null}
        values.forEach(function(v){
            if(outs.firstname ==null){
                outs.firstname = v.firstname
            }
            if(outs.lastname ==null){
                outs.lastname = v.lastname
            }
            if(outs.department ==null){
                outs.department = v.department
            }

        });
        return outs;
    };*/

    this.FloorSchema = new this.mongoose.Schema({
        Floor_Latitude: String,
        Floor_Longitude: String,
        Floor_Building: String,
        Floor_Name: String
    });

    /*Database connection*/
    this.Marker = this.mongoose.model('markers', this.MarkerSchema);
    this.MarkerType = this.mongoose.model('markertypes', this.MarkerTypeSchema);
    this.Polygon = this.mongoose.model('polygons', this.PolygonSchema);
    this.Floor = this.mongoose.model('floors', this.FloorSchema);
}