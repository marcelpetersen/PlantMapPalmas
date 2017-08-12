export class Arvore {

  constructor(
    private _id: number,
    private _name: string,
    private _distancia: string,
    private _lat: number,
    private _lng: number,
    private _icon: string,
    private _descricao: string  ) {
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get distancia() {
    return this._distancia;
  }

  get lat() {
    return this._lat;
  }

  get lng() {
    return this._lng;
  }

  get icon() {
    return this._icon;
  }

  get descricao() {
    return this._descricao;
  }

}
