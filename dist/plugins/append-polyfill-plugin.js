/**
 * Babel plugin to transform Element.append() calls to be compatible with older browsers.
 * This plugin converts:
 * - element.append("text") to element.appendChild(document.createTextNode("text"))
 * - element.append(node) to element.appendChild(node)
 * - element.append(node1, "text", node2) to a sequence of appendChild calls
 *
 * @param {Object} param0 - Babel plugin parameters
 * @param {Object} param0.types - Babel types utility
 * @returns {Object} Babel plugin object
 */
export default function ({ types: t }) {
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
          const arg = args[0];

          // String literal case: element.append("text")
          if (t.isStringLiteral(arg)) {
            path.replaceWith(
              t.callExpression(t.memberExpression(t.cloneNode(objectNode), t.identifier('appendChild')), [
                t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createTextNode')), [arg]),
              ]),
            );
          } else {
            // Node case: element.append(node)
            callee.get('property').replaceWith(t.identifier('appendChild'));
          }
          return;
        }

        // Handle multiple arguments: element.append(node1, "text", node2)
        const statements = args.map((arg) => {
          // String literal case
          if (t.isStringLiteral(arg)) {
            return t.callExpression(t.memberExpression(t.cloneNode(objectNode), t.identifier('appendChild')), [
              t.callExpression(t.memberExpression(t.identifier('document'), t.identifier('createTextNode')), [arg]),
            ]);
          } else {
            // Node case
            return t.callExpression(t.memberExpression(t.cloneNode(objectNode), t.identifier('appendChild')), [arg]);
          }
        });

        if (statements.length > 0) {
          // Combine multiple statements into a sequence expression
          path.replaceWith(t.sequenceExpression(statements));
        }
      },
    },
  };
}
