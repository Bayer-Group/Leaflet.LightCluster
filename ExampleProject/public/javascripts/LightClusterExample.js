// Create the map
var map = L.map('map').setView([39.5, -92], 4);

// Set up the tile layer
L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
	type: 'sat',
	ext: 'jpg',
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
	subdomains: '1234'
}).addTo(map);

//tell our slide out menu to init to window and map dimensions
SlideOutMenuCommon.slideOutMenu.init();

//set up a layer to put our data in
var layer = L.LayerGroup.extend({
	clustering: null,
	cutOffZoom: 16,

	//kick things off
	initialize: function(){
		var self = this;

		//this is our function that updates the data that we'll pass into LightCluster
		var updateFunction = function(){
			//get the scoping right
			var parent = self;
			var map = this.map ? this.map : this._map;

			//I'm using geohash to drill down
			//these are just some helper functions to assist with that
			//you may not need this
			var clickedMarkers = parent.clustering.findAll(map._layers, function (layer) {
				return layer._icon ? layer._wasClicked === true : false;
			});

			var previousClickedMarker = undefined
			if(clickedMarkers.length > 0){
				previousClickedMarker = clickedMarkers[0]
			}

			parent.previousGeoHash = previousClickedMarker ? previousClickedMarker : {options: {geoHash: undefined}};

			//This decides whether to get cluster data or the individual points
			var getData = function(){
				if(this.map.getZoom() < parent.cutOffZoom){
					getClusterData();
				} else {
					getPointsData();
				}
			}

			//This displays the point's data once it is clicked
			//if you didn't notice this demo also comes with a free slide out menu template; enjoy!
			this.showAttributeData = function(data){
				//getting the attributeData from the point and putting it in a menu
				//this would be alot easier with React or Angular but I didn't feel like setting it up
				var dataSpaceDiv = document.getElementById('dataSpace')
				var dataObject = data.target.options.attributeData;
				var objectKeys = Object.keys(dataObject);
				for(var index = 0; index < objectKeys.length; index++) {
					var key = objectKeys[index];
					var dataAttribute = dataObject[key];
					var element = document.createElement('LI');
					element.innerText = key + ": " + dataAttribute;
					var syle = element.style;
					dataSpaceDiv.appendChild(element);
				};
				SlideOutMenuCommon.slideOutMenu.toggleOpen();
			}

			//This takes the data after an update and puts it on the map
			var drawCustomClusters = function (dataClusters) {
						//getting rid of previous clusters and points
						parent.clustering.clearCustomClusters(this.map);
						if (dataClusters) {
							var clusters = []
								dataClusters.forEach(function (customCluster) {
										//create the cluster object
										var clusterLayer = parent.clustering.createClusterLayer(customCluster);
										//attaching the other attributes I want my clusters to have
										//you can put whatever you want on them
										clusterLayer.options.geoHash = customCluster.geoHash;

										//Here I check if our data object has attributeData (i.e. its a point rather than a cluster)
										//LightCluster checks the count and if its 1 it makes a standard marker instead of a cluster
										//if so I attach it to the object LightCluster returns (a stnd marker)
										//I also bind the popups and other event listeners I want on point markers
										if(customCluster.attributeData){
											clusters.push(clusterLayer);
											clusterLayer.options.attributeData = customCluster.attributeData;
											clusterLayer.clearAllEventListeners();
											var popup = L.popup()
												.setLatLng(clusterLayer.getLatLng())
												.setContent("Data Point at " + customCluster.centroid.latitude + " , " + customCluster.centroid.longitude);
											clusterLayer.bindPopup(popup);
											clusterLayer.on('click', this.showAttributeData);
										}
										//adding the objects to the map
										clusterLayer.addTo(this.map);
								});
						}
		};

			//This gets the data for your clusters
			//it could be a service call/api call or whatever you want to use to get your data
			var getClusterData = function(){
				var data = ClusterData.getClusterDataByClick(parent.previousGeoHash.options.geoHash);
				drawCustomClusters(data);
			}

			//This gets the data for single points
			//For this and the previous data I'm being super lazy and just loading it as a script
			//It's all in the MockData Folder if you want to look at it
			var getPointsData = function(){
				var data = PointsData.getPointData(parent.previousGeoHash.options);
				drawCustomClusters(data);
			}

			//Call the function to get the data on update
			getData();
		}

		//This sets up an instance LightCluster for the layer to use
		//since this is just javascript with no client-side framework instances and scopes can be kinda flakey
		//This ensures you're reusing the instance of LightCluster if it exists
		if (!this.clustering) { //If you're writing better code than what I put in this example you probably won't need this check

			//creates an instance of LightCluster and sends it your update function
			this.clustering = L.lightCluster(updateFunction);

			//This sets the option to update on zoom and pan
			//If you're using real services/api calls you're probably getting data by area (wkt, geoJson, etc.)
			//You'll most likely want this set to TRUE if you are!!!
			this.clustering.setMapZoomOptions(false, map, this.cutOffZoom);
		}
		//fires the updateFunction upon layer instantiation
		updateFunction();
	}

});
//Instantiate your layer and add it to the map
var newLayer = new layer();
newLayer.addTo(map);
