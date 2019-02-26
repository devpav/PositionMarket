import {Component, OnInit} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {selectTagById, selectTagsByLanguage} from '../../../store/selectors/selectors';
import {
  ApiTagCreate,
  ApiTagDelete,
  ApiTagLoadAll, ApiTagLoadById,
  ApiTagUpdate
} from '../../../store/actions/tag.actions';
import {DialogEditEntityComponent} from '../../dialog-edit-entity/dialog-edit-entity.component';
import {MatDialog} from '@angular/material';
import {Tag} from '../../../store/models/tag.model';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  $tags: Observable<{ uuid: string, value: string }[]> = this.store.select(selectTagsByLanguage);
  value: Tag;

  constructor(public dialog: MatDialog, private store: Store<any>) {}


  openDialog(actionRef: string, tag: Tag): void {
    const dialogRef = this.dialog.open(DialogEditEntityComponent, {
      hasBackdrop: true,
      width: '650px',
      height: '270px',
      data: {
        action: actionRef,
        object: tag
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.action && data.entity) {
        console.log(data + ' ' + data.change + ' ' + data.entity);
        switch (data.action) {
          case 'create': {

            this.store.dispatch(new ApiTagCreate(data.entity));
            break;
          }
          case 'change': {
            this.store.dispatch(new ApiTagUpdate((data.entity)));
            break;
          }
          default: return;
        }
      }
    });
  }

  ngOnInit() {
    this.$tags.subscribe(value1 => {
      console.log('load list tags');
    });
    this.store.dispatch(new ApiTagLoadAll());
  }

  create($event) {
    console.log('create');
    this.openDialog('create', $event);
  }

  changeOrView($event, action: string) {
    this.store.select(selectTagById, {id: $event}).subscribe(value => {
      this.value = value;
    });
    this.openDialog(action, this.value);
  }


  delete($event) {
    console.log(`delete: ${$event}`);
    this.store.dispatch(new ApiTagDelete($event));
  }
}