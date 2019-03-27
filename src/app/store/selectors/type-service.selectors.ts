import {createSelector} from '@ngrx/store';
import * as typeservices from '../reducers/type-service.reducer';
import * as converter from './converter';
import {LanguageState} from '../reducers/language.reducer';
import {TypeService} from '../models/type-service.model';
import {selectCurrentLanguage, selectLanguage} from './language.selectors';
import * as tag from '../reducers/tag.reducer';
import {Dictionary} from '@ngrx/entity';
import {Language} from '../models/language.model';

export const selectTypeServiceById = createSelector(
  typeservices.selectEntities,
  (array, props) => {
    return array[props.id];
  }
);

export const selectTypeServicesByLanguage = createSelector(
  selectCurrentLanguage,
  typeservices.selectAll,
  (lang: Language, array: TypeService[]) => {
    return array.map(value => {
      return converter.convertNsiByLanguage(value, lang);
    });
  }
);

export const selectTypeServiceByIds = createSelector(
  tag.selectEntities,
  (array: Dictionary<TypeService>, props: string[]) => {
    return props.map(uuid => array[uuid]);
  }
);