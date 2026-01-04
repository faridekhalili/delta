import Delta from "../src/Delta";

describe('Added tests', () => {

    it('Sample 3', () => {
        /**
         * Sample 3
         * src/Delta.ts:248:33
         * -           thisIter.peekType() === 'insert' &&
         * +           thisIter.peekType() === "" &&
         */
        const left = new Delta([
            { insert: 'A' },
            { insert: 'B' },
            { insert: 'A' },
        ]);
        const right = new Delta([
            { retain: 2 },
            { retain: 2, attributes: { bold: true } },
        ]);
        const expected = new Delta([
            { insert: 'A' },
            { insert: 'B' },
            { insert: 'A', attributes: { bold: true } },
            { retain: 1, attributes: { bold: true } },
        ]);
        expect(left.compose(right)).toEqual(expected);
    });

});
