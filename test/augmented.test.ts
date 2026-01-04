import Delta from "../src/Delta";

describe('Added tests', () => {

    it('Sample 4', () => {
        /**
         * Sample 4
         * src/Delta.ts:99:9
         * -       if (typeof length === 'number' && length <= 0) {
         * +       if (true && length <= 0) {
         */
        const zeroLike = { valueOf: () => 0 };
        const delta = new Delta().retain(zeroLike as any);
        expect(delta.ops).toEqual([{ retain: zeroLike as any }]);
    });

});
