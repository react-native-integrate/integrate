/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { processScript } from '../processScript';
import { logWarning, summarize } from '../prompter';
import { ObjectModifierStrategy } from '../types/mod.types';
import { variables } from '../variables';
import {
  findClosingTagIndex,
  stripNonCode,
  TagDefinitions,
} from './findClosingTagIndex';

type PartialExpression = {
  type: 'partial';
  content: string;
};
type PrimitiveExpression = {
  type: 'primitive';
  content: string;
};
type VariableExpression = {
  type: 'variable';
  name: string;
  partial?: string;
  valueType: 'object' | 'array';
  tree: Expression[];
};
type PropertyExpression = {
  type: 'property';
  name: string;
  valueType: 'object' | 'array' | 'primitive';
  tree: Expression[];
};
type ValueExpression = {
  type: 'value';
  valueType: 'object' | 'array' | 'primitive';
  tree: Expression[];
};
type Expression =
  | PartialExpression
  | VariableExpression
  | PropertyExpression
  | PrimitiveExpression
  | ValueExpression;

export class JsObjectParser {
  tree: Expression[] = [];

  constructor(content?: string) {
    if (content) this.parse(content);
  }

  parse(content: string): void {
    this.tree = [];
    this._parseRootObject(content, this.tree);
  }

