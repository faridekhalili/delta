import AttributeMap from "../src/AttributeMap";

describe('Added tests', () => {
    it('Sample 6', () => {
        /**
         * Sample 6
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