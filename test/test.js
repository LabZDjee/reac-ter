const assert = require("assert");
const { expect } = require("chai");
const _ = require("lodash");

const ReacTer = require("../reac-ter");
const { refData } = require("./test-data");

let react;

let count = 0;

let result = Array(3).fill();

function incCount(by) {
  return function(a, b, c) {
    result = [a, b, c];
    count += by;
  };
}

const checkResult = (a, b, c) => _.isEqual(result, [a, b, c]);

describe("Reactor", function() {
  describe("#new", function() {
    react = new ReacTer();
    it("should not have a $getWatchers member", function() {
      assert.equal(react.$getWatchers, undefined);
    });
  });
  describe('#new("true")', function() {
    it("should *not* have a $getWatchers member", function() {
      react = new ReacTer("true");
      assert.ok(typeof react.$getWatchers === "undefined");
    });
  });
  describe("#new(true)", function() {
    it("should have a $getWatchers member", function() {
      react = new ReacTer(true);
      assert.ok(Object.keys(react.$getWatchers).length === 0);
    });
  });
  describe("#addProperty", function() {
    it("should point to the right property value", function() {
      react.addProperty(refData, "projectName");
      assert.equal(react.projectName, refData.projectName);
    });
    it("should have an empty $watchers.projectName object", function() {
      assert.ok(Object.keys(react.$watchers.projectName).length === 0);
    });
    it("should have an empty $getWatchers object", function() {
      assert.ok(Object.keys(react.$getWatchers.projectName).length === 0);
    });
  });
  describe("#addProperty with alias", function() {
    it("should point to the right property value", function() {
      refData.alarms.mainsEnabled = true;
      react.addProperty(refData.alarms, "mainsEnabled", "alarmMainsEnabled");
      assert.equal(react.alarmMainsEnabled, refData.alarms.mainsEnabled);
    });
  });
  describe("#addProperty on non existing target property", function() {
    it("should create this property on target", function() {
      const target = {};
      const r = new ReacTer();
      r.addProperty(target, "foo");
      r.foo = "whatever";
      assert.equal(target.foo, "whatever");
    });
  });
  describe("altering values", function() {
    it("should point to the right property value", function() {
      const newProjectName = "Awesome Project";
      react.alarmMainsEnabled = false;
      react.projectName = newProjectName;
      assert.equal(refData.alarms.mainsEnabled, false);
      assert.equal(refData.projectName, newProjectName);
    });
  });
  describe("hooking a function through $watchers", function() {
    it("should see function side effects (with alias)", function() {
      react.alarmMainsEnabled = true;
      count = 1;
      react.$watchers.alarmMainsEnabled.push(incCount(1));
      react.alarmMainsEnabled = !react.alarmMainsEnabled;
      assert.ok(count === 2 && checkResult(false, true, "alarmMainsEnabled"));
    });
    it("should see function side effects (without alias)", function() {
      react.projectName = "foo";
      react.$watchers.projectName.push(incCount(2));
      react.projectName = "bar";
      assert.ok(count === 4 && checkResult("bar", "foo", "projectName"));
    });
    it("should apply on every hook function", function() {
      count = 0;
      react.$watchers.projectName = [];
      _.times(10, () => {
        react.$watchers.projectName.push(incCount(2));
      });
      react.projectName = "foo";
      assert.ok(count === 20);
    });
    it("should work on $getWatchers as well (without alias)", function() {
      react.projectName = "foo";
      count = 0;
      react.$getWatchers.projectName.push(incCount(4));
      const xyz = react.projectName;
      assert.ok(count === 4 && checkResult(refData.projectName, "projectName", undefined));
    });
    it("should work on $getWatchers as well (with alias)", function() {
      react.alarmMainsEnabled = true;
      count = 0;
      react.$getWatchers.alarmMainsEnabled.push(incCount(3));
      const xyz = react.alarmMainsEnabled;
      assert.ok(count === 3 && checkResult(refData.alarms.mainsEnabled, "alarmMainsEnabled", undefined));
    });
    it("should throw when #addProperty called twice on same property", function() {
      const f = () => {
        react.addProperty(refData, "projectName");
      };
      expect(f).to.throw();
    });
    it("should throw when #addProperty called twice on same aliased property", function() {
      const f = () => {
        react.addProperty(refData, "mainsEnabled", "alarmMainsEnabled");
      };
      expect(f).to.throw();
    });
    it("should throw when #addProperty called on a reference of wrong type", function() {
      const f = () => {
        react.addProperty("I'm not an object", "mainsEnabled");
      };
      expect(f).to.throw();
    });
  });
  describe("works on arrays too", function() {
    const target = [0, 10, 20, 30];
    const r = new ReacTer();
    let hits = 0;
    r.addProperty(target, 0);
    r.addProperty(target, 1, 1000);
    r.$watchers[0].push(() => {
      hits++;
    });
    r.$watchers[1000].push(() => {
      hits += 100;
    });
    r[0] = 1;
    r[1000] = 2;
    it("should set array value", function() {
      assert.equal(target[0], 1);
    });
    it("should retrieve array value", function() {
      assert.equal(r[0], 1);
    });
    it("should set array value with alias", function() {
      assert.equal(target[1], 2);
    });
    it("should equalize target and getter values (with alias)", function() {
      assert.equal(r[1000], target[1]);
    });
    it("should trigger callback functions", function() {
      assert.equal(hits, 101);
    });
  });
  describe("#deleteProperty", function() {
    const target = { a: 123, b: 456 };
    const r = new ReacTer(true);
    it("should return false on non existing property", function() {
      assert.equal(r.deleteProperty("b"), false);
    });
    r.addProperty(target, "a");
    it("should return true on existing property", function() {
      assert.equal(r.deleteProperty("a"), true);
    });
    it("should effectively remove property", function() {
      assert.equal(r.a, undefined);
    });
    it("should remove property in $watchers", function() {
      assert.equal(r.$watchers.a, undefined);
    });
    it("should remove property in $getWatchers", function() {
      assert.equal(r.$getWatchers.a, undefined);
    });
  });
});