  private _parseRootObject(content: string, tree: Expression[]): void {
    let reducedContent = content;
    let objectMatch: RegExpMatchArray | null;
    const addPartialToTree = () => {
      if (objectMatch?.index != null) {
        const partial = reducedContent.substring(0, objectMatch.index);
        if (partial)
          tree.push({
            type: 'partial',
            content: partial,
          });
      } else {
        if (reducedContent)
          tree.push({
            type: 'partial',
            content: reducedContent,
          });
      }
    };
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // match an object
      objectMatch = reducedContent.match(
        /([^{\s[,][^{\s[]+)['"\]\s]*=\s*((\w+\(\s*)*)?[{[]/s
      );

      if (objectMatch?.index == null) {
        // no more object
        addPartialToTree();
        return;
      }
      addPartialToTree();

      const objectStart = objectMatch.index + objectMatch[0].length;
      const isObject = objectMatch[0][objectMatch[0].length - 1] === '{';
      const tag = isObject ? TagDefinitions.CURLY : TagDefinitions.BRACKETS;
      const objectEnd = findClosingTagIndex(reducedContent, objectStart, tag);
      const objectContent = reducedContent.substring(objectStart, objectEnd);

      const objectExpr: VariableExpression = {
        type: 'variable',
        name: objectMatch[1],
        partial: objectMatch[2],
        valueType: isObject ? 'object' : 'array',
        tree: [],
      };
      tree.push(objectExpr);
      if ('tree' in objectExpr) this._parse(objectContent, objectExpr);

      // reduce content
      reducedContent = reducedContent.substring(objectEnd + 1);
    }
  }

  private _parse(
    content: string,
    parent: ValueExpression | PropertyExpression | VariableExpression
  ): void {
    let reducedContent = content;
    let objectMatch: RegExpMatchArray | null;
    const addPartialToTree = () => {
      if (objectMatch?.index != null) {
        const partial = reducedContent.substring(0, objectMatch.index);
        if (partial)
          parent.tree.push({
            type: 'partial',
            content: partial,
          });
        reducedContent = reducedContent.substring(objectMatch.index);
        objectMatch.index = 0;
      } else {
        if (reducedContent)
          parent.tree.push({
            type: 'partial',
            content: reducedContent,
          });
        reducedContent = '';
      }
    };
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const matchRegex =
        parent.valueType === 'object'
          ? /([^{\s[,][^{\s[]+['"\]\s]*)\s*:\s*[{[\w'"`0-9]/s
          : /[{[\w'"`0-9]/s;
      // match a property or value
      objectMatch = reducedContent.match(matchRegex);

      if (objectMatch?.index == null) {
        // no more object
        addPartialToTree();
        return;
      }
      addPartialToTree();

      let objectStart = objectMatch.index + objectMatch[0].length;
      const isObject = objectMatch[0][objectMatch[0].length - 1] === '{';
      const isArray = objectMatch[0][objectMatch[0].length - 1] === '[';
      let shouldReduceClosure = true;
      let objectEnd: number;
      if (isObject || isArray) {
        const tag = isObject ? TagDefinitions.CURLY : TagDefinitions.BRACKETS;
        objectEnd = findClosingTagIndex(reducedContent, objectStart, tag);
      } else {
        objectStart--;
        const strippedBracketContent = stripNonCode(
          reducedContent,
          TagDefinitions.BRACKETS.comment
        );
        const commaIndex = strippedBracketContent.indexOf(',', objectStart);
        if (commaIndex != -1) {
          objectEnd = commaIndex;
          shouldReduceClosure = false;
        } else objectEnd = reducedContent.length;

        // objectEnd = commaIndex;
        // const regExp = /,\s*[{[\w'"`0-9]?/s;
        // regExp.lastIndex = objectStart;
        // const commaMatch = regExp.exec(reducedContent);
        // if (commaMatch?.index != null) {
        //   objectEnd = commaMatch.index + commaMatch[0].length;
        //   shouldReduceClosure = false;
        // } else objectEnd = reducedContent.length;
      }

      const objectContent = reducedContent.substring(objectStart, objectEnd);

      if (parent.valueType === 'object') {
        const propExpr: PropertyExpression = {
          type: 'property',
          name: objectMatch[1],
          valueType: isObject ? 'object' : isArray ? 'array' : 'primitive',
          tree: [],
        };
        if (propExpr.valueType === 'primitive')
          propExpr.tree.push({
            type: 'primitive',
            content: objectContent,
          });
        else this._parse(objectContent, propExpr);

        const propertyName = objectMatch[1];
        // special property
        if (propertyName.replace(/['"[\]]/g, '') === '__$raw') {
          // unwrap it to the current tree
          // parent.type = 'value';
          parent.valueType = 'primitive';
          const transformedExpr = propExpr.tree[0] as PartialExpression;
          transformedExpr.type = 'partial';
          transformedExpr.content = processScript(
            transformedExpr.content,
            variables,
            true,
            false
          );
          // parent.tree.push(propExpr);
          parent.tree = [...propExpr.tree];
        } else {
          parent.tree.push(propExpr);
        }
      } else {
        const propExpr: ValueExpression = {
          type: 'value',
          valueType: isObject ? 'object' : isArray ? 'array' : 'primitive',
          tree: [],
        };
        parent.tree.push(propExpr);
        if (propExpr.valueType === 'primitive')
          propExpr.tree.push({
            type: 'primitive',
            content: objectContent,
          });
        else this._parse(objectContent, propExpr);
      }

      // reduce content
      reducedContent = reducedContent.substring(
        objectEnd + (shouldReduceClosure ? 1 : 0)
      );
    }
  }

  stringify(): string {
    return this._stringifyTree(this.tree);
  }

  private _stringifyTree(tree: Expression[]): string {
    let content = '';
    for (const expr of tree) {
      content += this._stringifyExpr(expr);
    }
    return content;
  }

  private _stringifyExpr(expr: Expression): string {
    switch (expr.type) {
      case 'primitive':
      case 'partial':
        return expr.content;
      case 'variable':
        return (
          `${expr.name} = ${expr.partial ?? ''}` +
          (expr.valueType === 'object'
            ? this._stringifyObject(expr.tree)
            : this._stringifyArray(expr.tree))
        );
      case 'property':
        return (
          `${expr.name}: ` +
          (expr.valueType === 'object'
            ? this._stringifyObject(expr.tree)
            : expr.valueType === 'array'
              ? this._stringifyArray(expr.tree)
              : this._stringifyTree(expr.tree))
        );
      case 'value':
        return expr.valueType === 'object'
          ? this._stringifyObject(expr.tree)
          : expr.valueType === 'array'
            ? this._stringifyArray(expr.tree)
            : this._stringifyTree(expr.tree);
    }
  }

  private _stringifyArray(tree: Expression[]): string {
    return `[${tree.map(expr => this._stringifyExpr(expr)).join('')}]`;
  }

  private _stringifyObject(tree: Expression[]): string {
    return `{${this._stringifyTree(tree)}}`;
  }

  merge(
    object: Record<string, any>,
    opts: { insert?: number; strategy?: ObjectModifierStrategy } = {}
  ) {
    this._merge(object, this.tree, opts);
  }

  private _merge(
    object: Record<string, any>,
    tree: Expression[],
    opts: { insert?: number; strategy?: ObjectModifierStrategy }
  ) {
    let insert = opts.insert;

    if (Array.isArray(object)) {
      const hasObject = object.length && typeof object[0] === 'object';
      const forceSearch = hasObject && !!object[0]?.$search;
      const forceDelete = hasObject && !!object[0]?.$delete;
      const forceBefore = hasObject && !!object[0]?.$before;
      const forceAfter = hasObject && !!object[0]?.$after;
      const forceReplace = hasObject && !!object[0]?.$replace;
      const forceAppend = hasObject && !!object[0]?.$append;
      const forcePrepend = hasObject && !!object[0]?.$prepend;

      const items = tree.filter(expr => expr.type != 'partial');

      let contextStart = 0;
      let contextEnd = items.length;
      if (forceSearch) {
        const index = items.findIndex(expr =>
          this._stringifyExpr(expr)?.includes(object[0].$search)
        );
        if (index != -1) {
          contextStart = index;
          contextEnd = index + 1;
        }
      }
      if (forceAfter) {
        const index = items.findIndex(expr =>
          this._stringifyExpr(expr)?.includes(object[0].$after)
        );
        if (index != -1) {
          contextStart = index + 1;
        }
      }
      if (forceBefore) {
        const index = items.findIndex(expr =>
          this._stringifyExpr(expr)?.includes(object[0].$before)
        );
        if (index != -1) {
          contextEnd = index;
        }
      }
      if (forceReplace) {
        insert = contextStart;
        object[0] = object[0].$replace;
      } else if (forcePrepend) {
        insert = contextStart;
        object[0] = object[0].$prepend;
      } else if (forceAppend) {
        insert = contextEnd;
        object[0] = object[0].$append;
      } else if (forceDelete) {
        insert = contextStart;
      }
      const newItemExprs = object
        .flatMap((value, index) => {
          const newExpr = this._objectToExpr(value);
          if (newExpr) {
            const property: ValueExpression = {
              type: 'value',
              valueType: newExpr.valueType,
              tree: newExpr.tree,
            };
            return [
              ...(index > 0 ? [{ type: 'partial', content: ', ' }] : []),
              property,
            ];
          }

          logWarning('could not convert value to js tree: ' + summarize(value));
          return undefined;
        })
        .filter(Boolean) as Expression[];

      if (opts.strategy === 'assign') {
        tree.splice(0, tree.length, ...newItemExprs);
      } else if (!opts.strategy || opts.strategy === 'merge_concat') {
        if (insert != null) {
          const itemAtIndex = items[insert];
          //find real index in tree
          if (!itemAtIndex) {
            // just push it
            insert = undefined;
          } else insert = tree.indexOf(itemAtIndex);
        }
        //merge arrays
        if (insert != null) {
          if (items.length) {
            const previousItem = tree[insert];
            if (
              previousItem.type != 'partial' ||
              !previousItem.content?.includes(',')
            ) {
              if (forceDelete)
                tree.splice(
                  insert,
                  Math.max(0, (contextEnd - contextStart) * 2 - 1) ? 1 : 0
                );
              else
                tree.splice(insert, forceReplace ? 1 : 0, {
                  type: 'partial',
                  content: ', ',
                });
            }
          }
          if (forceDelete)
            tree.splice(
              insert,
              Math.max(0, (contextEnd - contextStart) * 2 - 1)
            );
          else
            tree.splice(
              insert,
              forceReplace
                ? Math.max(0, (contextEnd - contextStart) * 2 - 1)
                : 0,
              ...newItemExprs
            );
        } else {
          if (items.length) {
            const lastItem = tree[tree.length - 1];
            if (lastItem.type != 'partial' || !lastItem.content?.includes(','))
              tree.push({ type: 'partial', content: ', ' });
          }
          tree.push(...newItemExprs);
        }
      }
    } else if (typeof object === 'object') {
      for (const key in object) {
        let value = object[key];
        const forceAssign = typeof value === 'object' && !!value?.$assignTo;
        const forceDelete = typeof value === 'object' && !!value?.$delete;
        if (forceAssign) {
          value = value.$assignTo;
        }

        const exprObject = tree.find(expr => {
          return (
            (expr.type === 'variable' || expr.type === 'property') &&
            expr.name.replace(/['"[\]]/g, '') === key
          );
        }) as VariableExpression | PropertyExpression | undefined;
        const items = tree.filter(expr => expr.type != 'partial');

        if (forceDelete) {
          if (exprObject) {
            //find real index in tree
            const realIndex = tree.indexOf(exprObject);
            tree.splice(realIndex, 2);
          }
          continue;
        }
        const valueType = getValueType(value);

        if (!exprObject) {
          //object doesnt exist, add it
          const newExpr = this._objectToExpr(value);
          if (newExpr) {
            const property: PropertyExpression = {
              type: 'property',
              name: key,
              valueType,
              tree: [],
            };
            if (items.length) {
              const lastItem = tree[tree.length - 1];
              if (
                lastItem.type != 'partial' ||
                !lastItem.content?.includes(',')
              )
                tree.push({ type: 'partial', content: ', ' });
            }
            tree.push(property);
            property.valueType = newExpr.valueType;
            property.tree.push(...newExpr.tree);
          } else
            logWarning(
              'could not convert value to js tree: ' + summarize(value)
            );

          continue;
        } else if (exprObject && exprObject.valueType != valueType) {
          const newExpr = this._objectToExpr(value);
          if (newExpr) {
            exprObject.valueType = valueType;
            exprObject.tree = newExpr.tree;
            continue;
          } else
            logWarning(
              'could not convert value to js tree: ' + summarize(value)
            );
        }
        if (
          !forceAssign &&
          (exprObject.type === 'variable' ||
            !opts.strategy ||
            opts.strategy === 'merge' ||
            opts.strategy === 'merge_concat' ||
            opts.strategy === 'merge_distinct')
        ) {
          this._merge(value, exprObject.tree, opts);
        } else {
          const newExpr = this._objectToExpr(value);
          exprObject.valueType = newExpr.valueType;
          exprObject.tree = newExpr.tree;
        }
      }
    }
  }

  private _objectToExpr(object: any) {
    let json = JSON.stringify(object);
    if (/^[{[]/.test(json)) json = json.substring(1);
    if (/[}\]]$/.test(json)) json = json.substring(0, json.length - 1);
    const parent: ValueExpression = {
      type: 'value',
      valueType: getValueType(object),
      tree: [],
    };
    this._parse(`${json}`, parent);
    return parent;
  }
}

function getValueType(object: any) {
  return Array.isArray(object)
    ? 'array'
    : object != null && typeof object === 'object'
      ? 'object'
      : ('primitive' as const);
}
