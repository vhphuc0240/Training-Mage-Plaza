export function separateArray(array, size = 20) {
  const numChildArrays = Math.ceil(array.length / size);
  const childArrays = [];
  for (let i = 0; i < numChildArrays; i++) {
    const startIdx = i * size;
    const endIdx = (i + 1) * size;
    const childArray = array.slice(startIdx, endIdx);
    childArrays.push(childArray);
  }
  return childArrays;
}

export const fillIntoArray = (data, arrToFill, size = 20) => {};
