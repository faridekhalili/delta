import AttributeMap from "../src/AttributeMap";

describe('Added tests', () => {
    it('Sample 1', () => {
        /**
         * Sample 1
          BlockStatement
          src/AttributeMap.ts:44:32
          -       if (typeof b !== 'object') {
          -         b = {};
          -       }
          +       if (typeof b !== 'object') {}
         */
        const a = { foo: 'bar' };
        const b = <AttributeMap><unknown>'baz';
        expect(AttributeMap.diff(a, b)).toEqual({ foo: null })
    });
});
