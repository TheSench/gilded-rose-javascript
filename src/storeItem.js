export function createStoreItem(item) {
  var itemType = makeDegradingItem(1);
  if (item.name.startsWith("Backstage pass")) {
    itemType = backstagePass;
  } else if (item.name.startsWith("Conjured")) {
    itemType = makeDegradingItem(2);
  } else if (item.name === "Sulfuras, Hand of Ragnaros") {
    itemType = unchangingStoreItem;
  } else if (item.name === "Aged Brie") {
    itemType = makeBetterOverTimeItem(1);
  }

  return Object.assign(
    {
      item
    },
    itemType
  );
}

function makeDegradingItem(amount) {
  return makeChangesOverTimeItem(-amount);
}

function makeBetterOverTimeItem(amount) {
  return makeChangesOverTimeItem(amount);
}

const unchangingStoreItem = {
  updateQuality() {
  }
};

var changesOverTimeItem = {};
function makeChangesOverTimeItem(amount) {
  if (!changesOverTimeItem[amount]) {
    changesOverTimeItem[amount] = {
      updateQuality() {
        var item = this.item;
        item.sellIn--;
        item.quality += amount;
        if (item.sellIn < 0) {
          item.quality += amount;
        }

        if (item.quality < 0) {
          item.quality = 0;
        } else if (item.quality > 50) {
          item.quality = 50;
        }
      }
    };
  }
  return changesOverTimeItem[amount];
}

const backstagePass = {
  updateQuality() {
    var item = this.item;

    item.sellIn--;
    if (item.sellIn < 0) {
      item.quality = 0;
    } else {
      let amount = 1;
      if (item.sellIn <= 9) {
        amount++;
      }
      if (item.sellIn <= 4) {
        amount++;
      }
      item.quality += amount;
      if(item.quality > 50) {
        item.quality = 50;
      }
    }
  }
};