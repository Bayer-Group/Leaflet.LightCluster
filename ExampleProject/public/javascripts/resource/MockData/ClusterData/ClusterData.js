window.ClusterData = this;

var previousPrecision = {};
var getClusterDataByClick = function(geohash){
  if(geohash === undefined){
    return GeoHash2Data.data;
  } else {

    var geohashPrecision = geohash.length + 1;
    switch (geohashPrecision) {
      case 2:
        previousPrecision = geohashPrecision;
        return GeoHash2Data.data;
        break;
      case 3:
        previousPrecision = geohashPrecision;
        return GeoHash3Data.data;
        break;
      case 4:
        previousPrecision = geohashPrecision;
        return GeoHash4Data.data;
        break;
      case 5:
        previousPrecision = geohashPrecision;
        return GeoHash5Data.data;
        break;
      case 6:
        previousPrecision = geohashPrecision;
        return GeoHash6Data.data;
        break;
      default:
        return null;
        break;
    }

}

}
