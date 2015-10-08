/**
 * Created by ccour2 on 9/23/15.
 */
require("mocha");
var sinon = require("sinon");
var expect = require("chai").expect;
global.L = require("leaflet");
var LightCluster = require("../../src/LightCluster");
describe("LightCluster", function(){
    var mockLightCluster, mockL, map, mockCountCluster1, mockCountCluster2, mockCountCluster20, mockCountCluster200,
        htmlString1, htmlString2, htmlString3, htmlString4, updateFunction, bbox, calledGetBoundsZoom, fitBoundsCalled,
        removeLayerCalled;
    var updateFunctionCalled = 0;

    beforeEach(function(){
        updateFunctionCalled = 0;
        removeLayerCalled = 0;
        mockL = {upateFunction: {},
            _latlng: {},
            setOptions: function(thiz, options){
                this.updateFunction = options;
            },
            latlng: function(latlong){
                this._latlng = latlong;
            }
        };
        map = {addLayer: function(thiz){
            this._layers.push(thiz);
        }, _layers: [],
            removeLayer: function(something){something = null; removeLayerCalled = removeLayerCalled + 1; this._layers = [];},
            getBoundsZoom: function(bounds, someBoolean){calledGetBoundsZoom = true;},
            fitBounds: function(bounds){fitBoundsCalled = true;}
        };

        bbox = {
            northEast: {lat: -92.8125, lng: 37.001953125},
            southWest: {lat: -92.4609375, lng: 37.353515625}
        };
        mockCountCluster1 = {
            centroid: {latitude: 37.177734375, longitude: -92.63671875},
            boundingBox: {
                xMin: -92.8125,
                xMax: -92.4609375,
                yMin: 37.001953125,
                yMax: 37.353515625
            },
            pointsCount: 1
        };
        mockCountCluster2 = {
            centroid: {latitude: 37.177734375, longitude: -92.63671875},
            boundingBox: {
                xMin: -92.8125,
                xMax: -92.4609375,
                yMin: 37.001953125,
                yMax: 37.353515625
            },
            pointsCount: 2
        };
        mockCountCluster20 = {
            centroid: {latitude: 37.177734375, longitude: -92.63671875},
            boundingBox: {
                xMin: -92.8125,
                xMax: -92.4609375,
                yMin: 37.001953125,
                yMax: 37.353515625
            },
            pointsCount: 20
        };
        mockCountCluster200 = {
            centroid: {latitude: 37.177734375, longitude: -92.63671875},
            boundingBox: {
                xMin: -92.8125,
                xMax: -92.4609375,
                yMin: 37.001953125,
                yMax: 37.353515625
            },
            pointsCount: 200
        };
        htmlString1 = '<svg id="custom-cluster" height="400%" width="400%" style="left:50%; top:50%; -webkit-transform: translate(-50%, -50%);position: absolute">' +
        '<circle cx="50%" cy="50%" r="40%" stroke="';
        htmlString2 = '" stroke-width="12%" fill="';
        htmlString3 = '" style="opacity: 0.85;" />' +
        '<text x="50%" y="54%" text-anchor="middle" style="font-size-adjust: inherit; font-size: 84%">';
        htmlString4 = '</text>' +
        '</svg>';
        updateFunction = function(){
            updateFunctionCalled = updateFunctionCalled +1;
        };
        mockLightCluster = L.lightCluster(updateFunction);

    });
    describe("tests run", function(){
       it("tests run", function(){
           var testVal = 1;
           expect(testVal).to.be.equal(1);
       });
    });

    describe("LightCluster", function(){

        it("initialize", function () {
            var initSpy = sinon.spy(L.LightCluster.prototype, "initialize");
            mockLightCluster.initialize(updateFunction);
            expect(initSpy.called).to.be.equal(true);
            expect(initSpy.calledWith(updateFunction)).to.be.equal(true);
            expect(mockLightCluster.updateFunction).to.be.eql(updateFunction);
            expect(mockLightCluster.initialized).to.be.eql(true);
            initSpy.restore();
        });

        it("addTo", function(){
            var result = mockLightCluster.addTo(map);
            expect(result).to.not.be.undefined;
            expect(map._layers.length).to.be.equal(1);
        });

        it("create Icon", function(){
            var icon = mockLightCluster.createCountClusterIcon(mockCountCluster2);
            expect(icon.options.html).to.not.be.undefined;
            expect(icon.options.html.toString().indexOf(htmlString1.toString()) > -1).to.be.eql(true);
            expect(icon.options.html.toString().indexOf(htmlString2.toString()) > -1).to.be.eql(true);
            expect(icon.options.html.toString().indexOf(htmlString3.toString()) > -1).to.be.eql(true);
            expect(icon.options.html.toString().indexOf(htmlString4.toString()) > -1).to.be.eql(true);
        });

        it("create Cluster Layer 1", function(){
            var createIconSpy = sinon.spy(mockLightCluster, "createCountClusterIcon");
            var result = mockLightCluster.createClusterLayer(mockCountCluster1);
            //console.log(result);
            expect(createIconSpy.called).to.be.equal(true);
            expect(result._initHooksCalled).to.be.eql(true);
            expect(result._latlng.lat).to.be.equal(mockCountCluster1.centroid.latitude);
            expect(result._latlng.lng).to.be.equal(mockCountCluster1.centroid.longitude);
            expect(result.options.boundingBox.northEast.lat).to.be.equal(mockCountCluster1.boundingBox.yMax);
            expect(result.options.boundingBox.southWest.lat).to.be.equal(mockCountCluster1.boundingBox.yMin);
            expect(result.options.boundingBox.northEast.lng).to.be.equal(mockCountCluster1.boundingBox.xMax);
            expect(result.options.boundingBox.southWest.lng).to.be.equal(mockCountCluster1.boundingBox.xMin);
            expect(result.options.clickable).to.be.eql(true);
            expect(result.options.draggable).to.be.eql(false);
            expect(result.options.icon.options.html).to.be.undefined;
            expect(result.options.zoomToBoundsOnClick).to.be.eql(true);
            createIconSpy.restore

        });

        it("create Cluster Layer 2", function(){
            var createIconSpy = sinon.spy(mockLightCluster, "createCountClusterIcon");
            var result = mockLightCluster.createClusterLayer(mockCountCluster2);
            expect(createIconSpy.called).to.be.eql(true);
            expect(result._initHooksCalled).to.be.eql(true);
            expect(result._latlng.lat).to.be.equal(mockCountCluster2.centroid.latitude);
            expect(result._latlng.lng).to.be.equal(mockCountCluster2.centroid.longitude);
            expect(result.options.boundingBox.northEast.lat).to.be.equal(mockCountCluster2.boundingBox.yMax);
            expect(result.options.boundingBox.southWest.lat).to.be.equal(mockCountCluster2.boundingBox.yMin);
            expect(result.options.boundingBox.northEast.lng).to.be.equal(mockCountCluster2.boundingBox.xMax);
            expect(result.options.boundingBox.southWest.lng).to.be.equal(mockCountCluster2.boundingBox.xMin);
            expect(result.options.clickable).to.be.eql(true);
            expect(result.options.draggable).to.be.eql(false);
            expect(result.options.icon.options.html).to.not.be.undefined;
            expect(result.options.icon.options.html.toString().indexOf(htmlString1.toString()) > -1).to.be.eql(true);
            expect(result.options.icon.options.html.toString().indexOf(htmlString2.toString()) > -1).to.be.eql(true);
            expect(result.options.icon.options.html.toString().indexOf(htmlString3.toString()) > -1).to.be.eql(true);
            expect(result.options.icon.options.html.toString().indexOf(htmlString4.toString()) > -1).to.be.eql(true);
            expect(result.options.zoomToBoundsOnClick).to.be.eql(true);
            createIconSpy.restore()
        });

        it("create Cluster Layer 20", function(){
            var createIconSpy = sinon.spy(mockLightCluster, "createCountClusterIcon");
            var result = mockLightCluster.createClusterLayer(mockCountCluster20);
            expect(createIconSpy.called).to.be.eql(true);
            expect(result._initHooksCalled).to.be.eql(true);
            expect(result._latlng.lat).to.be.equal(mockCountCluster20.centroid.latitude);
            expect(result._latlng.lng).to.be.equal(mockCountCluster20.centroid.longitude);
            expect(result.options.boundingBox.northEast.lat).to.be.equal(mockCountCluster20.boundingBox.yMax);
            expect(result.options.boundingBox.southWest.lat).to.be.equal(mockCountCluster20.boundingBox.yMin);
            expect(result.options.boundingBox.northEast.lng).to.be.equal(mockCountCluster20.boundingBox.xMax);
            expect(result.options.boundingBox.southWest.lng).to.be.equal(mockCountCluster20.boundingBox.xMin);
            expect(result.options.clickable).to.be.eql(true);
            expect(result.options.draggable).to.be.eql(false);
            expect(result.options.icon.options.html).to.not.be.undefined;
            expect(result.options.icon.options.html.toString().indexOf(htmlString1.toString()) > -1).to.be.eql(true);
            expect(result.options.icon.options.html.toString().indexOf(htmlString2.toString()) > -1).to.be.eql(true);
            expect(result.options.icon.options.html.toString().indexOf(htmlString3.toString()) > -1).to.be.eql(true);
            expect(result.options.icon.options.html.toString().indexOf(htmlString4.toString()) > -1).to.be.eql(true);
            expect(result.options.zoomToBoundsOnClick).to.be.eql(true);
            createIconSpy.restore();
        });

        it("create Cluster Layer 200", function(){
            var createIconSpy = sinon.spy(mockLightCluster, "createCountClusterIcon");
            var result = mockLightCluster.createClusterLayer(mockCountCluster200);

            expect(createIconSpy.called).to.be.eql(true);
            expect(result._initHooksCalled).to.be.eql(true);
            expect(result._latlng.lat).to.be.equal(mockCountCluster200.centroid.latitude);
            expect(result._latlng.lng).to.be.equal(mockCountCluster200.centroid.longitude);
            expect(result.options.boundingBox.northEast.lat).to.be.equal(mockCountCluster200.boundingBox.yMax);
            expect(result.options.boundingBox.southWest.lat).to.be.equal(mockCountCluster200.boundingBox.yMin);
            expect(result.options.boundingBox.northEast.lng).to.be.equal(mockCountCluster200.boundingBox.xMax);
            expect(result.options.boundingBox.southWest.lng).to.be.equal(mockCountCluster200.boundingBox.xMin);
            expect(result.options.clickable).to.be.eql(true);
            expect(result.options.draggable).to.be.eql(false);
            expect(result.options.geohash).to.be.equal(mockCountCluster200.geoHash);
            expect(result.options.icon.options.html).to.not.be.undefined;
            expect(result.options.icon.options.html.toString().indexOf(htmlString1.toString()) > -1).to.be.eql(true);
            expect(result.options.icon.options.html.toString().indexOf(htmlString2.toString()) > -1).to.be.eql(true);
            expect(result.options.icon.options.html.toString().indexOf(htmlString3.toString()) > -1).to.be.eql(true);
            expect(result.options.icon.options.html.toString().indexOf(htmlString4.toString()) > -1).to.be.eql(true);
            expect(result.options.zoomToBoundsOnClick).to.be.eql(true);
            expect(result.findAll).to.be.equal(mockLightCluster.findAll);
            expect(result._removeRectangles).to.be.equal(mockLightCluster._removeRectangles);
            createIconSpy.restore();
        });

        it("findAll", function(){
            var objectList = [{id: 1},{id: 1},{id: 8},{id: 1},{id: 1},{id: 9},{id: 1},{id: 1},{id: 7},{id: 1},{id: 10}];
            var results1 = mockLightCluster.findAll(objectList, function (object) {
                return object.id ? object.id === 1 : false;
            });
            expect(results1.length).to.be.equal(7);
            expect(results1).to.be.eql([{id:1},{id:1},{id:1},{id:1},{id:1},{id:1},{id:1}]);

            var results8 = mockLightCluster.findAll(objectList, function (object) {
                return object.id ? object.id === 8 : false;
            });
            expect(results8.length).to.be.equal(1);
            expect(results8).to.be.eql([{id:8}]);

            var results9 = mockLightCluster.findAll(objectList, function (object) {
                return object.id ? object.id === 9 : false;
            });
            expect(results9.length).to.be.equal(1);
            expect(results9).to.be.eql([{id:9}]);

            var results7 = mockLightCluster.findAll(objectList, function (object) {
                return object.id ? object.id === 7 : false;
            });
            expect(results7.length).to.be.equal(1);
            expect(results7).to.be.eql([{id:7}]);

            var results10 = mockLightCluster.findAll(objectList, function (object) {
                return object.id ? object.id === 10 : false;
            });
            expect(results10.length).to.be.equal(1);
            expect(results10).to.be.eql([{id:10}]);

            var results23 = mockLightCluster.findAll(objectList, function (object) {
                return object.id ? object.id === 23 : false;
            });
            expect(results23.length).to.be.equal(0);
            expect(results23).to.be.eql([]);
        });

        it("on Marker Click", function(){
            updateFunctionCalled = 0;
            removeLayerCalled = 0;
            mockLightCluster._map = map;
            mockLightCluster._shownRectangle = "someRectangle";
            mockLightCluster.options = {something: "something"};
            mockLightCluster.options.boundingBox = bbox;
            mockLightCluster.options.updateFunction = updateFunction;
            mockLightCluster.onMarkerClick();
            expect(calledGetBoundsZoom).to.be.eql(true);
            expect(fitBoundsCalled).to.be.eql(true);
            expect(updateFunctionCalled).to.be.equal(1);
            expect(mockLightCluster._shownRectangle).to.be.equal(null);
            expect(mockLightCluster._shownRectangle).to.be.equal(null);
            expect(mockLightCluster._wasClicked).to.be.eql(true);
            expect(removeLayerCalled).to.be.equal(1);
        });

        it("shown coverage rectangle", function(){
            mockLightCluster._map = map;
            mockLightCluster._shownRectangle = "someRectangle";
            mockLightCluster.options = {something: "something"};
            mockLightCluster.options.boundingBox = bbox;

            var rectangleResult = L.polygon([[bbox.northEast.lat, bbox.southWest.lng], [bbox.northEast.lat, bbox.northEast.lng],
                [bbox.southWest.lat, bbox.northEast.lng], [bbox.southWest.lat, bbox.southWest.lng]]);
            rectangleResult.id = 'bboxCoverageRectangle';

            mockLightCluster._showCoverageRectangle();
            expect(removeLayerCalled).to.be.equal(1);
            expect(map._layers.length).to.be.equal(1);
            expect(map._layers[0]).to.be.eql(rectangleResult);
        });

        it("hide coverage rectangle", function(){
            var removeRecSpy = sinon.spy(mockLightCluster, '_removeRectangles');
            mockLightCluster._map = map;
            mockLightCluster._shownRectangle = "someRectangle";

            mockLightCluster._hideCoverageRectangle();
            expect(removeLayerCalled).to.be.equal(1);
            expect(mockLightCluster._shownRectangle).to.be.equal(null);
            expect(mockLightCluster._removeRectangles);
            removeRecSpy.restore();
        });

        it("remove rectangles", function(){
            mockLightCluster._map = map;
            mockLightCluster._shownRectangle = "someRectangle";
            mockLightCluster.options = {something: "something"};
            mockLightCluster.options.boundingBox = bbox;

            var rectangleResult = L.polygon([[bbox.northEast.lat, bbox.southWest.lng], [bbox.northEast.lat, bbox.northEast.lng],
                [bbox.southWest.lat, bbox.northEast.lng], [bbox.southWest.lat, bbox.southWest.lng]]);
            rectangleResult.id = 'bboxCoverageRectangle';

            mockLightCluster._showCoverageRectangle();
            expect(removeLayerCalled).to.be.equal(1);
            expect(map._layers.length).to.be.equal(1);
            expect(map._layers[0]).to.be.eql(rectangleResult);

            mockLightCluster._removeRectangles(mockLightCluster._map);
            expect(removeLayerCalled).to.be.equal(2);
            expect(map._layers.length).to.be.equal(0);

        });

        it("map events", function(){
            updateFunctionCalled = 0;
            map.currentZoom = 5;
            map.getZoom = function(){
                return 5;
            };
            map.hasEventListeners = function(){
                return true;
            };
            map.fire = L.Mixin.Events.fireEvent;
            map.on = L.Mixin.Events.addEventListener;
            mockLightCluster.on = L.Mixin.Events.addEventListener;
            mockLightCluster.upateFunction = updateFunction;

            mockLightCluster._map = map;
            mockLightCluster.map = map;
            mockLightCluster.setMapZoomOptions(true, map,14);

            mockLightCluster.map.fire('viewreset');
            expect(updateFunctionCalled).to.be.equal(0);

            mockLightCluster.map.currentZoom = 6;
            mockLightCluster.map.fire('viewreset');
            expect(updateFunctionCalled).to.be.equal(1);

            map.fire("dragend");
            expect(updateFunctionCalled).to.be.equal(2);
        });

        it("marker.addTo", function(){
            var customMarker = mockLightCluster.createClusterLayer(mockCountCluster20);
            customMarker._icon = {classList: ["leaflet-div-icon"]};
            customMarker._icon.classList.remove = function(){
                customMarker._icon.classList.pop();
            };
            customMarker._icon.classList.add = function(className){
                customMarker._icon.classList.push(className);
            };
            var customAddToResult = customMarker.addTo(map);
            var classList = customAddToResult._icon.classList;
            var containsLeafletDiveIconClass = classList.indexOf("leaflet-div-icon");
            var containsCustomClusterClass = classList.indexOf("custom-cluster");

            expect(containsLeafletDiveIconClass >= 0).to.be.eql(false);
            expect(containsCustomClusterClass >= 0).to.be.eql(true);
        });

        it("clear Custom Clusters", function(){
            var newMap = map;
            var customMarker = mockLightCluster.createClusterLayer(mockCountCluster20);
            customMarker._icon = {classList: ["leaflet-div-icon"]};
            customMarker._icon.classList.remove = function(){
                customMarker._icon.classList.pop();
            };
            customMarker._icon.classList.add = function(className){
                customMarker._icon.classList.push(className);
            };
            var customAddToResult = customMarker.addTo(newMap);
            expect(newMap._layers.length).to.be.equal(1);
            mockLightCluster.clearCustomClusters(newMap);
            expect(newMap._layers.length).to.be.equal(0);
        });
    });
});