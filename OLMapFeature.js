import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import {Circle, Point, Polygon} from 'ol/geom';
import {Feature} from 'ol';

export const getPolygonFeature = (coords) => {
  const rectangleCoords = coords;
  const rectangleStyle = new Style({
    fill: new Fill({
      color: 'rgba(0, 255, 0, 0.2)', // Green fill color with 40% opacity
    }),
    stroke: new Stroke({
      color: 'red', // Red stroke color
      width: 2,
    }),
  });

  const rectanglePolygon = new Polygon([rectangleCoords]);
  const rectangleFeature = new Feature(rectanglePolygon);
  rectangleFeature.setStyle(rectangleStyle);

  return rectangleFeature;
};

export const getPointFeature = (coords) => {
  const rectangleCoords = coords;
  const rectanglePointPolygon = new Point(rectangleCoords);
  const rectangleTextFeature = new Feature(rectanglePointPolygon);
  return rectangleTextFeature;
};

export const getPointWithTextFeature = (coords) => {
  const rectangleCoords = coords;
  const rectangleTextFeature = getPointFeature(rectangleCoords);

  rectangleTextFeature.setStyle(
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

  return rectangleTextFeature;
};

export const getPointWithTextAndZoomFeature = (coords, olMap) => {
  const rectangleCoords = coords;
  const rectangleTextFeature = getPointFeature(rectangleCoords);

  const addDynamicStyle = (feature, resolution) => {
    const zoom = olMap.getView().getZoom();

    const baseFontSize = 14;
    const fontSize = Math.floor(zoom / (resolution * baseFontSize)); // Adjust this formula based on your preference

    const rectangleText = new Text({
      text: 'Rectangle',
      font: `${fontSize}px Arial`,
      fill: new Fill({color: 'black'}),
      textAlign: 'center',
      textBaseline: 'middle',
    });

    return new Style({
      text: rectangleText,
    });
  };

  rectangleTextFeature.setStyle(addDynamicStyle);

  return rectangleTextFeature;
};

export const getSlantedRectangleFeature = (center, width, height, angle) => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  // Define the coordinates of the rectangle
  const rectangleCoords = [
    [center[0] - halfWidth, center[1] - halfHeight],
    [center[0] + halfWidth, center[1] - halfHeight],
    [center[0] + halfWidth, center[1] + halfHeight],
    [center[0] - halfWidth, center[1] + halfHeight],
    [center[0] - halfWidth, center[1] - halfHeight],
  ];

  // Create a slanted rectangle geometry
  const slantedRectangleGeometry = new Polygon([rectangleCoords]);
  slantedRectangleGeometry.rotate(angle, center);

  // Create a feature with the slanted rectangle geometry
  const slantedRectangleFeature = new Feature(slantedRectangleGeometry);

  // Style for the slanted rectangle
  const style = new Style({
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.3)',
    }),
    stroke: new Stroke({
      color: 'blue',
      width: 2,
    }),
  });

  slantedRectangleFeature.setStyle(style);

  return slantedRectangleFeature;
};

export const getCircleFeature = (center, radius) => {
  // Create a circle geometry using ol.geom.Circle
  const circleGeometry = new Circle(center, radius);

  // Create a feature with the circle geometry
  const circleFeature = new Feature(circleGeometry);

  // Style for the circle
  const style = new Style({
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.3)', // Fill color (blue with 30% opacity)
    }),
    stroke: new Stroke({
      color: 'blue', // Stroke color (blue)
      width: 2, // Stroke width
    }),
  });

  circleFeature.setStyle(style);

  return circleFeature;
};

export const getEllipseFeature = (
  center,
  semiMajorAxis,
  semiMinorAxis,
  rotation = 0,
  sides = 200
) => {
  const ellipseCoords = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides;
    const x = center[0] + semiMajorAxis * Math.cos(angle);
    const y = center[1] + semiMinorAxis * Math.sin(angle);

    ellipseCoords.push([x, y]);
  }

  // Create an ellipse geometry using ol.geom.Polygon
  const ellipseGeometry = new Polygon([ellipseCoords]);
  ellipseGeometry.rotate(rotation, center);

  // Create a feature with the ellipse geometry
  const ellipseFeature = new Feature(ellipseGeometry);

  // Style for the ellipse
  const style = new Style({
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.3)', // Fill color (red with 30% opacity)
    }),
    stroke: new Stroke({
      color: 'red', // Stroke color (red)
      width: 2, // Stroke width
    }),
  });

  ellipseFeature.setStyle(style);

  return ellipseFeature;
};
