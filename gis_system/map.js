require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer"
  ],function(Map, MapView, FeatureLayer) {
        var map = new Map({
            basemap: "topo-vector"
        });

        var view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-98.5795, 39.8283],
            zoom: 4
        });
        
        var featureLayer = new FeatureLayer({
            url: "https://services.arcgis.com/h1HPF81YCOI467An/arcgis/rest/services/modernist_test/FeatureServer/0",
            outFields: ["*"], // Return all fields so it can be queried client-side
            popupTemplate: {  // Enable a popup
                title: "{name}", // Show attribute value
                content: "The {name} is located at {address}. Built by {architect} in {year}."
            }
        });

        var selectFilter = document.createElement("input");
        selectFilter.setAttribute("class", "esri-widget map-search-box");
        selectFilter.setAttribute("placeholder", "Search for architect...");

        view.ui.add(selectFilter, "top-right");

        function setFeatureLayerViewFilter(term) {
            const expression = term.toLowerCase();
            view.whenLayerView(featureLayer).then(function(featureLayerView) {
                featureLayerView.filter = {
                    where: `lower(architect) like '%${expression}%' or lower(address) like '%${expression}%' or lower(name) like '%${expression}%' or year = '${expression}'`
                };
            });
        }

        selectFilter.addEventListener('change', function (event) {
            setFeatureLayerViewFilter(event.target.value);
        });

        map.add(featureLayer);
  })
