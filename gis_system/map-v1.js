require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic"
  ],
  function(
    Map, MapView, FeatureLayer, GraphicsLayer, Graphic
  ) {
    var map = new Map({
      basemap: "topo-vector"
    });
  
    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-98.5795, 39.8283],
      zoom: 4
    });
    
    // //*** CHALLENGE ***//
    var sql = "architect like '%John Lautner%'";

    view.when(function(){
      queryFeatureLayerView(view.center, 1500, "intersects")
    });

    view.on("click", function(event){
      queryFeatureLayer(event.mapPoint, 1500, "intersects")

      queryFeatureLayerView(event.mapPoint, 1500, "intersects", sql)
    });

  
    // Reference the feature layer to query

    var featureLayer = new FeatureLayer({
      url: "https://services.arcgis.com/h1HPF81YCOI467An/arcgis/rest/services/modernist_test/FeatureServer/0",
    });
  
   // Add a graphics layer to hold features and draw data
  
    var graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);
  
    function addGraphics(result) {
      graphicsLayer.removeAll();
      result.features.forEach(function(feature){
        var g = new Graphic({
          geometry: feature.geometry,
          attributes: feature.attributes,
          symbol: {
           type: "simple-marker",
            color: [0,0,0],
            outline: {
             width: 2,
             color: [0,255,255],
           },
            size: "20px"
          },
          popupTemplate: {
           title: "{name}",
           content: "The {name} is located at {address}. Built by {architect} in {year}"
          }
        });
        graphicsLayer.add(g);
      });
    }
  
    // Server-side query
  
    function queryFeatureLayer(point, distance, spatialRelationship, sqlExpression) {
      var query = {
        geometry: point,
        distance: distance,
        spatialRelationship: spatialRelationship,
        outFields: ["*"],
        returnGeometry: true,
        where: sqlExpression
      };
      featureLayer.queryFeatures(query).then(function(result) {
        addGraphics(result);
      });
    }  
      
    // Client-side query
  
    function queryFeatureLayerView(point, distance, spatialRelationship, sqlExpression){ 
      if (!map.findLayerById(featureLayer.id)) {
        featureLayer.outFields = ["*"];
        map.add(featureLayer,0);
      }
      var query = {
        geometry: point,
        distance: distance,
        spatialRelationship: spatialRelationship,
        outFields: ["*"],
        returnGeometry: true,
        where: sqlExpression
      };
      // Wait for the layerview to be ready and then query features
      view.whenLayerView(featureLayer).then(function(featureLayerView) {
        if (featureLayerView.updating) {
          var handle = featureLayerView.watch("updating", function(isUpdating){
            if (!isUpdating) {
              featureLayerView.queryFeatures(query).then(function(result) {
                addGraphics(result) 
              });
              handle.remove();
            }
          });            
        } else {
          featureLayerView.queryFeatures(query).then(function(result) {
            addGraphics(result);
          });
        }
      });
    }
  });