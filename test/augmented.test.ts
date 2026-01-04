import AttributeMap from "../src/AttributeMap";
import Delta from "../src/Delta";
import Op from "../src/Op";

describe('Added tests', () => {

    it('Sample 7', () => {
        /**
         * Sample 7
         * src/Delta.ts:74:9
         * -       if (typeof arg === 'string' && arg.length === 0) {
         * +       if (true && arg.length === 0) {
         */
        const embed = { length: 0, foo: 'bar' };
        const delta = new Delta().insert(embed as any);
        expect(delta.ops).toEqual([{ insert: embed }]);
    });

});
