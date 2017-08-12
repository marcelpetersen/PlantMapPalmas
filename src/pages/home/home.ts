import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController, LoadingController } from 'ionic-angular';

import { ARVORES_MEDICINAIS } from '../../model/mock-arvores';
import { ARVORES_FRUTIFERAS } from '../../model/mock-arvores';
import { Arvore } from '../../model/arvore';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit{

  map: any;
  minhaLat: number;
  minhaLng: number;
  arvoresProximas: Array<Arvore>;
  arvoreDestino: string;
  getColorFrutiferas: string = "danger";
  getColorMedicinais: string = "danger";
  latLng: any;
  mapOptions: any;

  @ViewChild('map') mapElement: ElementRef;

  constructor(public navCtrl: NavController,
    public _geolocation: Geolocation,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController) {
    }

    ngOnInit(){
      let loader = this._loadingCtrl.create({
        content: "Carregando Mapa. Aguarde ...",
      });

      loader.present();
      this._geolocation.getCurrentPosition().then((position) => {
        this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.mapOptions = {
          center: this.latLng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        if(this._geolocation.getCurrentPosition() == null){
          let alertLocalizacaoFail = this._alertCtrl.create({
            title: "Falha na Localização!",
            subTitle: "Não foi possível carregar o mapa. Favor verificar se o GPS está ligado e reiniciar o aplicativo.",
            buttons: ['OK']
          });
          alertLocalizacaoFail.present();
          return;
        }
        this.minhaLat = position.coords.latitude;
        this.minhaLng = position.coords.longitude;
        this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
        loader.dismiss();
      }).catch( (err) => {
        console.log(err);
        loader.dismiss();
        let alertConexao = this._alertCtrl.create({
          title: 'Falha de Conexão!',
          buttons: [{ text: 'OK' }],
          subTitle: 'Não foi possível carregar o mapa. Favor verificar se sua internet e GPS estão ligados e reinicie o aplicativo.'
        });
        alertConexao.present();
      });
      // let alertCarregaBoneco = this._alertCtrl.create({
      //   title: 'Info',
      //   buttons: [{ text: 'OK',  this.carregarBoneco()}],
      //   subTitle: 'Clique na perspectiva de Árvores que você deseja.'
      // });
      // alertCarregaBoneco.present();
      }

    carregarBoneco(){
        let markerPos = new google.maps.LatLng(this.minhaLat, this.minhaLng);
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          icon: "assets/icon/boneco.jpg",
          position: markerPos
        });
        let infoWindow = new google.maps.InfoWindow({
          content: "<h4>Sua posição</h4>"
        });
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        });
      }

    // limparMap(){
    //   this.arvoresProximas = [];
    //   this.getColorFrutiferas = "danger";
    //   this.getColorMedicinais = "danger";
    //   this.map = null;
    //   this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
    // }

    clearMap(){
      this.arvoresProximas = [];
      this.map = null;
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
    }

    carregarArvoresMap(parametro: string){
      let arvores;
      if(parametro == 'Frutiferas'){
        if(this.getColorFrutiferas == "secondary"){
          return;
        }
        if(this.getColorMedicinais == "secondary"){
          this.getColorMedicinais = "danger";
          this.clearMap();
        }
        arvores = ARVORES_FRUTIFERAS;
        this.getColorFrutiferas = "secondary";
      }

      if(parametro == 'Medicinais'){
        if(this.getColorMedicinais == "secondary"){
          return;
        }
        if(this.getColorFrutiferas == "secondary"){
          this.getColorFrutiferas = "danger";
          this.clearMap();
        }
        arvores = ARVORES_MEDICINAIS;
        this.getColorMedicinais = "secondary";
      }

      this.arvoresProximas = [];
      for (var i = 0; i < arvores.length; i++) {
        var arvore = arvores[i];
        arvore.distancia = this.getDistanceBetweenPoints(arvore, 'km').toFixed(2);
        this.arvoresProximas.push(arvore);
        let markerPos = new google.maps.LatLng(arvore.lat, arvore.lng);
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          icon: arvore.icon,
          position: markerPos
        });
        let infoWindow = new google.maps.InfoWindow({
          content: "<h4>" + arvore.name + " n. " + arvore.id + "</h4>"
        });
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker);
        });
      }
    }

    getDistanceBetweenPoints(end: Arvore, units: string){
      let earthRadius = {
        miles: 3958.8,
        km: 6371
      };

      let R = earthRadius[units || 'miles'];
      let lat1 = this.minhaLat;
      let lon1 = this.minhaLng;
      let lat2 = end.lat;
      let lon2 = end.lng;

      let dLat = this.toRad((lat2 - lat1));
      let dLon = this.toRad((lon2 - lon1));
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;
      return d;
    }

    toRad(x){
      return x * Math.PI / 180;
    }

    guiar(arvoreSelecionada: Arvore) {
      this.arvoreDestino = arvoreSelecionada.lat + "," + arvoreSelecionada.lng;
      let directionsService = new google.maps.DirectionsService;
      let directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(this.map);
      directionsService.route({
        origin: this.minhaLat  + "," + this.minhaLng,
        destination: this.arvoreDestino,
        travelMode: 'WALKING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Requisição de direcionamento falhou para ' + status);
        }
      });
    }

    showAlertDescricaoArvore(arvoreSelecionada: Arvore) {
      let alertDescricaoArvore = this._alertCtrl.create({
        title: arvoreSelecionada.name,
        subTitle: arvoreSelecionada.descricao,
        buttons: ['OK']
      });
      alertDescricaoArvore.present();
    }
  }
