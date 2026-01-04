import Delta from "../src/Delta";

describe('Added tests', () => {

    it('sample 2', () => {
        /**
         * Sample 2
         * src/Delta.ts:243:7
         * -         typeof firstOther.retain === 'number' &&
         * +         true &&
         */
        const source = new Delta().insert('A');
        const other = new Delta([{ retain: '1' as any }, { delete: 1 }]);
        const expected = new Delta([{ insert: undefined as any }]);
        expect(source.compose(other)).toEqual(expected);
    });

});
