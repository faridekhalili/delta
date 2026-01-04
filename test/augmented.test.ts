import AttributeMap from "../src/AttributeMap";
import Delta from "../src/Delta";
import Op from "../src/Op";

describe('Added tests', () => {
    it('delta_0', () => {
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

    it('delta_1', () => {
        /**
          ConditionalExpression
          src/AttributeMap.ts:41:9
          -       if (typeof a !== 'object') {
          +       if (false) {
         */
        const a = <AttributeMap><unknown>'baz';
        const b = { foo: 'bar' };
        expect(AttributeMap.diff(a, b)).toEqual({ foo: 'bar' })
    });

    it('delta_4', () => {
        // Notes: very difficult to write. Reachability of infection is predicated upon
        // multiple conditions being met, all of which required further understanding of
        // the library's classes and types to create a test case to meet.
        /**
             src/Delta.ts:242:7
            -         firstOther != null &&
            -         typeof firstOther.retain === 'number' &&
            -         firstOther.attributes == null
            +         false
        */
        const a = new Delta()
        a.ops = [{ 'insert': 'foo' }, { 'insert': 'bar' }, { 'insert': 'baz' }]
        const b = new Delta([{ 'retain': 7 }])
        expect(a.compose(b)).toEqual(new Delta([{ 'insert': 'foo' }, { 'insert': 'barbaz' }]))
    });

    it('delta_6', () => {
        /**
          BlockStatement
          src/Delta.ts:340:33
          -       if (this.ops === other.ops) {
          -         return new Delta();
          -       }
          +       if (this.ops === other.ops) {}
         */
        const op = [{ 'insert': undefined }]
        const a = new Delta(op);
        const b = new Delta(op);
        expect(a.diff(b)).toEqual(new Delta());
    });

    it('delta_9', () => {
        /**
          ConditionalExpression
          src/Delta.ts:80:7
          -         typeof attributes === 'object' &&
          +         true &&
         */
        const a = new Delta();
        const b = new Delta([{ insert: 'foo' }]);
        const attributes: AttributeMap = <AttributeMap><unknown>'bar';
        expect(a.insert('foo', attributes)).toEqual(b)
    });

    it('delta_10', () => {
        /**
          ConditionalExpression
          src/AttributeMap.ts:70:11
          -         if (attr[key] !== base[key] && base[key] === undefined) {
          +         if (true && base[key] === undefined) {
         */
        const base = { key: undefined }
        const attr = { key: undefined }
        expect(AttributeMap.invert(base, attr)).toEqual({});
    });

    it('delta_11', () => {
        /**
          BlockStatement
          src/AttributeMap.ts:17:32
          -       if (typeof b !== 'object') {
          -         b = {};
          -       }
          +       if (typeof b !== 'object') {}
         */
        const a: AttributeMap = {};
        const b: AttributeMap = <AttributeMap><unknown>'foo';
        expect(AttributeMap.compose(a, b)).not.toBeDefined();
    });

    it('delta_12_sample_2', () => {
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

    it('delta_13_sample_4', () => {
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

    it('delta_14_sample_6', () => {
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

    it('delta_15_sample_7', () => {
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

    it('delta_16_sample_8', () => {
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

    it('delta_18_sample_3', () => {
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

    it('delta_19_sample_5', () => {
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

    it('delta_20_sample_10', () => {
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

    it('delta_17_sample_9', () => {
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
