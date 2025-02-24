import AttributeMap from "../src/AttributeMap";
import Delta from "../src/Delta";

describe('Added tests', () => {
    it('delta_0', () => {
        /**
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
});