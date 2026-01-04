import Op from "../src/Op";

describe('Added tests', () => {

    it('Sample 9', () => {
        /**
         * Sample 9
         * src/Op.ts:18:37
         * -       } else if (typeof op.retain === 'object' && op.retain !== null) {
         * +       } else if (typeof op.retain === "" && op.retain !== null) {
         */
        const op = { retain: { foo: 'bar' }, insert: 'abcd' } as any;
        expect(Op.length(op)).toBe(1);
    });

});
