import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CsgoItemsService {
  constructor(private http: HttpClient, private web3: Web3Service) { }
  public isDataComplete: boolean = false;
  itemsObject:any;
  itemsArray:any;
  itemsPage: any;
  step = 5;
  loadLoop = false;
  fetchItems() {
    this.http.get<any>(environment.steamItemsApi).subscribe(data => {
    this.itemsObject = data;
    const array = Object.entries(data).map(([name, link]) => ({ name, link }));
    this.itemsArray = array;
    this.isDataComplete = true;
    console.log("isDataComplete",this.isDataComplete);
    this.itemsPage = this.itemsArray.slice(0,this.step);
  });
  }

  getRegularItemImage(itemName: string): any {
    const item = this.itemsArray.find((i: { name: string; }) => i.name === itemName);
    return item;
  }

  addNextfiveInPage(){
    if (this.step < this.itemsArray.length) {
      this.itemsPage = [...this.itemsPage, ...this.itemsArray.slice(this.step, this.step + 5)];
      this.step += 5;
    } else {
      console.log("You have reached the end of the list");
    }
  }

  getItemInfo(inspectLink: string): any{
    return this.http.get<any>(environment.floatApi + inspectLink)
        .pipe(
            catchError(error => {
                if(error.status === 500) {
                    return of(ErrorMessages[ErrorCodes.InternalError]);
                } else {
                  console.log("ERRRRRR",error);
                  if(error.error.code as Number){
                    const number: Number = error.error.code;
                    return of(ErrorMessages[number as ErrorCodes]);
                  }
                  return of(ErrorMessages[ErrorCodes.InternalError]);
                }
            })
        )
  }
  // ImproperParameterStructure = 1,
  // InvalidInspectLinkStructure = 2,
  // PendingRequestsExceeded = 3,
  // ValveServersTimeout = 4,
  // ValveServersOffline = 5,
  // InternalError = 6,
  // ImproperBodyFormat = 7,
  // BadSecret = 8,

  //https://steamcommunity.com/tradeoffer/new/?partner=XXXXXXX&token=XXXXXXX
  partnerIdToSteamId64(partnerId: string): string {
    const partnerIdInt = parseInt(partnerId);
    return `7656119${partnerIdInt + 7960265728}`;
  }

}

interface ItemInfo {
  origin: number; // origin of the item
  quality: number; // quality of the item
  rarity: number; // rarity of the item
  a: string; // item's asset ID
  d: string; // item's description ID
  paintseed: number; // paintseed of the item
  defindex: number; // defindex of the item
  paintindex: number; // paintindex of the item
  stickers: Sticker[]; // array of stickers on the item
  floatid: string; // float ID of the item
  killeatervalue: number; // killeatervalue of the item
  floatvalue: number; // float value of the item
  s: string; // steamID of the owner of the item
  m: string; // marketable value of the item (0 for unmarketable, 1 for marketable)
  imageurl: string; // url of the image of the item
  min: number; // minimum float value of the item
  max: number; // maximum float value of the item
  weapon_type: string; // weapon type of the item
  item_name: string; // name of the item
  rarity_name: string; // rarity name of the item
  quality_name: string; // quality name of the item
  origin_name: string; // origin name of the item
  wear_name: string; // wear name of the item
  full_item_name: string; // full item name of the item
}

interface Sticker {
  stickerId: number; // sticker ID
  slot: number; // sticker slot
  codename: string; // sticker codename
  material: string; // sticker material
  name: string; // sticker name
}

/**
 * {
    "iteminfo": {
        "origin": 4,
        "quality": 9,
        "rarity": 4,
        "a": "28229768155",
        "d": "445544798276207605",
        "paintseed": 859,
        "defindex": 7,
        "paintindex": 1035,
        "stickers": [
            {
                "stickerId": 5272,
                "slot": 0,
                "codename": "antwerp2022_team_hero_glitter",
                "material": "antwerp2022/hero_glitter",
                "name": "Heroic (Glitter) | Antwerp 2022"
            },
            {
                "stickerId": 5272,
                "slot": 1,
                "codename": "antwerp2022_team_hero_glitter",
                "material": "antwerp2022/hero_glitter",
                "name": "Heroic (Glitter) | Antwerp 2022"
            },
            {
                "stickerId": 4538,
                "slot": 2,
                "codename": "halo_killjoy",
                "material": "halo/killjoy",
                "name": "Killjoy"
            },
            {
                "stickerId": 5272,
                "slot": 3,
                "codename": "antwerp2022_team_hero_glitter",
                "material": "antwerp2022/hero_glitter",
                "name": "Heroic (Glitter) | Antwerp 2022"
            }
        ],
        "floatid": "23236574362",
        "killeatervalue": 0,
        "floatvalue": 0.055094581097364426,
        "s": "76561198185748194",
        "m": "0",
        "imageurl": "http://media.steampowered.com/apps/730/icons/econ/default_generated/weapon_ak47_gs_ak47_professional_light_large.d09d623d0a725c63e8a3905f66bba41ba2ed59e8.png",
        "min": 0,
        "max": 1,
        "weapon_type": "AK-47",
        "item_name": "Slate",
        "rarity_name": "Restricted",
        "quality_name": "StatTrak™",
        "origin_name": "Crafted",
        "wear_name": "Factory New",
        "full_item_name": "StatTrak™ AK-47 | Slate (Factory New)"
    }
}
 */

enum ErrorCodes {
  ImproperParameterStructure = 1,
  InvalidInspectLinkStructure = 2,
  PendingRequestsExceeded = 3,
  ValveServersTimeout = 4,
  ValveServersOffline = 5,
  InternalError = 6,
  ImproperBodyFormat = 7,
  BadSecret = 8
}

const ErrorMessages = {
  [ErrorCodes.ImproperParameterStructure]: 'Improper parameter structure',
  [ErrorCodes.InvalidInspectLinkStructure]: 'Invalid inspect link structure',
  [ErrorCodes.PendingRequestsExceeded]: 'You may only have X pending request(s) at a time',
  [ErrorCodes.ValveServersTimeout]: "Valve's servers didn't reply in time",
  [ErrorCodes.ValveServersOffline]: "Valve's servers appear to be offline, please try again later!",
  [ErrorCodes.InternalError]: 'Something went wrong on our end, please try again',
  [ErrorCodes.ImproperBodyFormat]: 'Improper body format',
  [ErrorCodes.BadSecret]: 'Bad Secret'
};
