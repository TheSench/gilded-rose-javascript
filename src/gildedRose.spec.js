import { expect } from 'chai';
import { Item, updateItemQuality, updateQuality } from './gildedRose';

/*
items.push(new Item('+5 Dexterity Vest', 10, 20));
items.push(new Item('Aged Brie', 2, 0));
items.push(new Item('Elixir of the Mongoose', 5, 7));
items.push(new Item('Sulfuras, Hand of Ragnaros', 0, 80));
items.push(new Item('Backstage passes to a TAFKAL80ETC concert', 15, 20));
items.push(new Item('Conjured Mana Cake', 3, 6));
*/
const itemDefs = {
  agedBrie(sellIn, quality) { return new Item('Aged Brie', sellIn, quality); },
  dexterityVest(sellIn, quality) { return new Item('+5 Dexterity Vest', sellIn, quality); },
  elixirOfTheMongoose(sellIn, quality) { return new Item('Elixir of the Mongoose', sellIn, quality); },
  backstagePass(sellIn, quality) { return new Item('Backstage passes to a TAFKAL80ETC concert', sellIn, quality); },
  sulfuras(sellIn, quality) { return new Item('Sulfuras, Hand of Ragnaros', sellIn, quality); },
  conjuredManaCake(sellIn, quality) { return new Item('Conjured Mana Cake', sellIn, quality); }
};

describe("Gilded Rose", () => {

  it("should do something", () => {
    updateQuality();
  });

  describe('Aged Brie', () => {
    sellInOf(itemDefs.dexterityVest).changesBy(-1);

    qualityOf(itemDefs.agedBrie)
      .whenSellInEquals(10).changesBy(1)
      .and.whenSellInEquals(1).changesBy(1)
      .and.whenSellInEquals(0).changesBy(2)
      .and.whenSellInEquals(-1).changesBy(2)
      .and.whenSellInEquals(10).neverGoesAbove(50);
  });

  describe('Dexterity Vest', () => {
    sellInOf(itemDefs.dexterityVest).changesBy(-1);

    qualityOf(itemDefs.dexterityVest)
      .whenSellInEquals(10).changesBy(-1)
      .and.whenSellInEquals(0).changesBy(-2)
      .and.neverGoesBelow(0);
  });

  describe('Elixir of the Mongoose', () => {
    sellInOf(itemDefs.elixirOfTheMongoose).changesBy(-1);

    qualityOf(itemDefs.elixirOfTheMongoose)
      .whenSellInEquals(10).changesBy(-1)
      .and.whenSellInEquals(0).changesBy(-2)
      .and.neverGoesBelow(0);
  });

  describe('Bakstage Pass', () => {
    sellInOf(itemDefs.backstagePass).changesBy(-1);

    qualityOf(itemDefs.backstagePass)
      .whenSellInEquals(20).changesBy(1)
      .and.whenSellInEquals(11).changesBy(1)
      .and.whenSellInEquals(10).changesBy(2)
      .and.whenSellInEquals(9).changesBy(2)
      .and.whenSellInEquals(8).changesBy(2)
      .and.whenSellInEquals(7).changesBy(2)
      .and.whenSellInEquals(6).changesBy(2)
      .and.whenSellInEquals(5).changesBy(3)
      .and.whenSellInEquals(4).changesBy(3)
      .and.whenSellInEquals(3).changesBy(3)
      .and.whenSellInEquals(2).changesBy(3)
      .and.whenSellInEquals(1).changesBy(3)
      .and.whenSellInEquals(0).isSetTo(0)
      .and.whenSellInEquals(-1).isSetTo(0)
      .and.whenSellInEquals(-2).isSetTo(0)
      .and.whenSellInEquals(10).neverGoesAbove(50)
      .and.neverGoesBelow(0);
  });

  describe('Sulfuras', () => {
    sellInOf(itemDefs.sulfuras).neverChanges();

    qualityOf(itemDefs.sulfuras)
      .neverChanges();
  });

  describe('Conjured ManaCake', () => {
    sellInOf(itemDefs.conjuredManaCake).changesBy(-1);

    qualityOf(itemDefs.conjuredManaCake)
      .whenSellInEquals(10).changesBy(-2)
      .and.whenSellInEquals(1).changesBy(-2)
      .and.whenSellInEquals(0).changesBy(-4)
      .and.neverGoesBelow(0);
  });
});

