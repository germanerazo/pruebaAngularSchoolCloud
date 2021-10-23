import {Component, OnInit, ViewChild} from '@angular/core';
import {DatatableComponent, ColumnMode} from '@swimlane/ngx-datatable';
import {CorporativosService} from '../corporativos.service';

@Component({
  selector: 'app-corporativos',
  templateUrl: './corporativos.component.html',
  styleUrls: ['./corporativos.component.scss',
    '/assets/sass/libs/datatables.scss']
})
export class CorporativosComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;

  // row data
  public rows: any;
  public ColumnMode = ColumnMode;
  public limitRef = 10;
  private tempData: any = [];

  // column header
  public columns = [
    { name: "CORPORATIVO", prop: "ID" },
    { name: "URL", prop: "S_SystemUrl" },
    { name: "INCORPORACION", prop: "D_FechaIncorporacion" },
    { name: "CREADO EL", prop: "Last Activity" },
    { name: "ASIGNADO A", prop: "Verified" },
    { name: "STATUS", prop: "Status" },
    { name: "ACCIONES", prop: "Acciones" }
  ];

  constructor(public service: CorporativosService) {
  }

  // Carga los datos desde el API
  cargaDatos(){
    this.service.inicioCarga()
    this.service.listar()
      .subscribe((res) => {
        this.service.finCarga()
        if(res.code){
          this.service.notificacionError(JSON.stringify(res.error))
          console.error(JSON.stringify(res.error));
          return;
        }
        this.tempData = res.data;
        this.rows = res.data;
        const self = this;
          setTimeout(function(){
            self.table.element.click();
          },50);
      }),
      err => {
        console.error(err);
      }
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.S_NombreCompleto.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * updateLimit
   *
   * @param limit
   */
  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }

  ngOnInit(): void {
    this.rows = [];
    this.cargaDatos()
  }

}
