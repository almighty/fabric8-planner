import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import { CommonModule, Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MyDatePickerModule } from 'mydatepicker';

import { Observable } from 'rxjs';

import {
  CollapseModule,
  ComponentLoaderFactory,
  DropdownConfig,
  DropdownModule,
  PositioningService,
  TooltipConfig,
  TooltipModule
} from 'ng2-bootstrap';
import { Ng2CompleterModule } from 'ng2-completer';
import { Spaces } from 'ngx-fabric8-wit';
import { Broadcaster, Logger } from 'ngx-base';
import {
  // AlmUserName,
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import {
  AlmAvatarSize,
  AlmLinkTarget,
  AlmMomentTime,
  AlmSearchHighlight,
  AlmTrim,
  AlmEditableModule,
  AlmIconModule
} from 'ngx-widgets';

import { ModalModule } from 'ngx-modal';

import { AreaModel } from '../../models/area.model';
import { AreaService } from '../../services/area.service';
import { CollaboratorService } from '../../services/collaborator.service';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { TypeaheadDropdown } from '../typeahead-dropdown/typeahead-dropdown.component';
import { IterationModel } from '../../models/iteration.model';
import { IterationService } from '../../../services/iteration.service';
import { MarkdownControlComponent } from '../markdown-control/markdown-control.component';
import { LinkType } from '../../models/link-type';
import { Comment } from '../../models/comment';
import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';
import { AlmUserName } from '../../pipes/alm-user-name.pipe';
import { SpacesService } from '../../mock/standalone/spaces.service';
import { WorkItemService } from '../../services/work-item.service';
import { WorkItemLinkComponent } from '../work-item-link/work-item-link.component';
import { WorkItemCommentComponent } from './work-item-comment.component';
import { WorkItemDetailComponent } from '../work-item-detail/work-item-detail.component';
import { WorkItemLinkTypeFilterByTypeName, WorkItemLinkFilterByTypeName } from '../../pipes/work-item-link-filters.pipe';
import { WorkItemTypeControlService } from '../../services/work-item-type-control.service';

describe('Comment section for the work item detailed view - ', () => {
  let comp: WorkItemDetailComponent;
  let fixture: ComponentFixture<WorkItemDetailComponent>;
  let currentUser: User;
  let el: DebugElement;
  let el1: DebugElement;
  let logger: Logger;
  let fakeWorkItem: WorkItem;
  let fakeWorkItems: WorkItem[] = [];
  let fakeArea: AreaModel;
  let fakeAreaList: AreaModel[] = [];
  let fakeAreaService: any;
  let fakeIteration: IterationModel;
  let fakeIterationList: IterationModel[] = [];
  let fakeIterationService: any;
  let fakeUser: User;
  let fakeUserList: User[];
  let fakeComments: Comment[];
  let fakeWorkItemService: any;
  let fakeAuthService: any;
  let fakeUserService: any;
  let fakeCollaboratorService: any;
  let fakeWorkItemTypes: WorkItemType[];
  let fakeWorkItemStates: Object[];
  let fakeWorkItemLinkTypes: Object;

  beforeEach(() => {

    fakeUserList = [
      {
        attributes: {
          fullName: 'WIDCT Example User 0',
          imageURL: 'https://avatars.githubusercontent.com/u/000?v=3'
        },
        id: 'widct-user0'
      }, {
        attributes: {
          fullName: 'WIDCT Example User 1',
          imageURL: 'https://avatars.githubusercontent.com/u/001?v=3'
        },
        id: 'widct-user1'
      }, {
        attributes: {
          fullName: 'WIDCT Example User 2',
          imageURL: 'https://avatars.githubusercontent.com/u/002?v=3'
        },
        id: 'widct-user2'
      }
    ] as User[];

    fakeWorkItem = {
      'attributes': {
        'system.created_at': null,
        'system.description': null,
        'system.remote_item_id': null,
        'system.state': 'new',
        'system.title': 'test1',
        'version': 0
      },
      'id': '1',
      'relationships': {
        'area': { },
        'iteration': { },
        'assignees': {
          'data': [
            {
              'attributes': {
                'username': 'username2',
                'fullName': 'WIDCT Example User 2',
                'imageURL': 'https://avatars.githubusercontent.com/u/002?v=3'
            },
            'type': 'identities',
            'id': 'widct-user2'
          }
          ]
        },
        'baseType': {
          'data': {
            'id': 'system.userstory',
            'type': 'workitemtypes'
          }
        },
        'creator': {
          'data': {
            'attributes': {
              'username': 'username0',
              'fullName': 'WIDCT Example User 0',
              'imageURL': 'https://avatars.githubusercontent.com/u/000?v=3'
            },
            'type': 'identities',
            'id': 'widct-user0'
          }
        },
        'comments': {
          'data': [],
          'links': {
            'self': '',
            'related': ''
          }
        }
      },
      'type': 'workitems',
      'links': {
        'self': ''
      },
      'relationalData': {
        'creator': fakeUserList[0],
        'assignees': [fakeUserList[2]]
      }
    } as WorkItem;

    fakeWorkItems.push(fakeWorkItem);

    fakeArea = {
      'attributes': {
        'name': 'Area 1'
      },
      'type': 'areas'

    } as AreaModel;

    fakeAreaList.push(fakeArea);

    fakeIteration = {
      'attributes': {
        'name': 'Iteration 1'
      },
      'type': 'iterations'

    } as IterationModel;

    fakeIterationList.push(fakeIteration);

    fakeWorkItemStates = [
      { option: 'new' },
      { option: 'open' },
      { option: 'in progress' },
      { option: 'resolved' },
      { option: 'closed' }
    ];

    fakeUser = {
      attributes: {
        'fullName': 'WIDCT Example User 2',
        'imageURL': 'https://avatars.githubusercontent.com/u/002?v=3'
      },
      id: 'widct-user2'
    } as User;

    fakeWorkItemTypes = [
      { attributes: { name: 'system.userstory' } },
      { attributes: { name: 'system.valueproposition' } },
      { attributes: { name: 'system.fundamental' } },
      { attributes: { name: 'system.experience' } },
      { attributes: { name: 'system.feature' } },
      { attributes: { name: 'system.bug' } }
    ] as WorkItemType[];

    fakeComments = [
      {
        'id': '00000000-fake-uuid-haha-000000000000',
        'type': 'comments',
        'attributes': {
          'body': 'test',
          'created-at': '2017-01-01T12:00:00.000000Z',
        },
        'relationships': {
            'created-by': {
                'data': {
                  'id': '00000000-fake-user-haha-000000000000',
                  'type': 'identities'
                }
            }
        }
      }
    ] as Comment[];

    fakeWorkItemLinkTypes = {'forwardLinks': [
        {
         'id': '4f8d8e8c-ab1c-4396-b725-105aa69a789c',
         'type': 'workitemlinktypes',
         'attributes': {
          'description': 'A test work item can if a the code in a pull request passes the tests.',
          'forward_name': 'story-story',
          'name': 'story-story',
          'reverse_name': 'story by',
          'topology': 'network',
          'version': 0
        },
        // 'id': '40bbdd3d-8b5d-4fd6-ac90-7236b669af04',
        'relationships': {
          'link_category': {
            'data': {
              'id': 'c08d244f-ca36-4943-b12c-1cdab3525f12',
              'type': 'workitemlinkcategories'
            }
          },
          'source_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          },
          'target_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          }
      }
    }],
    'backwardLinks': [{
         'id': '9cd02068-d76e-4733-9df8-f18bc39002ee',
         'type': 'workitemlinktypes',
         'attributes': {
          'description': 'A test work item can if a the code in a pull request passes the tests.',
          'forward_name': 'abc-abc',
          'name': 'abc-abc',
          'reverse_name': 'story by',
          'topology': 'network',
          'version': 0
        },
        // 'id': '40bbdd3d-8b5d-4fd6-ac90-7236b669af04',
        'relationships': {
          'link_category': {
            'data': {
              'id': 'c08d244f-ca36-4943-b12c-1cdab3525f12',
              'type': 'workitemlinkcategories'
            }
          },
          'source_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          },
          'target_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          }
      }
    }]};


    fakeAuthService = {
      loggedIn: false,

      getToken: function () {
        return '';
      },
      isLoggedIn: function () {
        return this.loggedIn;
      },
      login: function () {
        this.loggedIn = true;
      },

      logout: function () {
        this.loggedIn = false;
      }
    };

    fakeAreaService = {
      getAreas: function () {
        return Observable.of(fakeAreaList);
      },
      getArea: function (area) {
        return Observable.of(fakeAreaList[0]);
      }
    };

    fakeIterationService = {
      getIterations: function () {
        return Observable.of(fakeIterationList);
      },
      getIteration: function (it) {
        return Observable.of(fakeIterationList[0]);
      },
      getSpaces: function () {
        let spaces = [{
          'attributes': {
            'name': 'Project 1'
          },
          'type': 'spaces'
        }];
        return spaces;
      },
      isRootIteration: function(iteration: IterationModel): boolean {
        if (iteration.attributes.parent_path==='/')
          return true;
        else
          return false;
      }
    };

    fakeWorkItemService = {
      create: function () {
        return Observable.of(fakeWorkItem);
      },
      update: function () {
        return Observable.of(fakeWorkItem);
      },
      getWorkItemTypes: function () {
        return Observable.of(fakeWorkItemTypes);
      },

      getStatusOptions: function () {
        return Observable.of(fakeWorkItemStates);
      },

      getWorkItems: function () {
        return Observable.of(fakeWorkItems);
      },

      getLocallySavedWorkItems: function() {
        return Observable.of(fakeWorkItems);
      },

      getLinkTypes: function () {
        return Observable.of(fakeWorkItemLinkTypes);
      },

      resolveAssignees: function(assignees) {
        return Observable.of(fakeUserList[2]);
      },

      resolveCreator2: function(creator) {
        return Observable.of(fakeUserList[0]);
      },

      resolveLinks: function(url) {
        return Observable.of([[], []]);
      },

      resolveComments: function() {
        return Observable.of([ [], {data: []} ]);
      }
    };

    fakeUserService = {
      getUser: function () {
        return Observable.of(fakeUser);
      },

      getAllUsers: function () {
        return Observable.of(fakeUserList);
      },

      getSavedLoggedInUser: function () {
        return fakeUser;
      }
    };

    fakeCollaboratorService = {
      getCollaborators: function() {
        return Observable.of(fakeUserList);
      }
    }

  });



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule,
        RouterTestingModule.withRoutes([
          // this needs to be a relative path but I don't know how to do that in a test
          { path: './detail/1', component: WorkItemDetailComponent }
        ]),
        BrowserAnimationsModule,
        CollapseModule,
        CommonModule,
        TooltipModule,
        DropdownModule,
        Ng2CompleterModule,
        AlmIconModule,
        AlmEditableModule,
        ReactiveFormsModule,
        MyDatePickerModule
      ],

      declarations: [
        AlmAvatarSize,
        AlmLinkTarget,
        AlmMomentTime,
        AlmSearchHighlight,
        AlmTrim,
        AlmUserName,
        DynamicFieldComponent,
        TypeaheadDropdown,
        MarkdownControlComponent,
        WorkItemCommentComponent,
        WorkItemDetailComponent,
        WorkItemLinkComponent,
        WorkItemLinkTypeFilterByTypeName,
        WorkItemLinkFilterByTypeName
      ],
      providers: [
        Broadcaster,
        ComponentLoaderFactory,
        DropdownConfig,
        Logger,
        Location,
        WorkItemTypeControlService,
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        {
          provide: AreaService,
          useValue: fakeAreaService
        },
        {
          provide: IterationService,
          useValue: fakeIterationService
        },
        {
          provide: CollaboratorService,
          useValue: fakeCollaboratorService
        },
        {
          provide: UserService,
          useValue: fakeUserService
        },
        {
          provide: WorkItemService,
          useValue: fakeWorkItemService
        },
        PositioningService,
        TooltipConfig,
        {
          provide: Spaces,
          useExisting: SpacesService
        },
        SpacesService
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WorkItemDetailComponent);
        comp = fixture.componentInstance;
        comp.users = fakeUserList;
        currentUser = fakeUserService.getSavedLoggedInUser();
      });
  }));

   it('Should have a parent comment element', () => {
      fakeAuthService.login();
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#wi-comment'));
      expect(el.nativeElement).toBeTruthy();
  });

  it('Should have an input to create comments', () => {
      fakeAuthService.login();
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#wi-comment-add-comment'));
      expect(el.nativeElement).toBeTruthy();
  });

/*
   it('Should have an image avatar on the comment(s)', () => {
      fakeAuthService.login();
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#comment_avatar_undefined'));
      expect(el.nativeElement.src).toBeTruthy();
  });

   it('Should have the timestamp on the comment(s)', () => {
      fakeAuthService.login();
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#comment_time_undefined'));
      expect(el.nativeElement.innerHTML).toBeTruthy();
  });

   it('Should have the name of the commentator', () => {
      fakeAuthService.login();
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#comment_username_undefined'));
      expect(el.nativeElement.innerHTML).toBeTruthy();
  });

   it('Should have the actual comment block', () => {
      fakeAuthService.login();
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#comment_body_undefined'));
      expect(el.nativeElement.innerHTML).toBeTruthy();
  });
*/

});