function makeTest(context, testFunc) {
  return function (...params) {
    testFunc(...params);

    return {
      and: context
    };
  };
}

function sellInOf(itemDef) {
  return {
    changesBy(num) {
      sellInChangesByNum(itemDef, num);
    },
    neverChanges() {
      sellInNeverChanges(itemDef);
    }
  };
}

function qualityOf(itemDef) {
  return {
    whenSellInEquals(sellIn) {
      var qualityOf = this;

      return {
        changesBy: makeTest(qualityOf, (qualityChange) => qualityChangesByNum(itemDef, sellIn, qualityChange)),
        isSetTo: makeTest(qualityOf, (newValue) => qualitySetToNum(itemDef, sellIn, newValue)),
        neverGoesAbove: makeTest(qualityOf, (maxValue) => qualityMaximum(itemDef, sellIn, maxValue)),
      };
    },
    neverGoesBelow: makeTest(qualityOf, (minValue) => qualityMinimum(itemDef, -1, minValue)),
    neverChanges() {
      qualityNeverChanges(itemDef);
    }
  };
}

function qualityChangesByNum(createItem, sellIn, qualityChange) {
  it(`given a sellIn of ${sellIn}, should modify quality by ${qualityChange}`, () => {
    [10, 5].forEach((quality) => {
      const item = createItem(sellIn, quality);
      updateItemQuality(item);
      expect(item.quality).to.equal(quality + qualityChange);
    });
  });
}

function qualitySetToNum(createItem, sellIn, newValue) {
  it(`given a sellIn of ${sellIn}, should set quality to ${newValue}`, () => {
    [80, 50, 49, 10, 5, 0, -10].forEach((quality) => {
      const item = createItem(sellIn, quality);
      updateItemQuality(item);
      expect(item.quality).to.equal(newValue);
    });
  });
}

function qualityMaximum(createItem, sellIn, maxValue) {
  it(`given a sellIn of ${sellIn}, quality should never go above ${maxValue}`, () => {
    [0, 1, 2, 3, 4, 5].forEach((quality) => {
      const item = createItem(sellIn, maxValue-quality);
      updateItemQuality(item);
      expect(item.quality).to.be.lessThan(maxValue+1);
    });
  });
}

function qualityMinimum(createItem, sellIn, minValue) {
  it(`given a sellIn of ${sellIn}, quality should never go below ${minValue}`, () => {
    [0, 1, 2, 3, 4, 5].forEach((quality) => {
      const item = createItem(sellIn, minValue+quality);
      updateItemQuality(item);
      expect(item.quality).to.be.greaterThan(minValue-1);
    });
  });
}

function qualityNeverChanges(createItem) {
  it(`should never change quality`, () => {
    [-10, -1, 0, 1, 10].forEach((sellIn) => {
      [0, 10, 49, 50, 51, 80].forEach((quality) => {
        const item = createItem(sellIn, quality);
        updateItemQuality(item);
        expect(item.quality).to.equal(quality);
      });
    });
  });
}

function sellInChangesByNum(createItem, num) {
  it(`should modify sellIn by ${num}`, () => {
    [10, 5].forEach((sellIn) => {
      const item = createItem(sellIn, 10);
      updateItemQuality(item);
      expect(item.sellIn).to.equal(sellIn + num);
    });
  });
}

function sellInNeverChanges(createItem) {
  it(`should never change sellIn`, () => {
    [-10, -1, 0, 1, 10].forEach((sellIn) => {
      const item = createItem(sellIn, 10);
      updateItemQuality(item);
      expect(item.sellIn).to.equal(sellIn);
    });
  });
}