/**
 * Created on 2015/07/13.
 */

//Some Global vars that I reference in other ui-jquery.js ... This is just a hack --- please feel to change, I'm just not 100% sure how... Matt
 var mark;
 var map1;
 var sidebar1;
 var searchData;
 var counter=0;
var objectArray = new Array();
var objectCounter = 0;

 angular.module('OneMap').controller('MainController', ['$scope','$http', function ($scope,$http) 
 {
        $scope.initialView =L.latLng(79.35147225000713, -140.2734375);
        $scope.zoomLevel = 4;
        $scope.map = null;
        $scope.drawControl = null;
        $scope.sidebar = null;
        $scope.avalableFloors = [];
        $scope.json=null;
        $scope.featureGroup = null;
        $scope.searchTest = new Array();
		$scope.lat= null;
		$scope.lon =null;

        $scope.initialiseMap = function () {
            //Initialize the Map view and configurations
            $scope.map = L.map('map').setView($scope.initialView, $scope.zoomLevel);
            L.tileLayer('Tiles/{z}/{x}/{y}.png', {
                //maxBounds: mybounds,
                minZoom: 0,
                maxZoom: 6,
                tms: true,
                noWrap: true,
                detectRetina: true,
                attribution: ""
            }).addTo($scope.map);

            L.controlCredits({
                image: "../Config/logoSmall.png",
                link: "https://www.investec.co.za/",
                text: "Interactive mapping <br/> by OneMap for Investec<br/><br/>"
            }).addTo($scope.map);

            $scope.map.attributionControl.setPrefix("");

            //Drawing Objects Array
            $scope.featureGroup = L.featureGroup().addTo($scope.map);

            //Drawing Toolbar
            $scope.drawControl = new L.Control.Draw({position: 'topright',
                draw: {
                polygon: {
                    shapeOptions: {
                        color: 'blue'
                    }}},
                    edit: {featureGroup: $scope.featureGroup }}).addTo($scope.map);

            //Add sidebar to screen
            $scope.sidebar = L.control.sidebar('sidebar').addTo($scope.map) ;
			$scope.map.on('draw:edited', function(e) 
            {
				for (var x = 0; x < e.layers.getLayers().length; x++) 
				{
					//console.log(e.layers.getLayers()[x]._leaflet_id);
					$scope.json = e.layers.getLayers()[x].toGeoJSON();
					var data = new Object();
					var data2= Object();
					if ($scope.json["geometry"].type=="Polygon")
					{
						data.Polygon_GeoJson =JSON.stringify($scope.json);
						if (e.layers.getLayers()[x]._popup != null){
							data.Polygon_Description = $(e.layers.getLayers()[x]._popup._content).first().html();
							//data.Polygon_Description = $(e.layers.getLayers()[x]._popup._content).find("div").html();
						}
						data.Polygon_Level= '1';
						console.log(e.layers.getLayers()[x].options);
						data.Polygon_Colour= e.layers.getLayers()[x].options.original.fillColor;
						data.Polygon_Id = e.layers.getLayers()[x]._leaflet_id.toString();
						data.Polygon_Lon=$scope.lon;
						data.Polygon_Lat=$scope.lat;
						data2.type="Polygon";
					}
					else	//Marker
					{
						data.Marker_GeoJson=JSON.stringify($scope.json);
						data.Marker_Level= '1';
						data.Marker_Colour = e.layers.getLayers()[x].options.icon.options.markerColor;
						data.Marker_Type = e.layers.getLayers()[x].options.icon.options.icon;
						data.Marker_Lon=$scope.lon;
						data.Marker_Lat=$scope.lat;
						
						if (e.layers.getLayers()[x]._popup != null)
							data.Marker_Description = $(e.layers.getLayers()[x]._popup._content).find("div").html();

						$scope.featureGroup.addLayer(e.layers.getLayers()[x]);
						data.Marker_Id = e.layers.getLayers()[x]._leaflet_id;
						data2.type="Marker";
					}

					data2.ID=e.layers.getLayers()[x]._leaflet_id.toString();
					$http.get('../Delete',{params: data2 }).success(function(data) 
					{
			
					})
					$http.get('../Insert',{params: data }).success(function(data) 
					{

					})
				}

			
			});
			
			$scope.map.on('draw:deleted', function(e) 
            {
				for (var x = 0; x < e.layers.getLayers().length; x++) 
				{
					
					$scope.json = e.layers.getLayers()[x].toGeoJSON();
					
					var data2= Object();
					if ($scope.json["geometry"].type=="Polygon")
					{
						data2.type="Polygon";
					}
					else	//Marker
					{
						data2.type="Marker";
					}
					
					
					data2.ID=e.layers.getLayers()[x]._leaflet_id.toString();
					$http.get('../Delete',{params: data2 }).success(function(data2) 
					{
						
					})
					
				}

			
			});

            //On GEOJSON Object creation save
            $scope.map.on('draw:created', function(e) 
            {
                var color =document.getElementById("color").value;
                var opacity =document.getElementById("opacity").value;
                var data = new Object();
                $scope.json = e.layer.toGeoJSON();
                if ($scope.json["geometry"].type=="Polygon")
				{
                    data.Polygon_GeoJson =JSON.stringify($scope.json);
                    data.Polygon_Description=($("#polygon-description-input").val());
                    data.Polygon_Colour= color;
                    data.Polygon_Level= '1';
					data.Polygon_Lon=$scope.lon;
					data.Polygon_Lat=$scope.lat;
                    if ($("#polygon-description-input").val().length > 0)
                        e.layer.bindPopup($("#polygon-description-input").val());
                    $scope.featureGroup.addLayer(e.layer.setStyle({fillColor: color,color:"#000000"}));
					var temp2 =getTimeStamp();
					data.Polygon_Id =temp2.toString();
					e.layer._leaflet_id= parseInt(temp2);
					//alert(temp2);
					
                }
                else
				{
					//console.log(e.layer._leaflet_id);
					data.Marker_Lon=$scope.lon;
					data.Marker_Lat=$scope.lat;
                    data.Marker_GeoJson=JSON.stringify($scope.json);
                    data.Marker_Description= ($("#marker-description-input").val());
                    data.Marker_Colour= $('.marker-selected').children(":first").children(":first").attr('alt');
					if ($("#custom-icon-input").val().length < 1)
						data.Marker_Type = $('.icon-selected').children(":first").children(":first").attr('class').split(' ')[1].split('-')[1];
					else
						data.Marker_Type = $("#custom-icon-input").val();
                    data.Marker_Level= '1';

                    if ($("#marker-description-input").val().length > 0)
                        e.layer.bindPopup($("#marker-description-input").val());
                    $scope.featureGroup.addLayer(e.layer);
					var temp2 =getTimeStamp();
					data.Marker_Id =temp2.toString();
					e.layer._leaflet_id= parseInt(temp2);
					
					
					//alert(temp2);
                }
				
				
                $http.get('../Insert',{params: data }).
                    success(function(data) {

                    });

            });

            //Helper function to get the coordinates
            $scope.map.on('click', function(e) {
                console.log("Extract coordinates :" + e.latlng.lat + ", " + e.latlng.lng);
            });
        };
		function getTimeStamp() {
			   var now = new Date();
			   return ((now.getMonth() + 1) + '' + (now.getDate()) + '' + now.getFullYear() + "" + now.getHours() + ''
							 + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + '' + ((now.getSeconds() < 10) ? ("0" + now
							 .getSeconds()) : (now.getSeconds())));
		}

        $scope.fillAvailableFloors = function () {
            $scope.avalableFloors.push([]);
            $scope.avalableFloors.push([]);
			var temp3=true;
            var data = new Object();
            data.type='Floor';
            $http.get('../Query',{params: data }).
                success(function(data) {

                    for(var item in data)
                    {
						if(temp3 ==true)
						{
							$scope.lat=data[item].Floor_Latitude;
							$scope.lon=data[item].Floor_Longitude;
							temp3=false;
							//$scope.setBounds ($scope.lon,$scope.lat);
						}
						
                        if (data[item].Floor_Building=='West')
                            $scope.avalableFloors[1].push({name:data[item].Floor_Name,lat:data[item].Floor_Latitude,lon:data[item].Floor_Longitude});
                        else
                            $scope.avalableFloors[0].push({name:data[item].Floor_Name,lat:data[item].Floor_Latitude,lon:data[item].Floor_Longitude});
                    }
            });
        };

         $scope.setBounds = function (lon, lat) {
			 $scope.lat=lat;
			 $scope.lon =lon;
             var yeah,
                 thebounds;
             yeah= L.latLng(lat,lon);
             thebounds = L.latLngBounds(yeah, yeah);
             $scope.map.setMaxBounds(thebounds);

        };
        $scope.loadPolygons = function () {

            var data = new Object();
            data.type='Polygon';
            $http.get('../Query',{params: data }).
                success(function(data) {

                    for(var item in data)
                    {
                        L.geoJson(JSON.parse(data[item].Polygon_GeoJson), {
                            onEachFeature: function (feature, layer) {
								console.log(layer);
                                layer.setStyle({
										fillColor: data[item].Polygon_Colour,	//Body of the shape
										color: "#000000",	//Color of the line
										weight:2,	//Thickness of the line
										fillOpacity:0.8,
										opacity:0.8
										})
                                if (data[item].Polygon_Description!='' && data[item].Polygon_Description!=null) {
									var popupContent =  '<div>' + data[item].Polygon_Description + '</div>';
                                    /*var popupContent =  '<a target="_blank" class="popup" href="' + feature.properties.url + '">' +
                                        '<img src="../Config/img/test.jpg" + />' +
                                        data[item].Polygon_Description +
                                        '</a>';*/
                                    layer.bindPopup(popupContent);
                                }
                                objectArray[counter] = new Object()
                                objectArray[counter].object = layer;
                                objectArray[counter].desc = data[item].Polygon_Description;
								objectArray[counter].lon=data[item].Polygon_Lon;
								objectArray[counter].lat=data[item].Polygon_Lat;
								layer._leaflet_id =  parseInt(data[item].Polygon_Id);
                                $scope.featureGroup.addLayer(layer);
                                var obj = new Object();
                                obj.value = data[item].Polygon_Description;
                                $scope.searchTest[counter++]= obj;

                            }
                        });
                    }
                });
        };
        $scope.loadCustomMarkers = function () {

            var data = new Object();
            data.type='Marker';
            $http.get('../Query',{params: data }).
                success(function(data) 
				{
                    for(var item in data)
                    {
                        L.geoJson(JSON.parse(data[item].Marker_GeoJson), {
                            onEachFeature: function (feature, layer) 
							{
                                layer.options.icon = L.AwesomeMarkers.icon({
                                    icon: data[item].Marker_Type,
                                    markerColor: data[item].Marker_Colour,
                                    prefix: 'fa'
                                });
								
                                if (data[item].Marker_Description!='' && data[item].Marker_Description!=null) {
                                    layer.bindPopup(data[item].Marker_Description);
                                    /*var popupContent =  '<a target="_blank" class="popup" href="' + feature.properties.url + '">' +
                                        '<img class ="test" src="../Config/img/test.jpg" + /><div>' +
                                        data[item].Marker_Description +
                                        '</div></a>';*/
									var popupContent =  '<div>' + data[item].Marker_Description + '</div>';
                                    layer.bindPopup(popupContent);
                                }
								
								
								
                                objectArray[counter] = new Object()
                                objectArray[counter].object = layer;
                                objectArray[counter].desc = data[item].Marker_Description;
								objectArray[counter].lon=data[item].Marker_Lon;
								objectArray[counter].lat=data[item].Marker_Lat;
								layer._leaflet_id =  parseInt(data[item].Marker_Id);
                                $scope.featureGroup.addLayer(layer);
                                var obj = new Object();
                                obj.value = data[item].Marker_Description;
                                $scope.searchTest[counter++]= obj;

                                //);
                            }
                        });
                    }
                });
        };

        $scope.init = function () {
            $scope.initialiseMap();
            $scope.fillAvailableFloors();
            $scope.loadCustomMarkers();
            $scope.loadPolygons();
        };

        $scope.init();

        map1 = $scope.map;
        sidebar1 = $scope.sidebar;
        searchData =$scope.searchTest;

    }]);
