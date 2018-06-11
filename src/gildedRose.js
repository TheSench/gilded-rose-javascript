import { createStoreItem } from './storeItem';

// Cannot change this function
export function Item(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
}

// Cannot change this
export const items = [];

items.push(new Item('+5 Dexterity Vest', 10, 20));
items.push(new Item('Aged Brie', 2, 0));
items.push(new Item('Elixir of the Mongoose', 5, 7));
items.push(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20));
items.push(new Item('Conjured Mana Cake', 3, 6));

export function updateQuality() {
  items.forEach(updateItemQuality);
}

export function updateItemQuality(item) {
  createStoreItem(item).updateQuality();
}