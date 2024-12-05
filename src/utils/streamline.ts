import * as Cesium from 'cesium';

const initTrailMaterial = () => {
  Cesium.Material.PolylineTrailType = 'PolylineTrail';
  Cesium.Material.PolylineTrailSource = `
      czm_material czm_getMaterial(czm_materialInput materialInput) {
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st;
          float t = time;
          t *= 2.0;
          float alpha = smoothstep(st.s - trailLength, st.s, t) * 
                       (1.0 - smoothstep(st.s, st.s + trailLength, t));
          material.alpha = alpha;
          material.diffuse = color.rgb;
          return material;
      }
  `;

  Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailType, {
    fabric: {
      type: Cesium.Material.PolylineTrailType,
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
        trailLength: 0.3,
        period: 1.0,
        time: 0.0,
        speed: 0.2, // 속도 제어를 위한 새로운 uniform 추가
      },
      source: `
          czm_material czm_getMaterial(czm_materialInput materialInput) {
              czm_material material = czm_getDefaultMaterial(materialInput);
              vec2 st = materialInput.st;
              float t = time * speed;  // time 변화 속도를 조절
              t *= 2.0;
              float alpha = smoothstep(st.s - trailLength, st.s, t) * 
                          (1.0 - smoothstep(st.s, st.s + trailLength, t));
              material.alpha = alpha;
              material.diffuse = color.rgb;
              return material;
          }
      `,
    },
    translucent: function() {
      return true;
    },
  });

  function PolylineTrailMaterialProperty(options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = options.color;
    this.trailLength = options.trailLength || 0.3;
    this.period = options.period || 1.0;
  }

  Object.defineProperties(PolylineTrailMaterialProperty.prototype, {
    isConstant: {
      get: function() {
        return false;
      },
    },
    definitionChanged: {
      get: function() {
        return this._definitionChanged;
      },
    },
    color: Cesium.createPropertyDescriptor('color'),
  });

  PolylineTrailMaterialProperty.prototype.getType = function() {
    return 'PolylineTrail';
  };

  PolylineTrailMaterialProperty.prototype.getValue = function(time, result) {
    if (!result) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
      this._color, time, Cesium.Color.WHITE, result.color);
    result.trailLength = this.trailLength;
    result.period = this.period;
    result.time = (performance.now() / 1000.0) % this.period;
    return result;
  };

  PolylineTrailMaterialProperty.prototype.equals = function(other) {
    return (this === other
          || (other instanceof PolylineTrailMaterialProperty
              && Cesium.Property.equals(this._color, other._color)
              && this.trailLength === other.trailLength
              && this.period === other.period));
  };

  return PolylineTrailMaterialProperty;
};

export class CurrentAnimation {
  constructor(ODTWIN, data) {
    this.ODTWIN = ODTWIN;
    this.data = data.payload;
    this.entities = [];
    this.isRunning = false;
    this.PolylineTrailMaterialProperty = initTrailMaterial();
  }

  generateCurvedPoints(startPoint, endPoint, curvePoints = 20) {
    const points = [];

    // 중간 제어점 생성 (해류 방향에 따라 휘어지도록)
    const midLon = (startPoint.x + endPoint.x) * 0.5;
    const midLat = (startPoint.y + endPoint.y) * 0.5;

    // 곡선의 휘어짐을 해류 방향에 맞게 조정
    const perpX = -(endPoint.y - startPoint.y) * 0.3; // 수직 방향으로 휘어짐
    const perpY = (endPoint.x - startPoint.x) * 0.3;

    const controlPoint = {
      x: midLon + perpX,
      y: midLat + perpY,
    };

    // 2차 Bezier 곡선 생성
    for (let i = 0; i <= curvePoints; i++) {
      const t = i / curvePoints;

      // Bezier 곡선 공식
      const x = Math.pow(1 - t, 2) * startPoint.x
              + 2 * (1 - t) * t * controlPoint.x
              + Math.pow(t, 2) * endPoint.x;

      const y = Math.pow(1 - t, 2) * startPoint.y
              + 2 * (1 - t) * t * controlPoint.y
              + Math.pow(t, 2) * endPoint.y;

      points.push(x, y);
    }

    return points;
  }

  start() {
    if (this.isRunning) return;

    this.clear();

    this.data.forEach((point, index) => {
      const magnitude = Math.sqrt(point.u * point.u + point.v * point.v);
      if (magnitude === 0) return;

      const scale = 0.5;
      const endPoint = {
        x: point.x + (point.u / magnitude) * scale,
        y: point.y + (point.v / magnitude) * scale,
      };

      const curvedPoints = this.generateCurvedPoints(point, endPoint);

      const normalizedSpeed = Math.min(magnitude / 0.5, 1.0);
      // trailLength를 더 짧게 조정
      const randomTrailLength = 0.3 + (Math.random() * 0.2); // 0.3 ~ 0.5 범위로 변경
      const randomPeriod = 2.0 + (Math.random() * 2.0);
      const randomOffset = Math.random();

      const entity = this.ODTWIN.map.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(curvedPoints),
          width: 2,
          material: new this.PolylineTrailMaterialProperty({
            color: Cesium.Color.fromHsl(0.6, 1.0, 0.5 + normalizedSpeed * 0.3),
            trailLength: randomTrailLength,
            period: randomPeriod,
            offset: randomOffset,
          }),
        },
      });

      this.entities.push(entity);
    });

    this.isRunning = true;
  }

  clear() {
    this.entities.forEach((entity) => {
      this.ODTWIN.map.entities.remove(entity);
    });
    this.entities = [];
    this.isRunning = false;
  }
}