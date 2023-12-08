import Draw from 'ol/interaction/Draw';
import Fill from 'ol/style/Fill';
import GeoJSON from 'ol/format/GeoJSON';
import Snap from 'ol/interaction/Snap';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import {
  getCircleFeature,
  getEllipseFeature,
  getPointWithTextAndZoomFeature,
  getPointWithTextFeature,
  getPolygonFeature,
  getSlantedRectangleFeature,
} from './OLMapFeature.js';

const initMap = () => {
  // Create an ol Map .........................................................
  const olMap = new Map({
    target: 'map-container',
    view: new View({
      center: fromLonLat([0, 0]),
      zoom: 1,
    }),
  });

  // Create a source for the vector features and add it to the map as a layer .
  const vectorSource = new VectorSource();

  // Draw a polygon in a ol map ..............................................
  vectorSource.addFeature(
    getPolygonFeature([
      [0, 0],
      [20, 0],
      [30, 15],
      [20, 30],
      [0, 30],
      [-10, 15],
    ])
  );

  // Draw a rectangle in a ol map ..........................................
  // Fill the color rgba(0,255,0,0.2) inside the rectangle .................
  // Give the boundary red color ...........................................
  vectorSource.addFeature(
    getPolygonFeature([
      [0, 5],
      [20, 5],
      [20, 25],
      [0, 25],
    ])
  );

  // Increase the zoom to maximum in which  both the polygon and rectangle is shown at its largest size.
  // Get the extent that encompasses both features ..........................
  const extent = vectorSource.getExtent();
  // Set the view to the calculated extent
  olMap.getView().fit(extent, {padding: [20, 20, 20, 20], maxZoom: 20});

  // Write the text ‘rectangle’ at the center of the rectangle and give fontSize 10px.
  vectorSource.addFeature(
    getPolygonFeature([
      [30, 35],
      [50, 35],
      [50, 55],
      [30, 55],
    ])
  );
  const textPointFeature = getPointWithTextFeature(
    [40, 45],
    new Style({
      text: new Text({
        text: 'Rectangle',
        font: '10px Arial',
        fill: new Fill({color: 'black'}),
        textAlign: 'center',
        textBaseline: 'middle',
      }),
    })
  );
  vectorSource.addFeature(textPointFeature);

  // Currently the fontSize is not affected when we zoom out or zoom In the map.
  // Make the changes so that the font size decreases when we zoom out of the map.
  // Give the text size according to your need
  const square = getPolygonFeature([
    [60, 65],
    [100, 65],
    [100, 85],
    [60, 85],
  ]);
  vectorSource.addFeature(square);
  const varFontSizePointFeature = getPointWithTextAndZoomFeature(
    [80, 75],
    olMap
  );
  vectorSource.addFeature(varFontSizePointFeature);

  // Draw a slanted rectangle at angle 45 degree ............................
  const center = [50, 10];
  const width = 30;
  const height = 20;
  const angle = Math.PI / 4; // 45 degrees in radians
  const slantedRectangleFeature = getSlantedRectangleFeature(
    center,
    width,
    height,
    angle
  );
  vectorSource.addFeature(slantedRectangleFeature);

  // Draw a circle feature and add it to the source .........................
  const center3 = [0, 60];
  const radius = [20];
  const circleFeature = getCircleFeature(center3, radius);
  vectorSource.addFeature(circleFeature);

  // Draw an ellipse feature and add it to the source ........................
  const center2 = [0, 0];
  const semiMajorAxis = 80;
  const semiMinorAxis = 50;
  const rotation = Math.PI / 4; // 45 degrees in radians

  const ellipseFeature = getEllipseFeature(
    center2,
    semiMajorAxis,
    semiMinorAxis,
    rotation
  );

  vectorSource.addFeature(ellipseFeature);

  // Create a layer
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  // Add the layer to the map
  olMap.addLayer(vectorLayer);

  // Create a style for the drawn features ..................................
  const drawStyle = new Style({
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: 'blue',
      width: 2,
    }),
  });

  // Create a draw interaction to draw polygons .............................
  const draw = new Draw({
    source: vectorSource,
    type: 'Polygon',
    style: drawStyle,
  });

  olMap.addInteraction(draw);

  // Add Snap ...............................................................
  olMap.addInteraction(
    new Snap({
      source: vectorSource,
    })
  );

  // Actions ................................................................
  const clear = document.getElementById('clear');
  clear.addEventListener('click', function () {
    vectorSource.clear();
  });

  const format = new GeoJSON({featureProjection: 'EPSG:3857'});
  const download = document.getElementById('download');

  vectorSource.on('change', function () {
    const features = vectorSource.getFeatures();
    const json = format.writeFeatures(features);
    download.href =
      'data:application/json;charset=utf-8,' + encodeURIComponent(json);
  });
};

initMap();
