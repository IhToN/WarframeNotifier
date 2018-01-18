import {Injectable, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class DropDataService implements OnInit {

  /*
  *  data structure (in array)
  *  {
  *      place: Eris/Xini Rotation A
  *      item: Vitality
  *      rarity: Rare
  *      chance: 9.09
  *  }
  */

  dropdata$: Observable<any>;
  private dropdata = new Subject<any>();

  fmtdrop: any;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.dropdata$ = this.dropdata.asObservable();
    this.fmtdrop = [];
    this.http.get('https://drops.warframestat.us/data/all.json').subscribe(data => {
      this.formatData(data);
    });
  }

  ngOnInit() {
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

    this.dropdata.next(this.fmtdrop);
  }

  formatPlanets(missionRewards) {
    for (const planetName of Object.keys(missionRewards)) {

      // locations
      for (const locationName of Object.keys(missionRewards[planetName])) {

        const location = missionRewards[planetName][locationName];

        if (Array.isArray(location.rewards)) {
          const placeName = `${planetName}/${locationName} (<b>${location.gameMode}</b>)`;

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
            const placeName = `${planetName}/${locationName} (<b>${location.gameMode}</b>), Rotation ${rotationName}`;

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
}
