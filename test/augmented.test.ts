import AttributeMap from "../src/AttributeMap";
import Delta from "../src/Delta";
import Op from "../src/Op";

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

    it('Sample 2', () => {
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

    it('Sample 5', () => {
        /**
         * Sample 5
         * src/Delta.ts:321:51
         * -               (typeof thisOp.retain === 'object' && thisOp.retain !== null))
         * +               (typeof thisOp.retain === 'object' && true))
         */
        const left = new Delta([{ retain: null as any }]);
        const right = new Delta([{ delete: 1 }]);
        expect(left.compose(right)).toEqual(new Delta());
    });

    it('Sample 6', () => {
        /**
         * Sample 6
         * src/AttributeMap.ts:30:11
         * -         if (a[key] !== undefined && b[key] === undefined) {
         * +         if (true && b[key] === undefined) {
         */
        const left = { bold: undefined, color: 'red' };
        const right = { italic: true };
        expect(AttributeMap.compose(left, right)).toEqual({
            italic: true,
            color: 'red',
        });
    });

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

    it('Sample 10', () => {
        /**
         * Sample 10
         * src/Delta.ts:416:13
         * -             : -1;
         * +             : +1;
         */
        const spy = () => {
            const fn: any = (...args: any[]) => {
                fn.mock.calls.push(args);
            };
            fn.mock = { calls: [] as any[] };
            return fn;
        };
        const mock = spy();
        const embed = { image: 'pic.png' };
        const delta = new Delta([{ insert: embed }]);
        delta.eachLine(mock);
        expect(mock.mock.calls.length).toBe(1);
        expect(mock.mock.calls[0]).toEqual([new Delta([{ insert: embed }]), {}, 0]);
    });
});
