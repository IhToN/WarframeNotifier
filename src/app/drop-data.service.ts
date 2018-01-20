import {Injectable, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {LocalStorage} from 'ngx-webstorage';
import * as ItemData from 'warframe-item-data';

@Injectable()
export class DropDataService {

  /*
  *  data structure (in array)
  *  {
  *      place: Eris/Xini Rotation A
  *      item: Vitality
  *      rarity: Rare
  *      chance: 9.09
  *  }
  */

  CURR_SCRIPT_VERSION = 1;
  @LocalStorage('wfnVersion', 1)
  wfnVersion: any;

  dropdata$: Observable<any>;
  private dropdata = new Subject<any>();

  @LocalStorage('wfnDropData', {})
  fmtdrop: any;
  @LocalStorage('wfnInfoData', {'hash': 'clem'})
  infodata: any;

  itemNodes: any;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.dropdata$ = this.dropdata.asObservable();

    this.updateScript(this.wfnVersion);
  }

  updateScript(fromVersion, toVersion = this.CURR_SCRIPT_VERSION) {
    if (fromVersion < toVersion) {
      this.infodata = {'hash': 'clem'};
    }
    this.updateData();

    this.wfnVersion = toVersion;
  }

  updateData() {
    const time = new Date().getTime();

    this.http.get('https://drops.warframestat.us/data/info.json?' + time).subscribe(info => {
      if (info['hash'] !== this.infodata.hash) {
        this.getData();
        this.infodata = info;
      }
    });
  }

  getData() {
    this.http.get('https://drops.warframestat.us/data/all.json').subscribe(data => {
      this.fmtdrop = [];
      this.formatData(data);
    });
  }

  requestData() {
    this.dropdata.next(this.fmtdrop);
  }

  formatData(data) {
    // mission rewards
    // planets
    this.formatPlanets(data.missionRewards);

    // blueprint locations
    this.formatBlueprints(data.blueprintLocations);

    // mod locations
    this.formatMods(data.modLocations);

    // relics
    this.formatRelics(data.relics);

    // sortie rewards
    this.formatSortie(data.sortieRewards);

    // transient rewards
    this.formatTransient(data.transientRewards);

    // cetus bounty rewards
    this.formatBounty(data.cetusBountyRewards);

    this.fmtdrop = this.fmtdrop.sort(this.sort_by('item', 'place', {
      name: 'chance',
      primer: parseFloat,
      reverse: true
    }));

    this.requestData();
  }

  formatPlanets(missionRewards) {
    for (const planetName of Object.keys(missionRewards)) {

      // locations
      for (const locationName of Object.keys(missionRewards[planetName])) {

        const location = missionRewards[planetName][locationName];

        if (Array.isArray(location.rewards)) {
          const placeName = `${planetName}/${locationName} (<strong>${location.gameMode}</strong>)`;

          for (const reward of location.rewards) {
            this.fmtdrop.push({
              place: placeName,
              item: reward.itemName,
              rarity: reward.rarity,
              chance: reward.chance
            });
          }
        } else {
          for (const rotationName of Object.keys(location.rewards)) {
            const placeName = `${planetName}/${locationName} (<strong>${location.gameMode}</strong>), Rotation ${rotationName}`;

            for (const reward of location.rewards[rotationName]) {
              this.fmtdrop.push({
                place: placeName,
                item: reward.itemName,
                rarity: reward.rarity,
                chance: reward.chance
              });
            }
          }
        }
      }
    }

  }

  private formatBlueprints(blueprintLocations) {
    for (const blueprint of blueprintLocations) {
      for (const enemy of blueprint.enemies) {
        this.fmtdrop.push({
          place: enemy.enemyName,
          item: blueprint.blueprintName,
          rarity: enemy.rarity,
          chance: (((enemy.enemyBlueprintDropChance / 100) * (enemy.chance / 100)) * 100).toFixed(2)
        });
      }
    }
  }

  private formatMods(modLocations) {
    for (const mod of modLocations) {
      for (const enemy of mod.enemies) {
        this.fmtdrop.push({
          place: enemy.enemyName,
          item: mod.modName,
          rarity: enemy.rarity,
          chance: (((enemy.enemyModDropChance / 100) * (enemy.chance / 100)) * 100).toFixed(2)
        });
      }
    }
  }

  private formatRelics(relics) {
    for (const relic of relics) {
      for (const item of relic.rewards) {
        this.fmtdrop.push({
          place: `${relic.tier} ${relic.relicName} ${relic.state}`,
          item: item.itemName,
          rarity: item.rarity,
          chance: item.chance
        });
      }
    }
  }

  private formatSortie(sortieRewards) {
    for (const sortie of sortieRewards) {
      this.fmtdrop.push({
        place: 'Sorties',
        item: sortie.itemName,
        rarity: sortie.rarity,
        chance: sortie.chance
      });
    }
  }

  private formatTransient(transientRewards) {
    for (const objective of transientRewards) {
      for (const reward of objective.rewards) {
        let rotation = '';

        if (reward.rotation) {
          rotation = ` ${reward.rotation}`;
        }

        this.fmtdrop.push({
          place: `${objective.objectiveName}${rotation}`,
          item: reward.itemName,
          rarity: reward.rarity,
          chance: reward.chance
        });
      }
    }
  }

  private formatBounty(cetusBountyRewards) {
    for (const bountyLevel of cetusBountyRewards) {
      const levelRange = bountyLevel.bountyLevel;

      for (const rewardTier of Object.keys(bountyLevel.rewards)) {
        for (const reward of bountyLevel.rewards[rewardTier]) {
          this.fmtdrop.push({
            place: `Cetus ${levelRange} Rotation ${rewardTier}`,
            item: reward.itemName,
            rarity: reward.rarity,
            chance: reward.chance
          });
        }
      }
    }
  }

  getItemImage(itemName) {
    const itemThumbs = ItemData.itemThumbs.sort((a, b) => a.name.length - b.name.length).filter(elem => elem.name.toLowerCase().includes(
      itemName.toLowerCase()
        .replace(' blueprint', '')))[0];
    return itemThumbs ? 'http://content.warframe.com/MobileExport' + itemThumbs.textureLocation : 'unknown';
  }

  getItemDescription(itemName) {
    const items = ItemData.itemThumbs.sort((a, b) => a.name.length - b.name.length).filter(elem => elem.name.toLowerCase().includes(
      itemName.toLowerCase()))[0];
    return items.hasOwnProperty('description') ? items.description : '';
  }

  // utility functions
  default_cmp = function (a, b) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  };

  getCmpFunc = function (primer, reverse) {
    const dfc = this.default_cmp; // closer in scope
    let cmp = this.default_cmp;
    if (primer) {
      cmp = function (a, b) {
        return dfc(primer(a), primer(b));
      };
    }
    if (reverse) {
      return function (a, b) {
        return -1 * cmp(a, b);
      };
    }
    return cmp;
  };

  // actual implementation
  sort_by = function (...args) {
    const fields = [];
    const n_fields = args.length;
    let field, name, cmp;

    // preprocess sorting options
    for (let i = 0; i < n_fields; i++) {
      field = args[i];
      if (typeof field === 'string') {
        name = field;
        cmp = this.default_cmp;
      } else {
        name = field.name;
        cmp = this.getCmpFunc(field.primer, field.reverse);
      }
      fields.push({
        name: name,
        cmp: cmp
      });
    }

    // final comparison function
    return function (A, B) {
      let fname, result;
      for (let i = 0; i < n_fields; i++) {
        result = 0;
        field = fields[i];
        fname = field.name;

        result = field.cmp(A[fname], B[fname]);
        if (result !== 0) {
          break;
        }
      }
      return result;
    };
  };
}
