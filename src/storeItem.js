export function createStoreItem(item) {
  var itemWrapper = { item };
  var itemType;
  if (item.name.startsWith("Backstage pass")) {
    itemType = backstagePass;
  } else if (item.name.startsWith("Conjured")) {
    itemType = changesOverTimeItem;
    itemType.amount = -2;
  } else if (item.name === "Sulfuras, Hand of Ragnaros") {
    itemType = unchangingStoreItem;
  } else if (item.name === "Aged Brie") {
    itemType = changesOverTimeItem;
    itemType.amount = 1;
  } else {
    itemType = changesOverTimeItem;
    itemType.amount = -1;
  }

  return Object.assign(itemWrapper, itemType);
}

const unchangingStoreItem = {
  updateQuality() {
  }
};

const changesOverTimeItem = {
  updateQuality() {
    var item = this.item;
    var amount = this.amount;

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
      if (item.quality > 50) {
        item.quality = 50;
      }
    }
  }
};