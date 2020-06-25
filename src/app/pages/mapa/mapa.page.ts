import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  param: Params;
  lat: Number;
  lng: Number;
  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.params.subscribe(param => {
      this.param = param;
      let geo = param.geo.substr(4);
      geo = geo.split(',');
      this.lat = Number(geo[0].trim());
      this.lng = Number(geo[1].trim());
      console.log(this.lat, this.lng)
    })
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9zZWNvYm9yaXZhcyIsImEiOiJja2J2MjY1b3UwMXYzMnBud25oNWUwNmttIn0.B5Xg7kaT0YxvyKYQZX2MVQ';
    const coordinates = document.getElementById('coordinates');
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
    });

    map.on('load', () => {
      map.resize();

      const marker = new mapboxgl.Marker({
        draggable: false
        })
        .setLngLat([this.lng, this.lat])
        .addTo(map);

      // Insert the layer beneath any symbol layer.
      var layers = map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      map.addLayer(
        {
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    });
  }

}
