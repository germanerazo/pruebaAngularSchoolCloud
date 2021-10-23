import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class CorporativosService {

  public url = environment.apiURL;
  public token = 'Bearer ' + localStorage.getItem('tokenscloud');
  public headers: any

  constructor(private http: HttpClient) {
    this.headers = {
      headers: new HttpHeaders({
        Authorization: this.token
      })
    };
  }

  listar() {
    const query = this.url + '/corporativos';
    return this.http.get(query, this.headers).pipe(map((data:any) => data),catchError(res => of(res.error)));
  }

  detalle(id) {
    const query = this.url + '/corporativos/' + id;
    return this.http.get(query, this.headers).pipe(map((data:any) => data),catchError(res => of(res.error)));
  }

  agregarContacto(contacto){
    const query = this.url + '/contactos';
    return this.http.post(query, contacto, this.headers).pipe(map((data:any) => data),catchError(res => of(res.error)));
  }

  actualizarContacto(contacto){
    const query = this.url + '/contactos/' + contacto.id;
    return this.http.put(query, contacto, this.headers).pipe(map((data:any) => data),catchError(res => of(res.error)));
  }

  eliminarContacto(id){
    const query = this.url + '/contactos/' + id;
    return this.http.delete(query, this.headers).pipe(map((data:any) => data),catchError(res => of(res.error)));
  }

  notificacionExitosa(mensaje){
    swal.fire({
      icon: 'success',
      title: '¡Info!',
      text: mensaje,
      showConfirmButton: true,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false,
    });
  }

  notificacionError(mensaje){
    swal.fire({
      icon: 'error',
      title: '¡Info!',
      text: mensaje,
      showConfirmButton: true,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false,
    });
  }

  inicioCarga(mensaje:string = 'Cargando información...', titulo:string = 'Espera'){
    swal.fire({
      title: titulo,
      html: mensaje,
      timerProgressBar: true,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading()
      }
    })
  }

  finCarga(){
    swal.hideLoading();
    swal.close();
  }

  confirmar(message:string,title:string, callback) {
    Swal.fire({
      title: title ?? '¿Quieres continuar?',
      html: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((confirmed) => {
      callback(confirmed && confirmed.value == true);
    });
  }
}
