import AttributeMap from "../src/AttributeMap";

describe('Added tests', () => {
    it('Sample 2', () => {
        /**
         * Sample 1
          src/AttributeMap.ts:30:11
          -       if (a[key] !== undefined && b[key] === undefined) {
          +       if (true && b[key] === undefined) {
         */
        const a = { color: undefined };
        const b = {};
        const result = AttributeMap.compose(a, b);
        expect(result).toBe(undefined);
    });  
});