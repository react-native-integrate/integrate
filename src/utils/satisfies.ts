type TPrimitive = string | number | boolean | undefined | null;
type TObject = Record<string, TAny>;
type TArray = any[];
type TObjectOrPrimitive = TObject | TPrimitive;
type TAny = Record<string, any> | TPrimitive | TArray;

export function satisfies(left: TAny, right: TAny): boolean {
  if (Array.isArray(right)) return anySatisfiesArray(left, right);
  else if (typeof right == 'object' && right != null)
    return anySatisfiesObject(left, right);
  return anySatisfiesPrimitive(left, right);
}

function anySatisfiesArray(left: TAny, right: TArray): boolean {
  if (Array.isArray(left)) return arraySatisfiesArray(left, right);
  //else if (typeof left == 'object') {
  //  this would never match
  //  return objectSatisfiesArray(left, right);
  //}
  // this would never match
  // return primitiveSatisfiesArray(left, right);
  return false;
}

// searches in array
function arraySatisfiesPrimitive(
  left: TArray,
  right: TArray | TPrimitive
): boolean {
  return left.some((leftChild: TAny) => deepEquals(leftChild, right));
}
function arraySatisfiesArray(
  left: TArray,
  right: TArray | TPrimitive
): boolean {
  return deepEquals(left, right);
}

function arraySatisfiesObject(left: any[], right: TObject): boolean {
  let hasOperand = false;
  const result = Object.entries(right).every(([key, value]) => {
    if (key in arrayOperands) {
      hasOperand = true;
      return arrayOperands[key](left, value);
    }
    return false;
  });

  if (hasOperand) return result;
  return left.some((leftChild: TAny) => deepEquals(leftChild, right));
}

function anySatisfiesObject(left: TAny, right: TObject): boolean {
  if (Array.isArray(left)) return arraySatisfiesObject(left, right);
  else if (typeof left == 'object' && left != null)
    return objectSatisfiesObject(left, right);
  return primitiveSatisfiesObject(left, right);
}

function objectSatisfiesObject(left: TObject, right: TObject): boolean {
  return Object.entries(right).every(([key, value]) => {
    if (key in nonArrayOperands)
      return nonArrayOperands[key](left, value, right);
    return satisfies(left[key], value);
  });
}

function anySatisfiesPrimitive(left: TAny, right: TPrimitive): boolean {
  if (Array.isArray(left)) return arraySatisfiesPrimitive(left, right);
  else if (typeof left == 'object' && left != null) {
    // this would never match
    // return objectSatisfiesPrimitive(left, right);
    return false;
  }
  return primitiveSatisfiesPrimitive(left, right);
}

function primitiveSatisfiesPrimitive(
  left: TPrimitive,
  right: TPrimitive
): boolean {
  return equals(left, right);
}

function primitiveSatisfiesObject(left: TPrimitive, right: TObject): boolean {
  return Object.entries(right).every(([key, value]) => {
    if (key in nonArrayOperands)
      return nonArrayOperands[key](left, value, right);
    return false;
  });
}

function equals(left: TAny, right: TAny): boolean {
  return left == right;
}

export function deepEquals(left: TAny, right: TAny): boolean {
  if (equals(left, right)) return true;

  if (
    typeof left != 'object' ||
    typeof right != 'object' ||
    left == null ||
    right == null
  )
    return false;

  const isLeftArray = Array.isArray(left),
    isRightArray = Array.isArray(right);
  if (isLeftArray && isRightArray) {
    if (left.length != right.length) return false;
    for (let i = 0; i < left.length; i++) {
      if (!deepEquals(left[i], right[i])) return false;
    }
    return true;
  }
  if (isLeftArray || isRightArray) return false;

  const keysA = Object.keys(left),
    keysB = Object.keys(right);

  if (keysA.length != keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEquals(left[key], right[key])) return false;
  }

  return true;
}

const commonOperands: Record<string, (left: TAny, right: TAny) => boolean> = {
  $and(left: TAny, right: TAny) {
    if (Array.isArray(right))
      return right.every((rightChild: TAny) => satisfies(left, rightChild));
    return satisfies(left, right);
  },
  $or(left: TAny, right: TAny) {
    if (Array.isArray(right))
      return right.some((rightChild: TAny) => satisfies(left, rightChild));
    if (right == undefined) return false;
    return Object.entries(right).some(([rightKey, rightChild]) =>
      satisfies(left, { [rightKey]: rightChild })
    );
  },
  $eq(left: TAny, right: TAny) {
    return deepEquals(left, right);
  },
  $ne(left: TAny, right: TAny) {
    return !deepEquals(left, right);
  },
  $not(left: TAny, right: TAny) {
    return !satisfies(left, right);
  },
};

const arrayOperands: Record<string, (left: TArray, right: TAny) => boolean> = {
  ...commonOperands,

  $elemMatch(left: TArray, right: TAny) {
    return left.some((leftChild: TAny) => satisfies(leftChild, right));
  },
  $all(left: TArray, right: TAny) {
    if (Array.isArray(right))
      return right.every((rightChild: TAny) =>
        left.some(leftChild => satisfies(leftChild, rightChild))
      );
    return left.every((leftChild: TAny) => satisfies(leftChild, right));
  },
  $any(left: TArray, right: TAny) {
    if (Array.isArray(right))
      return right.some((rightChild: TAny) =>
        left.some(leftChild => satisfies(leftChild, rightChild))
      );
    return left.some((leftChild: TAny) => satisfies(leftChild, right));
  },
  $size(left: TArray, right: TAny) {
    return satisfies(left.length, right);
  },
};

const nonArrayOperands: Record<
  string,
  (left: TObjectOrPrimitive, right: TAny, operandParent: TObject) => boolean
> = {
  ...commonOperands,

  $gt(left: TObjectOrPrimitive, right: TAny) {
    if (left == undefined || right == undefined) return false;
    return left > right;
  },
  $gte(left: TObjectOrPrimitive, right: TAny) {
    if (left == undefined || right == undefined) return false;
    return left >= right;
  },
  $lt(left: TObjectOrPrimitive, right: TAny) {
    if (left == undefined || right == undefined) return false;
    return left < right;
  },
  $lte(left: TObjectOrPrimitive, right: TAny) {
    if (left == undefined || right == undefined) return false;
    return left <= right;
  },
  $in(left: TObjectOrPrimitive, right: TAny) {
    if (Array.isArray(right)) return right.includes(left);
    return false;
  },
  $nin(left: TObjectOrPrimitive, right: TAny) {
    if (Array.isArray(right)) return !right.includes(left);
    return true;
  },
  $exists(left: TObjectOrPrimitive, right: TAny) {
    return right ? left != undefined : left == undefined;
  },
  $regex(left: TObjectOrPrimitive, right: TAny, operandParent: TObject) {
    if (typeof right != 'string' || typeof left != 'string') return false;
    let options = operandParent.$options;
    if (typeof options != 'string') options = undefined;
    return new RegExp(right, options).test(left);
  },
  $options() {
    return true;
  },
};
