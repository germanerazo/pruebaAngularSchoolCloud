import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {CorporativosService} from '../corporativos.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatatableComponent, ColumnMode} from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-corporativos-detalle',
  templateUrl: './corporativos-detalle.component.html',
  styleUrls: ['./corporativos-detalle.component.scss']
})
export class CorporativosDetalleComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('dg') datosGenerales: ElementRef;

  id: any;
  data: any = {};
  edit: any = true;
  lsEstados = [{Codigo: 0, Descripcion: 'Activo'}, {Codigo: 1, Descripcion: 'Inactivo'}]
  formDatosGenerales: FormGroup;
  formContactos: FormGroup;
  public limitRef = 10;
  public rows: any = [];
  public ColumnMode = ColumnMode;
  add: any = true;

  public columns = [
    { name: "NOMBRE", prop: "S_Nombre" },
    { name: "PUESTO", prop: "S_Puesto" },
    { name: "TELÉFONO", prop: "N_TelefonoFijo" },
    { name: "CELULAR", prop: "N_TelefonoMovil" },
    { name: "EMAIL", prop: "S_Email" },
    { name: "COMENTARIOS", prop: "S_Comentarios" },
    { name: "ACCIONES", prop: "Acciones" }
  ];

  constructor(private _router: Router, private _route: ActivatedRoute,
              public service: CorporativosService) {
    this.id = this._route.snapshot.paramMap.get('id');
    this.cargaDatos(this.id);
    this.creaForm();
  }

  ngOnInit(): void {
  }

  creaForm(){
    this.formDatosGenerales = new FormGroup({
      status: new FormControl(''),
    });
    this.formContactos = new FormGroup({
      id: new FormControl(''),
      S_Nombre: new FormControl('', [Validators.required]),
      S_Puesto: new FormControl('', [Validators.required]),
      S_Email: new FormControl('', [Validators.required]),
      N_TelefonoFijo: new FormControl('', [Validators.required]),
      N_TelefonoMovil: new FormControl('', [Validators.required]),
      S_Comentarios: new FormControl('', [Validators.required]),
      tw_corporativo_id: new FormControl('', [Validators.required])
    });
  }

  cargaDatos(id){
    this.service.inicioCarga()
    this.service.detalle(id)
      .subscribe((res) => {
        this.service.finCarga()
        if(res.Error){ console.error(res.Error); return;}
        this.data = res.data.corporativo;
        this.formDatosGenerales.patchValue({
          status: this.data.S_Activo
          }
        )
        this.rows = this.data.tw_contactos_corporativo
        this.rows.id = this.data.id
        const self = this;
        setTimeout(function() {
          console.log(self.datosGenerales)
          self.datosGenerales.nativeElement.click();
        },50);
      }),
      err => {
        console.error(err);
      }
  }

  habilita(){
    this.edit = !this.edit;
  }

  agregarContacto(){
    this.formContactos.patchValue({
      tw_corporativo_id: this.rows.id
    })
    this.service.agregarContacto(this.formContactos.value)
      .subscribe((res) => {
        console.log(res)
        if(res.code){
          this.service.notificacionError(JSON.stringify(res.error))
          console.error(JSON.stringify(res.error));
          return;
        }
        if(res.data){
          this.rows.push(res.data)
          this.formContactos.reset()
          this.service.notificacionExitosa('Registro agregado extosamente')
        }
      }),
      err => {
        console.error(err);
      }
  }

  actualizarContacto(){
    this.add = true;
    this.service.actualizarContacto(this.formContactos.value)
      .subscribe((res) => {
        console.log(res)
        if(res.code){
          this.service.notificacionError(JSON.stringify(res.error))
          console.error(JSON.stringify(res.error));
          return;
        }
        if(res.data){
          this.rows = this.rows.filter(x => x.id !== res.data.id)
          this.rows.push(res.data)
          this.formContactos.reset()
          this.service.notificacionExitosa('Registro actualizado extosamente')
        }
      }),
      err => {
        console.error(err);
      }
  }

  editarContacto(id){
    const cont = this.rows.find(x => x.id === id)
    console.log(cont)
    this.formContactos.patchValue({
      S_Nombre: cont.S_Nombre,
      S_Puesto: cont.S_Puesto,
      S_Email: cont.S_Email,
      N_TelefonoFijo: cont.N_TelefonoFijo,
      N_TelefonoMovil: cont.N_TelefonoMovil,
      S_Comentarios: cont.S_Comentarios,
      tw_corporativo_id: cont.tw_corporativo_id,
      id: cont.id
    })
    this.add = false;
  }

  eliminarContacto(id){
    const self = this;
    this.service.confirmar('Desea eliminar este registro?', null,function (confirmed) {
      if (confirmed) {
        self.service.eliminarContacto(id)
          .subscribe((res) => {
            console.log(res)
            if(res.code){
              self.service.notificacionError(JSON.stringify(res.error))
              console.error(JSON.stringify(res.error));
              return;
            }
            if(res.data){
              self.rows = self.rows.filter(x => x.id !== id)
              self.service.notificacionExitosa('Registro eliminado extosamente')
            }
          }),
          err => {
            console.error(err);
          }
      }
    });
  }

}
