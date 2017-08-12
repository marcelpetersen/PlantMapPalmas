import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PopoverController, NavParams } from 'ionic-angular';

import { Arvore } from '../modelo/arvore';
import { ARVORES_MEDICINAIS } from '../modelo/mock-arvores';
import { ARVORES_FRUTIFERAS } from '../modelo/mock-arvores';
import { PopoverPage } from '../modelo/popoverPage';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})

export class HomePage {

  itemsMedic = ARVORES_MEDICINAIS;
  itemsFruit = ARVORES_FRUTIFERAS;
  map: any;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;

  constructor(public navCtrl: NavController,
    public geolocation: Geolocation,
    private popoverCtrl: PopoverController) {
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(PopoverPage, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });
    popover.present({
      ev: ev
    });
  }

  itemSelected(item: string) {
   console.log("Selected Item", item);
 }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
      this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
       center: latLng,
       zoom: 14,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     }
     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
   }, (err) => {
     console.log(err);
   });
 }

 addInfoWindow(marker, content){
   let infoWindow = new google.maps.InfoWindow({
     content: content
   });
   google.maps.event.addListener(marker, 'click', () => {
     infoWindow.open(this.map, marker);
   });
 }

 addMarker(){
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
  });
  let content = "<h4>ArvoreX</h4>";
  this.loadMarkers();
  this.addInfoWindow(marker, content);
}

loadMarkers(){
        var records = ARVORES_MEDICINAIS;
        for (var i = 0; i < records.length; i++) {
          var record = records[i];
          console.log(record.name + " " + record.lat + " " + record.lng);
          let markerPos = new google.maps.LatLng(record.lat, record.lng);
          let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              icon: record.icon,
              position: markerPos
          });
          let content = "<h4>" + record.name + "</h4>";
          this.addInfoWindow(marker, content);
        }
  }
}
