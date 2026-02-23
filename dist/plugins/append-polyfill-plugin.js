/**
 * Babel plugin to transform Element.append() calls to be compatible with older browsers.
 * This plugin converts:
 * - element.append("text") to element.appendChild(document.createTextNode("text"))
 * - element.append(3) to element.appendChild(document.createTextNode(3))
 * - element.append(node) to element.appendChild(node instanceof Node ? node : document.createTextNode(String(node)))
 * - element.append(node1, "text", node2) to a sequence of appendChild calls
 *
 * @param {Object} param0 - Babel plugin parameters
 * @param {Object} param0.types - Babel types utility
 * @returns {Object} Babel plugin object
 */
export default function ({ types: t }) {
  function createTextNodeExpression(arg) {
    return t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createTextNode')), [arg]);
  }

  function isLiteral(node) {
    return (
      t.isStringLiteral(node) ||
      t.isNumericLiteral(node) ||
      t.isBooleanLiteral(node) ||
      t.isNullLiteral(node) ||
      t.isTemplateLiteral(node)
    );
  }

  function toAppendChildArg(arg) {
    // Known primitives: always wrap with createTextNode
    if (isLiteral(arg)) {
      return createTextNodeExpression(arg);
    }
    // Unknown values (variables, expressions): runtime check
    // If it's a Node, use directly; otherwise wrap with createTextNode
    return t.conditionalExpression(
      t.binaryExpression('instanceof', t.cloneNode(arg), t.identifier('Node')),
      t.cloneNode(arg),
      createTextNodeExpression(t.cloneNode(arg)),
    );
  }

  return {
    name: 'append-polyfill-transform',
    visitor: {
      CallExpression(path) {
        const callee = path.get('callee');

        // Check for element.append(...) call pattern
        if (!callee.isMemberExpression()) return;
        if (!callee.get('property').isIdentifier({ name: 'append' })) return;

        const args = path.node.arguments;
        const objectNode = callee.get('object').node;

        // Skip if no arguments
        if (args.length === 0) return;

        // Handle single argument case
        if (args.length === 1) {
          path.replaceWith(
            t.callExpression(t.memberExpression(t.cloneNode(objectNode), t.identifier('appendChild')), [
              toAppendChildArg(args[0]),
            ]),
          );
          return;
        }

        // Handle multiple arguments: element.append(node1, "text", node2)
        const statements = args.map((arg) =>
          t.callExpression(t.memberExpression(t.cloneNode(objectNode), t.identifier('appendChild')), [
            toAppendChildArg(arg),
          ]),
        );

        path.replaceWith(t.sequenceExpression(statements));
      },
    },
  };
}
