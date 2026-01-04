import Delta from "../src/Delta";

describe('Added tests', () => {

    it('Sample 8', () => {
        /**
         * Sample 8
         * src/Delta.ts:517:17
         * -               if (embedType === Object.keys(otherData)[0]) {
         * +               if (true) {
         */
        Delta.registerEmbed<any>('delta', {
            compose: (a, b) => new Delta(a).compose(new Delta(b)).ops,
            transform: (a, b, priority) =>
                new Delta(a).transform(new Delta(b), priority).ops,
            invert: (a, b) => new Delta(a).invert(new Delta(b)).ops,
        });
        try {
            const left = new Delta().retain({ delta: [{ insert: 'a' }] });
            const right = new Delta().retain({ otherdelta: [{ insert: 'b' }] });
            const expected = new Delta().retain({ otherdelta: [{ insert: 'b' }] });
            expect(left.transform(right, true)).toEqual(expected);
        } finally {
            Delta.unregisterEmbed('delta');
        }
    });

});
