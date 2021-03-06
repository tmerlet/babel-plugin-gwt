const each = require('jest-each');
const { transform } = require('babel-core');

const { isLabelBlock, isOnlyBlock, isSkipBlock, isTestBlock } = require('./');

const getExpressionStatement = programAst => programAst.program.body[0];

describe('Identifers', () => {
  describe('.isLabelBlock', () => {
    it('returns false when given label does not match given label name', () => {
      const code = 'random: "hello world"';
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(isLabelBlock('given')(node)).toBeFalse();
    });

    it('returns true when given label matches given label name', () => {
      const code = 'given: "hello world"';
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(isLabelBlock('given')(node)).toBeTrue();
    });
  });

  describe('.isOnlyBlock', () => {
    each([['it'], ['test']]).it('returns false when given %s block without only property ', name => {
      const code = `${name}("description", () => {});`;
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(isOnlyBlock(node)).toBeFalse();
    });

    each([['it'], ['test']]).it('returns true when given %s block with only property ', name => {
      const code = `${name}.only("description", () => {});`;
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(isOnlyBlock(node)).toBeTrue();
    });
  });

  describe('.isSkipBlock', () => {
    each([['it'], ['test']]).it('returns false when given %s block without skip property ', name => {
      const code = `${name}("description", function () {});`;
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(isSkipBlock(node)).toBeFalse();
    });

    each([['it'], ['test']]).it('returns true when given %s block with skip property ', name => {
      const code = `${name}.skip("description", function () {});`;
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(isSkipBlock(node)).toBeTrue();
    });
  });

  describe('.isTestBlock', () => {
    it('returns false when given random block ', () => {
      const code = 'random("description", () => {});';
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(isTestBlock(node)).toBeFalse();
    });

    each([['it'], ['test'], ['fit'], ['ftest'], ['xit'], ['xtest']]).it('returns true when given %s block ', name => {
      const code = `${name}("description", () => {});`;
      const { ast } = transform(code);
      const node = getExpressionStatement(ast);
      expect(isTestBlock(node)).toBeTrue();
    });
  });
});
