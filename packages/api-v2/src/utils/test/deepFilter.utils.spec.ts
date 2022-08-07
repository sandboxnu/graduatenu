import { deepFilter } from "../deepFilter.utils";

describe("deepFilter", () => {
  it("should filter 1 key", () => {
    const input = {
      key1: "val1",
      key2: 1,
      key3: false,
    };

    const expectedVal = {
      key1: "val1",
      key3: false,
    };

    expect(deepFilter(input, ["key2"])).toEqual(expectedVal);
  });

  it("should filter multiple keys", () => {
    const input = {
      key1: "val1",
      key2: 1,
      key3: false,
    };

    const expectedVal = {
      key3: false,
    };

    expect(deepFilter(input, ["key1", "key2"])).toEqual(expectedVal);
  });

  it("should filter nested key", () => {
    const input = {
      key1: "val1",
      key2: 1,
      secretKey: "secret",
      key3: {
        key4: 2,
        secretKey: "secret",
        key5: {
          key6: {
            secretKey: "secret",
            key7: {
              secretKey: "secret",
            },
          },
          secretKey: "secret",
        },
      },
    };

    const expectedVal = {
      key1: "val1",
      key2: 1,
      key3: {
        key4: 2,
        key5: {
          key6: {
            key7: {},
          },
        },
      },
    };

    expect(deepFilter(input, ["secretKey"])).toEqual(expectedVal);
  });

  it("should filter nothing if key is not present", () => {
    const input = {
      key1: "val1",
      key2: 1,
      key3: false,
    };

    expect(deepFilter(input, ["secretKey"])).toEqual(input);
  });

  it("should filter from class based objects", () => {
    class Person {
      private name: string;
      private age: number;
      constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
      }

      toString() {
        return `${this.name} - ${this.age}`;
      }
    }

    const input = new Person("Aryan", 20);

    const expectedVal = {
      age: 20,
    };

    expect(deepFilter(input, ["name"])).toEqual(expectedVal);
  });

  it("should not try to filter null", () => {
    expect(deepFilter(null, ["key1"])).toBeNull();
  });

  it("should not try to filter undefined", () => {
    expect(deepFilter(undefined, ["key1"])).toBeUndefined();
  });

  it("should not filter anything from arrays", () => {
    const input = [1, 2, 3, 4];
    expect(deepFilter(input, ["key1"])).toEqual(input);
  });
});
