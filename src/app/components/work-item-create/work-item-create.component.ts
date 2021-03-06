import { WorkItemDetailAddTypeSelectorWidgetComponent } from './work-item-create-selector/work-item-create-selector.component';
import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { cloneDeep } from 'lodash';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Subscription } from 'rxjs/Subscription';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { WorkItemService } from '../../services/work-item.service';
import { WorkItemListEntryComponent } from '../work-item-list-entry/work-item-list-entry.component';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItem } from '../../models/work-item';

import {
  AlmArrayFilter
} from 'ngx-widgets';

@Component({
  selector: 'detail-add-type-selector',
  templateUrl: './work-item-create.component.html',
  styleUrls: ['./work-item-create.component.scss']
})
export class WorkItemDetailAddTypeSelectorComponent implements OnInit, OnChanges {

  @Input() wiTypes: WorkItemType[] = [];
  @Input() takeFromInput: boolean = false;

  @ViewChild('detailAddTypeSelector') workItemDetailAddTypeSelectorWidget: WorkItemDetailAddTypeSelectorWidgetComponent;

  loggedIn: boolean = false;
  workItemTypes: WorkItemType[] = [];
  spaceSubscription: Subscription = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private auth: AuthenticationService,
    private spaces: Spaces) {
  }

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[WorkItemDetailAddTypeSelectorComponent] New Space selected: ' + space.attributes.name);
        this.getWorkItemTypes();
      } else {
        console.log('[WorkItemDetailAddTypeSelectorComponent] Space deselected.');
        this.workItemTypes = [];
      }
    });
  }

  ngOnChanges() {
    if (this.takeFromInput) {
      this.workItemTypes = this.wiTypes;
    }
  }

  //Detailed add functions
  getWorkItemTypes() {
    if (this.takeFromInput) {
      this.workItemTypes = this.wiTypes;
    } else {
      this.workItemService.getWorkItemTypes()
        .subscribe((types) => {
          this.workItemTypes = types;
        });
    }
  }

  showTypes() {
    this.workItemDetailAddTypeSelectorWidget.open();
  }

  closePanel() {
    this.workItemDetailAddTypeSelectorWidget.close();
  }

  openPanel() {
    this.workItemDetailAddTypeSelectorWidget.open();
  }

  onChangeType(type: WorkItemType) {
    this.workItemDetailAddTypeSelectorWidget.close();
    const queryParams = this.route.snapshot.queryParams;
    let newQueryParams = {type: type.id};
    Object.assign(newQueryParams, queryParams);
    this.router.navigate(
      ['detail', 'new'],
      {
        queryParams: newQueryParams,
        relativeTo: this.route
      } as NavigationExtras
    );
  }
}
