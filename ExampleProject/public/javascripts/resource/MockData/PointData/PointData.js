window.PointsData = this;

var getPointData = function(previousCluster){

  var points = [];

  for(var i = 0; i < previousCluster.pointsCount; i++){
    var point = {
      "geoHash": undefined,
      "centroid": {
        "latitude": undefined,
        "longitude": undefined
      },
      "pointsCount": 1,
      "boundingBox": {
        "xMin": 0,
        "xMax": 0,
        "yMin": 0,
        "yMax": 0
      }
    }
    var lat = Math.random() * (previousCluster.boundingBox.northEast.lat - previousCluster.boundingBox.southWest.lat) + previousCluster.boundingBox.southWest.lat;
    var long = Math.random() * (previousCluster.boundingBox.northEast.lng - previousCluster.boundingBox.southWest.lng) + previousCluster.boundingBox.southWest.lng;
    point.centroid.latitude = Math.round(lat * Math.pow(10, 6)) / Math.pow(10, 6);//lat;
    point.centroid.longitude = Math.round(long * Math.pow(10, 6)) / Math.pow(10, 6);//long;
    point.attributeData = PointsAttributes.data;
    points.push(point);
  }

  return points;
}
