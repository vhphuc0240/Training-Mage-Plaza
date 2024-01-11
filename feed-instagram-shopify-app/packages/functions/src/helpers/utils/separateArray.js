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

export function fillArray(presentArr, data, size = 20) {
  const isFull = presentArr[0].medias.length >= size;
  if (isFull) {
    presentArr.push(separateArray(data, size));
  } else {
    const indexToSlice = size - presentArr[0].medias.length - 1;
    const dataFill = data.slice(0, indexToSlice);
    presentArr[0].medias.push(...dataFill);
    presentArr.push(separateArray(data.slice(indexToSlice), size));
  }
  return presentArr;
}

export const filterExpriredId = data => {
  const dataExprired = data.map(item =>
    item.medias.filter(media =>
      media.media_type === 'VIDEO'
        ? Date.now() - media.lastSync > 1000
        : Date.now() - media.lastSync > 1000 * 60 * 60 * 24 * 3
    )
  );
  return dataExprired.flat().map(item => item.id);
};
