// @ts-nocheck
import * as t from '@babel/types';
import * as babel from '@babel/core';

/**
 * 填充未声明的变量对其进行声明
 */
export function polyfillUndeclaredVariable(path: babel.NodePath<babel.types.Node>) {
  if (path.type === 'ExpressionStatement' && !path.isVariableDeclaration()) {
    if (
      path.node &&
      path.node.expression &&
      path.node.expression.left &&
      path.node.expression.left.name
    ) {
      const node = t.variableDeclaration(
        'var', [t.variableDeclarator(t.identifier(path.node.expression.left.name))]
      );
      path.insertBefore(node);
    }
  }
}