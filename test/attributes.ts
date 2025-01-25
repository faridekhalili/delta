import AttributeMap from '../src/AttributeMap';

describe('AttributeMap', () => {
  describe('compose()', () => {
    const attributes = { bold: true, color: 'red' };

    it('left is undefined', () => {
      expect(AttributeMap.compose(undefined, attributes)).toEqual(attributes);
    });

    it('right is undefined', () => {
      expect(AttributeMap.compose(attributes, undefined)).toEqual(attributes);
    });

    it('both are undefined', () => {
      expect(AttributeMap.compose(undefined, undefined)).toBe(undefined);
    });

    it('missing', () => {
      expect(AttributeMap.compose(attributes, { italic: true })).toEqual({
        bold: true,
        italic: true,
        color: 'red',
      });
    });

    it('overwrite', () => {
      expect(
        AttributeMap.compose(attributes, { bold: false, color: 'blue' }),
      ).toEqual({
        bold: false,
        color: 'blue',
      });
    });

    it('remove', () => {
      expect(AttributeMap.compose(attributes, { bold: null })).toEqual({
        color: 'red',
      });
    });

    it('remove to none', () => {
      expect(
        AttributeMap.compose(attributes, { bold: null, color: null }),
      ).toEqual(undefined);
    });

    it('remove missing', () => {
      expect(AttributeMap.compose(attributes, { italic: null })).toEqual(
        attributes,
      );
    });
  });

  describe('diff()', () => {
    const format = { bold: true, color: 'red' };

    it('left is undefined', () => {
      expect(AttributeMap.diff(undefined, format)).toEqual(format);
    });

    it('right is undefined', () => {
      const expected = { bold: null, color: null };
      expect(AttributeMap.diff(format, undefined)).toEqual(expected);
    });

    it('same format', () => {
      expect(AttributeMap.diff(format, format)).toEqual(undefined);
    });

    it('add format', () => {
      const added = { bold: true, italic: true, color: 'red' };
      const expected = { italic: true };
      expect(AttributeMap.diff(format, added)).toEqual(expected);
    });

    it('remove format', () => {
      const removed = { bold: true };
      const expected = { color: null };
      expect(AttributeMap.diff(format, removed)).toEqual(expected);
    });

    it('overwrite format', () => {
      const overwritten = { bold: true, color: 'blue' };
      const expected = { color: 'blue' };
      expect(AttributeMap.diff(format, overwritten)).toEqual(expected);
    });

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
  });

  describe('invert()', () => {
    it('attributes is undefined', () => {
      const base = { bold: true };
      expect(AttributeMap.invert(undefined, base)).toEqual({});
    });

    it('base is undefined', () => {
      const attributes = { bold: true };
      const expected = { bold: null };
      expect(AttributeMap.invert(attributes, undefined)).toEqual(expected);
    });

    it('both undefined', () => {
      expect(AttributeMap.invert()).toEqual({});
    });

    it('merge', () => {
      const attributes = { bold: true };
      const base = { italic: true };
      const expected = { bold: null };
      expect(AttributeMap.invert(attributes, base)).toEqual(expected);
    });

    it('null', () => {
      const attributes = { bold: null };
      const base = { bold: true };
      const expected = { bold: true };
      expect(AttributeMap.invert(attributes, base)).toEqual(expected);
    });

    it('replace', () => {
      const attributes = { color: 'red' };
      const base = { color: 'blue' };
      const expected = base;
      expect(AttributeMap.invert(attributes, base)).toEqual(expected);
    });

    it('noop', () => {
      const attributes = { color: 'red' };
      const base = { color: 'red' };
      const expected = {};
      expect(AttributeMap.invert(attributes, base)).toEqual(expected);
    });

    it('combined', () => {
      const attributes = {
        bold: true,
        italic: null,
        color: 'red',
        size: '12px',
      };
      const base = { font: 'serif', italic: true, color: 'blue', size: '12px' };
      const expected = { bold: null, italic: true, color: 'blue' };
      expect(AttributeMap.invert(attributes, base)).toEqual(expected);
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
  });

  describe('transform()', () => {
    const left = { bold: true, color: 'red', font: null };
    const right = { color: 'blue', font: 'serif', italic: true };

    it('left is undefined', () => {
      expect(AttributeMap.transform(undefined, left, false)).toEqual(left);
    });

    it('right is undefined', () => {
      expect(AttributeMap.transform(left, undefined, false)).toEqual(undefined);
    });

    it('both are undefined', () => {
      expect(AttributeMap.transform(undefined, undefined, false)).toEqual(
        undefined,
      );
    });

    it('with priority', () => {
      expect(AttributeMap.transform(left, right, true)).toEqual({
        italic: true,
      });
    });

    it('without priority', () => {
      expect(AttributeMap.transform(left, right, false)).toEqual(right);
    });
  });
});
