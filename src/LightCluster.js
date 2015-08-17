L.LightCluster = L.FeatureGroup.extend({

        initialized: null,

        updateFunction: {
            //A function specifying how you want the library to Perform i.e. updating, service calls, etc.
        },

        map: {},

        setMapZoomOptions: function (makeCallOnZoom, map, maxZoom) {
            if (makeCallOnZoom) {
                var updateFunction = this.updateFunction;
                map.on('viewreset', function (e) {
                    if ((map.currentZoom !== map.getZoom()) && (map.getZoom() <= maxZoom)) {
                        map.currentZoom = map.getZoom();
                        updateFunction();
                    }
                });
                map.on('dragend', function (e) {
                    if (map.getZoom() <= maxZoom) {
                        updateFunction();
                    }
                });
            }
            this.map = map;
        },

        initialize: function (options) {
            if (!this.initialized) {
                this.updateFunction = options;
                this.updateFunction.call(this);
                this.initialized = true;
            }

        },

        addTo: function (map) {
            map.addLayer(this);
            return this;
        },

        createCountClusterIcon: function (countCluster) {
            var childCount = countCluster.pointsCount;
            var c = {size: "", strokeColor: "", color: ""};
            if (childCount < 10) {
                c.size = "small";
                c.strokeColor = "#B5E28C";
                c.color = "#6ECC39";
                c.cx = "20%";
                c.cy = "20%";
            } else {
                if (childCount < 100) {
                    c.size = "medium";
                    c.strokeColor = "#F1D357";
                    c.color = "#F0C20C";
                    c.cx = "35%";
                    c.cy = "35%";
                } else {
                    c.size = "large";
                    c.strokeColor = "#FD9C73";
                    c.color = "#F18017";
                    c.cx = "50%";
                    c.cy = "50%";
                }
            }

            var htmlIcon = new L.DivIcon({
                html: '<svg id="custom-cluster" height="400%" width="400%" style="left:50%; top:50%; -webkit-transform: translate(-50%, -50%);position: absolute">' +
                '<circle cx="50%" cy="50%" r="40%" stroke="' + c.strokeColor + '" stroke-width="12%" fill="' + c.color + '" style="opacity: 0.85;" />' +
                '<text x="50%" y="54%" text-anchor="middle" style="font-size-adjust: inherit; font-size: 84%">' + childCount + '</text>' +
                '</svg>'


            });
            return htmlIcon;
        },

        findAll: function (objectList, testingFunction) {
            var keysList = Object.keys(objectList);
            var filteredList = [];
            for (var keyIndex = 0; keyIndex < keysList.length; keyIndex++) {
                var key = keysList[keyIndex];
                var object = objectList[key];
                if (testingFunction(object)) {
                    filteredList.push(object);
                }
            }
            return filteredList;
        },

        clearCustomClusters: function (map) {
            var oldClusters = this.findAll(map._layers, function (layer) {
                return layer.options ? layer.options.id === "custom-cluster" : false;
            });
            if (oldClusters) {
                oldClusters.forEach(function (cluster) {
                    map.removeLayer(cluster);
                });
            }
        },

        onMarkerClick: function () {
            if (this._shownRectangle) {
                this._map.removeLayer(this._shownRectangle);
                this._shownRectangle = null;
            }
            var bbox = this.options.boundingBox;
            var east = bbox.northEast.lng;
            var west = bbox.southWest.lng;
            var south = bbox.southWest.lat;
            var north = bbox.northEast.lat;
            var map = this._map;
            this._wasClicked = true;
            var bounds = L.latLngBounds([south, west], [north, east]);
            bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);
            map.currentZoom = map.getBoundsZoom(bounds, false);
            map.fitBounds(bounds);
            this.options.updateFunction.call(this);
        },

        _showCoverageRectangle: function (e) {
            var map = this._map;
            if (this._shownRectangle) {
                map.removeLayer(this._shownRectangle);
            }
            var bbox = this.options.boundingBox;
            var east = bbox.northEast.lng;
            var west = bbox.southWest.lng;
            var south = bbox.southWest.lat;
            var north = bbox.northEast.lat;
            this._shownRectangle = L.polygon([
                [north, west],
                [north, east],
                [south, east],
                [south, west]
            ]);
            this._shownRectangle.id = "bboxCoverageRectangle";
            map.addLayer(this._shownRectangle);

        },
        _removeRectangles: function (map) {
            var rectangles = this.findAll(map._layers, function (layer) {
                return layer.id ? layer.id === "bboxCoverageRectangle" : false;
            });
            rectangles.forEach(function (rectangle) {
                map.removeLayer(rectangle);
            });
        },
        _hideCoverageRectangle: function () {
            if (this._shownRectangle) {
                this._map.removeLayer(this._shownRectangle);
                this._shownRectangle = null;
            }
            this._removeRectangles(this._map);
        },

        /*Expected Data structure
         countCluster: {
         latlng: {latitude: someValue, longitude: someValue},
         boundingBox: {xMin: someValue, xMax, someValue, yMin: someValue, yMax: someValue},
         pointsCount: integer
         }*/

        createClusterLayer: function (countCluster) {
            var icon = this.createCountClusterIcon(countCluster);
            var countClusterLayer = {
                options: {
                    id: "custom-cluster",
                    clickable: true,
                    zoomToBoundsOnClick: true,
                    updateFunction: this.updateFunction
                }
            };
            if (countCluster.pointsCount > 1) {
                countClusterLayer.options.icon = icon;
            }
            countClusterLayer._latlng = L.latLng(countCluster.centroid.latitude, countCluster.centroid.longitude);
            var boundingBox = countCluster.boundingBox;
            var southWest = {lat: boundingBox.yMin, lng: boundingBox.xMin};
            var northEast = {lat: boundingBox.yMax, lng: boundingBox.xMax};
            countClusterLayer.options.boundingBox = {southWest: southWest, northEast: northEast};
            countClusterLayer._intiHooksCalled = true;
            var marker = new L.marker(countClusterLayer._latlng, countClusterLayer.options);
            marker.on('click', this.onMarkerClick).on('mouseover', this._showCoverageRectangle).on('mouseout', this._hideCoverageRectangle);
            marker._removeRectangles = this._removeRectangles;
            marker.findAll = this.findAll;

            marker.addTo = function (map) {
                map.addLayer(this);
                this._icon.classList.remove("leaflet-div-icon");
                this._icon.classList.add("custom-cluster");
                return this;
            };

            return marker;
        }

    });
    L.Map.include({
        currentZoom: {}
    });
    L.Mixin.Events.on = L.Mixin.Events.addEventListener;
    L.Mixin.Events.fire = L.Mixin.Events.fireEvent;
    L.lightCluster = function (options) {
        return new L.LightCluster(options);
    };