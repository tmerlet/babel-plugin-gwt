const { types, transform, transformFromAst } = require('babel-core');
const { constructTitle, getInterpolatedTitleAst, getLabelTitle } = require('./');

const getExpressionStatement = programAst => programAst.program.body[0];

describe('Title', () => {
  describe('.constructTitle', () => {
    it('returns title when given, when and then are empty strings', () => {
      expect(constructTitle('add(a, b)', '', '', '')).toBe('add(a, b)');
    });

    it('returns title and given when, when and then are empty strings', () => {
      expect(constructTitle('add(a, b)', 'a and b', '', '')).toBe('add(a, b) given: a and b');
    });

    it('returns title and given and when, when then is an empty string', () => {
      expect(constructTitle('add(a, b)', 'a and b', 'added', '')).toBe('add(a, b) given: a and b when: added');
    });

    it('returns title and given and when and then', () => {
      expect(constructTitle('add(a, b)', 'a and b', 'added', 'returns sum')).toBe(
        'add(a, b) given: a and b when: added then: returns sum'
      );
    });

    it('returns title and given and then when, when is empty', () => {
      expect(constructTitle('add(a, b)', 'a and b', '', 'returns sum')).toBe(
        'add(a, b) given: a and b then: returns sum'
      );
    });

    it('returns title and when and then when given is empty', () => {
      expect(constructTitle('add(a, b)', '', 'added', 'returns sum')).toBe('add(a, b) when: added then: returns sum');
    });
  });

  describe('.getLabelTitle', () => {
    it('returns empty string when given labels do not contain given label name', () => {
      const code = 'random: "hello world"';
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(getLabelTitle([node], 'when')).toBe('');
    });

    it('returns label title when given labels contain given label name', () => {
      const code = 'when: "hello world"';
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(getLabelTitle([node], 'when')).toBe('hello world');
    });
  });

  describe('.getInterpolatedTitleAst', () => {
    it('returns string as template literal when given title does not contain any words prefixed with a $', () => {
      const title = 'a normal title';
      expect(getInterpolatedTitleAst(types, title)).toEqual(
        types.templateLiteral([types.templateElement({ raw: title, cooked: title }, true)], [])
      );
    });

    it('returns string as template literal when given title contains multiple words prefixed with a $', () => {
      const title = 'given: $a when: squared then: equals $expected';
      expect(getInterpolatedTitleAst(types, title)).toEqual(
        types.templateLiteral(
          [
            types.templateElement({ raw: 'given: ', cooked: 'given: ' }, false),
            types.templateElement(
              { raw: ' when: squared then: equals ', cooked: ' when: squared then: equals ' },
              false
            ),
            types.templateElement({ raw: '', cooked: '' }, true)
          ],
          [types.identifier('a'), types.identifier('expected')]
        )
      );
    });
  });
});
