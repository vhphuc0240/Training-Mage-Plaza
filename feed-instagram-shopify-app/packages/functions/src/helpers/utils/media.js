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

/**
 * @param oldMedias
 * @param newMedias
 * @returns {{}|{new: *[], update: *[], delete: *[]}}
 */
export function mergeMedias(oldMedias, newMedias) {
  const formattedMedia = oldMedias.map(item => item.medias).flat();
  const newMediaIds = newMedias.map(item => item.id);
  const oldMediaIds = formattedMedia.map(item => item.id);
  /*
   * exit in new, not in old => new
   * exit in old, not in new => delete
   */
  const deleteMediaIds = oldMediaIds.filter(id => !newMediaIds.includes(id));
  const newMediasNotInOld = newMediaIds.filter(id => !oldMediaIds.includes(id));
  if (deleteMediaIds.length > 0 || newMediasNotInOld.length > 0) {
    const updatedMedias = formattedMedia.filter(item => !deleteMediaIds.includes(item.id));
    const newMedia = newMedias.map(item => {
      if (newMediasNotInOld.includes(item.id)) {
        const baseObj = {
          ...item,
          media_url: item?.media_url,
          lastSync: Date.now()
        };
        return item.media_type === 'VIDEO'
          ? {...baseObj, thumbnail_url: item.thumbnail_url}
          : baseObj;
      }
      return {};
    });
    console.log(
      JSON.stringify(
        newMedia.filter(i => i?.id !== undefined),
        null,
        2
      ),
      'newMedia in line 66'
    );
    const synced = separateArray(
      [...updatedMedias, ...newMedia.filter(i => i?.id !== undefined)],
      2
    );
    console.log(JSON.stringify(synced, null, 2), 'synced in line 68');
    const maxIndex = Math.max(oldMedias.length, synced.length);
    const mergedMedias = {
      update: [],
      delete: [],
      new: []
    };
    for (let index = 0; index < maxIndex; index++) {
      if (oldMedias[index] !== undefined) {
        if (synced[index] !== undefined) {
          mergedMedias.update.push({
            ...oldMedias[index],
            medias: synced[index]
          });
        } else {
          mergedMedias.delete.push(oldMedias[index].id);
        }
      } else {
        if (synced[index] !== undefined) {
          mergedMedias.new.push(
            synced[index].map(item => ({
              ...item,
              hidden: false
            }))
          );
        }
      }
    }
    return mergedMedias;
  }
  return {};
}

/**
 * @param expriredMediaIds
 * @param medias
 * @param newestMedias
 * @returns {*}
 */
export function refreshMedias(expriredMediaIds, medias, newestMedias) {
  return medias.map(media => {
    const newMedia = media?.medias.map(item => {
      const t = newestMedias.find(n => item.id === n.id);
      const baseObj = {
        ...item,
        media_url: t?.media_url,
        lastSync: Date.now()
      };
      return t?.id
        ? t.media_type === 'VIDEO'
          ? {...baseObj, thumbnail_url: t.thumbnail_url}
          : baseObj
        : item;
    });
    return {
      ...media,
      medias: newMedia
    };
  });
}
