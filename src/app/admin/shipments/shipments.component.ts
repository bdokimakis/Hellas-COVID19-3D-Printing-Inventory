import { ShipmentModel } from './../../_helpers/backend';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AdminShipmentsModel } from '@app/_helpers';
import { TableColumn } from '@swimlane/ngx-datatable';
import { SearchEvent } from '@app/_helpers/list-view/models/search-event';
import { UserService, ShipmentService, AuthenticationService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html'
})
export class ShipmentsComponent implements OnInit {
  @ViewChild('deliveryTemplate', { static: true }) private _deliveryTemplate: TemplateRef<HTMLElement>;
  @ViewChild('dateTemplate', { static: true }) private _dateTemplate: TemplateRef<HTMLElement>;
  loading = false;
  deliveryLoading = false;
  pendingShipments: ShipmentModel[] = new Array<ShipmentModel>();
  columns: TableColumn[] = [];
  private event: SearchEvent;

  constructor(
    private userService: UserService,
    private shipmentService: ShipmentService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    this.columns = [
      { prop: 'quantity', name: 'First Name', draggable: false, canAutoResize: false, sortable: true, resizeable: false },
      { prop: 'shippingCompany', name: 'Last Name', draggable: false, canAutoResize: true, sortable: true, resizeable: false },
      { prop: 'trackingNumber', name: 'Total Shipped', draggable: false, canAutoResize: true, sortable: true, resizeable: false },
      {
        prop: 'dateShipped', name: 'Company', draggable: false, canAutoResize: true, sortable: true, resizeable: false,
        cellTemplate: this._dateTemplate
      },
      { prop: 'fileName', name: 'Tracking Number', draggable: false, canAutoResize: true, sortable: true, resizeable: false },
      {
        prop: 'recieved', name: 'Recieved', draggable: false, canAutoResize: false, sortable: true, resizeable: false,
        cellTemplate: this._deliveryTemplate
      }
    ];

    this.pendingShipments.map(x => x.dateShipped = new Date());
  }

  getUsersWithShipments(event: SearchEvent): void {
    this.event = event;
    this.shipmentService.getAll(event).pipe(first()).subscribe((users: ShipmentModel[]) => {
      this.loading = false;
      this.pendingShipments = users;
    });
  }

  onRecieved(row) {
    this.deliveryLoading = true;
    this.shipmentService.packageRecieved(row.shipmentId, true).subscribe(() => {
      this.deliveryLoading = false;
      this.getUsersWithShipments(this.event);
    });
  }
}